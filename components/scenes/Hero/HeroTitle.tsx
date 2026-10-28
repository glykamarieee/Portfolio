"use client";

import { useRef } from "react";
import { dur, ease, gsap, isReady, mq, onReady, SplitText, stagger, useGSAP } from "@/lib/motion";

// The hero name: words rise in when the preloader opens, then on scroll the
// letters scatter back into depth. Words and chars animate separately so the
// intro (opacity on words) never fights the scrub (opacity on chars).
export function HeroTitle({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      let intro: gsap.core.Tween | undefined;
      let scatter: gsap.core.Tween | undefined;

      SplitText.create(el, {
        type: "words,chars",
        autoSplit: true,
        onSplit(self) {
          scatter?.scrollTrigger?.kill();
          scatter?.kill();

          intro = gsap.from(self.words, {
            yPercent: 60,
            autoAlpha: 0,
            duration: dur.slow,
            ease: ease.reveal,
            stagger: stagger.words,
            paused: !isReady(),
          });

          scatter = gsap.to(self.chars, {
            y: () => gsap.utils.random(-160, 80),
            z: () => gsap.utils.random(150, 500),
            rotation: () => gsap.utils.random(-25, 25),
            autoAlpha: 0,
            filter: "blur(8px)",
            transformPerspective: 600,
            ease: ease.scrub,
            stagger: { each: stagger.chars, from: "random" },
            scrollTrigger: {
              trigger: el.closest("section"),
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          return intro;
        },
      });

      return onReady(() => intro?.play());
    });
  });

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}
