"use client";

import { useRef, type ReactNode } from "react";
import { dur, ease, gsap, interaction, useGSAP } from "@/lib/motion";

type TiltProps = {
  children: ReactNode;
  className?: string;
  max?: number;
};

// Tilts toward the pointer (max 6° by default) and settles back on leave.
export function Tilt({ children, className, max = interaction.tiltMax }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { transformPerspective: 800 });

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(el, { rotateY: px * 2 * max, rotateX: -py * 2 * max, duration: dur.fast, ease: ease.ui, overwrite: true });
        };
        const onLeave = () => {
          gsap.to(el, { rotateX: 0, rotateY: 0, duration: dur.base, ease: ease.reveal, overwrite: true });
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
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
