import { site } from "@/content";
import { RollText } from "@/components/ui/RollText";
import { LocalTime } from "./LocalTime";
import { MobileMenu } from "./MobileMenu";
import { ScrollProgress } from "./ScrollProgress";
import { ThemeToggle } from "./ThemeToggle";
import { TransitionLink } from "./TransitionLink";

// Fixed top bar. Anchored during page transitions (view-transition-name)
// and inverted over content with mix-blend-mode.
export function Nav() {
  return (
    <>
      <header className="site-nav container-grid items-center py-6">
        <TransitionLink href="/" className="meta col-span-6 text-fg md:col-span-3" data-cursor="link">
          <RollText text={site.name} />
        </TransitionLink>

        <p className="meta col-span-4 hidden items-center gap-3 md:flex">
          {site.available && <span className="status-dot" aria-hidden="true" />}
          <span>{site.available ? "Available" : "Booked"}</span>
          <span aria-hidden="true">·</span>
          <span>
            {site.location} <LocalTime timeZone={site.timeZone} />
          </span>
        </p>

        <nav aria-label="Primary" className="col-span-6 flex items-center justify-end gap-4 md:col-span-5 md:gap-6">
          <ul className="hidden justify-end gap-6 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="meta text-fg" data-cursor="link">
                  <RollText text={item.label} />
                </TransitionLink>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <MobileMenu />
        </nav>
      </header>
      <ScrollProgress />
    </>
  );
}
