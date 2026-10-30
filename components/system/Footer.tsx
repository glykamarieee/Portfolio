import type { ReactNode } from "react";
import { site } from "@/content";
import { RollText } from "@/components/ui/RollText";
import { BackToTop } from "./BackToTop";
import { CurrentYear, FooterWordmark } from "./FooterWordmark";
import { LocalTime } from "./LocalTime";
import { TransitionLink } from "./TransitionLink";

// Site footer, the same on every page: a sign-off card (line, status,
// link columns, live Cebu time), the name set edge to edge, then the fine
// print. The call to action lives above it — the Contact scene on the home
// page, <WorkTogether /> everywhere else — so the footer never repeats it.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-brand">
          {/* The name is set huge just below, so the card leads with the line */}
          <p className="font-display text-h2 max-w-[16ch]">{site.positioning}</p>
          <p className="meta flex items-center gap-2">
            {site.available && <span className="status-dot" aria-hidden="true" />}
            {site.available ? "Open to projects" : "Currently booked"} · {site.role}
          </p>
        </div>

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
