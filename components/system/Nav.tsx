import { site } from "@/content";
import { RollText } from "@/components/ui/RollText";
import { initials } from "@/lib/format";
import { LocalTime } from "./LocalTime";
import { MobileMenu } from "./MobileMenu";
import { ScrollProgress } from "./ScrollProgress";
import { ThemeToggle } from "./ThemeToggle";
import { TransitionLink } from "./TransitionLink";

// Fixed top bar of frosted-glass pills: monogram + name, the links, and
// status/time/theme/CTA. Anchored during page transitions (view-transition-name).
export function Nav() {
  return (
    <>
      <header className="site-nav">
        <TransitionLink href="/" className="nav-pill nav-brand" data-cursor="link" aria-label={`${site.name} — home`}>
          <span className="nav-mark" aria-hidden="true">
            {initials(site.name)}
          </span>
          <span className="nav-name">
            <RollText text={site.name} />
          </span>
        </TransitionLink>

        <nav aria-label="Primary" className="nav-pill nav-links">
          <ul className="flex items-center">
            {site.nav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="nav-link" data-cursor="link">
                  <RollText text={item.label} />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <p className="nav-pill nav-status meta">
            {site.available && <span className="status-dot" aria-hidden="true" />}
            <span>
              {site.location} <LocalTime timeZone={site.timeZone} />
            </span>
          </p>
          <span className="nav-pill nav-icon">
            <ThemeToggle />
          </span>
          <TransitionLink href="/#contact" className="btn-pill nav-cta" data-cursor="link">
            Let&apos;s talk
          </TransitionLink>
          <span className="nav-pill nav-icon nav-menu">
            <MobileMenu />
          </span>
        </div>
      </header>
      <ScrollProgress />
    </>
  );
}
