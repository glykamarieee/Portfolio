"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { adventures } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { RollText } from "@/components/ui/RollText";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, mq, useGSAP } from "@/lib/motion";
import { formatCoords, formatMonth, pad } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const Globe = dynamic(() => import("@/components/webgl/Globe"), { ssr: false });
const points = adventures.map((trip) => trip.coordinates);

// Scene 7 — Field Notes. Desktop: pinned globe that flies from trip to trip
// as you scroll, with the current trip's clip playing inside a lens window
// and its place/date/coords in a HUD. Elsewhere: a list of trip cards.
export function FieldNotes() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [globe, setGlobe] = useState(false);
  const [current, setCurrent] = useState(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(mq.cinematic, () => {
      const el = section.current!;
      el.dataset.mode = "globe";
      setGlobe(true);

      let last = 0;
      gsap.to(progress, {
        current: adventures.length - 1,
        ease: ease.scrub,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${adventures.length * 70}%`,
          pin: true,
          scrub: true,
          onUpdate: () => {
            const next = Math.round(progress.current);
            if (next !== last) {
              last = next;
              setCurrent(next);
            }
          },
        },
      });

      return () => {
        delete el.dataset.mode;
        setGlobe(false);
      };
    });
  });

  const trip = adventures[current];
  const still = trip.video?.poster ? { src: trip.video.poster, alt: trip.cover.alt } : trip.cover;

  return (
    <section ref={section} data-scene="Field Notes" className="field-notes py-24 relative isolate">
      <Decor set="fieldNotes" />
      <div className="field-inner container-grid gap-y-12">
        <header className="field-header col-span-12 flex flex-col gap-4">
          <SceneHeader index={sceneIndex("Field Notes")} title="Field Notes" />
          <h2 className="font-display text-display font-semibold">Field Notes</h2>
          <TransitionLink href="/adventures" className="meta self-start text-fg" data-cursor="link">
            <RollText text="Open the full reel →" />
          </TransitionLink>
        </header>

        {/* Desktop globe mode */}
        {globe && (
          <>
            <div className="field-globe col-span-7" aria-hidden="true">
              <Globe points={points} progress={progress} />
            </div>
            <div className="field-hud col-span-5 flex flex-col justify-center gap-6" aria-live="polite">
              <p className="meta">
                {pad(current + 1)} / {pad(adventures.length)} · {formatCoords(trip.coordinates)}
              </p>
              <div className="field-lens" data-cursor={trip.video ? "play" : "view"}>
                {trip.video ? (
                  <video
                    key={trip.slug}
                    src={trip.video.preview ?? trip.video.src}
                    poster={trip.video.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="none"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MediaImage key={trip.slug} media={still} sizes="24vw" />
                )}
              </div>
              <div>
                <h3 className="font-display text-h2 font-semibold">{trip.place}</h3>
                <p className="meta mt-2">
                  {trip.country} · {formatMonth(trip.date)}
                </p>
                <p className="text-lead mt-4 text-fg-muted">{trip.story}</p>
              </div>
            </div>
          </>
        )}

        {/* List mode (mobile, tablet, reduced motion, no JS) */}
        <ol className="field-list col-span-12 grid gap-6 md:grid-cols-2">
          {adventures.map((t, i) => (
            <li key={t.slug} className="flex flex-col gap-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-bg-elev">
                <MediaImage media={t.cover} sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <p className="meta">
                ({pad(i + 1)}) — {t.country} · {formatMonth(t.date)}
              </p>
              <h3 className="font-display text-h2 font-semibold">{t.place}</h3>
              <p className="text-fg-muted">{t.story}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
