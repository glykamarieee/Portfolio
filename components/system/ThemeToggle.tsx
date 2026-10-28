"use client";

import type { MouseEvent } from "react";
import { useTheme } from "@/lib/hooks";
import { setTheme } from "@/lib/theme";

// Light/dark switch. The icon is a lens: a ring with one half filled, which
// turns over when the theme flips. The new theme opens from the button.
export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      data-cursor="link"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <span className="theme-toggle-icon" data-theme-icon={theme} aria-hidden="true" />
    </button>
  );
}
