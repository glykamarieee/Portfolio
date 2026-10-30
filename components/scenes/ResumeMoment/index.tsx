"use client";

import { useRef } from "react";
import { about, certificates, education, experience, projects, site, skillCategories, skills } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { CountUp } from "@/components/ui/CountUp";
import { Magnetic } from "@/components/ui/Magnetic";
import { MediaImage } from "@/components/ui/MediaImage";
import { RollText } from "@/components/ui/RollText";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, mq, useGSAP } from "@/lib/motion";
import { formatMonth } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const jobs = experience.slice(0, 2);
const school = education[0];
// The first three skills of each craft — the sheet is a teaser, /resume has the rest
const topSkills = skillCategories.map((c) => ({
  name: c.name,
  items: skills
    .filter((s) => s.category === c.name)
    .slice(0, 3)
    .map((s) => s.name),
}));

const facts = [
  { label: "Projects", value: projects.filter((p) => p.featured).length },
  { label: "Certificates", value: certificates.length },
  { label: "Tools & skills", value: skills.length },
];

// Scene 8 — a resume put together on a desk. Desktop: the section pins and,
// as you scroll, a paper sheet slides up and settles, its lines print in,
// a highlighter swipes the key lines, a taped polaroid and a paper clip land,
// a sticky note slides in and an "Open to work" stamp slams down. Smaller
// screens play it once on enter; reduced motion shows the finished desk.
export function ResumeMoment() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = section.current!;
    const mm = gsap.matchMedia();
    mm.add({ cinematic: mq.cinematic, motion: mq.motion }, (ctx) => {
      const { cinematic } = ctx.conditions as { cinematic: boolean };
      const q = gsap.utils.selector(el);

      const tl = gsap.timeline({
        defaults: { ease: ease.reveal },
        scrollTrigger: cinematic
          ? { trigger: el, start: "top top", end: "+=180%", pin: true, scrub: true }
          : { trigger: q("[data-sheet]")[0], start: "top 80%", once: true },
      });

      tl.from(q("[data-sheet]"), { yPercent: 60, rotation: -9, autoAlpha: 0, duration: 1.2 })
        .from(q("[data-clip]"), { y: -40, autoAlpha: 0, duration: 0.4 }, "-=0.3")
        .fromTo(
          q("[data-line]"),
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, stagger: 0.07, ease: ease.ui },
          "-=0.2",
        )
        .fromTo(
          q("[data-hl]"),
          { backgroundSize: "0% 100%" },
          { backgroundSize: "100% 100%", duration: 0.4, stagger: 0.12, ease: ease.ui },
          "-=0.4",
        )
        .from(q("[data-polaroid]"), { y: -140, rotation: 24, autoAlpha: 0, duration: 0.8 }, "-=0.6")
        .from(q("[data-tape]"), { scaleX: 0, duration: 0.3, ease: ease.ui }, "-=0.2")
        .from(q("[data-note]"), { x: -80, rotation: -20, autoAlpha: 0, duration: 0.7 }, "-=0.2")
        .from(q("[data-stamp]"), { scale: 2.4, rotation: -40, autoAlpha: 0, duration: 0.35, ease: "back.out(2)" })
        .from(q("[data-actions]"), { y: 24, autoAlpha: 0, duration: 0.5 }, "-=0.1");
    });
  });

  return (
    <section
      ref={section}
      data-scene="Resume"
      className="resume-scene container-grid relative isolate min-h-svh content-center items-center gap-y-12 overflow-x-clip py-24 lg:py-16"
    >
      <Decor set="resume" />

      <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
        <SceneHeader index={sceneIndex("Resume")} title="Resume" />
        <h2 className="font-display text-display">Resume</h2>
        <p className="text-lead text-fg-muted">Everything above, on one page — ready to print or send.</p>
        <dl className="resume-facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dd className="font-display text-h2">
                <CountUp value={fact.value} />
              </dd>
              <dt className="meta">{fact.label}</dt>
            </div>
          ))}
        </dl>
        <div data-actions className="flex flex-wrap items-center gap-6">
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

      <div className="resume-desk col-span-12 lg:col-span-7 lg:col-start-6">
        <article data-sheet className="paper" aria-label={`${site.name} — resume preview`}>
          <span data-clip className="paper-clip" aria-hidden="true" />

          <header className="paper-head">
            <p data-line className="paper-name">
              {site.name}
            </p>
            <p data-line>
              <span data-hl className="paper-hl">
                {site.role}
              </span>{" "}
              · {site.location}
            </p>
            <p data-line className="paper-meta">
              {site.email} · {site.phone}
            </p>
          </header>

          <div className="paper-cols">
            <div className="paper-col">
              <p data-line className="paper-label">
                Experience
              </p>
              {jobs.map((job) => (
                <div key={`${job.organization}-${job.start}`} className="paper-entry">
                  <p data-line className="paper-strong">
                    {job.role}
                  </p>
                  <p data-line className="paper-meta">
                    {job.organization} · {formatMonth(job.start)} — {formatMonth(job.end)}
                  </p>
                </div>
              ))}
              {school && (
                <>
                  <p data-line className="paper-label">
                    Education
                  </p>
                  <div className="paper-entry">
                    <p data-line className="paper-strong">
                      {school.program}
                    </p>
                    <p data-line className="paper-meta">
                      {school.school} · {school.start} — {school.end === "present" ? "Present" : school.end}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="paper-col">
              <p data-line className="paper-label">
                Skills
              </p>
              {topSkills.map((craft, i) => (
                <div key={craft.name} className="paper-entry">
                  <p data-line className="paper-strong">
                    {i === 0 ? (
                      <span data-hl className="paper-hl">
                        {craft.name}
                      </span>
                    ) : (
                      craft.name
                    )}
                  </p>
                  <p data-line className="paper-meta">
                    {craft.items.join(" · ")}
                  </p>
                </div>
              ))}
              <p data-line className="paper-label">
                Certificates
              </p>
              <p data-line className="paper-meta">
                {certificates.length} credentials
              </p>
            </div>
          </div>

          {/* Faint ruled lines at the bottom, like the rest of the page continues */}
          <div className="paper-rules" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div data-polaroid className="polaroid" aria-hidden="true">
            <span data-tape className="polaroid-tape" />
            <span className="polaroid-photo">
              <MediaImage media={about.portrait} sizes="140px" quality={90} />
            </span>
            <span className="polaroid-caption">hi, it&apos;s me!</span>
          </div>

          <p data-stamp className="stamp" aria-hidden="true">
            <span>Open to work</span>
            <span className="stamp-sub">{site.location}</span>
          </p>
        </article>

        <p data-note className="sticky-note" aria-hidden="true">
          Code · Cut · Capture
        </p>
      </div>
    </section>
  );
}
