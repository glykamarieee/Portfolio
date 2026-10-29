"use client";

import { useRef } from "react";
import { dur, ease, gsap, mq, stagger, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/cn";

// Frosted-glass folder with pages inside (decorative). The front panel is real
// glass (backdrop-filter), so the pages blur through it. Pages slide in when
// it scrolls into view and lift on hover.
export function GlassFolder({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.from(".glass-folder-page", {
          yPercent: 60,
          rotation: 0,
          duration: dur.slow,
          ease: ease.reveal,
          stagger: stagger.items,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("glass-folder", className)} aria-hidden="true">
      <span className="glass-folder-shadow" />
      <span className="glass-folder-back" />
      <span className="glass-folder-page" />
      <span className="glass-folder-page" />
      <span className="glass-folder-page" />
      <span className="glass-folder-front" />
    </div>
  );
}
