"use client";

import { useRef, type ReactNode } from "react";
import { ease, gsap, mq, useGSAP } from "@/lib/motion";

type ParallaxProps = {
  children?: ReactNode;
  className?: string;
  /** Travel as a fraction of the element's height; negative moves against scroll. */
  speed?: number;
};

// Scroll-linked vertical drift for layered depth. Static under reduced motion.
export function Parallax({ children, className, speed = 0.15 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: ease.scrub,
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
