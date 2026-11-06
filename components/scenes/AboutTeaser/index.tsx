import { about, site } from "@/content";
import { LocalTime } from "@/components/system/LocalTime";
import { TransitionLink } from "@/components/system/TransitionLink";
import { Decor } from "@/components/ui/Decor";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { RollText } from "@/components/ui/RollText";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { pad } from "@/lib/format";
import { sceneIndex } from "../registry";
import { CrewPass } from "./CrewPass";

const firstName = site.name.split(" ")[0];

// Scene 2 — hello. A film-crew lanyard pass hangs on the left (it swings with
// the pointer and flips to the values); on the right the greeting, the short
// bio, three quick facts and what I'm learning right now.
export function AboutTeaser() {
  return (
    <section data-scene="About" className="container-grid relative isolate items-center gap-y-16 overflow-x-clip py-32">
      <Decor set="about" />
      <div className="col-span-12 md:col-span-6 lg:col-span-5">
        <CrewPass />
      </div>

      <div className="col-span-12 flex flex-col gap-8 md:col-span-6 lg:col-span-6 lg:col-start-7">
        <SceneHeader index={sceneIndex("About")} title="About" />
        <SplitHeading className="font-display text-display">{`Hi, I'm ${firstName}.`}</SplitHeading>
        <p className="text-lead text-fg-muted">{about.shortBio}</p>

        <Reveal className="about-facts" staggerChildren>
          <div className="about-fact">
            <span className="about-fact-value font-display">{pad(about.yearsCreating)}+</span>
            <span className="meta">Years creating</span>
          </div>
          <div className="about-fact">
            <span className="about-fact-value font-display">03</span>
            <span className="meta">Crafts, one eye</span>
          </div>
          <div className="about-fact">
            <span className="about-fact-value font-display">
              <LocalTime timeZone={site.timeZone} />
            </span>
            <span className="meta">In {site.location.split(",")[0]} now</span>
          </div>
        </Reveal>

        <p className="about-learning">
          <span className="meta">Now learning</span>
          {about.currentlyLearning.map((skill) => (
            <span key={skill} className="about-learning-chip">
              {skill}
            </span>
          ))}
          <span className="about-caret" aria-hidden="true" />
        </p>

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
