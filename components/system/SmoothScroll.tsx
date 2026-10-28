"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, gsap, ScrollTrigger, setLenis, smoothScroll } from "@/lib/motion";

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

  // Reading the pathname must sit inside Suspense under Cache Components.
  return (
    <Suspense fallback={null}>
      <RouteSync />
    </Suspense>
  );
}

// After a client navigation the page height changes: re-measure Lenis and
// every ScrollTrigger once the new page has painted.
function RouteSync() {
  const pathname = usePathname();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      getLenis()?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
