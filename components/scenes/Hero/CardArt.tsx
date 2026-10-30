import { about, certificates, education, experience, skillCategories, site, type HeroCard } from "@/content";
import { LocalTime } from "@/components/system/LocalTime";
import { CRAFTS, CraftChip } from "@/components/ui/CraftChip";
import { initials, pad } from "@/lib/format";

// Journey stops: when each school and job began, oldest first (the last three)
const stops = [
  ...education.map((e) => ({ year: e.start, label: "School" })),
  ...experience.map((e) => ({ year: Number(e.start.slice(0, 4)), label: "Work" })),
]
  .sort((a, b) => a.year - b.year)
  .slice(-3);

// Cover art for the hero cards: small, quiet interface pieces built from the
// real content, in the card's own ink (currentColor) — a timeline for
// Journey, a wireframe for Work, the certificate count for the Archive, a
// live clock for Cebu, and so on. Cards with a photo cover (`about`) draw nothing.
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
      return (
        <span className="ca-browser">
          <span className="ca-browser-bar">
            <i />
            <i />
            <i />
          </span>
          <span className="ca-browser-body">
            <span className="ca-line is-head" />
            <span className="ca-line is-sub" />
            <span className="ca-blocks">
              <span className="is-solid" />
              <span />
              <span />
              <span />
            </span>
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

    case "learning":
      return (
        <span className="ca-learn">
          {about.currentlyLearning.map((topic) => (
            <span key={topic} className="ca-learn-row">
              <span className="ca-learn-name">{topic}</span>
              <span className="ca-bar" />
            </span>
          ))}
        </span>
      );

    case "manifesto":
      return (
        <span className="ca-crafts">
          {CRAFTS.map((craft) => (
            <span key={craft} className="ca-craft">
              <CraftChip craft={craft} />
              <span className="ca-row-name">{craft}</span>
            </span>
          ))}
        </span>
      );

    case "time":
      return (
        <span className="ca-clock">
          <span className="ca-clock-time">
            <LocalTime timeZone={site.timeZone} />
          </span>
          <span className="ca-label">GMT+8 · {site.timeZone}</span>
        </span>
      );

    case "status":
      return (
        <span className="ca-status">
          <span className="ca-status-line">
            <span className="ca-status-dot" />
            {site.available ? "Available" : "Booked"}
          </span>
          <span className="ca-tags">
            <span>Freelance</span>
            <span>Collabs</span>
            <span>Full-time</span>
          </span>
        </span>
      );

    default:
      return null;
  }
}
