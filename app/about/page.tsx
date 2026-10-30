import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { about, certificates, projects, site, skillCategories, skills } from "@/content";
import { PageTransition } from "@/components/system/PageTransition";
import { TransitionLink } from "@/components/system/TransitionLink";
import { WorkTogether } from "@/components/system/WorkTogether";
import { CountUp } from "@/components/ui/CountUp";
import { PhotoStack } from "@/components/ui/PhotoStack";
import { Reveal } from "@/components/ui/Reveal";
import { ScrubText } from "@/components/ui/ScrubText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Tilt } from "@/components/ui/Tilt";
import { pad } from "@/lib/format";
import { Decor } from "@/components/ui/Decor";

export const metadata: Metadata = {
  title: "About",
  description: about.shortBio,
};

const stats = [
  { label: "Years creating", value: about.yearsCreating },
  { label: "Projects shipped", value: projects.length },
  { label: "Tools in the kit", value: skills.length },
  { label: "Certificates", value: certificates.length },
];

// Value cards are little covers, like the hero's: one swatch each, tilted
const SWATCHES = ["green", "ink", "pink", "yellow"] as const;
const TILTS = [-3, 2, -2, 3];

// /about — greeting + photo stack, the long bio lighting up as you scroll,
// numbers as cards, values as tilted covers, crafts, learning/fun facts,
// and two next steps.
export default function AboutPage() {
  return (
    <PageTransition>
      {/* Intro */}
      <section className="container-grid relative isolate items-start gap-y-14 pt-36 pb-24">
        <Decor set="aboutPage" />
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
          <p className="meta">(About) — {site.role}</p>
          <SplitHeading as="h1" by="words" trigger="ready" className="font-display text-hero">
            {`Hi, I'm ${site.name}.`}
          </SplitHeading>
          <ul className="flex flex-wrap gap-2">
            {[site.role, site.location, ...skillCategories.map((c) => c.name)].map((chip) => (
              <li key={chip} className="about-chip">
                {chip}
              </li>
            ))}
          </ul>
          <p className="text-lead mt-4 max-w-[34ch] text-fg-muted">{about.shortBio}</p>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-9 lg:pt-10">
          <PhotoStack sizes="(min-width: 1024px) 30vw, 70vw" />
          <p className="meta mt-8 text-center">Hover the photo — there&apos;s another me underneath.</p>
        </div>
      </section>

      {/* Long bio */}
      <section className="container-grid gap-y-10 py-24">
        <p className="meta col-span-12 lg:col-span-3">(01) — My story</p>
        <div className="col-span-12 flex flex-col gap-10 lg:col-span-8 lg:col-start-5">
          {about.longBio.map((paragraph, i) => (
            <ScrubText key={i} className="font-display text-h2">
              {paragraph}
            </ScrubText>
          ))}
        </div>
      </section>

      {/* By the numbers */}
      <section className="container-grid gap-y-10 py-24">
        <p className="meta col-span-12">(02) — By the numbers</p>
        <Reveal className="col-span-12 grid grid-cols-2 gap-3 md:grid-cols-4" staggerChildren>
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="font-display text-display">
                <CountUp value={stat.value} />
              </span>
              <span className="meta">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Values */}
      <section className="container-grid gap-y-10 py-24">
        <div className="col-span-12 flex flex-wrap items-end justify-between gap-4">
          <p className="meta">(03) — How I work</p>
          <p className="meta">Hover to straighten</p>
        </div>
        <ul className="col-span-12 grid gap-6 md:grid-cols-3">
          {about.values.map((value, i) => (
            <li key={value.title} style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}>
              <Tilt className={`value-cover is-${SWATCHES[i % SWATCHES.length]}`}>
                <span className="meta">{pad(i + 1)}</span>
                <div>
                  <h2 className="font-display text-h2">{value.title}</h2>
                  <p className="mt-3">{value.body}</p>
                </div>
              </Tilt>
            </li>
          ))}
        </ul>
      </section>

      {/* Learning + fun facts */}
      <section className="container-grid gap-y-12 py-24">
        <div className="col-span-12 flex flex-col gap-6 md:col-span-5">
          <p className="meta">(04) — Currently learning</p>
          <Reveal className="flex flex-wrap gap-2" staggerChildren>
            {about.currentlyLearning.map((item) => (
              <span key={item} className="learning-pill">
                <span className="status-dot" aria-hidden="true" />
                {item}
              </span>
            ))}
          </Reveal>
        </div>
        <div className="col-span-12 flex flex-col gap-6 md:col-span-6 md:col-start-7">
          <p className="meta">(05) — Fun facts</p>
          <Reveal className="grid gap-3" staggerChildren>
            {about.funFacts.map((fact, i) => (
              <p key={i} className="fact-card">
                <span className="meta">{pad(i + 1)}</span>
                <span className="text-lead">{fact}</span>
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Next steps */}
      <section className="container-grid gap-y-6 pt-12 pb-32">
        <p className="meta col-span-12">(06) — Keep going</p>
        <NextCard
          href="/#work"
          kicker="Selected work"
          title="See what I've built"
          className="col-span-12 md:col-span-6"
        />
        <NextCard
          href="/resume"
          kicker="Resume"
          title="The whole story, one page"
          className="col-span-12 md:col-span-6"
        />
      </section>
      <WorkTogether />
    </PageTransition>
  );
}

function NextCard({
  href,
  kicker,
  title,
  className,
}: {
  href: string;
  kicker: string;
  title: string;
  className: string;
}) {
  return (
    <TransitionLink href={href} className={`next-card group ${className}`} data-cursor="link">
      <span className="meta">{kicker}</span>
      <span className="flex items-end justify-between gap-6">
        <span className="font-display text-h2">{title}</span>
        <span className="next-card-arrow" aria-hidden="true">
          →
        </span>
      </span>
    </TransitionLink>
  );
}
