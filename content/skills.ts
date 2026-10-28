import type { Skill } from "./types";

// TODO: adjust. `projects` holds project slugs that used the skill.
export const skills: Skill[] = [
  { name: "Figma", category: "Design", level: 4, projects: ["project-three"] },
  { name: "UI/UX", category: "Design", level: 4 },
  { name: "TypeScript", category: "Frontend", level: 4, projects: ["project-two"] },
  { name: "React", category: "Frontend", level: 4, projects: ["project-one", "project-two"] },
  { name: "Next.js", category: "Frontend", level: 4, projects: ["project-one"] },
  { name: "Tailwind CSS", category: "Frontend", level: 4, projects: ["project-two"] },
  { name: "GSAP", category: "Motion", level: 3, projects: ["project-one"] },
  { name: "Three.js", category: "Motion", level: 2, projects: ["project-one"] },
  { name: "Git", category: "Tools", level: 4 },
  { name: "Premiere Pro", category: "Tools", level: 3 },
];
