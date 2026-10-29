import { site } from "@/content";
import { ContactForm } from "@/components/ui/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Decor } from "@/components/ui/Decor";
import { Magnetic } from "@/components/ui/Magnetic";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { sceneIndex } from "../registry";

const HEADLINE = "Let's get in touch";

// Scene 9 — giant magnetic "Let's get in touch" (hovering a letter turns the
// lens into a screen-filling inversion) beside a contact form.
export function Contact() {
  return (
    <section
      id="contact"
      data-scene="Contact"
      className="container-grid relative isolate min-h-svh content-center gap-y-16 py-32"
    >
      <Decor set="contact" />
      <SceneHeader index={sceneIndex("Contact")} title="Contact" className="col-span-12" />

      <div className="col-span-12 flex flex-col gap-10 lg:col-span-6">
        <h2 className="font-display text-hero" aria-label={HEADLINE}>
          {HEADLINE.split(" ").map((word, w) => (
            // Letters are separate magnets; each word stays on one line
            <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
              {Array.from(word).map((char, i) => (
                <Magnetic key={i} strength={0.5} cursor="invert">
                  {char}
                </Magnetic>
              ))}
              {w < HEADLINE.split(" ").length - 1 && " "}
            </span>
          ))}
        </h2>

        <div className="flex flex-col gap-6">
          <Magnetic className="self-start">
            <CopyEmail email={site.email} />
          </Magnetic>
          <ul className="flex flex-wrap gap-6">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="meta link-underline text-fg" data-cursor="link">
                  {social.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="meta flex items-center gap-3">
            {site.available && <span className="status-dot" aria-hidden="true" />}
            {site.available ? "Open to new projects" : "Currently booked"}
          </p>
        </div>
      </div>

      <div className="col-span-12 self-end lg:col-span-5 lg:col-start-8">
        <ContactForm email={site.email} />
      </div>
    </section>
  );
}
