// Light/dark theme. The active theme lives on <html data-theme>; the choice
// is remembered in localStorage. Light is the default.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME: Theme = "light";

// Inlined in <head> (app/layout.tsx) so the saved theme applies before first paint.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="dark"||t==="light"?t:"${DEFAULT_THEME}"}catch(e){document.documentElement.dataset.theme="${DEFAULT_THEME}"}})();`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Switches theme. With `origin`, the new theme opens as a lens (circle) from
 * that point via a view transition; otherwise it switches instantly.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!origin || reduceMotion || !document.startViewTransition) {
    apply();
    return;
  }
  root.style.setProperty("--lens-x", `${origin.x}px`);
  root.style.setProperty("--lens-y", `${origin.y}px`);
  document.startViewTransition({ update: apply, types: ["theme"] });
}
