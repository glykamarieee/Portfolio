import { about } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { LensImage } from "@/components/ui/LensImage";
import { Parallax } from "@/components/ui/Parallax";
import { RollText } from "@/components/ui/RollText";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { sceneIndex } from "../registry";

// Scene 2 — portrait in three parallax layers (bloom / photo / outline type);
// the lens over the photo reveals the alternate "travel me" shot.
export function AboutTeaser() {
  return (
    <section data-scene="About" className="container-grid items-center gap-y-16 overflow-x-clip py-32">
      <div className="relative col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-2">
        <Parallax speed={-0.1} className="about-bloom absolute -inset-[15%]" />
        <Parallax speed={0.06} className="relative">
          <LensImage
            base={about.portrait}
            reveal={about.portraitAlt}
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] overflow-hidden rounded-sm"
          />
        </Parallax>
        <Parallax speed={0.25} className="pointer-events-none absolute right-0 bottom-[8%] md:-right-[10%]">
          <span className="font-display text-display outline-type font-semibold" aria-hidden="true">
            Hello
          </span>
        </Parallax>
      </div>

      <div className="col-span-12 flex flex-col gap-8 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
        <SceneHeader index={sceneIndex("About")} title="About" />
        <SplitHeading className="font-display text-h2 font-semibold">{about.shortBio}</SplitHeading>
        <ul className="grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
          {about.values.map((value) => (
            <li key={value.title}>
              <p className="meta text-fg">{value.title}</p>
              <p className="mt-2 text-fg-muted">{value.body}</p>
            </li>
          ))}
        </ul>
        <TransitionLink href="/about" className="meta self-start text-fg" data-cursor="link">
          <RollText text="More about me →" />
        </TransitionLink>
      </div>
    </section>
  );
}
