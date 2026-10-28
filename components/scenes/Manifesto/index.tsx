"use client";

import { Fragment, useRef } from "react";
import { about } from "@/content";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, interaction, mq, useGSAP } from "@/lib/motion";
import { parseEmphasis } from "@/lib/format";
import { sceneIndex } from "../registry";

// Each *key phrase* gets the next manifestoMedia image as its chip.
let chips = 0;
const segments = parseEmphasis(about.manifesto).map((segment) => ({
  ...segment,
  media: segment.em ? about.manifestoMedia[chips++] : undefined,
}));

// Scene 1 — pinned statement. Words light up one by one as you scroll; key
// phrases are accented and led by a small image chip. Renders fully lit
// without JS or under reduced motion.
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      const words = el.querySelectorAll("[data-word]");
      const chips = el.querySelectorAll("[data-chip]");
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=150%", pin: true, scrub: true },
        })
        .fromTo(
          words,
          {
            opacity: (_: number, word: Element) =>
              word.classList.contains("text-accent-fg") ? interaction.dimAccentText : interaction.dimLargeText,
          },
          { opacity: 1, stagger: 0.1, ease: ease.scrub },
        )
        .fromTo(chips, { scale: 0 }, { scale: 1, stagger: 0.6, ease: ease.ui }, 0);
    });
  });

  return (
    <section
      ref={ref}
      data-scene="Manifesto"
      className="container-grid min-h-svh content-center gap-y-12 py-32"
    >
      <SceneHeader index={sceneIndex("Manifesto")} title="Manifesto" className="col-span-12" />
      <p className="font-display text-display col-span-12 font-semibold xl:col-span-11">
        {segments.map((segment, s) => (
          <Fragment key={s}>
            {segment.media && (
              <span data-chip className="manifesto-chip" aria-hidden="true">
                <MediaImage media={segment.media} sizes="160px" />
              </span>
            )}
            {segment.text.split(/(\s+)/).map((word, w) =>
              word.trim() ? (
                <span key={w} data-word className={segment.em ? "text-accent-fg" : undefined}>
                  {word}
                </span>
              ) : (
                word
              ),
            )}
          </Fragment>
        ))}
      </p>
    </section>
  );
}
