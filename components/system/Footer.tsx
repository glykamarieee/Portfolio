import type { ReactNode } from "react";
import { site } from "@/content";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { telHref } from "@/lib/format";
import { BackToTop } from "./BackToTop";
import { CurrentYear, FooterWordmark } from "./FooterWordmark";
import { LocalTime } from "./LocalTime";
import { TransitionLink } from "./TransitionLink";

// Site footer: a closing card (CTA, email, link columns, live Cebu time),
// then the name set edge to edge, then the fine print and back-to-top.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-cta">
          <p className="meta">(Next) — Let&apos;s work together</p>
          <h2 className="font-display text-display">Have an idea? Let&apos;s make it move.</h2>
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
