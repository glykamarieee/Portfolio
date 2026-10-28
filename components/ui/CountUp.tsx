"use client";

import { useRef } from "react";
import { dur, ease, gsap, mq, useGSAP } from "@/lib/motion";

const format = (n: number) => Math.round(n).toLocaleString("en-US");

// Number that counts up from 0 when it scrolls into view. Renders the final
// value on the server and under reduced motion.
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      const counter = { n: 0 };
      el.textContent = format(0);
      gsap.to(counter, {
        n: value,
        duration: dur.slow,
        ease: ease.reveal,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = format(counter.n);
        },
      });
      return () => {
        el.textContent = format(value);
      };
    });
  });

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
