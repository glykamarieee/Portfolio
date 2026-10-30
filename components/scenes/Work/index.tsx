"use client";

import { useRef, useState } from "react";
import { projects, type Project } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, mq, stagger, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { pad } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const featured = projects.filter((p) => p.featured);
const years = featured.map((p) => p.year);
const span = `${Math.min(...years)} — ${Math.max(...years)}`;
const OPEN = featured.length; // index of the closing "Your project?" slice

// The live domain, or a stand-in from the slug
const address = (project: Project) => (project.url ? new URL(project.url).host : `${project.slug}.app`);

// Scene 3 — expanding slices. Every project is a tall rounded panel (cover,
// number, title set sideways); hovering or focusing one widens it to show the
// whole project while the rest squeeze into strips. The last slice is a lime
// "Your project?" pointing to contact. Below desktop the slices stack as full
// cards; reduced motion skips the transitions.
export function Work() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const el = section.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      gsap.from(gsap.utils.toArray("[data-slice]", el), {
        yPercent: 18,
        autoAlpha: 0,
        duration: dur.slow,
        ease: ease.reveal,
        stagger: stagger.items,
        scrollTrigger: { trigger: el.querySelector("[data-slices]"), start: "top 80%", once: true },
      });
    });
  });

  return (
    <section ref={section} id="work" data-scene="Selected Work" className="work relative isolate py-32">
      <Decor set="work" />

      <header className="container-grid mb-12 items-end gap-y-6">
        <SceneHeader index={sceneIndex("Selected Work")} title="Selected Work" className="col-span-12" />
        <h2 className="font-display text-display col-span-12 md:col-span-8">
          Selected work<sup className="work-count">({pad(featured.length)})</sup>
        </h2>
        <p className="text-lead col-span-12 text-fg-muted md:col-span-4 md:text-right">
          Things I&apos;ve designed, coded and shipped · {span}
        </p>
      </header>

      <ul data-slices className="slices">
        {featured.map((project, i) => (
          <li key={project.slug} data-slice className={cn("slice", active === i && "is-active")}>
            <TransitionLink
              href={`/work/${project.slug}`}
              className="slice-link"
              data-cursor="view"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="slice-media" aria-hidden="true">
                <MediaImage media={project.cover} sizes="(min-width: 1024px) 60vw, 100vw" />
              </span>

              <span className="slice-url" aria-hidden="true">
                {address(project)}
              </span>

              {/* Collapsed: the number and the title set sideways */}
              <span className="slice-spine" aria-hidden="true">
                <span className="slice-num">{pad(i + 1)}</span>
                <span className="slice-spine-title">{project.title}</span>
              </span>

              {/* Expanded: the whole project */}
              <span className="slice-body">
                <span className="slice-top">
                  <span className="slice-num">{pad(i + 1)}</span>
                </span>
                <span className="slice-info">
                  <span className="slice-meta">
                    {project.year} · {project.role}
                  </span>
                  <span className="slice-title">{project.title}</span>
                  <span className="slice-stack">
                    {project.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </span>
                  <span className="slice-cta">
                    View case study
                    <span className="slice-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </span>
              </span>
            </TransitionLink>
          </li>
        ))}

        <li data-slice className={cn("slice is-open", active === OPEN && "is-active")}>
          <TransitionLink
            href="/#contact"
            className="slice-link"
            data-cursor="link"
            onPointerEnter={() => setActive(OPEN)}
            onFocus={() => setActive(OPEN)}
          >
            <span className="slice-spine" aria-hidden="true">
              <span className="slice-num">{pad(OPEN + 1)}</span>
              <span className="slice-spine-title">Your project?</span>
            </span>
            <span className="slice-body">
              <span className="slice-top">
                <span className="slice-num">{pad(OPEN + 1)}</span>
              </span>
              <span className="slice-info">
                <span className="slice-meta">Website, edit or shoot</span>
                <span className="slice-title">Your project?</span>
                <span className="slice-cta">
                  Let&apos;s make it next
                  <span className="slice-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </span>
            </span>
          </TransitionLink>
        </li>
      </ul>
    </section>
  );
}
