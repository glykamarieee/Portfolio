"use client";

import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import Snap from "lenis/snap";
import { adventures, type Adventure } from "@/content";
import { MediaImage } from "@/components/ui/MediaImage";
import { getLenis } from "@/lib/motion";
import { formatCoords, formatMonth, pad, yearOf } from "@/lib/format";
import { cn } from "@/lib/cn";

type View = "reel" | "grid";
const ALL = "All";

const countries = [ALL, ...new Set(adventures.map((a) => a.country))];
const years = [ALL, ...new Set(adventures.map((a) => yearOf(a.date)))];

/** seconds → "00:01:12:05" (hh:mm:ss:ff at 24fps) */
function timecode(seconds: number) {
  const frames = Math.floor((seconds % 1) * 24);
  const s = Math.floor(seconds);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60, frames].map((n) => pad(n)).join(":");
}

// /adventures — the travel film reel. Reel view: one trip per screen, snapped,
// letterboxed, with a timecode HUD; only the clip on screen plays. Grid view:
// a mosaic with hover-scrub previews. Either opens a full-screen player.
export function AdventureReel() {
  const [view, setView] = useState<View>("reel");
  const [country, setCountry] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [sound, setSound] = useState(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const trips = useMemo(
    () =>
      adventures.filter(
        (trip) => (country === ALL || trip.country === country) && (year === ALL || yearOf(trip.date) === year),
      ),
    [country, year],
  );

  // Snap the reel to each trip (proximity, so the footer stays reachable)
  useEffect(() => {
    const lenis = getLenis();
    if (view !== "reel" || !lenis || !list.current) return;
    const snap = new Snap(lenis, { type: "proximity", distanceThreshold: "40%" });
    snap.addElements(Array.from(list.current.children) as HTMLElement[], { align: "start" });
    return () => snap.destroy();
  }, [view, trips]);

  // Track which trip is on screen
  useEffect(() => {
    if (view !== "reel" || !list.current) return;
    const items = Array.from(list.current.children);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(items.indexOf(entry.target));
        }
      },
      { threshold: 0.6 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [view, trips]);

  const open = (index: number) => {
    setPlaying(index);
    if (!dialog.current?.open) {
      dialog.current?.showModal();
      getLenis()?.stop();
    }
  };
  const step = (delta: number) => setPlaying((i) => (i === null ? i : (i + delta + trips.length) % trips.length));
  const current = playing === null ? null : trips[playing];

  return (
    <>
      {/* Controls */}
      <div className="reel-controls container-grid gap-y-4">
        <div className="col-span-12 flex flex-wrap items-center gap-2 md:col-span-9">
          <FilterGroup label="Country" options={countries} value={country} onChange={setCountry} />
          <FilterGroup label="Year" options={years} value={year} onChange={setYear} />
        </div>
        <div className="col-span-12 flex items-center gap-2 md:col-span-3 md:justify-end">
          {view === "reel" && (
            <button type="button" className={cn("chip", sound && "is-active")} onClick={() => setSound((s) => !s)} aria-pressed={sound} data-cursor="link">
              Sound {sound ? "on" : "off"}
            </button>
          )}
          <button type="button" className="chip" onClick={() => setView(view === "reel" ? "grid" : "reel")} data-cursor="link">
            {view === "reel" ? "Grid view" : "Reel view"}
          </button>
        </div>
      </div>

      {trips.length === 0 && <p className="container-grid meta py-32">No trips match these filters.</p>}

      {view === "reel" ? (
        <ol ref={list} className="reel">
          {trips.map((trip, i) => (
            <ReelItem
              key={trip.slug}
              trip={trip}
              index={i}
              total={trips.length}
              active={i === active}
              sound={sound}
              onOpen={() => open(i)}
            />
          ))}
        </ol>
      ) : (
        <ul className="container-grid gap-y-(--gutter) py-12">
          {trips.map((trip, i) => (
            <GridItem key={trip.slug} trip={trip} index={i} onOpen={() => open(i)} />
          ))}
        </ul>
      )}

      {/* Full-screen player */}
      <dialog
        ref={dialog}
        className="player"
        aria-label={current ? `${current.place}, ${current.country}` : "Player"}
        onClose={() => {
          setPlaying(null);
          getLenis()?.start();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current && (
          <div className="player-inner">
            <div className="player-media">
              {current.video ? (
                <video key={current.slug} src={current.video.src} poster={current.video.poster} controls autoPlay playsInline>
                  {current.video.captions && <track kind="captions" src={current.video.captions} srcLang="en" label="English" default />}
                </video>
              ) : (
                <MediaImage key={current.slug} media={current.cover} sizes="100vw" className="!object-contain" eager />
              )}
            </div>
            <div className="player-bar meta">
              <button type="button" onClick={() => step(-1)} data-cursor="link">
                ← Prev
              </button>
              <span>
                {current.place}, {current.country} · {formatMonth(current.date)} · {pad((playing ?? 0) + 1)} / {pad(trips.length)}
              </span>
              <button type="button" onClick={() => step(1)} data-cursor="link">
                Next →
              </button>
            </div>
            <button type="button" className="player-close meta" onClick={() => dialog.current?.close()} data-cursor="link">
              Close ✕
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="meta mr-1">{label}</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={cn("chip", option === value && "is-active")}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          data-cursor="link"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ReelItem({
  trip,
  index,
  total,
  active,
  sound,
  onOpen,
}: {
  trip: Adventure;
  index: number;
  total: number;
  active: boolean;
  sound: boolean;
  onOpen: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const clock = useRef<HTMLSpanElement>(null);

  // Only the trip on screen plays; sound follows the toggle
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = !sound;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active, sound]);

  return (
    <li className="reel-item">
      <article className="relative h-full w-full">
        <div className="absolute inset-0">
          {trip.video ? (
            <video
              ref={video}
              src={trip.video.src}
              poster={trip.video.poster}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
              onTimeUpdate={(e) => {
                if (clock.current) clock.current.textContent = timecode(e.currentTarget.currentTime);
              }}
            />
          ) : (
            <div className="reel-still absolute inset-0">
              <MediaImage media={trip.cover} sizes="100vw" eager={index === 0} />
            </div>
          )}
        </div>

        <div className="reel-hud">
          <div className="flex justify-between gap-6">
            <span>
              <span className="reel-rec" aria-hidden="true" /> {trip.video ? "Rec" : "Still"} ·{" "}
              <span ref={clock}>{trip.video ? timecode(0) : formatMonth(trip.date)}</span>
            </span>
            <span>
              {pad(index + 1)} / {pad(total)}
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p>{formatCoords(trip.coordinates)}</p>
              <h2 className="font-display text-display mt-2 font-semibold normal-case tracking-tight">{trip.place}</h2>
              <p className="mt-2">
                {trip.country} · {formatMonth(trip.date)} — <span className="normal-case">{trip.story}</span>
              </p>
            </div>
            <button type="button" onClick={onOpen} className="chip chip-on-media" data-cursor="play" data-cursor-label="Watch">
              {trip.video ? "Watch full clip" : "View"}
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}

function GridItem({ trip, index, onOpen }: { trip: Adventure; index: number; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);

  // Hover-scrub: pointer position across the card seeks through the preview
  const scrub = (e: PointerEvent<HTMLButtonElement>) => {
    const v = video.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  return (
    <li className={cn("col-span-12 md:col-span-6", index % 3 === 0 && "lg:col-span-8", index % 3 !== 0 && "lg:col-span-4")}>
      <button
        type="button"
        onClick={onOpen}
        onPointerMove={scrub}
        className="group flex w-full flex-col gap-3 text-left"
        data-cursor="play"
        data-cursor-label={trip.video ? "Scrub · Play" : "View"}
      >
        <span className="relative block aspect-[16/10] overflow-hidden rounded-sm bg-bg-elev">
          {trip.video?.preview ? (
            <video ref={video} src={trip.video.preview} poster={trip.video.poster} muted playsInline preload="metadata" className="h-full w-full object-cover" />
          ) : (
            <MediaImage
              media={trip.cover}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="transition-transform duration-(--dur-slow) ease-(--ease-reveal) group-hover:scale-105"
            />
          )}
        </span>
        <span className="meta">
          {pad(index + 1)} — {trip.country} · {formatMonth(trip.date)}
        </span>
        <span className="font-display text-h2 font-semibold">{trip.place}</span>
      </button>
    </li>
  );
}
