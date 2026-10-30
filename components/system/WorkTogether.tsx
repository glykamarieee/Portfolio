import { site, skillCategories } from "@/content";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Magnetic } from "@/components/ui/Magnetic";
import { telHref } from "@/lib/format";
import { TransitionLink } from "./TransitionLink";

// "Let's work together" — the closing call to action on pages that don't have
// the Contact scene (/about, /resume, /work/[slug]). The home page ends on the
// Contact scene instead, so this never repeats it. Two crossed marquee tapes,
// then a card: headline, the three crafts, email/phone and a spinning
// "available" badge, all pointing to the contact form.
export function WorkTogether() {
  return (
    <section className="work-together print-hide" aria-labelledby="work-together-title">
      <div className="footer-tapes" aria-hidden="true">
        <Tape text="Let's work together" className="is-back" />
        <Tape text="Code ✺ Cut ✺ Capture" />
      </div>

      <div className="footer-card work-together-card surface-invert">
        <div className="footer-cta">
          <p className="meta">(Next) — Let&apos;s work together</p>
          <h2 id="work-together-title" className="font-display text-display">
            Have an idea? Let&apos;s make it <span className="footer-hl">move.</span>
          </h2>
          <ol className="footer-services">
            {skillCategories.map((craft, i) => (
              <li key={craft.name}>
                <span className="meta">{String(i + 1).padStart(2, "0")}</span>
                <span className="footer-service-name">{craft.name}</span>
                <span className="footer-service-blurb">{craft.blurb}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <TransitionLink href="/#contact" className="btn-pill" data-magnetic-inner>
                Start a project →
              </TransitionLink>
            </Magnetic>
            <Magnetic>
              <CopyEmail email={site.email} className="footer-email" />
            </Magnetic>
            <a href={telHref(site.phone)} className="footer-email" data-cursor="link">
              {site.phone}
            </a>
          </div>
        </div>

        <TransitionLink href="/#contact" className="footer-badge" data-cursor="link" aria-label="Start a project">
          <svg viewBox="0 0 100 100" className="footer-badge-ring" aria-hidden="true">
            <defs>
              <path id="footer-badge-path" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
            </defs>
            <text>
              <textPath href="#footer-badge-path" textLength="236">
                {site.available ? "Available for projects" : "Currently booked"} ✺ {site.location} ✺
              </textPath>
            </text>
          </svg>
          <span className="footer-badge-arrow" aria-hidden="true">
            ↗
          </span>
        </TransitionLink>
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
