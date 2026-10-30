"use client";

import { useRef, useSyncExternalStore, type CSSProperties } from "react";
import { dur, ease, gsap, mq, stagger, useGSAP } from "@/lib/motion";

// The name set edge to edge at the very bottom; its letters rise into place
// when the footer scrolls in. Sized in CSS from the character count.
export function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.from("[data-letter]", {
          yPercent: 105,
          duration: dur.slow,
          ease: ease.reveal,
          stagger: stagger.chars * 1.5,
          scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className="footer-wordmark" style={{ "--chars": text.length } as CSSProperties} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span key={i} data-letter className="footer-letter" aria-hidden="true">
          {char === " " ? " " : char}
        </span>
      ))}
    </p>
  );
}

const never = () => () => {};

// The current year (client-side, so the page can stay static)
export function CurrentYear() {
  const year = useSyncExternalStore(
    never,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year}</>;
}
