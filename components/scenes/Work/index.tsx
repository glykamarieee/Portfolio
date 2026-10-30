"use client";

import { useRef } from "react";
import { projects, site, type Project } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, mq, useGSAP } from "@/lib/motion";
import { initials, pad } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const featured = projects.filter((p) => p.featured);

// What the browser bar shows: the live domain, or a stand-in from the slug
const address = (project: Project) => (project.url ? new URL(project.url).host : `${project.slug}.app`);

// The header timecode runs 4 seconds of "film" per project, at 24 fps
const FPS = 24;
const SECONDS_PER_FRAME = 4;
const timecode = (seconds: number) => {
  const frames = Math.floor(seconds * FPS);
  const ff = frames % FPS;
  const s = Math.floor(frames / FPS);
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(ff)}`;
};

// Scene 3 — the projects as frames on a 35mm film strip (sprocket holes,
// edge markings). Desktop: the section pins and vertical scroll pulls the
// strip sideways; the frame in the middle racks into focus while the rest
// dim, media parallaxes, titles rise, a frame counter + timecode tick and a
// rail fills. The strip ends on a "That's a wrap" frame pointing to contact.
// Below desktop / under reduced motion it's a vertical strip, all in focus.
export function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(mq.cinematic, () => {
      const el = section.current!;
      const list = track.current!;
      el.dataset.mode = "track";
      const count = el.querySelector("[data-count]");
      const tc = el.querySelector("[data-tc]");
      const total = featured.length * SECONDS_PER_FRAME;

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
            if (count)
              count.textContent = pad(Math.min(featured.length, Math.floor(self.progress * featured.length) + 1));
            if (tc) tc.textContent = timecode(self.progress * total);
          },
        },
      });
      gsap.fromTo(
        el.querySelector("[data-rail]"),
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

      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", list);
      panels.forEach((panel, i) => {
        // Rack focus: dim and small at the edges, sharp in the middle. The
        // first frame starts sharp (it never reaches the middle from the left)
        // and the last one ends sharp (the strip stops before it's centered).
        const frame = panel.querySelector("[data-frame]");
        const dim = { scale: 0.86, opacity: 0.4 };
        const sharp = { scale: 1, opacity: 1 };
        const focus = (start: string, end: string) =>
          gsap.timeline({
            defaults: { ease: ease.scrubSoft },
            scrollTrigger: { trigger: panel, containerAnimation: slide, start, end, scrub: true },
          });
        if (i === 0) focus("left 6%", "right left").fromTo(frame, sharp, dim);
        else if (i === panels.length - 1) focus("left right", "left 80%").fromTo(frame, dim, sharp);
        else focus("left right", "right left").fromTo(frame, dim, sharp).to(frame, dim);

        const media = panel.querySelector("[data-media]");
        if (media) {
          gsap.fromTo(
            media,
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
        }
        gsap.from(panel.querySelector("[data-title]"), {
          yPercent: 110,
          duration: dur.slow,
          ease: ease.reveal,
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 90%", once: true },
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
          <div className="col-span-12 flex md:col-span-4 md:justify-end">
            <div className="work-progress">
              <p className="meta flex items-center gap-3">
                <span className="work-rec" aria-hidden="true" />
                <span>
                  Frame{" "}
                  <span data-count className="text-fg">
                    01
                  </span>{" "}
                  / {pad(featured.length)}
                </span>
                <span data-tc className="work-tc hidden lg:motion-safe:inline" aria-hidden="true">
                  {timecode(0)}
                </span>
              </p>
              <span className="work-rail" aria-hidden="true">
                <span data-rail className="work-rail-fill" />
              </span>
            </div>
          </div>
        </header>

        <ul ref={track} className="work-track filmstrip">
          {featured.map((project, i) => (
            <li key={project.slug} data-panel className="work-panel">
              <span className="frame-edge" aria-hidden="true">
                <span>▸ {pad(i + 1)}A</span>
                <span>
                  {initials(site.name)} · {project.year}
                </span>
              </span>
              <div data-frame className="work-frame">
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
              </div>
            </li>
          ))}

          {/* The last frame on the reel: an open invitation */}
          <li data-panel className="work-panel is-wrap">
            <span className="frame-edge" aria-hidden="true">
              <span>▸ {pad(featured.length + 1)}A</span>
              <span>End of reel</span>
            </span>
            <div data-frame className="work-frame">
              <TransitionLink href="/#contact" className="work-wrap group" data-cursor="link">
                <span className="meta">That&apos;s a wrap</span>
                <span className="font-display text-display overflow-hidden">
                  <span data-title className="inline-block">
                    Your project could be frame {pad(featured.length + 1)}.
                  </span>
                </span>
                <span className="work-wrap-cta">
                  Let&apos;s talk
                  <span className="work-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </TransitionLink>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
