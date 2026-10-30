"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { pad } from "@/lib/format";

// Fixed "03 / 10 — Selected Work" indicator for pages built from [data-scene]
// sections. Hidden during the first scene so it never sits on the hero, and
// once the last scene has passed so it never sits on the footer.
// Render it after the scenes so their pins are measured first.
export function SceneCounter() {
  const root = useRef<HTMLParagraphElement>(null);
  const index = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const total = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
    total.current!.textContent = pad(scenes.length);
    scenes.forEach((scene, i) => {
      // Pinned scenes live in a pin-spacer that spans their whole scroll distance
      const spacer = scene.parentElement?.classList.contains("pin-spacer") ? scene.parentElement : null;
      ScrollTrigger.create({
        trigger: spacer ?? scene,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (!self.isActive) return;
          root.current!.toggleAttribute("data-visible", i > 0);
          index.current!.textContent = pad(i + 1);
          title.current!.textContent = scene.dataset.scene ?? "";
        },
        // Past the last scene (the footer): get out of the way
        onLeave: i === scenes.length - 1 ? () => root.current!.removeAttribute("data-visible") : undefined,
      });
    });
  });

  return (
    <p ref={root} className="scene-counter meta" aria-hidden="true">
      <span ref={index} className="text-fg">
        01
      </span>{" "}
      / <span ref={total}>--</span> — <span ref={title}>Intro</span>
    </p>
  );
}
