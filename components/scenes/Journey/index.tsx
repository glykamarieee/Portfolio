"use client";

import { useRef } from "react";
import { education, experience } from "@/content";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, mq, ScrollTrigger, useGSAP } from "@/lib/motion";
import { formatMonth, initials, yearOf } from "@/lib/format";
import { cn } from "@/lib/cn";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

type Milestone = {
  lane: "work" | "school";
  year: string;
  dates: string;
  now: boolean;
  title: string;
  org: string;
  place: string;
  points: string[];
};

const milestones: Milestone[] = [
  ...experience.map((e) => ({
    lane: "work" as const,
    year: yearOf(e.start),
    dates: `${formatMonth(e.start)} — ${formatMonth(e.end)}`,
    now: e.end === "present",
    title: e.role,
    org: e.organization,
    place: [e.organization, e.location].filter(Boolean).join(" · "),
    points: e.achievements,
  })),
  ...education.map((e) => ({
    lane: "school" as const,
    year: String(e.start),
    dates: `${e.start} — ${e.end === "present" ? "Present" : e.end}`,
    now: e.end === "present",
    title: e.program,
    org: e.school,
    place: e.school,
    points: [...(e.honors ?? []), ...(e.highlights ?? [])],
  })),
].sort((a, b) => b.year.localeCompare(a.year));

// Scene 5 — experience + education on one timeline: work on the left lane,
// school on the right (single lane on mobile). The spine draws as you scroll,
// each dot lights as its milestone reaches the middle, and a sticky year
// counter follows along.
export function Journey() {
  const section = useRef<HTMLElement>(null);
  const spine = useRef<HTMLSpanElement>(null);
  const year = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = section.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      el.dataset.motion = "on";
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
        gsap.from(item.querySelector("[data-journey-card]"), {
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
          onEnter: () => item.classList.add("is-reached"),
          onLeaveBack: () => item.classList.remove("is-reached"),
          onToggle: (self) => {
            if (self.isActive && year.current) year.current.textContent = item.dataset.year ?? "";
          },
        });
      });

      return () => {
        delete el.dataset.motion;
        el.querySelectorAll("[data-milestone]").forEach((item) => item.classList.remove("is-reached"));
      };
    });
  });

  return (
    <section
      ref={section}
      id="journey"
      data-scene="Journey"
      className="journey-scene container-grid relative isolate gap-y-12 py-32"
    >
      <Decor set="journey" />
      <SceneHeader index={sceneIndex("Journey")} title="Journey" className="col-span-12" />
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display">Journey &amp; education</h2>
          <p className="text-lead text-fg-muted">Where I&apos;ve worked, and where I&apos;ve learned.</p>
        </div>
        <ul className="flex gap-2" aria-label="Legend">
          <li className="journey-lane is-work">Work</li>
          <li className="journey-lane is-school">School</li>
        </ul>
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
              <article data-journey-card className="journey-card">
                <div className="flex items-center gap-3">
                  <span className="journey-mark" aria-hidden="true">
                    {initials(m.org)}
                  </span>
                  <span className={cn("journey-lane", `is-${m.lane}`)}>{m.lane === "work" ? "Work" : "School"}</span>
                  {m.now && <span className="journey-now">Now</span>}
                  <span className="meta ml-auto">{m.dates}</span>
                </div>
                <h3 className="font-display text-h2 mt-5">{m.title}</h3>
                <p className="mt-1 text-fg-muted">{m.place}</p>
                {m.points.length > 0 && (
                  <ul className="journey-points">
                    {m.points.map((point, p) => (
                      <li key={p}>{point}</li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
