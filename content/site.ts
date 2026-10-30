import type { Site } from "./types";

// Contact details match the GitHub profile README. `url` is still a placeholder
// until the site is deployed.
export const site: Site = {
  name: "Glyka Marie Amahan",
  role: "Creative Developer",
  positioning: "I build interfaces that feel alive.",
  // Hero: the first word rotates (one per craft: code, cut, capture), then the line
  headline: { words: ["Interfaces", "Films", "Frames"], lead: "that feel", accent: "alive" },
  location: "Cebu, PH",
  timeZone: "Asia/Manila",
  available: true,
  email: "glykamarie05@gmail.com",
  phone: "+63 995 035 6689",
  resumePdf: "/resume/resume.pdf",
  // Most important first
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/glykamarieee/" },
    { label: "@gloxonaquest", href: "https://www.instagram.com/gloxonaquest/" },
    { label: "Facebook", href: "https://www.facebook.com/glykamarieee" },
    { label: "GitHub", href: "https://github.com/glykamarieee" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume" },
    { label: "Contact", href: "/#contact" },
  ],
  url: "https://example.com",
};
