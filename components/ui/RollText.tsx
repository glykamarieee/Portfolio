import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type RollTextProps = {
  text: string;
  className?: string;
};

// Letter-stagger roll on hover (CSS only, see styles/interactions.css).
// Rolls when it — or the link/button it sits in — is hovered or focused.
export function RollText({ text, className }: RollTextProps) {
  return (
    <span className={cn("roll", className)}>
      <span className="sr-only">{text}</span>
      <span className="roll-chars" aria-hidden="true">
        {Array.from(text).map((char, i) => (
          <span key={i} className="roll-char" style={{ "--i": i } as CSSProperties}>
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}
