import type { About } from "./types";

// TODO: replace placeholders. Photos go in /public/media/about/.
export const about: About = {
  shortBio: "Developer and designer crafting immersive, motion-rich web experiences.",
  longBio: [
    "Placeholder paragraph about who you are, what you do, and why you do it.",
    "Placeholder paragraph about how you work and what you care about.",
  ],
  manifesto:
    "I design and build digital experiences that move — interfaces where every scroll tells a story and every detail is felt.",
  portrait: { src: "/media/about/portrait.jpg", alt: "Portrait of Your Name" },
  portraitAlt: { src: "/media/about/portrait-travel.jpg", alt: "Your Name on an adventure" },
  values: [
    { title: "Craft", body: "Details are the design." },
    { title: "Motion", body: "Animation should explain, not decorate." },
    { title: "Curiosity", body: "Always learning, always exploring." },
  ],
  currentlyLearning: ["WebGL shaders", "Three.js"],
  funFacts: ["Placeholder fun fact."],
};
