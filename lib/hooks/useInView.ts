"use client";

import { useEffect, useState, type RefObject } from "react";

// True while the element is near the viewport and the tab is visible.
// Used to pause WebGL render loops offscreen.
export function useInView(ref: RefObject<Element | null>, rootMargin = "200px") {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let intersecting = false;
    const update = () => setInView(intersecting && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { rootMargin },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref, rootMargin]);

  return inView;
}
