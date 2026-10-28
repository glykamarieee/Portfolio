"use client";

import { useRef } from "react";
import { certificates, education, experience, site, skills } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, mq, useGSAP } from "@/lib/motion";
import { formatMonth } from "@/lib/format";
import { sceneIndex } from "../registry";

// Where each block flies in from, as [x vw, y vh, rotation deg]
const ORIGINS: [number, number, number][] = [
  [-45, -40, -12],
  [50, -25, 10],
  [-55, 30, 8],
  [45, 45, -14],
  [0, 60, 6],
];

// Scene 8 — the sections of the story fly in and stack into a resume sheet
// (pinned scrub), ending on the download. Static sheet when motion is off.
export function ResumeMoment() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(mq.cinematic, () => {
      const el = section.current!;
      const blocks = gsap.utils.toArray<HTMLElement>("[data-block]", el);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=200%", pin: true, scrub: true },
      });
      blocks.forEach((block, i) => {
        const [x, y, rotation] = ORIGINS[i % ORIGINS.length];
        tl.from(block, { x: `${x}vw`, y: `${y}vh`, rotation, autoAlpha: 0, ease: ease.reveal }, i * 0.25);
      });
      tl.from(el.querySelector("[data-actions]"), { autoAlpha: 0, y: 24, ease: ease.reveal });
    });
  });

  const latestJob = experience[0];
  const latestSchool = education[0];

  return (
    <section
      ref={section}
      data-scene="Resume"
      className="container-grid min-h-svh content-center items-center gap-y-10 overflow-x-clip py-24 lg:py-16"
    >
      {/* Two columns on desktop so the pinned scene fits short laptop screens */}
      <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
        <SceneHeader index={sceneIndex("Resume")} title="Resume" />
        <h2 className="font-display text-display font-semibold">Resume</h2>
        <p className="text-lead text-fg-muted">The whole story above, on one page.</p>
        <div data-actions className="flex flex-wrap items-center gap-8">
          <Magnetic>
            <a href={site.resumePdf} download className="btn-pill" data-magnetic-inner>
              Download PDF ↓
            </a>
          </Magnetic>
          <TransitionLink href="/resume" className="meta text-fg" data-cursor="link">
            <RollText text="View full resume →" />
          </TransitionLink>
        </div>
      </div>

      <div className="resume-sheet col-span-12 md:col-span-10 md:col-start-2 lg:col-span-7 lg:col-start-6">
        <div data-block className="resume-block">
          <p className="font-display text-h2 font-semibold">{site.name}</p>
          <p className="meta mt-1">{site.role} · {site.location}</p>
        </div>
        {latestJob && (
          <div data-block className="resume-block">
            <p className="meta">Experience</p>
            <p className="mt-2 font-semibold">{latestJob.role}</p>
            <p className="text-fg-muted">
              {latestJob.organization} · {formatMonth(latestJob.start)} — {formatMonth(latestJob.end)}
            </p>
          </div>
        )}
        {latestSchool && (
          <div data-block className="resume-block">
            <p className="meta">Education</p>
            <p className="mt-2 font-semibold">{latestSchool.program}</p>
            <p className="text-fg-muted">{latestSchool.school}</p>
          </div>
        )}
        <div data-block className="resume-block">
          <p className="meta">Skills</p>
          <p className="mt-2 text-fg-muted">{skills.map((s) => s.name).join(" · ")}</p>
        </div>
        <div data-block className="resume-block">
          <p className="meta">Certificates</p>
          <p className="mt-2 text-fg-muted">
            {certificates.length} credentials, latest from {certificates[0]?.issuer}
          </p>
        </div>
      </div>
    </section>
  );
}
