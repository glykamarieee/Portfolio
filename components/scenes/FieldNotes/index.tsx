"use client";

import { useEffect, useRef, useState } from "react";
import { adventures } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { RollText } from "@/components/ui/RollText";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, mq, scrollToTarget, useGSAP, type ScrollTrigger } from "@/lib/motion";
import { formatMonth, pad, timecode } from "@/lib/format";
import { cn } from "@/lib/cn";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const SECONDS_PER_FILM = 12; // how far the HUD timecode runs per film scrolled

// Scene 7 — Field Notes, a screening. Desktop: a pinned letterboxed screen
// where scrolling cuts film to film with a wipe, a REC/timecode HUD runs with
// the scroll, and a filmstrip below jumps to any film. Elsewhere: a list.
export function FieldNotes() {
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [screen, setScreen] = useState(false); // gates video playback only
  const [current, setCurrent] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.cinematic, () => {
        const el = section.current!;
        el.dataset.mode = "screen";
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", el);
        const clock = el.querySelector<HTMLElement>("[data-clock]")!;
        const last = slides.length - 1;

        gsap.set(slides.slice(1), { clipPath: "inset(0% 0% 0% 100%)" });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${Math.max(last, 1) * window.innerHeight * 0.9}`,
            pin: true,
            scrub: true,
            snap:
              last > 0
                ? {
                    snapTo: 1 / last,
                    duration: { min: 0.2, max: 0.6 },
                    ease: ease.scrubSoft,
                  }
                : undefined,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress * last;
              clock.textContent = timecode(p * SECONDS_PER_FILM);
              setCurrent(Math.round(p));
            },
          },
        });
        // Each cut: the next film wipes in from the right while the outgoing one pushes in
        slides.slice(1).forEach((slide, i) => {
          tl.to(
            slide,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: ease.scrubSoft,
              duration: 1,
            },
            i,
          )
            .from(slide.querySelector("[data-slide-media]"), { scale: 1.15, ease: ease.scrubSoft, duration: 1 }, i)
            .to(
              slides[i].querySelector("[data-slide-media]"),
              { scale: 1.08, xPercent: -4, ease: ease.scrubSoft, duration: 1 },
              i,
            );
        });
        trigger.current = tl.scrollTrigger ?? null;
        setScreen(true);

        return () => {
          delete el.dataset.mode;
          trigger.current = null;
          setScreen(false);
        };
      });
    },
    { scope: section },
  );

  // Only the film on screen plays
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (screen && i === current) video.play().catch(() => {});
      else video.pause();
    });
  }, [current, screen]);

  const jump = (index: number) => {
    const st = trigger.current;
    if (!st) return;
    scrollToTarget(st.start + (index / Math.max(adventures.length - 1, 1)) * (st.end - st.start));
  };

  const film = adventures[current];

  return (
    <section ref={section} data-scene="Field Notes" className="field-notes relative isolate py-24">
      <Decor set="fieldNotes" />
      <div className="field-inner container-grid gap-y-10">
        <header className="field-header col-span-12 flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <div className="flex flex-col gap-4">
            <SceneHeader index={sceneIndex("Field Notes")} title="Field Notes" />
            <h2 className="font-display text-display">Field notes</h2>
          </div>
          <div className="flex flex-col gap-3 md:items-end md:text-right">
            <p className="text-lead max-w-[34ch] text-fg-muted">
              Days out around Cebu with friends — shot and edited by me.
            </p>
            <TransitionLink href="/adventures" className="meta text-fg" data-cursor="link">
              <RollText text="Watch the full reel →" />
            </TransitionLink>
          </div>
        </header>

        {/* Screening mode (desktop, motion OK) — hidden by CSS until data-mode="screen" */}
        <div className="field-screen field-screening col-span-12" data-cursor="play" data-cursor-label="Watch">
          {adventures.map((f, i) => (
            <div key={f.slug} data-slide className="field-slide">
              <div data-slide-media className="absolute inset-0">
                {f.video ? (
                  <video
                    ref={(node) => {
                      videos.current[i] = node;
                    }}
                    src={f.video.preview ?? f.video.src}
                    poster={f.video.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MediaImage media={f.cover} sizes="92vw" />
                )}
              </div>
            </div>
          ))}
          <div className="field-screen-hud" aria-hidden="true">
            <div className="flex justify-between gap-6">
              <span>
                <span className="reel-rec" /> Rec · <span data-clock>{timecode(0)}</span>
              </span>
              <span>
                Sc. {pad(current + 1)} / {pad(adventures.length)}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>{film.area}, Cebu</span>
              <span>{formatMonth(film.date)}</span>
            </div>
          </div>
        </div>

        <div className="field-screening col-span-12 grid grid-cols-12 items-start gap-x-(--gutter) gap-y-6">
          <div className="col-span-5" aria-live="polite">
            <h3 className="font-display text-h2">{film.place}</h3>
            <p className="text-lead mt-2 text-fg-muted">{film.story}</p>
            {film.crew?.length ? <p className="meta mt-3">With {film.crew.join(", ")}</p> : null}
          </div>
          <ol className="filmstrip col-span-7" aria-label="Films">
            {adventures.map((f, i) => (
              <li key={f.slug}>
                <button
                  type="button"
                  className={cn("filmstrip-frame", i === current && "is-active")}
                  aria-current={i === current}
                  onClick={() => jump(i)}
                  data-cursor="link"
                >
                  <span className="filmstrip-thumb">
                    <MediaImage
                      media={f.video?.poster ? { src: f.video.poster, alt: "" } : { ...f.cover, alt: "" }}
                      sizes="10vw"
                    />
                  </span>
                  <span className="meta">
                    {pad(i + 1)} {f.place}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* List mode (mobile, tablet, reduced motion, no JS) */}
        <ol className="field-list col-span-12 grid gap-6 md:grid-cols-2">
          {adventures.map((f, i) => (
            <li key={f.slug} className="flex flex-col gap-4">
              <div className="field-list-frame relative overflow-hidden rounded-sm bg-bg-elev">
                <MediaImage media={f.cover} sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <p className="meta">
                ({pad(i + 1)}) — {f.area}, Cebu · {formatMonth(f.date)}
              </p>
              <h3 className="font-display text-h2">{f.place}</h3>
              <p className="text-fg-muted">{f.story}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
