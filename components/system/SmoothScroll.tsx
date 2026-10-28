"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, smoothScroll } from "@/lib/motion";

// Lenis smooth scroll driven by GSAP's ticker, so the site has one RAF loop.
// Lenis disables its own smoothing under prefers-reduced-motion.
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: smoothScroll.lerp,
      autoRaf: false,
      respectReducedMotion: true,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
