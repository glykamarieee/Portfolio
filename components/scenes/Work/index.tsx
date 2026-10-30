"use client";

import { useRef } from "react";
import { projects, type Project } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, mq, useGSAP } from "@/lib/motion";
import { pad } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";
import { GlassFolder } from "@/components/ui/GlassFolder";

const featured = projects.filter((p) => p.featured);

// What the browser bar shows: the live domain, or a stand-in from the slug
const address = (project: Project) => (project.url ? new URL(project.url).host : `${project.slug}.app`);

// Scene 3 — pinned horizontal track of projects, each framed as a browser
// window: vertical scroll slides them sideways (media parallax, title
// reveals) and a progress rail fills. Below desktop / under reduced motion
// it's a plain vertical stack.
export function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(mq.cinematic, () => {
      const el = section.current!;
      const list = track.current!;
      el.dataset.mode = "track";

      const distance = () => list.scrollWidth - window.innerWidth;
      const slide = gsap.to(list, {
        x: () => -distance(),
        ease: ease.scrub,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const count = el.querySelector("[data-count]");
            if (count)
              count.textContent = pad(Math.min(featured.length, Math.floor(self.progress * featured.length) + 1));
          },
        },
      });
      gsap.fromTo(
        "[data-rail]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: ease.scrub,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      list.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.fromTo(
          panel.querySelector("[data-media]"),
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: ease.scrub,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: slide,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
        gsap.from(panel.querySelector("[data-title]"), {
          yPercent: 110,
          duration: dur.slow,
          ease: ease.reveal,
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 75%", once: true },
        });
      });

      return () => delete el.dataset.mode;
    });
  });

  return (
    <section ref={section} id="work" data-scene="Selected Work" className="work relative isolate py-24">
      <Decor set="work" />
      <div className="work-inner">
        <header className="container-grid mb-12 items-end gap-y-4">
          <SceneHeader index={sceneIndex("Selected Work")} title="Selected Work" className="col-span-12" />
          <div className="col-span-12 flex flex-col gap-3 md:col-span-8">
            <h2 className="font-display text-display">Selected work</h2>
            <p className="text-lead text-fg-muted">Things I&apos;ve designed, coded and shipped.</p>
          </div>
          <div className="col-span-12 flex items-end gap-6 md:col-span-4 md:justify-end">
            <GlassFolder />
            <div className="work-progress">
              <p className="meta">
                <span data-count className="text-fg">
                  01
                </span>{" "}
                / {pad(featured.length)}
                <span className="hidden lg:motion-safe:inline"> · scroll →</span>
              </p>
              <span className="work-rail" aria-hidden="true">
                <span data-rail className="work-rail-fill" />
              </span>
            </div>
          </div>
        </header>

        <ul ref={track} className="work-track">
          {featured.map((project, i) => (
            <li key={project.slug} data-panel className="work-panel">
              <TransitionLink
                href={`/work/${project.slug}`}
                className="work-card group"
                data-cursor="view"
                data-cursor-media={project.preview?.preview ?? project.cover.src}
              >
                <span className="work-bar" aria-hidden="true">
                  <span className="win-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="work-url">{address(project)}</span>
                  <span className="meta">
                    {pad(i + 1)} / {pad(featured.length)}
                  </span>
                </span>
                <span className="work-media">
                  <span data-media className="absolute -inset-x-[10%] inset-y-0">
                    <MediaImage
                      media={project.cover}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="transition-transform duration-(--dur-base) ease-(--ease-reveal) group-hover:scale-105"
                    />
                  </span>
                </span>
                <span className="work-info">
                  <span className="flex min-w-0 flex-col gap-2">
                    <span className="meta">
                      {project.year} · {project.role}
                    </span>
                    <span className="font-display text-h2 overflow-hidden">
                      <span data-title className="inline-block">
                        {project.title}
                      </span>
                    </span>
                    <span className="work-stack">
                      {project.stack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </span>
                  </span>
                  <span className="work-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
