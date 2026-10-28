import { pad } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ScrambleText } from "./ScrambleText";

// The "(03) — Selected Work" meta label that opens every scene.
export function SceneHeader({ index, title, className }: { index: number; title: string; className?: string }) {
  return (
    <p className={cn("meta", className)}>
      <ScrambleText text={`(${pad(index)}) — ${title}`} />
    </p>
  );
}
