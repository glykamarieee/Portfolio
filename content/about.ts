import type { About } from "./types";

// TODO: replace placeholders. Photos go in /public/media/about/.
const PLACEHOLDER = "/media/placeholder.svg";

export const about: About = {
  shortBio: "Developer, editor and videographer from Cebu — I build interfaces and films that feel alive.",
  longBio: [
    "Placeholder paragraph about who you are, what you do, and why you do it.",
    "Placeholder paragraph about how you work and what you care about.",
  ],
  manifesto:
    "I *write the code*, *cut the film* and *frame the shot* — so every scroll, every edit and every moment feels like a story worth staying for.",
  manifestoMedia: [
    { src: PLACEHOLDER, alt: "" },
    { src: PLACEHOLDER, alt: "" },
    { src: PLACEHOLDER, alt: "" },
  ],
  portrait: { src: "/media/about/portrait.jpg", alt: "Portrait of Glyka Marie Amahan smiling, in a black blazer" },
  portraitAlt: { src: "/media/about/portrait-camera.jpg", alt: "Glyka outdoors at dusk holding a camera, making a call-me hand sign" },
  values: [
    { title: "Craft", body: "Details are the design." },
    { title: "Story", body: "Every scroll, cut and frame should say something." },
    { title: "Curiosity", body: "Always learning, always exploring." },
  ],
  currentlyLearning: ["After Effects", "Blender", "Motion graphics"],
  funFacts: ["Placeholder fun fact.", "Another placeholder fun fact.", "One more placeholder fun fact."],
  yearsCreating: 3,
};
