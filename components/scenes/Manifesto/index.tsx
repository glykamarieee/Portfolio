"use client";

import { Fragment, useRef } from "react";
import { about, site } from "@/content";
import { CRAFTS, CraftChip } from "@/components/ui/CraftChip";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, interaction, mq, useGSAP } from "@/lib/motion";
import { parseEmphasis } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const WORD_STEP = 0.1; // timeline time between words lighting up

// Each *key phrase* is led by the next craft's chip, in order: code, cut, capture.
let keys = 0;
const segments = parseEmphasis(about.manifesto).map((segment) => ({
  ...segment,
  craft: segment.em ? CRAFTS[keys++ % CRAFTS.length] : undefined,
}));

const tilt = (segment: number) => (segment % 4 === 1 ? -7 : 7); // chips alternate their lean
const GHOST = Array.from({ length: 8 }, () => null);

// Scene 1 — pinned statement, centered, over three giant outlined rows
// (Code / Cut / Capture) that slide opposite ways as you scroll. A lime quote
// mark opens it; words light up one by one; each key phrase gets a highlighter
// swipe and is led by a small animated craft chip (a code tag with a caret, a
// film strip that splits, a viewfinder with a REC dot). It signs off with the
// first name drawn as a signature. Renders finished without JS or under
// reduced motion.
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const firstName = site.name.split(" ")[0];

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      const q = gsap.utils.selector(el);
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", el);
      const total = words.length * WORD_STEP + 1;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=180%", pin: true, scrub: true },
      });

      // Backdrop rows drift opposite ways for the whole pin
      tl.fromTo(
        q("[data-ghost]"),
        { xPercent: (i) => (i % 2 ? -18 : 0) },
        { xPercent: (i) => (i % 2 ? 0 : -18), ease: ease.scrub, duration: total },
        0,
      );
      tl.from(q("[data-quote]"), { scale: 0, rotation: -40, ease: ease.ui, duration: 0.4 }, 0);
      tl.fromTo(
        words,
        { opacity: interaction.dimLargeText },
        { opacity: 1, stagger: WORD_STEP, ease: ease.scrub, duration: WORD_STEP * 2 },
        0.2,
      );

      // Highlight + chip start as the phrase's first word lights
      q("[data-key]").forEach((key) => {
        const own = key.querySelectorAll("[data-word]");
        const at = 0.2 + words.indexOf(own[0] as HTMLElement) * WORD_STEP;
        tl.fromTo(
          key,
          { backgroundSize: "0% 100%" },
          { backgroundSize: "100% 100%", ease: ease.scrubSoft, duration: own.length * WORD_STEP + 0.2 },
          at,
        );
        const chip = key.previousElementSibling as HTMLElement | null;
        if (!chip?.hasAttribute("data-chip")) return;
        tl.fromTo(
          chip,
          { scale: 0, rotation: 0 },
          { scale: 1, rotation: Number(chip.dataset.tilt), ease: ease.ui, duration: 0.3 },
          at,
        );
        // The film strip is cut: its halves part a little once it lands
        const halves = chip.querySelectorAll("[data-half]");
        if (halves.length) {
          tl.fromTo(halves, { xPercent: 0 }, { xPercent: (i) => (i ? 9 : -9), ease: ease.ui, duration: 0.3 }, at + 0.3);
        }
      });

      // Signature: the name is drawn, then filled, then the swoosh underlines it
      tl.from(q("[data-sign]"), { autoAlpha: 0, y: 24, ease: ease.ui, duration: 0.3 })
        .fromTo(
          q("[data-signature]"),
          { strokeDasharray: 420, strokeDashoffset: 420, fillOpacity: 0 },
          { strokeDashoffset: 0, ease: ease.scrubSoft, duration: 0.8 },
        )
        .to(q("[data-signature]"), { fillOpacity: 1, ease: ease.ui, duration: 0.3 })
        .fromTo(
          q("[data-swoosh]"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: ease.ui, duration: 0.4 },
          "<",
        );
    });
  });

  return (
    <section
      ref={ref}
      data-scene="Manifesto"
      className="manifesto container-grid relative isolate min-h-svh content-center gap-y-6 overflow-x-clip py-20"
    >
      <Decor set="manifesto" />

      <div className="manifesto-ghost" aria-hidden="true">
        {CRAFTS.map((craft) => (
          <p key={craft} data-ghost className="manifesto-ghost-row">
            {GHOST.map((_, i) => (
              <span key={i}>{craft} ✺ </span>
            ))}
          </p>
        ))}
      </div>

      <SceneHeader index={sceneIndex("Manifesto")} title="Manifesto" className="col-span-12" />

      <span data-quote className="manifesto-quote col-span-12" aria-hidden="true">
        &ldquo;
      </span>

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
              {segment.craft && <CraftChip craft={segment.craft} tilt={tilt(s)} />}
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
        <svg className="manifesto-signature" viewBox="0 0 280 100" role="img" aria-label={`Signed, ${firstName}`}>
          <text data-signature x="140" y="66" textAnchor="middle">
            {firstName}
          </text>
          <path data-swoosh d="M40 84 C 100 72, 190 94, 250 76" pathLength={1} className="manifesto-swoosh" />
        </svg>
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
