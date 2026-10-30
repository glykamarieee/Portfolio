// Shapes for everything in /content. Every page — including /resume —
// reads from these files, so update content here, never in components.

export type Media = {
  src: string; // path under /public, e.g. "/media/projects/foo/cover.jpg"
  alt: string;
  width?: number;
  height?: number;
};

export type Video = {
  src: string; // full clip (mp4); large files should live on a video host
  srcWebm?: string;
  preview?: string; // 3–6s muted loop (≤ 1.5MB)
  poster: string;
  captions?: string; // WebVTT file, e.g. "/media/adventures/trip-one/captions.vtt"
};

export type Link = {
  label: string;
  href: string;
};

export type Site = {
  name: string;
  role: string;
  positioning: string;
  /** Home hero headline: "<word> that feel <accent>." — `words` rotate, one per craft (Code, Cut, Capture) */
  headline: { words: string[]; lead: string; accent: string };
  location: string;
  timeZone: string; // IANA, e.g. "Asia/Manila" — drives the live clock in the nav
  available: boolean;
  email: string;
  phone: string; // as displayed, e.g. "+63 995 035 6689" — see telHref() for the link
  resumePdf: string;
  socials: Link[];
  nav: Link[];
  url: string; // production URL, for metadata/sitemap
};

export type About = {
  shortBio: string;
  longBio: string[];
  manifesto: string; // home scene 2: 2–3 sentences. Wrap key phrases in *stars*.
  portrait: Media;
  portraitAlt: Media; // revealed by the lens (e.g. behind the camera)
  values: { title: string; body: string }[];
  currentlyLearning: string[];
  funFacts: string[];
  yearsCreating: number; // "By the numbers" on /about
};

export type Project = {
  slug: string;
  title: string;
  year: number;
  role: string;
  stack: string[];
  problem: string;
  outcome: string;
  url?: string;
  repo?: string;
  cover: Media;
  preview?: Video;
  featured: boolean;
  // Case study (/work/[slug]) — every section is optional
  overview?: string;
  challenge?: string;
  process?: { title: string; body: string; media: Media }[];
  metrics?: { label: string; value: number; suffix?: string }[];
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string; // ISO "YYYY-MM"
  credentialUrl?: string;
  image: Media;
};

export type Education = {
  school: string;
  program: string; // degree / strand
  start: number;
  end: number | "present";
  honors?: string[];
  highlights?: string[];
};

export type Experience = {
  organization: string;
  role: string;
  start: string; // ISO "YYYY-MM"
  end: string | "present";
  location?: string;
  achievements: string[];
};

/** A tilted cover card around the home hero (content/hero.ts) */
export type HeroCard = {
  href: string;
  title: string; // big cover type
  kicker: string; // small cover line
  // Cover art that says what the card opens (drawn in components/scenes/Hero/CardArt.tsx)
  art: "journey" | "work" | "about" | "archive" | "skills" | "hello" | "resume";
  bg: string;
  fg: string;
  image?: Media; // a photo cover replaces the art
  // Position in the hero (CSS lengths), resting tilt in degrees, parallax depth ~0.6–1.6
  place: { top?: string; right?: string; bottom?: string; left?: string };
  placeMobile?: { top?: string; right?: string; bottom?: string; left?: string }; // phones (defaults to `place`)
  rotate: number;
  depth: number;
  mobile?: boolean; // also show on phones (keep it to four)
};

export type SkillCategory = "Programming" | "Editing" | "Videography";

export type Skill = {
  name: string;
  category: SkillCategory;
  level?: 1 | 2 | 3 | 4 | 5;
  projects?: string[]; // project slugs that used the skill
};
