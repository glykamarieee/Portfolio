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

// Size presets for placements: S = "clamp(48px, 5vw, 84px)",
// M = "clamp(72px, 8vw, 140px)", L = "clamp(96px, 11vw, 190px)"

// Placements per section, keyed by the `set` passed to <Decor />. Empty for the
// current gallery look (hero cards + glass folder carry the depth instead) —
// add entries here to bring floating objects back to any section.
export const decor: Record<string, DecorObject[]> = {
  hero: [],
  manifesto: [],
  about: [],
  work: [],
  skills: [],
  journey: [],
  archive: [],
  fieldNotes: [],
  resume: [],
  contact: [],
  aboutPage: [],
  adventures: [],
  caseStudy: [],
};
