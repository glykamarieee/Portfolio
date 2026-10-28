"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/hooks";
import { mq } from "@/lib/motion";

const HeroField = dynamic(() => import("./HeroField"), { ssr: false });

// CSS light blooms always render (fast first paint, reduced-motion fallback);
// the WebGL field loads after hydration and fades in on top.
export function HeroBackdrop() {
  const motionOk = useMediaQuery(mq.motion);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="hero-blooms absolute inset-0" />
      {motionOk && <HeroField />}
    </div>
  );
}
