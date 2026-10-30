import Image from "next/image";
import type { Media } from "@/content";
import { cn } from "@/lib/cn";

type MediaImageProps = {
  media: Media;
  /** Responsive `sizes` hint — always set it to the rendered width. */
  sizes: string;
  className?: string;
  eager?: boolean;
  /** 75 (default) or 90 — must be listed in next.config `images.qualities` */
  quality?: 75 | 90;
};

// next/image filling its (relatively positioned) parent. SVG placeholders
// skip the optimizer, which doesn't process SVG.
export function MediaImage({ media, sizes, className, eager, quality }: MediaImageProps) {
  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      unoptimized={media.src.endsWith(".svg")}
      loading={eager ? "eager" : "lazy"}
      quality={quality}
      className={cn("object-cover", className)}
    />
  );
}
