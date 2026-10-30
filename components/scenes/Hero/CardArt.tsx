import { certificates, education, experience, projects, skillCategories, site, type HeroCard } from "@/content";
import { initials, pad } from "@/lib/format";

// Journey stops: when each school and job began, oldest first (the last three)
const stops = [
  ...education.map((e) => ({ year: e.start, label: "School" })),
  ...experience.map((e) => ({ year: Number(e.start.slice(0, 4)), label: "Work" })),
]
  .sort((a, b) => a.year - b.year)
  .slice(-3);

// Work: every featured title on one running line, and the years they span
const featured = projects.filter((p) => p.featured);
const reel = featured.map((p) => `${p.title} ✺ `).join("");
const years = featured.map((p) => p.year);
const span = `${Math.min(...years)}–${Math.max(...years)}`;

// Cover art for the hero cards: small, quiet interface pieces built from the
// real content, in the card's own ink (currentColor) — a timeline for
// Journey, running project titles for Work, the certificate count for the Archive, and
// so on. Cards with a photo cover (`about`) draw nothing.
export function CardArt({ art }: { art: HeroCard["art"] }) {
  switch (art) {
    case "journey":
      return (
        <span className="ca-timeline">
          {stops.map((stop, i) => (
            <span key={i} className="ca-stop">
              <span className="ca-dot" />
              <span className="ca-year">{stop.year}</span>
              <span className="ca-label">{stop.label}</span>
            </span>
          ))}
          <span className="ca-stop is-now">
            <span className="ca-dot" />
            <span className="ca-year">Now</span>
          </span>
        </span>
      );

    case "work":
      // Project titles running past in three rows (solid, outlined, solid), then the count
      return (
        <span className="ca-reel">
          {[0, 1, 2].map((row) => (
            <span key={row} className={`ca-reel-row is-${row}`}>
              <span className="ca-reel-track">
                <span>{reel}</span>
                <span>{reel}</span>
              </span>
            </span>
          ))}
          <span className="ca-reel-meta">
            <span className="ca-reel-dot" />
            Live · {pad(featured.length)} projects · {span}
          </span>
        </span>
      );

    case "archive":
      return (
        <span className="ca-count">
          <span className="ca-count-num">{pad(certificates.length)}</span>
          <span className="ca-label">Credentials · verified</span>
        </span>
      );

    case "skills":
      return (
        <span className="ca-rows">
          {skillCategories.map((craft, i) => (
            <span key={craft.name} className="ca-row">
              <span className="ca-label">{pad(i + 1)}</span>
              <span className="ca-row-name">{craft.name}</span>
            </span>
          ))}
        </span>
      );

    case "hello":
      return (
        <span className="ca-chat">
          <span className="ca-bubble">Got a project in mind?</span>
          <span className="ca-bubble is-me">Let&apos;s talk →</span>
          <span className="ca-bubble is-typing">
            <i />
            <i />
            <i />
          </span>
        </span>
      );

    case "resume":
      return (
        <span className="ca-sheet">
          <span className="ca-sheet-head">
            <span className="ca-sheet-mark">{initials(site.name)}</span>
            <span className="ca-sheet-lines">
              <span className="ca-line is-head" />
              <span className="ca-line is-sub" />
            </span>
          </span>
          <span className="ca-sheet-cols">
            <span className="ca-sheet-lines">
              <span className="ca-line" />
              <span className="ca-line" />
              <span className="ca-line is-short" />
            </span>
            <span className="ca-sheet-lines">
              <span className="ca-line" />
              <span className="ca-line is-short" />
              <span className="ca-line" />
            </span>
          </span>
          <span className="ca-tag">PDF ↓</span>
        </span>
      );

    default:
      return null;
  }
}
