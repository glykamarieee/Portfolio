import Image from "next/image";
import type { Media } from "@/content";
import { cn } from "@/lib/cn";

type MediaImageProps = {
  media: Media;
  /** Responsive `sizes` hint — always set it to the rendered width. */
  sizes: string;
  className?: string;
  eager?: boolean;
};

// next/image filling its (relatively positioned) parent. SVG placeholders
// skip the optimizer, which doesn't process SVG.
export function MediaImage({ media, sizes, className, eager }: MediaImageProps) {
  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      unoptimized={media.src.endsWith(".svg")}
      loading={eager ? "eager" : "lazy"}
      className={cn("object-cover", className)}
    />
  );
}
