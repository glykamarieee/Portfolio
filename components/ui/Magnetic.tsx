"use client";

import { useRef, type ReactNode } from "react";
import { dur, ease, gsap, interaction, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/cn";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  /** Lens state while hovered (default "magnetic"). */
  cursor?: string;
};

// Pulls its content toward the pointer and springs back on leave.
// An optional child marked [data-magnetic-inner] moves further, for a parallax label.
export function Magnetic({
  children,
  className,
  strength = interaction.magnetStrength,
  cursor = "magnetic",
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          gsap.to(el, { x: dx * strength, y: dy * strength, duration: dur.fast, ease: ease.ui, overwrite: true });
          if (inner) {
            gsap.to(inner, { x: dx * strength * 0.5, y: dy * strength * 0.5, duration: dur.fast, ease: ease.ui, overwrite: true });
          }
        };
        const onLeave = () => {
          gsap.to([el, inner].filter(Boolean), { x: 0, y: 0, duration: dur.slow, ease: ease.spring, overwrite: true });
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
  );

  return (
    <span ref={ref} className={cn("inline-block", className)} data-cursor={cursor}>
      {children}
    </span>
  );
}
