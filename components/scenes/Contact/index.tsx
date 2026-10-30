"use client";

import { Fragment, useRef } from "react";
import { about, site } from "@/content";
import { LocalTime } from "@/components/system/LocalTime";
import { ContactForm } from "@/components/ui/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Decor } from "@/components/ui/Decor";
import { Magnetic } from "@/components/ui/Magnetic";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { ease, gsap, mq, useGSAP } from "@/lib/motion";
import { telHref } from "@/lib/format";
import { sceneIndex } from "../registry";

const HEADLINE = "Let's get in touch";

// "instagram.com/glykamarieee/" → "@glykamarieee"
const handle = (href: string) => `@${new URL(href).pathname.split("/").filter(Boolean).pop()}`;

// Scene 9 — giant magnetic "Let's get in touch", a ticket stub with every way
// to reach me (from Cebu → to you), socials as a numbered list, and the form
// as a postcard: write on the left, address on the right, a stamp with my
// portrait and a postmark. Everything lands once on enter; static under
// reduced motion.
export function Contact() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = section.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      const q = gsap.utils.selector(el);
      // Each piece triggers itself: on phones they stack far apart
      const enter = (sel: string) =>
        gsap.timeline({
          defaults: { ease: ease.reveal },
          scrollTrigger: { trigger: q(sel)[0], start: "top 85%", once: true },
        });

      enter("[data-ticket]").from(q("[data-ticket]"), { x: -60, rotation: -6, autoAlpha: 0, duration: 1 });
      enter("[data-social]").from(q("[data-social]"), { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.06 });
      enter("[data-postcard]")
        .from(q("[data-postcard]"), { y: 120, rotation: 9, autoAlpha: 0, duration: 1.2 })
        .from(q("[data-postage]"), { y: -60, rotation: 30, autoAlpha: 0, duration: 0.7 }, "-=0.6")
        .from(q("[data-postmark]"), { scale: 1.8, autoAlpha: 0, duration: 0.35, ease: "back.out(2)" }, "-=0.2");
    });
  });

  return (
    <section
      ref={section}
      id="contact"
      data-scene="Contact"
      className="container-grid relative isolate min-h-svh content-center gap-y-12 overflow-x-clip py-32"
    >
      <Decor set="contact" />
      <SceneHeader index={sceneIndex("Contact")} title="Contact" className="col-span-12" />

      <div className="col-span-12 flex flex-col gap-10 lg:col-span-5">
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

        {/* Ticket: the details on the main part, a barcode stub on the right */}
        <div data-ticket className="ticket">
          <div className="ticket-main">
            <div className="ticket-route">
              <div>
                <span className="meta">From</span>
                <span className="ticket-city">{site.location.split(",")[0]}</span>
              </div>
              <span className="ticket-plane" aria-hidden="true">
                ✈
              </span>
              <div className="text-right">
                <span className="meta">To</span>
                <span className="ticket-city">You</span>
              </div>
            </div>

            <dl className="ticket-rows">
              <div className="col-span-2">
                <dt className="meta">Email · click to copy</dt>
                <dd>
                  <Magnetic className="self-start">
                    <CopyEmail email={site.email} className="contact-email" />
                  </Magnetic>
                </dd>
              </div>
              <div>
                <dt className="meta">Phone</dt>
                <dd>
                  <a href={telHref(site.phone)} className="link-underline" data-cursor="link">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="meta">Local time</dt>
                <dd className="tabular-nums">
                  <LocalTime timeZone={site.timeZone} /> · {site.location}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="meta">Status</dt>
                <dd className="flex items-center gap-3">
                  {site.available && <span className="status-dot" aria-hidden="true" />}
                  {site.available ? "Open to projects — freelance & collabs" : "Currently booked"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="ticket-stub" aria-hidden="true">
            <span className="ticket-stub-text">Admit one · Code · Cut · Capture</span>
            <span className="ticket-barcode" />
          </div>
        </div>

        <ul className="social-list">
          {site.socials.map((social, i) => (
            <li key={social.href} data-social>
              <a href={social.href} target="_blank" rel="noreferrer" className="social-row" data-cursor="link">
                <span className="meta">{String(i + 1).padStart(2, "0")}</span>
                <span className="social-row-name">{social.label.startsWith("@") ? "Instagram" : social.label}</span>
                <span className="social-row-handle">{handle(social.href)}</span>
                <span className="social-row-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-12 self-center lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
        <ContactForm email={site.email} to={site.name} location={site.location} portrait={about.portrait} />
      </div>
    </section>
  );
}
