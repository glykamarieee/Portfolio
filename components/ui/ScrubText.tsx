"use client";

import { useRef } from "react";
import { ease, gsap, interaction, mq, useGSAP } from "@/lib/motion";

type ScrubTextProps = {
  children: string;
  className?: string;
};

// Paragraph whose words light up as it scrolls through the viewport
// (unpinned cousin of the Manifesto). Fully lit without JS / reduced motion.
export function ScrubText({ children, className }: ScrubTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      // WCAG "large text" is ≥ 24px; smaller text needs a brighter dim state
      const large = parseFloat(getComputedStyle(el).fontSize) >= 24;
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { opacity: large ? interaction.dimLargeText : interaction.dimBodyText },
        {
          opacity: 1,
          stagger: 0.1,
          ease: ease.scrub,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    });
  });

  return (
    <p ref={ref} className={className}>
      {children.split(/(\s+)/).map((word, i) =>
        word.trim() ? (
          <span key={i} data-word>
            {word}
          </span>
        ) : (
          word
        ),
      )}
    </p>
  );
}
