import { ViewTransition, type ReactNode } from "react";

// Wrap each page's content in this (in page.tsx, not a layout — layouts
// persist, so enter/exit never fire there). Navigations made with
// <TransitionLink> carry the "lens" type: the new page opens as a circle
// from the click point. See styles/transitions.css.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ lens: "lens-in", default: "none" }}
      exit={{ lens: "lens-out", default: "none" }}
      default="none"
    >
      {/* One opaque wrapper = one snapshot, so the page opens as a single solid lens */}
      <div className="min-h-svh bg-bg">{children}</div>
    </ViewTransition>
  );
}
