"use client";

import { useRef } from "react";
import { dur, ease, gsap, isReady, onReady, SplitText, stagger, useGSAP } from "@/lib/motion";

type SplitHeadingProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  by?: "chars" | "words" | "lines";
  /** "scroll": when it enters the viewport. "ready": when the preloader opens. */
  trigger?: "scroll" | "ready";
  delay?: number;
};

const STAGGER = { chars: stagger.chars, words: stagger.words, lines: stagger.items };

// Masked line/word/char reveal. Screen readers get a plain sr-only copy; the
// animated copy is aria-hidden (aria-label isn't allowed on every tag, e.g. <p>).
// SSR renders plain text, so it's readable without JS.
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  by = "words",
  trigger = "scroll",
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let tween: gsap.core.Tween | undefined;

      SplitText.create(el, {
        type: by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines",
        mask: "lines",
        aria: "none",
        autoSplit: true,
        onSplit(self) {
          tween = gsap.from(self[by], {
            yPercent: 110,
            duration: dur.slow,
            ease: ease.reveal,
            stagger: STAGGER[by],
            delay,
            paused: trigger === "ready" && !isReady(),
            scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined,
          });
          return tween;
        },
      });

      if (trigger === "ready") return onReady(() => tween?.play());
    });
  });

  return (
    <Tag className={className}>
      <span className="sr-only">{children}</span>
      <span ref={ref} className="block" aria-hidden="true">
        {children}
      </span>
    </Tag>
  );
}
