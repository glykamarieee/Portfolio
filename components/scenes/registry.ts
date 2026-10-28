// Home-page scene order. Each scene renders `data-scene={title}` and uses its
// index here for its "(03) — Title" label; SceneCounter reads the same list.
export const SCENES = [
  "Intro",
  "Manifesto",
  "About",
  "Selected Work",
  "Skills",
  "Journey",
  "The Archive",
  "Field Notes",
  "Resume",
  "Contact",
] as const;

export type SceneTitle = (typeof SCENES)[number];

export const sceneIndex = (title: SceneTitle) => SCENES.indexOf(title);
