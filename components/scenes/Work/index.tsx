"use client";

import { useRef } from "react";
import { projects } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, mq, useGSAP } from "@/lib/motion";
import { pad } from "@/lib/format";
import { sceneIndex } from "../registry";

const featured = projects.filter((p) => p.featured);

// Scene 3 — pinned horizontal track: vertical scroll slides the project
// panels sideways, with media parallax and title reveals per panel.
// Below desktop / under reduced motion it's a plain vertical stack.
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
        },
      });

      list.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.fromTo(
          panel.querySelector("[data-media]"),
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: ease.scrub,
            scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
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
    <section ref={section} id="work" data-scene="Selected Work" className="work py-24">
      <div className="work-inner">
        <header className="container-grid mb-12 items-end gap-y-4">
          <SceneHeader index={sceneIndex("Selected Work")} title="Selected Work" className="col-span-12" />
          <h2 className="font-display text-display col-span-12 font-semibold md:col-span-8">Selected Work</h2>
          <p className="meta col-span-12 md:col-span-4 md:text-right">
            {pad(featured.length)} projects<span className="hidden lg:motion-safe:inline"> · scroll →</span>
          </p>
        </header>

        <ul ref={track} className="work-track">
          {featured.map((project, i) => (
            <li key={project.slug} data-panel className="work-panel">
              <TransitionLink
                href={`/work/${project.slug}`}
                className="group flex flex-col gap-6"
                data-cursor="view"
                data-cursor-media={project.preview?.preview ?? project.cover.src}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-bg-elev">
                  <div data-media className="absolute -inset-x-[10%] inset-y-0">
                    <MediaImage
                      media={project.cover}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="transition-transform duration-(--dur-base) ease-(--ease-reveal) group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-display text-h2 overflow-hidden font-semibold">
                    <span data-title className="inline-block">
                      {project.title}
                    </span>
                  </h3>
                  <p className="meta shrink-0 pt-2">
                    ({pad(i + 1)}) — {project.year}
                  </p>
                </div>
                <p className="meta flex flex-wrap gap-x-4 gap-y-2">
                  <span className="text-fg">{project.role}</span>
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </p>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
