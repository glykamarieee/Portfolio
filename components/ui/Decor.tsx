"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { decor, type DecorObject } from "@/content/decor";
import { dur, ease, gsap, mq, onReady, stagger, useGSAP, whenIdle } from "@/lib/motion";
import { cn } from "@/lib/cn";

// Floating 3D objects for one section (placements in content/decor.ts).
// The parent section needs `relative isolate` so objects sit behind its text
// (or over it with `front`). Each object: idle float, cursor parallax by depth,
// scroll drift, and a pop-in when the section enters. Static under reduced motion.
export function Decor({ set }: { set: keyof typeof decor }) {
  const ref = useRef<HTMLDivElement>(null);
  const items = decor[set] ?? [];

  useGSAP((_, contextSafe) => {
    const root = ref.current;
    if (!root) return; // empty set renders nothing
    // root is display: contents (no box) — the section is the scroll trigger
    const section = root.parentElement!;

    const setup = contextSafe!(() => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        // Skip objects hidden at this breakpoint (display: none)
        const objects = gsap.utils.toArray<HTMLElement>("[data-decor]", root).filter((o) => o.offsetParent !== null);
        if (objects.length === 0) return;
        const tilts = objects.map((o) => o.querySelector<HTMLElement>("[data-decor-tilt]")!);

        // Layers own different properties: obj = scroll drift, tilt = pop-in +
        // cursor x/y, body = idle float. The resting angle is CSS `rotate` on the image.
        const pop = gsap.from(tilts, {
          scale: 0,
          rotation: "-=40",
          duration: dur.slow,
          ease: ease.spring,
          stagger: stagger.items,
          paused: true,
        });

        // One ScrollTrigger per section drives every object's drift and the pop-in
        const drift = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onEnter: () => pop.play(),
            onEnterBack: () => pop.play(),
          },
        });

        objects.forEach((obj) => {
          const depth = Number(obj.dataset.depth);
          drift.fromTo(obj, { yPercent: 40 * depth }, { yPercent: -40 * depth, ease: ease.scrub }, 0);
          gsap.to(obj.querySelector("[data-decor-body]"), {
            y: -12 * depth,
            rotation: `+=${6 * depth}`,
            duration: gsap.utils.random(2.6, 3.8),
            ease: ease.float,
            yoyo: true,
            repeat: -1,
          });
        });

        // Cursor parallax (fine pointers only)
        if (!window.matchMedia(mq.finePointer).matches) return;
        const movers = objects.map((obj, i) => ({
          depth: Number(obj.dataset.depth),
          x: gsap.quickTo(tilts[i], "x", { duration: dur.slow, ease: ease.ui }),
          y: gsap.quickTo(tilts[i], "y", { duration: dur.slow, ease: ease.ui }),
        }));
        const onMove = (e: PointerEvent) => {
          const dx = e.clientX / window.innerWidth - 0.5;
          const dy = e.clientY / window.innerHeight - 0.5;
          for (const m of movers) {
            m.x(dx * 40 * m.depth);
            m.y(dy * 40 * m.depth);
          }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    });

    // Decoration isn't essential: set it up after the intro, when the main
    // thread is idle, so it never lands in the hydration long task.
    let cancelIdle = () => {};
    const off = onReady(() => {
      cancelIdle = whenIdle(setup);
    });
    return () => {
      off();
      cancelIdle();
    };
  });

  if (items.length === 0) return null;

  // Two layers: behind the section's text, and in front of it
  return (
    <div ref={ref} className="contents" aria-hidden="true">
      <div className="decor">
        {items.map((item, i) => !item.front && <DecorItem key={i} item={item} />)}
      </div>
      <div className="decor is-front">
        {items.map((item, i) => item.front && <DecorItem key={i} item={item} />)}
      </div>
    </div>
  );
}

function DecorItem({ item }: { item: DecorObject }) {
  const style = {
    width: item.size,
    top: item.top,
    right: item.right,
    bottom: item.bottom,
    left: item.left,
    "--rotate": `${item.rotate ?? 0}deg`,
  } as CSSProperties;

  return (
    <div
      data-decor
      data-depth={item.depth}
      className={cn("decor-item", !item.mobile && "max-md:hidden")}
      style={style}
    >
      <div data-decor-tilt>
        <div data-decor-body className="decor-body">
          <Image
            src={item.src}
            alt=""
            width={400}
            height={400}
            draggable={false}
            unoptimized={item.src.endsWith(".svg")}
            sizes="(min-width: 768px) 12vw, 25vw"
          />
        </div>
      </div>
    </div>
  );
}
