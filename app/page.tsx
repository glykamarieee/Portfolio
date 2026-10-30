import { AboutTeaser } from "@/components/scenes/AboutTeaser";
import { Archive } from "@/components/scenes/Archive";
import { Contact } from "@/components/scenes/Contact";
import { Hero } from "@/components/scenes/Hero";
import { Journey } from "@/components/scenes/Journey";
import { Manifesto } from "@/components/scenes/Manifesto";
import { ResumeMoment } from "@/components/scenes/ResumeMoment";
import { Skills } from "@/components/scenes/Skills";
import { Work } from "@/components/scenes/Work";
import { PageTransition } from "@/components/system/PageTransition";
import { SceneCounter } from "@/components/system/SceneCounter";

// The main scroll story (DESIGN.md §9). Order matches components/scenes/registry.ts;
// SceneCounter stays last so every pin above it is measured first.
export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Manifesto />
      <AboutTeaser />
      <Work />
      <Skills />
      <Journey />
      <Archive />
      <ResumeMoment />
      <Contact />
      <SceneCounter />
    </PageTransition>
  );
}
