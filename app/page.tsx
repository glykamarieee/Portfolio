import { site } from "@/content";
import { Reveal } from "@/components/ui/Reveal";

// Phase 1 foundation page: verifies tokens, fonts, smooth scroll and
// ScrollTrigger. Each stub is replaced by its real scene in Phase 3.
const scenes = [
  { title: "Manifesto", note: "Words light up as you scroll" },
  { title: "About", note: "Three-layer portrait parallax" },
  { title: "Selected Work", note: "Pinned horizontal track" },
  { title: "Skills", note: "Draggable constellation" },
  { title: "Journey", note: "Experience + education timeline" },
  { title: "The Archive", note: "Certificates in depth layers" },
  { title: "Field Notes", note: "Adventures on a globe" },
  { title: "Resume", note: "The document assembles itself" },
  { title: "Contact", note: "Let's talk" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <>
      <section className="container-grid min-h-svh content-end gap-y-6 pb-16">
        <p className="meta col-span-12">(00) — {site.role}</p>
        <h1 className="font-display text-hero col-span-12 font-semibold">{site.name}</h1>
        <p className="text-lead col-span-12 text-fg-muted md:col-span-6">{site.positioning}</p>
        <p className="meta col-span-12 md:col-span-6 md:text-right">
          {site.location} · Scroll ↓
        </p>
      </section>

      {scenes.map((scene, i) => (
        <section
          key={scene.title}
          className="container-grid min-h-[70svh] content-center border-t border-line py-24"
        >
          <Reveal className="col-span-12 flex flex-col gap-6" staggerChildren>
            <p className="meta">
              ({pad(i + 1)}) — {scene.note}
            </p>
            <h2 className="font-display text-display font-semibold">{scene.title}</h2>
            <p className="meta">
              {pad(i + 1)} / {pad(scenes.length)} · coming in phase 3
            </p>
          </Reveal>
        </section>
      ))}

      <footer className="container-grid border-t border-line py-16">
        <p className="meta col-span-12">
          <span className="text-accent">●</span> Foundation ready · tokens · fonts · smooth scroll
        </p>
      </footer>
    </>
  );
}
