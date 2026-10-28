"use client";

import { useRef, useState, type MouseEvent } from "react";
import { site } from "@/content";
import { RollText } from "@/components/ui/RollText";
import { dur, ease, getLenis, gsap, stagger } from "@/lib/motion";
import { pad } from "@/lib/format";
import { LocalTime } from "./LocalTime";
import { ThemeToggle } from "./ThemeToggle";
import { TransitionLink } from "./TransitionLink";

// Full-screen menu for small screens. A modal <dialog> gives focus trapping,
// Esc and inert background for free; it opens as a lens (circle) from the
// Menu button and the links rise in.
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const origin = useRef("100% 0%");
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (e: MouseEvent<HTMLButtonElement>) => {
    const el = dialog.current!;
    const rect = e.currentTarget.getBoundingClientRect();
    origin.current = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
    el.showModal();
    setOpen(true);
    getLenis()?.stop();
    if (reduceMotion()) return;
    gsap.fromTo(
      el,
      { clipPath: `circle(0% at ${origin.current})` },
      { clipPath: `circle(150% at ${origin.current})`, duration: dur.slow, ease: ease.reveal },
    );
    gsap.from(el.querySelectorAll("[data-menu-item]"), {
      yPercent: 100,
      autoAlpha: 0,
      duration: dur.base,
      ease: ease.reveal,
      stagger: stagger.items,
      delay: 0.15,
    });
  };

  const hide = () => {
    const el = dialog.current!;
    const done = () => {
      el.close();
      gsap.set(el, { clearProps: "clipPath" });
    };
    if (reduceMotion()) {
      done();
      return;
    }
    gsap.to(el, { clipPath: `circle(0% at ${origin.current})`, duration: dur.base, ease: ease.ui, onComplete: done });
  };

  return (
    <>
      <button
        type="button"
        className="meta md:hidden"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <RollText text="Menu" />
      </button>

      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault(); // animate out instead of closing instantly on Esc
          hide();
        }}
        onClose={() => {
          setOpen(false);
          getLenis()?.start();
        }}
      >
        <div className="container-grid h-full grid-rows-[auto_1fr_auto] gap-y-8 py-6">
          <div className="col-span-12 flex items-center justify-between">
            <span className="meta">{site.name}</span>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button type="button" className="meta text-fg" onClick={hide}>
                <RollText text="Close" />
              </button>
            </div>
          </div>

          <nav aria-label="Mobile" className="col-span-12 self-center">
            <ul className="flex flex-col gap-2">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <TransitionLink
                    href={item.href}
                    // Close instantly so the page's lens transition isn't fighting the menu's
                    onClick={() => dialog.current?.close()}
                    data-menu-item
                    className="font-display text-display flex items-baseline gap-4 font-semibold"
                  >
                    <span className="meta">{pad(i + 1)}</span>
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="meta col-span-12 flex flex-wrap items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              {site.available && <span className="status-dot" aria-hidden="true" />}
              {site.location} <LocalTime timeZone={site.timeZone} />
            </span>
            <span className="flex gap-4">
              {site.socials.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noreferrer" className="text-fg">
                  {social.label}
                </a>
              ))}
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}
