import { about, site } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Parallax } from "@/components/ui/Parallax";
import { PhotoStack } from "@/components/ui/PhotoStack";
import { Reveal } from "@/components/ui/Reveal";
import { RollText } from "@/components/ui/RollText";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { pad } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const firstName = site.name.split(" ")[0];

// Scene 2 — hello. A stack of tilted photo cards (lens reveals the alternate
// shot, hover fans them) beside a greeting, the short bio and three value cards.
export function AboutTeaser() {
  return (
    <section data-scene="About" className="container-grid relative isolate items-center gap-y-16 overflow-x-clip py-32">
      <Decor set="about" />
      <div className="col-span-12 md:col-span-6 lg:col-span-5">
        <Parallax speed={0.06}>
          <PhotoStack sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 80vw" />
        </Parallax>
      </div>

      <div className="col-span-12 flex flex-col gap-8 md:col-span-6 lg:col-span-6 lg:col-start-7">
        <SceneHeader index={sceneIndex("About")} title="About" />
        <SplitHeading className="font-display text-display">{`Hi, I'm ${firstName}.`}</SplitHeading>
        <p className="text-lead text-fg-muted">{about.shortBio}</p>
        <Reveal className="grid gap-3 sm:grid-cols-3" staggerChildren>
          {about.values.map((value, i) => (
            <div key={value.title} className="value-card">
              <span className="meta">{pad(i + 1)}</span>
              <p className="font-medium">{value.title}</p>
              <p className="text-sm text-fg-muted">{value.body}</p>
            </div>
          ))}
        </Reveal>
        <div className="flex flex-wrap items-center gap-6">
          <Magnetic>
            <TransitionLink href="/about" className="btn-pill" data-magnetic-inner>
              More about me →
            </TransitionLink>
          </Magnetic>
          <TransitionLink href="/resume" className="meta text-fg" data-cursor="link">
            <RollText text="Read the resume" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
