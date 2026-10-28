import type { Project } from "./types";

// TODO: 4–6 projects. Media goes in /public/media/projects/<slug>/.
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    year: 2026,
    role: "Design & Development",
    stack: ["Next.js", "GSAP", "Three.js"],
    problem: "One line on the problem this solved.",
    outcome: "One line on the result.",
    url: "https://example.com",
    cover: { src: "/media/projects/project-one/cover.jpg", alt: "Project One cover" },
    featured: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    year: 2025,
    role: "Frontend Development",
    stack: ["React", "TypeScript", "Tailwind"],
    problem: "One line on the problem this solved.",
    outcome: "One line on the result.",
    cover: { src: "/media/projects/project-two/cover.jpg", alt: "Project Two cover" },
    featured: true,
  },
  {
    slug: "project-three",
    title: "Project Three",
    year: 2025,
    role: "UI Design",
    stack: ["Figma", "Framer"],
    problem: "One line on the problem this solved.",
    outcome: "One line on the result.",
    cover: { src: "/media/projects/project-three/cover.jpg", alt: "Project Three cover" },
    featured: true,
  },
];
