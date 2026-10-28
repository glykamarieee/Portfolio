// Motion vocabulary (DESIGN.md §5). The only place eases and durations live.
// Safe to import from server or client code — no GSAP dependency.

export const ease = {
  reveal: "expo.out",
  scrub: "none",
  scrubSoft: "power2.inOut",
  ui: "power3.out",
  spring: "elastic.out(1, 0.4)",
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

// Micro-interaction constants (DESIGN.md §6–7)
export const interaction = {
  magnetStrength: 0.35,
  tiltMax: 6, // degrees
  copiedResetMs: 1500,
  preloaderMinSeconds: 1.2,
  preloaderTimeoutMs: 6000,
} as const;
