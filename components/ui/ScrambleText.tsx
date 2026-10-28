"use client";

import { useRef } from "react";
import { dur, ease, gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/cn";

type ScrambleTextProps = {
  text: string;
  className?: string;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_—";

// Decodes itself when it enters the viewport and again on hover.
// Screen readers get the plain text; the scrambling layer is hidden from them.
export function ScrambleText({ text, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const run = () =>
          gsap.to(el, {
            duration: dur.base,
            ease: ease.scrub,
            overwrite: true,
            scrambleText: { text, chars: CHARS, speed: 0.6, revealDelay: 0.1 },
          });

        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: run });
        el.addEventListener("pointerenter", run);
        return () => el.removeEventListener("pointerenter", run);
      });
    },
    { dependencies: [text] },
  );

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
