"use client";

import { useState } from "react";
import { site, skillCategories } from "@/content";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { CRAFTS, type Craft } from "@/components/ui/CraftChip";
import { Magnetic } from "@/components/ui/Magnetic";
import { BRIEF_FOR, briefHref, type BriefFor } from "@/lib/brief";
import { cn } from "@/lib/cn";
import { telHref } from "@/lib/format";
import { LocalTime } from "./LocalTime";
import { TransitionLink } from "./TransitionLink";

// "Let's work together" — the closing call to action on pages that don't have
// the Contact scene (/about, /resume, /work/[slug]). Two crossed marquee tapes,
// then a camera viewfinder: the visitor toggles the crafts they need (Code /
// Cut / Capture) and what it's for, and "Roll camera" carries that brief to the
// contact form on the home page, already filled in.
export function WorkTogether() {
  const [need, setNeed] = useState<Craft[]>(["Code"]);
  const [purpose, setPurpose] = useState<BriefFor>(BRIEF_FOR[0]);

  const toggle = (craft: Craft) =>
    setNeed((prev) =>
      prev.includes(craft) ? prev.filter((c) => c !== craft) : CRAFTS.filter((c) => c === craft || prev.includes(c)),
    );

  return (
    <section className="work-together print-hide" aria-labelledby="work-together-title">
      <div className="footer-tapes" aria-hidden="true">
        <Tape text="Let's work together" className="is-back" />
        <Tape text="Code ✺ Cut ✺ Capture" />
      </div>

      <div className="vf surface-invert">
        <span className="vf-corners" aria-hidden="true" />

        <div className="vf-hud" aria-hidden="true">
          <span className="vf-rec">Rec</span>
          <span>
            {site.location} · <LocalTime timeZone={site.timeZone} />
          </span>
        </div>

        <div className="vf-body">
          <div className="vf-copy">
            <p className="meta">(Next) — Let&apos;s work together</p>
            <h2 id="work-together-title" className="font-display text-display">
              Have an idea? Let&apos;s put it <span className="vf-frame">in frame.</span>
            </h2>

            <fieldset className="vf-for">
              <legend className="meta">It&apos;s for</legend>
              <div className="flex flex-wrap gap-2">
                {BRIEF_FOR.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={cn("vf-chip", p === purpose && "is-on")}
                    aria-pressed={p === purpose}
                    onClick={() => setPurpose(p)}
                    data-cursor="link"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <TransitionLink href={briefHref(need, purpose)} className="vf-roll" data-magnetic-inner>
                  <span className="vf-roll-dot" aria-hidden="true" />
                  Roll camera →
                </TransitionLink>
              </Magnetic>
              <CopyEmail email={site.email} className="vf-link" />
              <a href={telHref(site.phone)} className="vf-link" data-cursor="link">
                {site.phone}
              </a>
            </div>
          </div>

          <fieldset className="vf-crafts">
            <legend className="sr-only">What do you need?</legend>
            <p className="meta" aria-hidden="true">
              I need — tap to pick
            </p>
            {CRAFTS.map((craft, i) => (
              <button
                key={craft}
                type="button"
                className={cn("vf-craft", need.includes(craft) && "is-on")}
                aria-pressed={need.includes(craft)}
                onClick={() => toggle(craft)}
                data-cursor="link"
              >
                <span className="vf-craft-box" aria-hidden="true" />
                <span className="vf-craft-name">{craft}</span>
                <span className="vf-craft-blurb">
                  {String(i + 1).padStart(2, "0")} · {skillCategories[i]?.name}
                </span>
              </button>
            ))}
          </fieldset>
        </div>

        <div className="vf-hud" aria-hidden="true">
          <span>ISO 400 · 24 fps · 1/50</span>
          <span>
            Take 01 · {need.length ? need.join(" + ") : "Pick a craft"} · {purpose}
          </span>
        </div>
      </div>
    </section>
  );
}

// One tape of the marquee: the phrase repeated, doubled so the loop is seamless
function Tape({ text, className }: { text: string; className?: string }) {
  const run = Array.from({ length: 6 }, () => `${text} ✺ `).join("");
  return (
    <div className={`footer-tape ${className ?? ""}`}>
      <div className="footer-tape-track">
        <span>{run}</span>
        <span>{run}</span>
      </div>
    </div>
  );
}
