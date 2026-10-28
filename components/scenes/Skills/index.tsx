"use client";

import { useRef, useState } from "react";
import { projects, skills, type SkillCategory } from "@/content";
import { SceneHeader } from "@/components/ui/SceneHeader";
import type { Draggable } from "gsap/Draggable";
import { dur, ease, gsap, mq, stagger, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { sceneIndex } from "../registry";

const CATEGORIES: SkillCategory[] = ["Design", "Frontend", "Motion", "Tools"];
// Cluster centers (fraction of the field) for the constellation layout
const CLUSTERS: Record<SkillCategory, [number, number]> = {
  Design: [0.2, 0.3],
  Frontend: [0.62, 0.26],
  Motion: [0.3, 0.74],
  Tools: [0.76, 0.7],
};

// Scene 4 — skills as a draggable constellation (desktop, fine pointer) or
// grouped lists. Hovering/focusing a skill lights up the projects that used it.
export function Skills() {
  const field = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const related = new Set(skills.find((s) => s.name === active)?.projects ?? []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${mq.cinematic} and ${mq.finePointer}`, () => {
      const el = field.current!;
      el.dataset.mode = "orbit";
      const { width, height } = el.getBoundingClientRect();

      const nodes: HTMLElement[] = [];
      for (const category of CATEGORIES) {
        const [cx, cy] = CLUSTERS[category];
        const group = el.querySelectorAll<HTMLElement>(`[data-category="${category}"] [data-node]`);
        group.forEach((node, i) => {
          const angle = (i / group.length) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3);
          const radius = gsap.utils.random(70, 130);
          gsap.set(node, {
            x: cx * width + Math.cos(angle) * radius,
            y: cy * height + Math.sin(angle) * radius * 0.7,
            xPercent: -50,
            yPercent: -50,
          });
          nodes.push(node);
        });
        gsap.set(el.querySelector(`[data-category="${category}"] [data-label]`), {
          x: cx * width,
          y: cy * height,
          xPercent: -50,
          yPercent: -50,
        });
      }

      gsap.from(nodes, {
        scale: 0,
        autoAlpha: 0,
        duration: dur.base,
        ease: ease.reveal,
        stagger: stagger.items / 2,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });

      // Draggable is only needed here, so it loads on demand (keeps it out of the initial bundle)
      let draggables: Draggable[] = [];
      let cancelled = false;
      import("gsap/Draggable").then(({ Draggable }) => {
        if (cancelled) return;
        gsap.registerPlugin(Draggable);
        draggables = Draggable.create(nodes, { bounds: el, zIndexBoost: true });
      });

      return () => {
        cancelled = true;
        draggables.forEach((d) => d.kill());
        delete el.dataset.mode;
      };
    });
  });

  return (
    <section data-scene="Skills" className="container-grid gap-y-12 py-32">
      <SceneHeader index={sceneIndex("Skills")} title="Skills" className="col-span-12" />
      <h2 className="font-display text-display col-span-12 font-semibold">Skills &amp; tools</h2>

      <div ref={field} className="skills-field col-span-12 lg:col-span-9">
        {CATEGORIES.map((category) => (
          <div key={category} data-category={category} className="skills-group">
            <p data-label className="meta skills-label">
              {category}
            </p>
            <ul className="flex flex-wrap gap-2">
              {skills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <li key={skill.name} data-node className="skills-node">
                    <button
                      type="button"
                      className={cn("skill-chip", active === skill.name && "is-active")}
                      data-cursor="drag"
                      onPointerEnter={() => setActive(skill.name)}
                      onPointerLeave={() => setActive(null)}
                      onFocus={() => setActive(skill.name)}
                      onBlur={() => setActive(null)}
                    >
                      {skill.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <aside className="col-span-12 lg:col-span-3">
        <p className="meta mb-4">Used in</p>
        <ul className="flex flex-col gap-2" aria-live="polite">
          {projects.map((project) => (
            <li
              key={project.slug}
              className={cn(
                "font-display text-lead font-semibold transition-colors duration-(--dur-fast)",
                active === null ? "text-fg-muted" : related.has(project.slug) ? "text-accent-fg" : "text-fg-faint",
              )}
            >
              {project.title}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
