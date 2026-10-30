import { about, site } from "@/content";
import { LensImage } from "@/components/ui/LensImage";
import { MediaImage } from "@/components/ui/MediaImage";
import { cn } from "@/lib/cn";

// Two tilted photo cards (portrait in front, alternate behind) with a location
// sticker. Hover fans the cards apart; the lens on the front card reveals the
// alternate shot.
export function PhotoStack({ sizes, className }: { sizes: string; className?: string }) {
  return (
    <div className={cn("photo-stack", className)}>
      <div className="photo-card photo-card-back" aria-hidden="true">
        <MediaImage media={about.portraitAlt} sizes={sizes} />
      </div>
      <div className="photo-card photo-card-front">
        <LensImage base={about.portrait} reveal={about.portraitAlt} sizes={sizes} className="h-full w-full" />
      </div>
      <p className="photo-sticker meta">
        {site.available && <span className="status-dot" aria-hidden="true" />}
        Based in {site.location.split(",")[0]}
      </p>
    </div>
  );
}
