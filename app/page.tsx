import { about, projects, site } from "@/content";
import { PageTransition } from "@/components/system/PageTransition";
import { TransitionLink } from "@/components/system/TransitionLink";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { LensText } from "@/components/ui/LensText";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Tilt } from "@/components/ui/Tilt";

// Phase 2 page: the hero intro plus a "lab" exercising every piece of the
// signature system. Phase 3 replaces the lab and stubs with the real scenes.
const scenes = [
  "Manifesto",
  "About",
  "Selected Work",
  "Skills",
  "Journey",
  "The Archive",
  "Field Notes",
  "Resume",
];

const pad = (n: number) => String(n).padStart(2, "0");
const PLACEHOLDER_MEDIA = "/media/placeholder.svg";

export default function Home() {
  return (
    <PageTransition>
      <section className="container-grid min-h-svh content-end gap-y-6 pb-16">
        <p className="meta col-span-12">
          <ScrambleText text={`(00) — ${site.role}`} />
        </p>
        <SplitHeading as="h1" by="chars" trigger="ready" className="font-display text-hero col-span-12 font-semibold">
          {site.name}
        </SplitHeading>
        <SplitHeading as="p" by="lines" trigger="ready" delay={0.3} className="text-lead col-span-12 text-fg-muted md:col-span-6">
          {site.positioning}
        </SplitHeading>
        <p className="meta col-span-12 md:col-span-6 md:text-right">{site.location} · Scroll ↓</p>
      </section>

      {/* Signature system lab */}
      <section className="container-grid gap-y-16 border-t border-line py-32">
        <p className="meta col-span-12">
          <ScrambleText text="(Lab) — The lens, try it" />
        </p>

        <div className="col-span-12">
          <p className="font-display text-display font-semibold">
            <LensText reveal="Look closer.">{about.shortBio.split(" ").slice(0, 3).join(" ")}</LensText>
          </p>
          <p className="meta mt-4">data-cursor=&quot;link&quot; · hover to reveal the hidden layer</p>
        </div>

        <ul className="col-span-12 grid gap-6 md:grid-cols-3" id="work">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <Tilt>
                <TransitionLink
                  href="/about"
                  data-cursor="view"
                  data-cursor-media={PLACEHOLDER_MEDIA}
                  className="flex aspect-[16/10] flex-col justify-between rounded-sm border border-line bg-bg-elev p-6"
                >
                  <span className="meta">
                    ({pad(i + 1)}) — {project.year}
                  </span>
                  <span className="font-display text-h2 font-semibold">{project.title}</span>
                </TransitionLink>
              </Tilt>
            </li>
          ))}
        </ul>

        <div
          className="col-span-12 flex h-48 items-center justify-center rounded-sm border border-dashed border-line md:col-span-6"
          data-cursor="drag"
        >
          <span className="meta">data-cursor=&quot;drag&quot;</span>
        </div>
        <div
          className="col-span-12 flex h-48 items-center justify-center rounded-sm border border-dashed border-line md:col-span-6"
          data-cursor="play"
          data-cursor-label="Play reel"
        >
          <span className="meta">data-cursor=&quot;play&quot;</span>
        </div>

        <div className="col-span-12 flex flex-wrap items-center gap-8">
          <Magnetic>
            <CopyEmail email={site.email} />
          </Magnetic>
          {site.socials.map((social) => (
            <a key={social.href} href={social.href} className="meta link-underline text-fg" data-cursor="link">
              {social.label}
            </a>
          ))}
        </div>
      </section>

      {scenes.map((scene, i) => (
        <section key={scene} className="container-grid min-h-[60svh] content-center border-t border-line py-24">
          <Reveal className="col-span-12 flex flex-col gap-6" staggerChildren>
            <p className="meta">
              ({pad(i + 1)}) — {pad(i + 1)} / {pad(scenes.length)}
            </p>
            <SplitHeading className="font-display text-display font-semibold">{scene}</SplitHeading>
            <p className="meta">Coming in phase 3</p>
          </Reveal>
        </section>
      ))}

      <section id="contact" className="container-grid min-h-svh content-center gap-y-8 border-t border-line">
        <SplitHeading by="chars" className="font-display text-hero col-span-12 font-semibold">
          Let&apos;s talk
        </SplitHeading>
        <div className="col-span-12">
          <Magnetic>
            <CopyEmail email={site.email} />
          </Magnetic>
        </div>
      </section>
    </PageTransition>
  );
}
