import type { Project } from "./types";

// TODO: 4–6 projects. Media goes in /public/media/projects/<slug>/.
const PLACEHOLDER = "/media/placeholder.svg";

// Placeholder case-study sections — replace per project.
const caseStudy = (title: string): Pick<Project, "overview" | "challenge" | "process" | "metrics"> => ({
  overview: `Placeholder overview of ${title}: what it is, who it was for, and your role in it.`,
  challenge: "Placeholder: the core problem, the constraints, and what made it hard.",
  process: [
    { title: "Research", body: "Placeholder: how you understood the problem.", media: { src: PLACEHOLDER, alt: `${title} research` } },
    { title: "Design", body: "Placeholder: the key design decisions.", media: { src: PLACEHOLDER, alt: `${title} design` } },
    { title: "Build", body: "Placeholder: how it was built and what you learned.", media: { src: PLACEHOLDER, alt: `${title} build` } },
  ],
  metrics: [
    { label: "Faster load", value: 40, suffix: "%" },
    { label: "Users reached", value: 1200, suffix: "+" },
    { label: "Weeks to launch", value: 6 },
  ],
});

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
    cover: { src: PLACEHOLDER, alt: "Project One cover" },
    featured: true,
    ...caseStudy("Project One"),
  },
  {
    slug: "project-two",
    title: "Project Two",
    year: 2025,
    role: "Frontend Development",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    problem: "One line on the problem this solved.",
    outcome: "One line on the result.",
    cover: { src: PLACEHOLDER, alt: "Project Two cover" },
    featured: true,
    ...caseStudy("Project Two"),
  },
  {
    slug: "project-three",
    title: "Project Three",
    year: 2025,
    role: "UI Design",
    stack: ["Figma", "UI/UX"],
    problem: "One line on the problem this solved.",
    outcome: "One line on the result.",
    cover: { src: PLACEHOLDER, alt: "Project Three cover" },
    featured: true,
    ...caseStudy("Project Three"),
  },
  {
    slug: "project-four",
    title: "Project Four",
    year: 2024,
    role: "Motion & Development",
    stack: ["React", "GSAP"],
    problem: "One line on the problem this solved.",
    outcome: "One line on the result.",
    cover: { src: PLACEHOLDER, alt: "Project Four cover" },
    featured: true,
    ...caseStudy("Project Four"),
  },
];
