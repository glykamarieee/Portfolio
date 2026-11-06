"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { about, education, experience, site } from "@/content";
import { Decor } from "@/components/ui/Decor";
import { MediaImage } from "@/components/ui/MediaImage";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { cn } from "@/lib/cn";
import { formatMonth, pad, yearOf } from "@/lib/format";
import { gsap, mq, useGSAP } from "@/lib/motion";
import { sceneIndex } from "../registry";

type Lane = "work" | "school";

type Entry = {
  lane: Lane;
  sortKey: string;
  year: string;
  dates: string;
  now: boolean;
  title: string;
  org: string;
  place: string;
  points: string[];
};

// Oldest first: the passport fills up in the order it happened
const entries: Entry[] = [
  ...experience.map((e) => ({
    lane: "work" as const,
    sortKey: e.start,
    year: yearOf(e.start),
    dates: `${formatMonth(e.start)} — ${formatMonth(e.end)}`,
    now: e.end === "present",
    title: e.role,
    org: e.organization,
    place: [e.organization, e.location].filter(Boolean).join(" · "),
    points: e.achievements,
  })),
  ...education.map((e) => ({
    lane: "school" as const,
    sortKey: String(e.start),
    year: String(e.start),
    dates: `${e.start} — ${e.end === "present" ? "Present" : e.end}`,
    now: e.end === "present",
    title: e.program,
    org: e.school,
    place: e.school,
    points: [...(e.honors ?? []), ...(e.highlights ?? [])],
  })),
].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

// Holder page details, all from content
const nameParts = site.name.split(" ");
const surname = nameParts.at(-1) ?? site.name;
const given = nameParts.slice(0, -1).join(" ");
const issued = entries[0]?.year ?? "";

// Machine-readable zone: two 44-character lines, "<" as the filler
const mrz = (text: string) =>
  text
    .toUpperCase()
    .replace(/[^A-Z0-9<]+/g, "<")
    .padEnd(44, "<")
    .slice(0, 44);
const mrzLines = [
  mrz(`P<CEB${surname}<<${given}`),
  mrz(`${nameParts.map((n) => n[0]).join("")}${issued}<<CODE<CUT<CAPTURE<<${pad(entries.length)}`),
];

// Each stamp lands at its own angle
const TILTS = [-9, 7, -4, 11, -12, 5, -6, 9];

const panelId = (i: number) => `journey-entry-${i}`;
const tabId = (i: number) => `journey-stamp-${i}`;

