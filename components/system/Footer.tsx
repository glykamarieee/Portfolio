import { site } from "@/content";
import { BackToTop } from "./BackToTop";
import { LocalTime } from "./LocalTime";

const MARQUEE = "Let's build something that moves — ";

// Site footer: endless marquee, local time, socials, back to top.
export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="marquee py-12" aria-hidden="true">
        <div className="marquee-track font-display text-display font-semibold">
          {/* Two identical halves so translating -50% loops seamlessly */}
          {[0, 1].map((half) => (
            <span key={half} className="outline-type pr-[0.5em]">
              {MARQUEE.repeat(3)}
            </span>
          ))}
        </div>
      </div>
      <div className="container-grid gap-y-6 py-10">
        <p className="meta col-span-12 md:col-span-4">
          © {site.name} · {site.location} <LocalTime timeZone={site.timeZone} />
        </p>
        <ul className="col-span-12 flex flex-wrap gap-6 md:col-span-5">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a href={social.href} target="_blank" rel="noreferrer" className="meta link-underline text-fg" data-cursor="link">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="col-span-12 md:col-span-3 md:text-right">
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
