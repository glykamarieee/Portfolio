"use client";

import { useRef, type ReactNode } from "react";
import { dur, ease, gsap, stagger, useGSAP } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate direct children one after another instead of the wrapper as a whole. */
  staggerChildren?: boolean;
};

// Fades/rises content in once as it enters the viewport.
// Content is fully visible without JS, and stays static under reduced motion.
export function Reveal({ children, className, staggerChildren = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(staggerChildren ? el.children : el, {
          autoAlpha: 0,
          y: 48,
          duration: dur.base,
          ease: ease.reveal,
          stagger: staggerChildren ? stagger.items : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
