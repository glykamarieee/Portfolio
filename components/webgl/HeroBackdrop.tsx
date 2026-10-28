"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/hooks";
import { mq, onReady } from "@/lib/motion";

const HeroField = dynamic(() => import("./HeroField"), { ssr: false });

// CSS light blooms always render: they are the whole backdrop on mobile and
// under reduced motion (DESIGN.md §9). On desktop the WebGL field (three.js,
// ~240KB) loads only after the intro has started, so it never competes with
// first paint, then fades in on top.
export function HeroBackdrop() {
  const cinematic = useMediaQuery(mq.cinematic);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!cinematic) return;
    let timer = 0;
    const off = onReady(() => {
      timer = window.setTimeout(() => setLoad(true), 400);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, [cinematic]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="hero-blooms absolute inset-0" />
      {cinematic && load && <HeroField />}
    </div>
  );
}
