import type { Skill, SkillCategory } from "./types";

// TODO: adjust to your real kit. `level` (1–5) sets how long a clip runs on the
// Editing timeline; `projects` holds project slugs that used the skill.
export const skills: Skill[] = [
  { name: "HTML & CSS", category: "Programming", level: 5 },
  { name: "JavaScript", category: "Programming", level: 4 },
  { name: "TypeScript", category: "Programming", level: 4, projects: ["project-two"] },
  { name: "React", category: "Programming", level: 4, projects: ["project-one", "project-two", "project-four"] },
  { name: "Next.js", category: "Programming", level: 4, projects: ["project-one"] },
  { name: "Tailwind CSS", category: "Programming", level: 4, projects: ["project-two"] },
  { name: "GSAP", category: "Programming", level: 3, projects: ["project-one", "project-four"] },
  { name: "Git", category: "Programming", level: 4 },

  { name: "Premiere Pro", category: "Editing", level: 4 },
  { name: "After Effects", category: "Editing", level: 3 },
  { name: "DaVinci Resolve", category: "Editing", level: 3 },
  { name: "CapCut", category: "Editing", level: 5 },
  { name: "Color grading", category: "Editing", level: 4 },
  { name: "Sound design", category: "Editing", level: 3 },

  { name: "Cinematic framing", category: "Videography", level: 4 },
  { name: "Camera movement", category: "Videography", level: 4 },
  { name: "Drone shots", category: "Videography", level: 3 },
  { name: "Natural light", category: "Videography", level: 4 },
  { name: "Storyboarding", category: "Videography", level: 3 },
  { name: "Phone cinematography", category: "Videography", level: 5 },
];

// The three crafts in the Skills scene, in this order.
export const skillCategories: { name: SkillCategory; blurb: string }[] = [
  { name: "Programming", blurb: "Typed, fast, accessible code that ships." },
  { name: "Editing", blurb: "Cutting footage into something that feels like a film." },
  { name: "Videography", blurb: "Framing, light and movement — getting the shot right in camera." },
];
