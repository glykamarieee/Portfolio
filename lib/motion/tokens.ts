// Motion vocabulary (DESIGN.md §5). The only place eases and durations live.
// Safe to import from server or client code — no GSAP dependency.

export const ease = {
  reveal: "expo.out",
  scrub: "none",
  scrubSoft: "power2.inOut",
  ui: "power3.out",
  spring: "elastic.out(1, 0.4)",
  float: "sine.inOut", // idle bobbing of floating objects
} as const;

export const dur = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

export const stagger = {
  chars: 0.02,
  words: 0.06,
  items: 0.1,
} as const;

export const smoothScroll = {
  lerp: 0.1,
} as const;

// Media queries for gsap.matchMedia(). Pinned/3D scenes run only under `cinematic`;
// everything else gets the static layout the markup renders by default.
export const mq = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 1024px)",
  finePointer: "(hover: hover) and (pointer: fine)",
  cinematic: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
} as const;

// Micro-interaction constants (DESIGN.md §6–7)
export const interaction = {
  magnetStrength: 0.35,
  tiltMax: 6, // degrees
  copiedResetMs: 1500,
  preloaderMinSeconds: 0.8,
  // Opacity of not-yet-lit words in scroll reveals. Chosen so even the dim
  // state passes WCAG AA in both themes: 3:1 for large text, 4.5:1 for body.
  dimLargeText: 0.45,
  dimBodyText: 0.62,
  dimAccentText: 0.75, // accent green loses contrast faster than black when faded
  preloaderTimeoutMs: 6000,
} as const;
