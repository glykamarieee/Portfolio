"use client";

import { useRef } from "react";
import { dur, gsap, mq, useGSAP } from "@/lib/motion";

// The striped arm on top of the footer slate. It snaps shut when the footer
// scrolls in (and opens again if you scroll back up), and claps once more on
// hover. Static and closed under reduced motion.
export function Clapper() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const arm = ref.current!.querySelector<HTMLElement>("[data-arm]")!;
    // Open angle from the width, so the far end always lifts about 80px
    const open = () => (-Math.atan2(80, arm.offsetWidth) * 180) / Math.PI;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      gsap.fromTo(
        arm,
        { rotation: open },
        {
          rotation: 0,
          duration: dur.base,
          ease: "back.out(3)",
          scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none reverse" },
        },
      );

      const clap = contextSafe!(() => {
        if (gsap.isTweening(arm)) return;
        gsap
          .timeline()
          .to(arm, { rotation: open(), duration: dur.fast * 0.6, ease: "power2.out" })
          .to(arm, { rotation: 0, duration: dur.fast, ease: "back.out(3)" });
      });
      ref.current!.addEventListener("pointerenter", clap);
      return () => ref.current?.removeEventListener("pointerenter", clap);
    });
  });

  return (
    <div ref={ref} className="slate-clapper" aria-hidden="true">
      <div data-arm className="slate-arm" />
      <div className="slate-bar" />
    </div>
  );
}
