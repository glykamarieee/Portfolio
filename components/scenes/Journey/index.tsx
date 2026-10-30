"use client";

import { useRef } from "react";
import { education, experience } from "@/content";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, mq, ScrollTrigger, useGSAP } from "@/lib/motion";
import { formatMonth, yearOf } from "@/lib/format";
import { cn } from "@/lib/cn";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

type Milestone = {
  lane: "work" | "school";
  year: string;
  dates: string;
  title: string;
  place: string;
  points: string[];
};

const milestones: Milestone[] = [
  ...experience.map((e) => ({
    lane: "work" as const,
    year: yearOf(e.start),
    dates: `${formatMonth(e.start)} — ${formatMonth(e.end)}`,
    title: e.role,
    place: [e.organization, e.location].filter(Boolean).join(" · "),
    points: e.achievements,
  })),
  ...education.map((e) => ({
    lane: "school" as const,
    year: String(e.start),
    dates: `${e.start} — ${e.end === "present" ? "Present" : e.end}`,
    title: e.program,
    place: e.school,
    points: [...(e.honors ?? []), ...(e.highlights ?? [])],
  })),
].sort((a, b) => b.year.localeCompare(a.year));

// Scene 5 — experience + education on one timeline: work on the left lane,
// school on the right (single lane on mobile). The spine draws as you scroll
// and a sticky year counter follows the milestone in view.
export function Journey() {
  const section = useRef<HTMLElement>(null);
  const spine = useRef<HTMLSpanElement>(null);
  const year = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = section.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      gsap.fromTo(
        spine.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: ease.scrub,
          scrollTrigger: { trigger: el.querySelector("ol"), start: "top 60%", end: "bottom 60%", scrub: true },
        },
      );

      el.querySelectorAll<HTMLElement>("[data-milestone]").forEach((item) => {
        gsap.from(item.querySelector("[data-card]"), {
          autoAlpha: 0,
          y: 48,
          duration: dur.base,
          ease: ease.reveal,
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (self.isActive && year.current) year.current.textContent = item.dataset.year ?? "";
          },
        });
      });
    });
  });

  return (
    <section ref={section} id="journey" data-scene="Journey" className="container-grid gap-y-12 py-32 relative isolate">
      <Decor set="journey" />
      <SceneHeader index={sceneIndex("Journey")} title="Journey" className="col-span-12" />
      <div className="col-span-12 flex items-end justify-between gap-6">
        <h2 className="font-display text-display font-semibold">Journey</h2>
        <p className="meta hidden gap-6 lg:flex">
          <span>← Work</span>
          <span>School →</span>
        </p>
      </div>

      <div className="relative col-span-12">
        <aside className="journey-year" aria-hidden="true">
          <span ref={year}>{milestones[0]?.year}</span>
        </aside>

        <ol className="journey relative">
          <span className="journey-spine" aria-hidden="true">
            <span ref={spine} className="journey-spine-fill" />
          </span>
          {milestones.map((m, i) => (
            <li key={i} data-milestone data-year={m.year} className={cn("journey-item", `is-${m.lane}`)}>
              <span className="journey-dot" aria-hidden="true" />
              <article data-card className="journey-card">
                <p className="meta">
                  <span className="text-accent-fg">{m.lane === "work" ? "Work" : "School"}</span> · {m.dates}
                </p>
                <h3 className="font-display text-h2 mt-3 font-semibold">{m.title}</h3>
                <p className="mt-2 text-fg-muted">{m.place}</p>
                {m.points.length > 0 && (
                  <details className="journey-details mt-4">
                    <summary className="meta cursor-pointer text-fg" data-cursor="link">
                      Highlights
                    </summary>
                    <ul className="mt-3 flex flex-col gap-2 text-fg-muted">
                      {m.points.map((point, p) => (
                        <li key={p}>— {point}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
