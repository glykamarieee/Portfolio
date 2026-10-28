"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

type LensTextProps = {
  children: ReactNode;
  /** What the lens reveals. Defaults to the same text in the accent color. */
  reveal?: ReactNode;
  className?: string;
};

// Text with a hidden layer that shows through a circle under the cursor —
// the Lens's "link" behavior (DESIGN.md §6). Purely decorative: screen
// readers only get `children`.
export function LensText({ children, reveal, className }: LensTextProps) {
  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <span className={cn("lens-text", className)} data-cursor="link" onPointerMove={onPointerMove}>
      {children}
      <span className="lens-text-reveal" aria-hidden="true">
        {reveal ?? children}
      </span>
    </span>
  );
}
