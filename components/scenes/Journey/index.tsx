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
  now: boolean;
  title: string;
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
    place: [e.organization, e.location].filter(Boolean).join(" · "),
    points: e.achievements,
  })),
  ...education.map((e) => ({
    lane: "school" as const,
    year: String(e.start),
    dates: `${e.start} — ${e.end === "present" ? "Present" : e.end}`,
    now: e.end === "present",
    title: e.program,
    place: e.school,
    points: [...(e.honors ?? []), ...(e.highlights ?? [])],
  })),
].sort((a, b) => b.year.localeCompare(a.year));

// Scene 5 — experience + education on one timeline: work on the left lane,
// school on the right (single lane on mobile). Minimal: type on hairlines, a
// large faint year across the spine from each milestone. The spine draws as
// you scroll, each dot fills as its milestone reaches the middle, and a sticky
// year follows along.
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

      const items = gsap.utils.toArray<HTMLElement>("[data-milestone]", el);
      const show = (item?: HTMLElement) => {
        if (year.current && item) year.current.textContent = item.dataset.year ?? "";
      };
      items.forEach((item, i) => {
        gsap.from(item.querySelector("[data-journey-card]"), {
          autoAlpha: 0,
          y: 48,
          duration: dur.base,
          ease: ease.reveal,
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
        // The year switches as each milestone's top passes the middle (so a fast
        // scroll can't skip one), and back to the previous one on the way up
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          onEnter: () => {
            item.classList.add("is-reached");
            show(item);
          },
          onLeaveBack: () => {
            item.classList.remove("is-reached");
            show(items[i - 1] ?? item);
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
        <ul className="flex gap-6" aria-label="Legend">
          <li className="journey-key is-work">Work</li>
          <li className="journey-key is-school">School</li>
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
            <li
              key={i}
              data-milestone
              data-year={m.year}
              className={cn("journey-item", `is-${m.lane}`, m.now && "is-now")}
            >
              <span className="journey-dot" aria-hidden="true" />
              <span className="journey-ghost font-display" aria-hidden="true">
                {m.year}
              </span>
              <article data-journey-card className="journey-card">
                <p className="journey-meta">
                  <span>{m.lane === "work" ? "Work" : "School"}</span>
                  <span aria-hidden="true">·</span>
                  <span>{m.dates}</span>
                  {m.now && <span className="journey-now">Now</span>}
                </p>
                <h3 className="journey-title font-display">{m.title}</h3>
                <p className="text-fg-muted">{m.place}</p>
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
