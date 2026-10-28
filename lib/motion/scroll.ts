import type Lenis from "lenis";

// Holds the active Lenis instance so any component can scroll programmatically
// without prop-drilling. Falls back to native scrolling when Lenis is off
// (reduced motion, or before it mounts).
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target: number | string | HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target);
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView();
}
