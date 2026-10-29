"use client";

import { useRef, type CSSProperties } from "react";
import { skillCategories, skills } from "@/content";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, interaction, mq, useGSAP } from "@/lib/motion";
import { pad } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const STEP = 24; // degrees between stops on the dial

// Scene 4 — a pinned dial: big mono numbers sit on an arc, and scrolling turns
// it so each skill category clicks into place with its details beside it.
// Under reduced motion (and without JS) it's a plain numbered list.
export function Skills() {
  const section = useRef<HTMLElement>(null);

  useGSAP((_, contextSafe) => {
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      const el = section.current!;
      el.dataset.mode = "dial";
      const wheel = el.querySelector<HTMLElement>("[data-wheel]")!;
      const nums = gsap.utils.toArray<HTMLElement>("[data-dial-num]", el);
      const panels = gsap.utils.toArray<HTMLElement>("[data-dial-panel]", el);
      const last = nums.length - 1;
      const dim = interaction.dimLargeText;

      let active = 0;
      gsap.set(panels.slice(1), { autoAlpha: 0, y: 16 });
      const show = contextSafe!((index: number) => {
        panels.forEach((panel, i) =>
          gsap.to(panel, {
            autoAlpha: i === index ? 1 : 0,
            y: i === index ? 0 : i < index ? -16 : 16,
            duration: dur.fast,
            ease: ease.ui,
            overwrite: true,
          }),
        );
      });

      // p runs 0 → last: the wheel turns one STEP per category, and the number
      // nearest p grows and darkens (dim floor keeps AA contrast)
      const render = (p: number) => {
        gsap.set(wheel, { rotation: -p * STEP });
        nums.forEach((num, i) => {
          const near = Math.max(0, 1 - Math.abs(i - p));
          gsap.set(num, { scale: 1 + near * 0.9, opacity: dim + near * (1 - dim) });
        });
        const next = Math.round(p);
        if (next !== active) {
          active = next;
          show(next);
        }
      };
      render(0);

      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${last * window.innerHeight * 0.8}`,
          pin: true,
          scrub: true,
          snap: { snapTo: 1 / last, duration: { min: 0.2, max: 0.6 }, ease: ease.scrubSoft },
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress * last),
        },
      });

      return () => delete el.dataset.mode;
    });
  });

  return (
    <section ref={section} id="skills" data-scene="Skills" className="skills relative isolate">
      <Decor set="skills" />
      <header className="container-grid gap-y-4 pt-32 pb-12 skills-head">
        <SceneHeader index={sceneIndex("Skills")} title="Skills" className="col-span-12" />
        <h2 className="font-display text-display col-span-12 font-semibold">Skills &amp; tools</h2>
      </header>

      <div className="dial">
        <div data-wheel className="dial-wheel" aria-hidden="true">
          {skillCategories.map((category, i) => (
            <span key={category.name} className="dial-stop" style={{ "--angle": `${i * STEP}deg` } as CSSProperties}>
              <span className="dial-dot" />
              <span data-dial-num className="dial-num">
                {pad(i + 1)}
              </span>
            </span>
          ))}
        </div>

        <ol className="dial-panels">
          {skillCategories.map((category, i) => (
            <li key={category.name} data-dial-panel className="dial-panel">
              <span className="dial-panel-num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <div>
                <h3 className="text-lead font-semibold">{category.name}</h3>
                <p className="text-lead text-fg-muted">{category.blurb}</p>
                <ul className="meta mt-4 flex flex-wrap gap-x-3 gap-y-1">
                  {skills
                    .filter((skill) => skill.category === category.name)
                    .map((skill) => (
                      <li key={skill.name} className="text-fg">
                        {skill.name}
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
