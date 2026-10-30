import type { ReactNode } from "react";
import { site, skillCategories } from "@/content";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { telHref } from "@/lib/format";
import { BackToTop } from "./BackToTop";
import { CurrentYear, FooterWordmark } from "./FooterWordmark";
import { LocalTime } from "./LocalTime";
import { TransitionLink } from "./TransitionLink";

// Site footer: two crossed marquee tapes ("Let's work together"), a closing
// card (CTA, the three crafts, email, a spinning "available" badge, link
// columns, live Cebu time), the name set edge to edge, then the fine print.
export function Footer() {
  return (
    <footer className="site-footer">
      {/* Two crossed tapes running in opposite directions */}
      <div className="footer-tapes" aria-hidden="true">
        <Tape text="Let's work together" className="is-back" />
        <Tape text="Code ✺ Cut ✺ Capture" />
      </div>

      <div className="footer-card">
        <div className="footer-cta">
          <p className="meta">(Next) — Let&apos;s work together</p>
          <h2 className="font-display text-display">
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

        <div className="footer-cols">
          <FooterCol title="Navigate">
            <li>
              <TransitionLink href="/" className="footer-link" data-cursor="link">
                <RollText text="Home" />
              </TransitionLink>
            </li>
            {site.nav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="footer-link" data-cursor="link">
                  <RollText text={item.label} />
                </TransitionLink>
              </li>
            ))}
          </FooterCol>
          <FooterCol title="Elsewhere">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="footer-link" data-cursor="link">
                  <RollText text={`${social.label} ↗`} />
                </a>
              </li>
            ))}
          </FooterCol>
          <FooterCol title="Based in">
            <li>{site.location}</li>
            <li className="text-fg-muted">
              <LocalTime timeZone={site.timeZone} /> local time
            </li>
            <li className="flex items-center gap-2 text-fg-muted">
              {site.available && <span className="status-dot" aria-hidden="true" />}
              {site.available ? "Open to projects" : "Currently booked"}
            </li>
          </FooterCol>
        </div>
      </div>

      <FooterWordmark text={site.name} />

      <div className="footer-bar meta">
        <p>
          © <CurrentYear /> {site.name}
        </p>
        <p className="max-md:hidden">Designed, coded &amp; cut in {site.location.split(",")[0]}</p>
        <BackToTop />
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="meta">{title}</p>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
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
