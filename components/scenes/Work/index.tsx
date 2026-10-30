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

// What the preview's address bar shows: the live domain, or a stand-in from the slug
const address = (project: Project) => (project.url ? new URL(project.url).host : `${project.slug}.app`);

// Scene 3 — an interactive project index. Big typographic rows (number,
// title, role, stack, year); hovering one sweeps a lime fill across it, fades
// the others and shows a floating preview card that trails the cursor and
// leans with its speed. The list ends on an open "Your project?" row. Touch
// screens and reduced motion get an inline cover on every row instead.
export function Work() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const el = section.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    // Rows draw their rule and raise their title as the list scrolls in
    mm.add(mq.motion, () => {
      gsap
        .timeline({
          defaults: { ease: ease.reveal },
          scrollTrigger: { trigger: q("[data-list]")[0], start: "top 80%", once: true },
        })
        .from(q("[data-rule]"), { scaleX: 0, duration: dur.slow, stagger: stagger.items })
        .from(q("[data-rise]"), { yPercent: 110, duration: dur.slow, stagger: stagger.items }, "<0.1");
    });

    // Floating preview (fine pointers with motion only)
    mm.add({ fine: mq.finePointer, motion: mq.motion }, (ctx) => {
      const { fine, motion } = ctx.conditions as { fine: boolean; motion: boolean };
      if (!fine || !motion) return;
      const list = el.querySelector<HTMLElement>("[data-list]")!;
      const preview = el.querySelector<HTMLElement>("[data-preview]")!;
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
      const x = gsap.quickTo(preview, "x", { duration: dur.base, ease: ease.ui });
      const y = gsap.quickTo(preview, "y", { duration: dur.base, ease: ease.ui });
      const lean = gsap.quickTo(preview, "rotation", { duration: dur.base, ease: ease.ui });
      let lastX = 0;

      const move = (e: PointerEvent) => {
        const box = el.getBoundingClientRect();
        const px = e.clientX - box.left;
        x(px);
        y(e.clientY - box.top);
        lean(gsap.utils.clamp(-10, 10, (px - lastX) * 0.5));
        lastX = px;
      };
      const show = (e: PointerEvent) => {
        const box = el.getBoundingClientRect();
        lastX = e.clientX - box.left;
        gsap.set(preview, { x: lastX, y: e.clientY - box.top });
        gsap.to(preview, { scale: 1, autoAlpha: 1, duration: dur.fast, ease: ease.ui, overwrite: "auto" });
      };
      const hide = () => {
        lean(0);
        gsap.to(preview, { scale: 0.6, autoAlpha: 0, duration: dur.fast, ease: ease.ui, overwrite: "auto" });
      };
      list.addEventListener("pointermove", move);
      list.addEventListener("pointerenter", show);
      list.addEventListener("pointerleave", hide);
      return () => {
        list.removeEventListener("pointermove", move);
        list.removeEventListener("pointerenter", show);
        list.removeEventListener("pointerleave", hide);
      };
    });
  });

  return (
    <section ref={section} id="work" data-scene="Selected Work" className="work relative isolate py-32">
      <Decor set="work" />

      <header className="container-grid mb-14 items-end gap-y-6">
        <SceneHeader index={sceneIndex("Selected Work")} title="Selected Work" className="col-span-12" />
        <h2 className="font-display text-display col-span-12 md:col-span-8">
          Selected work<sup className="work-count">({pad(featured.length)})</sup>
        </h2>
        <p className="text-lead col-span-12 text-fg-muted md:col-span-4 md:text-right">
          Things I&apos;ve designed, coded and shipped · {span}
        </p>
      </header>

      <ul data-list className="work-list">
        {featured.map((project, i) => (
          <li key={project.slug}>
            <TransitionLink
              href={`/work/${project.slug}`}
              className="work-row"
              data-cursor="view"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span data-rule className="work-rule" aria-hidden="true" />
              <span className="work-thumb" aria-hidden="true">
                <MediaImage media={project.cover} sizes="100vw" />
              </span>
              <span className="work-index meta">{pad(i + 1)}</span>
              <span className="work-title">
                <span data-rise className="inline-block">
                  {project.title}
                </span>
              </span>
              <span className="work-meta">
                <span>{project.role}</span>
                <span className="work-stack">{project.stack.join(" · ")}</span>
              </span>
              <span className="work-year meta">{project.year}</span>
              <span className="work-arrow" aria-hidden="true">
                →
              </span>
            </TransitionLink>
          </li>
        ))}

        {/* An open slot at the end of the list */}
        <li>
          <TransitionLink href="/#contact" className="work-row is-open" data-cursor="link">
            <span data-rule className="work-rule" aria-hidden="true" />
            <span className="work-index meta">{pad(featured.length + 1)}</span>
            <span className="work-title">
              <span data-rise className="inline-block">
                Your project?
              </span>
            </span>
            <span className="work-meta">
              <span>Website, edit or shoot</span>
              <span className="work-stack">Let&apos;s make it next</span>
            </span>
            <span className="work-year meta">Next</span>
            <span className="work-arrow" aria-hidden="true">
              →
            </span>
          </TransitionLink>
          <span data-rule className="work-rule is-end" aria-hidden="true" />
        </li>
      </ul>

      {/* Floating preview: every cover stacked, the hovered one revealed */}
      <div data-preview className="work-preview" aria-hidden="true">
        {featured.map((project, i) => (
          <div key={project.slug} className={cn("work-preview-card", i === active && "is-active")}>
            <span className="work-preview-bar">
              <span className="win-dots">
                <span />
                <span />
                <span />
              </span>
              <span className="work-preview-url">{address(project)}</span>
            </span>
            <span className="work-preview-media">
              <MediaImage media={project.cover} sizes="420px" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
