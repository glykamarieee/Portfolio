import type { Skill, SkillCategory } from "./types";

// TODO: adjust. `projects` holds project slugs that used the skill.
export const skills: Skill[] = [
  { name: "Figma", category: "Design", level: 4, projects: ["project-three"] },
  { name: "UI/UX", category: "Design", level: 4 },
  { name: "TypeScript", category: "Frontend", level: 4, projects: ["project-two"] },
  { name: "React", category: "Frontend", level: 4, projects: ["project-one", "project-two", "project-four"] },
  { name: "Next.js", category: "Frontend", level: 4, projects: ["project-one"] },
  { name: "Tailwind CSS", category: "Frontend", level: 4, projects: ["project-two"] },
  { name: "GSAP", category: "Motion", level: 3, projects: ["project-one", "project-four"] },
  { name: "Three.js", category: "Motion", level: 2, projects: ["project-one"] },
  { name: "Git", category: "Tools", level: 4 },
  { name: "Premiere Pro", category: "Tools", level: 3 },
];

// The Skills dial (home scene 4): one stop per category, in this order.
export const skillCategories: { name: SkillCategory; blurb: string }[] = [
  { name: "Design", blurb: "Interfaces that start on paper and end up obvious." },
  { name: "Frontend", blurb: "Typed, fast, accessible code that ships." },
  { name: "Motion", blurb: "Scroll, timing and depth that make it feel alive." },
  { name: "Tools", blurb: "The kit behind the work — from repo to cut." },
];
