"use client";

import { useRef, useState } from "react";
import { about, site, skillCategories } from "@/content";
import { LensImage } from "@/components/ui/LensImage";
import { cn } from "@/lib/cn";
import { initials, pad } from "@/lib/format";
import { dur, ease, gsap, mq, useGSAP } from "@/lib/motion";

const MAX_SWING = 12; // degrees

// A film-crew lanyard pass hanging from a Code ✺ Cut ✺ Capture strap. It drops
// in on enter and swings with the pointer's speed (fine pointers, motion
// allowed). The front is the portrait (the lens reveals the camera shot); the
// flip button turns it over to the values and what I'm learning.
export function CrewPass() {
  const root = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const kick = useRef<() => void>(undefined); // a little swing when it flips

  useGSAP((_, contextSafe) => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      gsap.from(el.querySelector("[data-drop]"), {
        yPercent: -45,
        rotation: -16,
        autoAlpha: 0,
        duration: dur.slow * 1.5,
        ease: ease.spring,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });
    mm.add(`${mq.motion} and ${mq.finePointer}`, () => {
      const rig = el.querySelector("[data-rig]")!;
      const section = el.closest("section") ?? el;
      let last = { x: 0, t: 0 };
      let tl: gsap.core.Timeline | undefined;
      const swing = contextSafe!((angle: number) => {
        tl?.kill();
        tl = gsap
          .timeline()
          .to(rig, { rotation: angle, duration: dur.fast, ease: ease.ui })
          .to(rig, { rotation: 0, duration: dur.slow * 2, ease: "elastic.out(1, 0.2)" });
      });
      kick.current = () => swing(6);
      // Lag behind the pointer, then settle back on a spring once it stops
      const onMove = (e: PointerEvent) => {
        const dt = Math.max(e.timeStamp - last.t, 1);
        const vx = (e.clientX - last.x) / dt;
        last = { x: e.clientX, t: e.timeStamp };
        if (dt > 100) return; // first move after a pause: no velocity yet
        swing(gsap.utils.clamp(-MAX_SWING, MAX_SWING, vx * 9));
      };
      section.addEventListener("pointermove", onMove);
      return () => {
        kick.current = undefined;
        section.removeEventListener("pointermove", onMove);
      };
    });
  });

  const flip = () => {
    setFlipped((f) => !f);
    kick.current?.();
  };

  return (
    <div ref={root} className="pass-wrap">
      <div data-drop className="pass-drop">
        <div data-rig className="pass-rig">
          <div className="pass-strap" aria-hidden="true">
            <span>Code ✺ Cut ✺ Capture ✺ Code ✺ Cut ✺ Capture ✺</span>
          </div>
          <span className="pass-clip" aria-hidden="true" />

          <div className={cn("pass", flipped && "is-flipped")}>
            <div className="pass-inner">
              {/* Front: portrait, name, crafts */}
              <div className="pass-face pass-front" aria-hidden={flipped}>
                <span className="pass-slot" aria-hidden="true" />
                <div className="pass-band">
                  <span>Crew · All access</span>
                  <span>Nº 001</span>
                </div>
                <div className="pass-photo">
                  <LensImage
                    base={about.portrait}
                    reveal={about.portraitAlt}
                    sizes="320px"
                    quality={90}
                    className="h-full w-full"
                  />
                  <span className="pass-monogram" aria-hidden="true">
                    {initials(site.name)}
                  </span>
                </div>
                <div className="pass-id">
                  <p className="pass-name font-display">{site.name}</p>
                  <p className="pass-role">{skillCategories.map((c) => c.name).join(" · ")}</p>
                </div>
                <div className="pass-foot">
                  <span className="pass-barcode" aria-hidden="true" />
                  <span className="pass-where">
                    {site.available && <span className="status-dot" aria-hidden="true" />}
                    {site.location}
                  </span>
                </div>
              </div>

              {/* Back: values + currently learning */}
              <div className="pass-face pass-back" aria-hidden={!flipped}>
                <span className="pass-slot" aria-hidden="true" />
                <div className="pass-band is-dark">
                  <span>On set, I care about</span>
                  <span>↻</span>
                </div>
                <ol className="pass-values">
                  {about.values.map((value, i) => (
                    <li key={value.title}>
                      <span className="pass-value-n">{pad(i + 1)}</span>
                      <span>
                        <span className="pass-value-title">{value.title}</span>
                        <span className="pass-value-body">{value.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="pass-learning">
                  <span className="meta">Currently learning</span>
                  <span className="flex flex-wrap gap-1.5">
                    {about.currentlyLearning.map((skill) => (
                      <span key={skill} className="pass-tag">
                        {skill}
                      </span>
                    ))}
                  </span>
                </div>
                <p className="pass-valid meta">Valid · {about.yearsCreating}+ years and counting</p>
              </div>
            </div>
          </div>

          <button type="button" className="pass-flip" onClick={flip} aria-pressed={flipped} data-cursor="link">
            <span aria-hidden="true">↻</span> {flipped ? "Flip to front" : "Flip the pass"}
          </button>
        </div>
      </div>
    </div>
  );
}
