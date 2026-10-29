// Floating 3D objects (DESIGN.md §8). To use your own images: drop PNG/SVG/WebP
// files in /public/media/objects/ and point `objects` below at them — every
// placement updates. Transparent-background PNGs (~600px) work best.

export const objects = {
  flower: "/media/objects/flower.svg",
  heart: "/media/objects/heart.svg",
  bolt: "/media/objects/bolt.svg",
  blob: "/media/objects/blob.svg",
  sparkle: "/media/objects/sparkle.svg",
};

export type DecorObject = {
  src: string;
  /** CSS width, e.g. "clamp(80px, 10vw, 170px)" */
  size: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  /** Cursor/scroll parallax strength: ~0.5 (far) to ~1.8 (near) */
  depth: number;
  /** Resting tilt in degrees */
  rotate?: number;
  /** Paint over the section's text instead of behind it */
  front?: boolean;
  /** Also show on phones (keep it to one or two per section) */
  mobile?: boolean;
};

const S = "clamp(48px, 5vw, 84px)";
const M = "clamp(72px, 8vw, 140px)";
const L = "clamp(96px, 11vw, 190px)";

// Placements per section, keyed by the `set` passed to <Decor />
export const decor: Record<string, DecorObject[]> = {
  hero: [
    { src: objects.flower, size: L, top: "16%", right: "9%", depth: 1.4, rotate: 12, mobile: true },
    { src: objects.blob, size: M, top: "24%", left: "6%", depth: 0.8, rotate: -8 },
    { src: objects.sparkle, size: S, top: "46%", right: "32%", depth: 1.8, rotate: 10 },
  ],
  manifesto: [
    { src: objects.heart, size: M, bottom: "10%", right: "6%", depth: 1.2, rotate: -12, mobile: true },
    { src: objects.sparkle, size: S, top: "14%", right: "22%", depth: 1.6 },
  ],
  about: [
    { src: objects.flower, size: M, top: "10%", left: "38%", depth: 1.5, rotate: -10, front: true, mobile: true },
    { src: objects.heart, size: S, bottom: "14%", left: "5%", depth: 1.1, rotate: 14, front: true },
  ],
  work: [{ src: objects.bolt, size: M, top: "12%", right: "30%", depth: 1.3, rotate: 8, mobile: true }],
  skills: [{ src: objects.blob, size: L, top: "8%", right: "4%", depth: 0.9, rotate: 10, mobile: true }],
  journey: [{ src: objects.sparkle, size: M, top: "10%", left: "44%", depth: 1.2, rotate: -6 }],
  archive: [
    { src: objects.heart, size: M, top: "32%", right: "7%", depth: 1.3, rotate: 10, mobile: true },
    { src: objects.sparkle, size: S, bottom: "16%", left: "6%", depth: 1.7 },
  ],
  fieldNotes: [{ src: objects.flower, size: S, top: "10%", right: "40%", depth: 1.5, rotate: 18 }],
  resume: [{ src: objects.bolt, size: M, bottom: "10%", left: "4%", depth: 1.2, rotate: -14 }],
  contact: [
    { src: objects.bolt, size: L, top: "16%", left: "34%", depth: 1.4, rotate: 14 },
    { src: objects.flower, size: M, bottom: "12%", left: "40%", depth: 1.1, rotate: -8 },
  ],
  aboutPage: [
    { src: objects.flower, size: L, top: "9%", right: "8%", depth: 1.4, rotate: 12, mobile: true },
    { src: objects.heart, size: M, top: "13%", left: "57%", depth: 1.8, rotate: -10 },
  ],
  adventures: [{ src: objects.sparkle, size: M, top: "14%", right: "10%", depth: 1.4, rotate: 8, mobile: true }],
  caseStudy: [{ src: objects.blob, size: M, top: "12%", right: "8%", depth: 1.2, rotate: 6, mobile: true }],
};
