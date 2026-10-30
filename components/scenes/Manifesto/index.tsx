"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { about, site } from "@/content";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, interaction, mq, useGSAP } from "@/lib/motion";
import { parseEmphasis } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const WORD_STEP = 0.1; // timeline time between words lighting up

// Each *key phrase* gets the next manifestoMedia image as its chip.
let chips = 0;
const segments = parseEmphasis(about.manifesto).map((segment) => ({
  ...segment,
  media: segment.em ? about.manifestoMedia[chips++] : undefined,
}));

const CRAFTS = ["Code", "Cut", "Capture"];
const tilt = (segment: number) => (segment % 4 === 1 ? -7 : 7); // chips alternate their lean

// Scene 1 — pinned statement, centered. Words light up one by one as you
// scroll; each key phrase gets a highlighter swipe and is led by a tilted
// photo chip that pops in. Ends on a signature line. Renders fully lit (and
// highlighted) without JS or under reduced motion.
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", el);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=160%", pin: true, scrub: true },
      });
      tl.fromTo(
        words,
        { opacity: interaction.dimLargeText },
        { opacity: 1, stagger: WORD_STEP, ease: ease.scrub, duration: WORD_STEP * 2 },
      );

      // Highlight + chip start as the phrase's first word lights
      el.querySelectorAll<HTMLElement>("[data-key]").forEach((key) => {
        const own = key.querySelectorAll("[data-word]");
        const at = words.indexOf(own[0] as HTMLElement) * WORD_STEP;
        tl.fromTo(
          key,
          { backgroundSize: "0% 100%" },
          { backgroundSize: "100% 100%", ease: ease.scrubSoft, duration: own.length * WORD_STEP + 0.2 },
          at,
        );
        const chip = key.previousElementSibling;
        if (chip?.hasAttribute("data-chip")) {
          tl.fromTo(
            chip,
            { scale: 0, rotation: 0 },
            { scale: 1, rotation: () => Number((chip as HTMLElement).dataset.tilt), ease: ease.ui, duration: 0.3 },
            at,
          );
        }
      });
      tl.from("[data-sign]", { autoAlpha: 0, y: 24, ease: ease.ui, duration: 0.4 });
    });
  });

  return (
    <section
      ref={ref}
      data-scene="Manifesto"
      className="manifesto container-grid relative isolate min-h-svh content-center gap-y-12 py-32"
    >
      <Decor set="manifesto" />
      <SceneHeader index={sceneIndex("Manifesto")} title="Manifesto" className="col-span-12" />
      <p className="manifesto-text font-display text-display col-span-12">
        {segments.map((segment, s) => {
          const words = segment.text.split(/(\s+)/).map((word, w) =>
            word.trim() ? (
              <span key={w} data-word>
                {word}
              </span>
            ) : (
              word
            ),
          );
          return (
            <Fragment key={s}>
              {segment.media && (
                <span
                  data-chip
                  data-tilt={tilt(s)}
                  className="manifesto-chip"
                  style={{ "--tilt": `${tilt(s)}deg` } as CSSProperties}
                  aria-hidden="true"
                >
                  <MediaImage media={segment.media} sizes="120px" />
                </span>
              )}
              {segment.em ? (
                <span data-key className="manifesto-key">
                  {words}
                </span>
              ) : (
                words
              )}
            </Fragment>
          );
        })}
      </p>
      <div data-sign className="manifesto-sign col-span-12">
        <span className="manifesto-sign-line" aria-hidden="true" />
        <p className="meta">
          {site.name} · {site.location}
        </p>
        <ul className="flex gap-2" aria-label="Crafts">
          {CRAFTS.map((craft) => (
            <li key={craft} className="manifesto-craft">
              {craft}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
