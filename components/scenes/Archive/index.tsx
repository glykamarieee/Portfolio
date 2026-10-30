"use client";

import { useRef, useState } from "react";
import { certificates } from "@/content";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, getLenis, mq, useGSAP } from "@/lib/motion";
import { formatMonth, initials, pad, yearOf } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

// Depth layout: card i sits `GAP` px further away than card i-1, at one of a
// few screen offsets so the path weaves (DESIGN.md §9, The Archive).
const GAP = 650;
const START_Z = -300;
const OFFSETS: [number, number][] = [
  [-22, -12],
  [20, 10],
  [-6, 16],
  [24, -14],
  [-24, 8],
  [6, -16],
];
const TILT = 4; // degrees of pointer-driven camera tilt

// Scene 6 — The Archive. On desktop the section pins and scrolling flies the
// camera forward through certificates on receding z-planes; distance blurs and
// fades them, hover pulls one into focus, click opens a lightbox. Elsewhere:
// swipeable deck (mobile) / grid (tablet, reduced motion).
export function Archive() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0); // HUD
  const [open, setOpen] = useState<number | null>(null); // lightbox

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(mq.cinematic, () => {
      const el = section.current!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", camera.current);
      const depth = (cards.length - 1) * GAP + 200;
      el.dataset.mode = "3d";

      cards.forEach((card, i) => {
        const [x, y] = OFFSETS[i % OFFSETS.length];
        gsap.set(card, { xPercent: -50, yPercent: -50, x: `${x}vw`, y: `${y}vh`, z: START_Z - i * GAP });
      });

      let last = -1;
      const render = (progress: number) => {
        const cameraZ = progress * depth;
        cards.forEach((card, i) => {
          const z = START_Z - i * GAP + cameraZ; // distance from the screen plane
          const passed = z > 0;
          const opacity = passed
            ? gsap.utils.clamp(0, 1, 1 - z / 300)
            : gsap.utils.clamp(0.15, 1, 1 + (z + 600) / 2400);
          const blur = passed ? z / 60 : Math.max(0, (-z - 400) / 350);
          card.style.opacity = String(opacity);
          card.style.filter = `blur(${Math.min(blur, 8).toFixed(2)}px)`;
          card.style.pointerEvents = opacity < 0.4 ? "none" : "";
        });
        // Card i is "current" while it sits around its starting distance (START_Z)
        const nearest = gsap.utils.clamp(0, cards.length - 1, Math.round(cameraZ / GAP));
        if (nearest !== last) {
          last = nearest;
          setCurrent(nearest);
        }
      };

      gsap.to(camera.current, {
        z: depth,
        ease: ease.scrub,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${cards.length * 45}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => render(self.progress),
        },
      });
      render(0);

      const tiltX = gsap.quickTo(stage.current, "rotationX", { duration: dur.base, ease: ease.ui });
      const tiltY = gsap.quickTo(stage.current, "rotationY", { duration: dur.base, ease: ease.ui });
      const onMove = (e: PointerEvent) => {
        tiltY((e.clientX / window.innerWidth - 0.5) * 2 * TILT);
        tiltX(-(e.clientY / window.innerHeight - 0.5) * 2 * TILT);
      };
      el.addEventListener("pointermove", onMove);

      return () => {
        el.removeEventListener("pointermove", onMove);
        cards.forEach((card) => card.removeAttribute("style"));
        delete el.dataset.mode;
      };
    });
  });

  const show = (index: number) => {
    setOpen(index);
    if (!dialog.current?.open) {
      dialog.current?.showModal();
      getLenis()?.stop();
    }
  };
  const step = (delta: number) =>
    setOpen((i) => (i === null ? i : (i + delta + certificates.length) % certificates.length));

  const active = certificates[current];
  const selected = open === null ? null : certificates[open];

  return (
    <section ref={section} id="archive" data-scene="The Archive" className="archive py-24 relative isolate">
      <Decor set="archive" />
      <div className="archive-inner">
        <header className="container-grid items-end gap-y-4">
          <SceneHeader index={sceneIndex("The Archive")} title="The Archive" className="col-span-12" />
          <div className="col-span-12 flex flex-col gap-3 md:col-span-8">
            <h2 className="font-display text-display">The Archive</h2>
            <p className="text-lead archive-lead text-fg-muted">
              Certificates and credentials, collected along the way.
            </p>
          </div>
          <p className="col-span-12 flex md:col-span-4 md:justify-end">
            <span className="archive-count meta">
              <span className="text-fg">{pad(certificates.length)}</span> certificates · tap to inspect
            </span>
          </p>
        </header>

        <div ref={stage} className="archive-stage">
          <ul ref={camera} className="archive-camera">
            {certificates.map((cert, i) => (
              <li key={cert.id} data-card className="archive-card">
                <button
                  type="button"
                  onClick={() => show(i)}
                  className="cert-card"
                  data-cursor="view"
                  data-cursor-label="Inspect"
                >
                  <span className="cert-media">
                    <MediaImage media={cert.image} sizes="(min-width: 1024px) 28vw, 75vw" />
                  </span>
                  <span className="cert-seal" aria-hidden="true">
                    {initials(cert.issuer)}
                  </span>
                  <span className="flex items-center justify-between gap-3">
                    <span className="meta">{cert.issuer}</span>
                    <span className="meta">{yearOf(cert.date)}</span>
                  </span>
                  <span className="font-display text-lead">{cert.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="archive-hud" aria-hidden="true">
          <span className="flex items-baseline justify-between gap-6">
            <span className="meta">Now passing</span>
            <span className="meta text-fg">
              {pad(current + 1)} / {pad(certificates.length)}
            </span>
          </span>
          <span className="font-medium">{active?.title}</span>
          <span className="meta">
            {active?.issuer} · {active && yearOf(active.date)}
          </span>
          <span className="archive-hud-rail">
            <span style={{ width: `${((current + 1) / certificates.length) * 100}%` }} />
          </span>
        </aside>
      </div>

      <dialog
        ref={dialog}
        className="archive-dialog"
        aria-label={selected ? `${selected.title} — ${selected.issuer}` : "Certificate"}
        onClose={() => {
          setOpen(null);
          getLenis()?.start();
        }}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {selected && (
          <div className="archive-dialog-body">
            <div className="archive-dialog-media">
              <MediaImage
                media={selected.image}
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="!object-contain"
                eager
              />
            </div>
            <div className="flex flex-col gap-6">
              <span className="cert-seal is-static" aria-hidden="true">
                {initials(selected.issuer)}
              </span>
              <div>
                <p className="meta">
                  {selected.issuer} · {formatMonth(selected.date)}
                </p>
                <h3 className="font-display text-h2 mt-2">{selected.title}</h3>
              </div>
              {selected.credentialUrl && (
                <a
                  href={selected.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-pill self-start"
                  data-cursor="link"
                >
                  Verify credential ↗
                </a>
              )}
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                <button type="button" onClick={() => step(-1)} className="archive-step" data-cursor="link">
                  ← Prev
                </button>
                <span className="meta">
                  {pad((open ?? 0) + 1)} / {pad(certificates.length)}
                </span>
                <button type="button" onClick={() => step(1)} className="archive-step" data-cursor="link">
                  Next →
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="archive-close"
              data-cursor="link"
              aria-label="Close"
            >
              Close ✕
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
