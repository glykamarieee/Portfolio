"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, getTheme, type Theme } from "@/lib/theme";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

// Current theme, kept in sync with <html data-theme>. Server renders the default.
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => DEFAULT_THEME);
}
