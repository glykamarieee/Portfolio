import type { ReactNode } from "react";
import { site } from "@/content";
import { RollText } from "@/components/ui/RollText";
import { cn } from "@/lib/cn";
import { BackToTop } from "./BackToTop";
import { Clapper } from "./Clapper";
import { CurrentYear, FooterWordmark } from "./FooterWordmark";
import { LocalTime } from "./LocalTime";
import { TransitionLink } from "./TransitionLink";

// Site footer, the same on every page: an end slate — a film clapperboard
// whose striped arm snaps shut as it scrolls in, with chalk-label cells
// (production line, status, scene/roll/take, location + live time, links) —
// then the name set edge to edge and the fine print. The call to action lives
// above it — the Contact scene on the home page, <WorkTogether /> everywhere
// else — so the footer never repeats it.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="slate">
        <Clapper />

        <div className="slate-grid">
          <SlateCell label="Production" className="slate-prod">
            <p className="slate-title">{site.positioning}</p>
          </SlateCell>
          <SlateCell label="Status" className="slate-status">
            <p className="slate-value flex items-center gap-3">
              {site.available && <span className="status-dot" aria-hidden="true" />}
              {site.available ? "Open to projects" : "Currently booked"}
            </p>
            <p className="text-fg-muted">{site.role}</p>
          </SlateCell>

          <SlateCell label="Scene" className="slate-small">
            <p className="slate-value">The end</p>
          </SlateCell>
          <SlateCell label="Roll" className="slate-small">
            <p className="slate-value tabular-nums">
              <CurrentYear />
            </p>
          </SlateCell>
          <SlateCell label="Take" className="slate-small">
            <p className="slate-value">01</p>
          </SlateCell>
          <SlateCell label="Location" className="slate-location">
            <p className="slate-value">{site.location}</p>
            <p className="flex items-center gap-2 text-fg-muted tabular-nums">
              <span className="slate-live" aria-hidden="true">
                Live
              </span>
              <LocalTime timeZone={site.timeZone} /> local time
            </p>
          </SlateCell>

          <SlateCell label="Navigate" className="slate-links">
            <ul className="slate-list">
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
            </ul>
          </SlateCell>
          <SlateCell label="Elsewhere" className="slate-links">
            <ul className="slate-list">
              {site.socials.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="footer-link" data-cursor="link">
                    <RollText text={`${social.label} ↗`} />
                  </a>
                </li>
              ))}
            </ul>
          </SlateCell>
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

function SlateCell({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("slate-cell", className)}>
      <p className="slate-label">{label}</p>
      {children}
    </div>
  );
}