// Scene 5 — experience + education as a passport. The left page is the holder
// page (photo, name, a machine-readable strip) plus the open entry; the right
// page collects a stamp per milestone — round ink stamps for school,
// rectangular entry stamps for work. The stamps are tabs: pick one (hover,
// click or arrow keys) to read it. On enter the cover swings open (desktop)
// and the stamps thunk down one by one.
export function Journey() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(entries.length - 1);

  useGSAP(() => {
    const el = section.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add({ motion: mq.motion, desktop: mq.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions!;
      if (!motion) return;
      el.dataset.motion = "on";
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-passport]")[0], start: "top 70%", once: true } });
      if (desktop) {
        tl.fromTo(
          q("[data-cover]"),
          { rotationY: 0, autoAlpha: 1 },
          { rotationY: -180, duration: 1.1, ease: "power3.inOut" },
        ).set(q("[data-cover]"), { autoAlpha: 0 });
      }
      tl.from(
        q("[data-pstamp] > .pstamp-ink"),
        {
          scale: 1.9,
          autoAlpha: 0,
          rotation: (i) => (TILTS[i % TILTS.length] ?? 0) * 2,
          duration: 0.45,
          ease: "back.out(2.4)",
          stagger: 0.22,
        },
        desktop ? "-=0.3" : 0,
      );
      return () => delete el.dataset.motion;
    });
  });

  // Arrow keys move between stamps (tabs pattern)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + entries.length) % entries.length;
    setActive(next);
    section.current?.querySelector<HTMLElement>(`#${tabId(next)}`)?.focus();
  };

  return (
    <section
      ref={section}
      id="journey"
      data-scene="Journey"
      className="journey-scene container-grid relative isolate gap-y-12 overflow-x-clip py-32"
    >
      <Decor set="journey" />
      <SceneHeader index={sceneIndex("Journey")} title="Journey" className="col-span-12" />
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display">
            Every stop, <span className="passport-hl">stamped.</span>
          </h2>
          <p className="text-lead text-fg-muted">
            Where I&apos;ve worked and where I&apos;ve studied — collected like stamps in a passport.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Legend">
          <li className="passport-key is-school">School</li>
          <li className="passport-key is-work">Work</li>
        </ul>
      </div>

      <div data-passport className="passport col-span-12">
        {/* Left: the holder page and the open entry */}
        <div className="passport-page is-holder">
          <div className="passport-head">
            <span>Passport · Journey</span>
            <span>Nº GMA-{issued}</span>
          </div>

          <div className="passport-holder">
            <div className="passport-photo">
              <MediaImage media={about.portrait} sizes="120px" quality={90} />
            </div>
            <dl className="passport-fields">
              <div>
                <dt>Surname</dt>
                <dd>{surname}</dd>
              </div>
              <div>
                <dt>Given names</dt>
                <dd>{given}</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{site.location}</dd>
              </div>
              <div>
                <dt>Issued</dt>
                <dd>{issued}</dd>
              </div>
              <div>
                <dt>Expires</dt>
                <dd>Never — still learning</dd>
              </div>
            </dl>
          </div>

          {entries.map((entry, i) => (
            <article
              key={i}
              id={panelId(i)}
              role="tabpanel"
              aria-labelledby={tabId(i)}
              hidden={i !== active}
              className="passport-entry"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="meta">
                  Entry {pad(i + 1)} / {pad(entries.length)}
                </span>
                <span className={cn("passport-key is-small", `is-${entry.lane}`)}>
                  {entry.lane === "work" ? "Work" : "School"}
                </span>
                {entry.now && <span className="passport-now">Now</span>}
              </div>
              <h3 className="passport-entry-title font-display">{entry.title}</h3>
              <p className="text-fg-muted">
                {entry.place} · {entry.dates}
              </p>
              {entry.points.length > 0 && (
                <ul className="passport-points">
                  {entry.points.map((point, p) => (
                    <li key={p}>{point}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          <p className="passport-mrz" aria-hidden="true">
            {mrzLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        {/* Right: the stamps */}
        <div className="passport-page is-stamps">
          <div className="passport-head">
            <span>Entries · Visas</span>
            <span>02</span>
          </div>

          <div role="tablist" aria-label="Journey entries" className="passport-stamps" onKeyDown={onKeyDown}>
            {entries.map((entry, i) => (
              <button
                key={i}
                id={tabId(i)}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={panelId(i)}
                tabIndex={i === active ? 0 : -1}
                data-pstamp
                data-cursor="link"
                className={cn("pstamp", `is-${entry.lane}`, i === active && "is-active")}
                style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
                onClick={() => setActive(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              >
                {entry.lane === "school" ? <SchoolStamp entry={entry} /> : <WorkStamp entry={entry} />}
              </button>
            ))}
          </div>

          <p className="passport-hint meta">Pick a stamp to read the entry</p>

          <div data-cover className="passport-cover" aria-hidden="true">
            <span className="passport-cover-emblem">✺</span>
            <span className="passport-cover-title font-display">Passport</span>
            <span className="meta">Code · Cut · Capture</span>
          </div>
        </div>
      </div>

      {/* Rough ink edges for the stamps */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="pstamp-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
      </svg>
    </section>
  );
}

// Round school stamp: the school's name around the rim, the year in the middle
function SchoolStamp({ entry }: { entry: Entry }) {
  return (
    <span className="pstamp-ink pstamp-round">
      <svg viewBox="0 0 160 160" className="pstamp-ring" aria-hidden="true">
        <circle cx="80" cy="80" r="76" />
        <circle cx="80" cy="80" r="56" />
        <defs>
          <path id={`ring-${entry.sortKey}`} d="M80 80m-66 0a66 66 0 1 1 132 0a66 66 0 1 1 -132 0" />
        </defs>
        <text>
          <textPath href={`#ring-${entry.sortKey}`} textLength="405">
            {`School ✺ ${entry.org} ✺ `}
          </textPath>
        </text>
      </svg>
      <span className="pstamp-round-body">
        <span className="pstamp-year font-display">{entry.year}</span>
        <span className="pstamp-small">{entry.title}</span>
      </span>
    </span>
  );
}

// Rectangular entry stamp for work
function WorkStamp({ entry }: { entry: Entry }) {
  return (
    <span className="pstamp-ink pstamp-rect">
      <span className="pstamp-small">Entry ✈ Work</span>
      <span className="pstamp-year font-display">
        {entry.year}
        {entry.now ? " →" : ""}
      </span>
      <span className="pstamp-title">{entry.title}</span>
      <span className="pstamp-small">{entry.org}</span>
    </span>
  );
}
