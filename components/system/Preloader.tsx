"use client";

import { useRef, useState } from "react";
import { site } from "@/content";
import { dur, ease, getLenis, gsap, interaction, markReady, useGSAP } from "@/lib/motion";

const SEEN_KEY = "preloader-seen";

// Counter 0→100 driven by real asset loading (fonts + images), then the lens
// "opens" — a growing transparent hole in the overlay reveals the page.
// Shown once per session. Hidden for no-JS visitors via <noscript> in the layout.
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;

      const finish = () => {
        getLenis()?.start();
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        setDone(true);
      };

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}
      if (seen) {
        markReady();
        finish();
        return;
      }

      getLenis()?.stop();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progress = { value: 0 };
      // Guarded: reverting on unmount re-renders the tween after React clears the ref.
      const render = () => {
        if (count.current) count.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
      };

      // Tweens created later (after assets load) must be context-safe so
      // cleanup — including React's dev double-invoke — kills them.
      const open = contextSafe(() => {
        markReady();
        if (reduceMotion) {
          gsap.to(el, { autoAlpha: 0, duration: dur.fast, onComplete: finish });
          return;
        }
        gsap
          .timeline({ onComplete: finish })
          .to("[data-preloader-ui]", { yPercent: -100, autoAlpha: 0, duration: dur.fast, ease: ease.ui })
          .to(el, { "--hole": "150%", duration: dur.slow, ease: ease.reveal }, "<0.1");
      });

      let opened = false;
      const advance = contextSafe((target: number) => {
        gsap.to(progress, {
          value: target,
          duration: target === 100 ? interaction.preloaderMinSeconds : dur.base,
          ease: ease.ui,
          overwrite: true,
          onUpdate: render,
          onComplete: () => {
            if (target === 100 && !opened) {
              opened = true;
              open();
            }
          },
        });
      });

      const pending: Promise<unknown>[] = [
        document.fonts.ready,
        ...Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              }),
          ),
      ];

      let loaded = 0;
      let cancelled = false;
      for (const p of pending) {
        p.then(() => {
          if (cancelled) return;
          loaded += 1;
          advance(loaded === pending.length ? 100 : (loaded / pending.length) * 90);
        });
      }
      const timeout = setTimeout(() => advance(100), interaction.preloaderTimeoutMs);

      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    },
    { scope: ref },
  );

  if (done) return null;

  return (
    <div ref={ref} className="preloader" aria-hidden="true">
      <div className="container-grid h-full content-end gap-y-4 pb-16">
        <p className="meta col-span-6 overflow-hidden">
          <span className="inline-block" data-preloader-ui>
            {site.name}
          </span>
        </p>
        <p className="meta col-span-6 overflow-hidden text-right">
          <span className="inline-block" data-preloader-ui>
            Loading experience
          </span>
        </p>
        <p className="font-display text-hero col-span-12 overflow-hidden text-right font-semibold tabular-nums">
          <span ref={count} className="inline-block" data-preloader-ui>
            000
          </span>
        </p>
      </div>
    </div>
  );
}
