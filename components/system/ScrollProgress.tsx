"use client";

import { useRef } from "react";
import { ease, gsap, useGSAP } from "@/lib/motion";

// Thin accent bar across the top that tracks page scroll.
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      { scaleX: 1, ease: ease.scrub, scrollTrigger: { start: 0, end: "max", scrub: true } },
    );
  });

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
