import type { Skill, SkillCategory } from "./types";

// Kept in step with the GitHub profile README (glykamarieee/glykamarieee).
// `level` (1–5) sets how long a clip runs on the Editing timeline; `projects`
// holds project slugs that used the skill.
export const skills: Skill[] = [
  { name: "HTML & CSS", category: "Programming", level: 4 },
  { name: "JavaScript", category: "Programming", level: 4 },
  { name: "TypeScript", category: "Programming", level: 4, projects: ["project-two"] },
  { name: "React", category: "Programming", level: 4, projects: ["project-one", "project-two", "project-four"] },
  { name: "Tailwind CSS", category: "Programming", level: 4, projects: ["project-two"] },
  { name: "PHP", category: "Programming", level: 3 },
  { name: "Python", category: "Programming", level: 3 },
  { name: "Java", category: "Programming", level: 3 },
  { name: "C", category: "Programming", level: 3 },
  { name: "C++", category: "Programming", level: 3 },
  { name: "MySQL", category: "Programming", level: 3 },

  { name: "Premiere Pro", category: "Editing", level: 4 },
  { name: "DaVinci Resolve", category: "Editing", level: 3 },
  { name: "CapCut", category: "Editing", level: 4 },
  { name: "Color grading", category: "Editing", level: 4 },
  { name: "Sound design", category: "Editing", level: 3 },

  { name: "Cinematic framing", category: "Videography", level: 4 },
  { name: "Composition", category: "Videography", level: 4 },
  { name: "Camera movement", category: "Videography", level: 4 },
  { name: "B-roll", category: "Videography", level: 4 },
  { name: "Phone filming", category: "Videography", level: 4 },
];

// The three crafts in the Skills scene, in this order.
export const skillCategories: { name: SkillCategory; blurb: string }[] = [
  { name: "Programming", blurb: "Typed, fast, accessible code that ships." },
  { name: "Editing", blurb: "Cutting footage into something that feels like a film." },
  { name: "Videography", blurb: "Framing, light and movement — getting the shot right in camera." },
];
