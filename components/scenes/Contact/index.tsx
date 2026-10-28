import { site } from "@/content";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Magnetic } from "@/components/ui/Magnetic";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { sceneIndex } from "../registry";

const HEADLINE = "Let's talk";

// Scene 9 — giant magnetic "Let's talk". Hovering a letter turns the lens
// into a screen-filling inversion; then email, socials and availability.
export function Contact() {
  return (
    <section id="contact" data-scene="Contact" className="container-grid min-h-svh content-center gap-y-12 py-32">
      <SceneHeader index={sceneIndex("Contact")} title="Contact" className="col-span-12" />

      <h2 className="font-display text-hero col-span-12 font-semibold" aria-label={HEADLINE}>
        {Array.from(HEADLINE).map((char, i) =>
          char === " " ? (
            <span key={i}> </span>
          ) : (
            <Magnetic key={i} strength={0.5} cursor="invert">
              <span aria-hidden="true">{char}</span>
            </Magnetic>
          ),
        )}
      </h2>

      <div className="col-span-12 flex flex-wrap items-center gap-x-10 gap-y-6">
        <Magnetic>
          <CopyEmail email={site.email} />
        </Magnetic>
        <ul className="flex flex-wrap gap-6">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="meta link-underline text-fg"
                data-cursor="link"
              >
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="meta flex items-center gap-3 md:ml-auto">
          {site.available && <span className="status-dot" aria-hidden="true" />}
          {site.available ? "Open to new projects" : "Currently booked"}
        </p>
      </div>
    </section>
  );
}
