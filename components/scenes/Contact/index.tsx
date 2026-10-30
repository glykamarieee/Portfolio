import { Fragment } from "react";
import { site } from "@/content";
import { LocalTime } from "@/components/system/LocalTime";
import { ContactForm } from "@/components/ui/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Decor } from "@/components/ui/Decor";
import { Magnetic } from "@/components/ui/Magnetic";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { telHref } from "@/lib/format";
import { sceneIndex } from "../registry";

const HEADLINE = "Let's get in touch";

// Scene 9 — giant magnetic "Let's get in touch" (hovering a letter turns the
// lens into a screen-filling inversion), contact cards and socials, and the
// form in its own card.
export function Contact() {
  return (
    <section
      id="contact"
      data-scene="Contact"
      className="container-grid relative isolate min-h-svh content-center gap-y-12 py-32"
    >
      <Decor set="contact" />
      <SceneHeader index={sceneIndex("Contact")} title="Contact" className="col-span-12" />

      <div className="col-span-12 flex flex-col gap-10 lg:col-span-6">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-hero" aria-label={HEADLINE}>
            {HEADLINE.split(" ").map((word, w) => (
              // Letters are separate magnets; each word stays on one line. The space
              // sits between words (a trailing space inside an inline-block collapses).
              <Fragment key={w}>
                {w > 0 && " "}
                <span className="inline-block whitespace-nowrap" aria-hidden="true">
                  {Array.from(word).map((char, i) => (
                    <Magnetic key={i} strength={0.5} cursor="invert">
                      {char}
                    </Magnetic>
                  ))}
                </span>
              </Fragment>
            ))}
          </h2>
          <p className="text-lead max-w-[30ch] text-fg-muted">
            A website, an edit or a shoot — tell me about it. I usually reply within a day.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="contact-card sm:col-span-2">
            <span className="meta">Email · click to copy</span>
            <Magnetic className="self-start">
              <CopyEmail email={site.email} className="contact-email" />
            </Magnetic>
            <span className="meta mt-2">Phone</span>
            <a href={telHref(site.phone)} className="text-lead link-underline self-start" data-cursor="link">
              {site.phone}
            </a>
          </div>
          <div className="contact-card">
            <span className="meta">Based in</span>
            <span className="text-lead">{site.location}</span>
            <span className="text-fg-muted">
              <LocalTime timeZone={site.timeZone} /> local time
            </span>
          </div>
          <div className="contact-card">
            <span className="meta">Availability</span>
            <span className="text-lead flex items-center gap-3">
              {site.available && <span className="status-dot" aria-hidden="true" />}
              {site.available ? "Open to projects" : "Currently booked"}
            </span>
            <span className="text-fg-muted">Freelance &amp; collaborations</span>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a href={social.href} target="_blank" rel="noreferrer" className="social-pill" data-cursor="link">
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="contact-form-card col-span-12 self-center lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
        <div className="flex flex-col gap-2">
          <p className="meta">Send a message</p>
          <p className="font-display text-h2">What are we making?</p>
        </div>
        <ContactForm email={site.email} />
      </div>
    </section>
  );
}
