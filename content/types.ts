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
};

export type Link = {
  label: string;
  href: string;
};

export type Site = {
  name: string;
  role: string;
  positioning: string;
  location: string;
  timeZone: string; // IANA, e.g. "Asia/Manila" — drives the live clock in the nav
  available: boolean;
  email: string;
  resumePdf: string;
  socials: Link[];
  url: string; // production URL, for metadata/sitemap
};

export type About = {
  shortBio: string;
  longBio: string[];
  manifesto: string; // home scene 2: 2–3 sentences
  portrait: Media;
  portraitAlt: Media; // revealed by the lens ("travel me")
  values: { title: string; body: string }[];
  currentlyLearning: string[];
  funFacts: string[];
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

export type SkillCategory = "Design" | "Frontend" | "Motion" | "Tools";

export type Skill = {
  name: string;
  category: SkillCategory;
  level?: 1 | 2 | 3 | 4 | 5;
  projects?: string[]; // project slugs — powers the "hover highlights projects" link
};

export type Adventure = {
  slug: string;
  place: string;
  country: string;
  date: string; // ISO "YYYY-MM"
  coordinates: { lat: number; lng: number };
  story: string; // one line
  video?: Video;
  photos?: Media[];
};
