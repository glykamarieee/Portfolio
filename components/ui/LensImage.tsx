"use client";

import type { PointerEvent } from "react";
import type { Media } from "@/content";
import { cn } from "@/lib/cn";
import { MediaImage } from "./MediaImage";

type LensImageProps = {
  base: Media;
  reveal: Media;
  sizes: string;
  className?: string;
};

// An image with a second image hidden underneath: the lens (a circle that
// follows the pointer) shows it. Fine pointers only — touch sees the base image.
export function LensImage({ base, reveal, sizes, className }: LensImageProps) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div className={cn("lens-image relative", className)} data-cursor="hide" onPointerMove={onPointerMove}>
      <MediaImage media={base} sizes={sizes} />
      <div className="lens-image-reveal" aria-hidden="true">
        <MediaImage media={{ ...reveal, alt: "" }} sizes={sizes} />
      </div>
    </div>
  );
}
