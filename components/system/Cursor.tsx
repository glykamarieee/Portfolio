"use client";

import { useRef } from "react";
import { dur, ease, gsap, useGSAP } from "@/lib/motion";
import { useFinePointer } from "@/lib/hooks";

// The Lens (DESIGN.md §6). Components opt in declaratively:
//   data-cursor="link|view|play|drag|text|magnetic|hide"
//   data-cursor-label="Custom label"   (optional)
//   data-cursor-media="/path/to.jpg|mp4"  (optional, for view/play)
// Visual states live in styles/lens.css; this file only moves things.

const DEFAULT_LABELS: Record<string, string> = { view: "View", play: "Play", drag: "Drag" };
const VIDEO_SRC = /\.(mp4|webm)$/i;
const MAX_SPEED = 60;

export function Cursor() {
  const finePointer = useFinePointer();
  return finePointer ? <Lens /> : null;
}

function Lens() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLSpanElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const winBody = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lag = reduceMotion ? 0 : dur.fast;

      const dotX = gsap.quickSetter(dot.current, "x", "px");
      const dotY = gsap.quickSetter(dot.current, "y", "px");
      const followers = [ring.current, win.current].map((target) => ({
        x: gsap.quickTo(target, "x", { duration: lag, ease: ease.ui }),
        y: gsap.quickTo(target, "y", { duration: lag, ease: ease.ui }),
      }));

      let host: HTMLElement | null = null;
      let mediaSrc = "";

      const setMedia = (src: string) => {
        const v = video.current!;
        const isVideo = VIDEO_SRC.test(src);
        media.current!.style.backgroundImage = src && !isVideo ? `url("${src}")` : "";
        v.hidden = !isVideo;
        if (isVideo) {
          v.src = src;
          v.play().catch(() => {});
        } else {
          v.pause();
          v.removeAttribute("src");
        }
      };

      const apply = (target: EventTarget | null) => {
        const next = target instanceof Element ? target.closest<HTMLElement>("[data-cursor]") : null;
        if (next === host) return;
        host = next;
        const state = host?.dataset.cursor ?? "default";
        el.dataset.state = state;
        label.current!.textContent = host?.dataset.cursorLabel ?? DEFAULT_LABELS[state] ?? "";
        const src = host?.dataset.cursorMedia ?? "";
        el.toggleAttribute("data-media", Boolean(src));
        if (src !== mediaSrc) {
          mediaSrc = src;
          setMedia(src);
        }
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        dotX(e.clientX);
        dotY(e.clientY);
        for (const f of followers) {
          f.x(e.clientX);
          f.y(e.clientY);
        }
        el.dataset.visible = "";
      };
      const onOver = (e: PointerEvent) => apply(e.target);
      const onOut = (e: PointerEvent) => {
        if (!e.relatedTarget) delete el.dataset.visible;
      };
      const onDown = () => {
        el.dataset.pressed = "";
        gsap.fromTo(
          ripple.current,
          { scale: 0.5, autoAlpha: 0.6 },
          { scale: 2.5, autoAlpha: 0, duration: dur.base, ease: ease.reveal },
        );
      };
      const onUp = () => delete el.dataset.pressed;

      // Velocity: drag squashes along the direction of travel, view/play skews.
      let lastX = 0;
      let lastY = 0;
      const tick = () => {
        const x = gsap.getProperty(win.current, "x") as number;
        const y = gsap.getProperty(win.current, "y") as number;
        const vx = x - lastX;
        const vy = y - lastY;
        lastX = x;
        lastY = y;
        const speed = Math.min(Math.hypot(vx, vy), MAX_SPEED);
        const state = el.dataset.state;
        if (state === "drag") {
          gsap.set(winBody.current, {
            rotation: (Math.atan2(vy, vx) * 180) / Math.PI,
            scaleX: 1 + speed / 150,
            scaleY: 1 - speed / 300,
            skewX: 0,
          });
        } else {
          gsap.set(winBody.current, {
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: state === "view" || state === "play" ? gsap.utils.clamp(-12, 12, vx * 0.4) : 0,
          });
        }
      };

      document.documentElement.classList.add("has-lens");
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      if (!reduceMotion) gsap.ticker.add(tick);

      return () => {
        document.documentElement.classList.remove("has-lens");
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        gsap.ticker.remove(tick);
      };
    },
  );

  return (
    <div ref={root} className="lens" data-state="default" aria-hidden="true">
      <div ref={ring} className="lens-ring">
        <span className="lens-ring-shape" />
        <span ref={ripple} className="lens-ripple" />
      </div>
      <div ref={win} className="lens-win">
        <div ref={winBody}>
          <span ref={media} className="lens-win-shape">
            <video ref={video} muted loop playsInline hidden />
          </span>
        </div>
        <span ref={label} className="lens-label" />
      </div>
      <div ref={dot} className="lens-dot">
        <span className="lens-dot-shape" />
      </div>
    </div>
  );
}
