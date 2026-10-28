"use client";

import { scrollToTarget } from "@/lib/motion";
import { RollText } from "@/components/ui/RollText";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTarget(0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className="meta text-fg"
      data-cursor="link"
    >
      <RollText text="Back to top ↑" />
    </button>
  );
}
