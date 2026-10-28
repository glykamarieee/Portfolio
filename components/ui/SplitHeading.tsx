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

// Masked line/word/char reveal. SSR renders plain text (readable without JS);
// SplitText keeps an aria-label so screen readers read the full string.
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  by = "words",
  trigger = "scroll",
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let tween: gsap.core.Tween | undefined;

        SplitText.create(el, {
          type: by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            tween = gsap.from(self[by], {
              yPercent: 110,
              duration: dur.slow,
              ease: ease.reveal,
              stagger: STAGGER[by],
              delay,
              paused: trigger === "ready" && !isReady(),
              scrollTrigger:
                trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined,
            });
            return tween;
          },
        });

        if (trigger === "ready") return onReady(() => tween?.play());
      });
    },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
