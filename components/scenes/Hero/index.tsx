import { site } from "@/content";
import { HeroBackdrop } from "@/components/webgl/HeroBackdrop";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { HeroTitle } from "./HeroTitle";

// Scene 0 — giant split name over the WebGL field; scatters into depth on scroll.
export function Hero() {
  return (
    <section data-scene="Intro" className="relative h-svh min-h-[560px] overflow-hidden">
      <HeroBackdrop />
      <div className="container-grid relative z-(--z-content) h-full content-end gap-y-6 pb-16">
        <p className="meta col-span-12">
          <ScrambleText text={`(00) — ${site.role}`} />
        </p>
        <HeroTitle className="font-display text-hero col-span-12 font-semibold">{site.name}</HeroTitle>
        <SplitHeading
          as="p"
          by="lines"
          trigger="ready"
          delay={0.4}
          className="text-lead col-span-12 text-fg-muted md:col-span-6"
        >
          {site.positioning}
        </SplitHeading>
        <p className="meta col-span-12 self-end md:col-span-6 md:text-right">
          {site.location} · Scroll <span className="scroll-cue">↓</span>
        </p>
      </div>
    </section>
  );
}
