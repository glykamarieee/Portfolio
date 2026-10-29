import type { Metadata } from "next";
import { about, adventures, certificates, projects, site } from "@/content";
import { PageTransition } from "@/components/system/PageTransition";
import { TransitionLink } from "@/components/system/TransitionLink";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { CountUp } from "@/components/ui/CountUp";
import { LensImage } from "@/components/ui/LensImage";
import { Magnetic } from "@/components/ui/Magnetic";
import { MediaImage } from "@/components/ui/MediaImage";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RollText } from "@/components/ui/RollText";
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
  { label: "Countries explored", value: new Set(adventures.map((a) => a.country)).size },
  { label: "Certificates", value: certificates.length },
];

// /about — portrait that stays put (sticky) while the long bio lights up word
// by word, then numbers, values, learning/fun facts, a travel strip and a CTA.
export default function AboutPage() {
  return (
    <PageTransition>
      {/* Intro */}
      <section className="container-grid gap-y-12 pt-40 pb-24 relative isolate">
        <Decor set="aboutPage" />
        <p className="meta col-span-12">(About) — {site.role}</p>
        <SplitHeading as="h1" by="chars" trigger="ready" className="font-display text-hero col-span-12 font-semibold">
          About me
        </SplitHeading>

        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-28">
            <LensImage
              base={about.portrait}
              reveal={about.portraitAlt}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/5] overflow-hidden rounded-sm"
            />
            <p className="meta mt-4">Hover the photo — there&apos;s another me underneath.</p>
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-12 md:col-span-6 md:col-start-7">
          <p className="font-display text-h2 font-semibold">{about.shortBio}</p>
          {about.longBio.map((paragraph, i) => (
            <ScrubText key={i} className="text-lead">
              {paragraph}
            </ScrubText>
          ))}
        </div>
      </section>

      {/* By the numbers */}
      <section className="container-grid gap-y-10 border-t border-line py-24">
        <p className="meta col-span-12">(01) — By the numbers</p>
        <dl className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-2">
              <dt className="meta">{stat.label}</dt>
              <dd className="font-display text-display font-semibold">
                <CountUp value={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Values */}
      <section className="container-grid gap-y-10 border-t border-line py-24">
        <p className="meta col-span-12">(02) — How I work</p>
        <ul className="col-span-12 grid gap-6 md:grid-cols-3">
          {about.values.map((value, i) => (
            <li key={value.title}>
              <Tilt className="flex h-full flex-col gap-10 rounded-sm border border-line bg-bg-elev p-8">
                <span className="meta">{pad(i + 1)}</span>
                <div>
                  <h2 className="font-display text-h2 font-semibold">{value.title}</h2>
                  <p className="mt-3 text-fg-muted">{value.body}</p>
                </div>
              </Tilt>
            </li>
          ))}
        </ul>
      </section>

      {/* Learning + fun facts */}
      <section className="container-grid gap-y-12 border-t border-line py-24">
        <Reveal className="col-span-12 md:col-span-5" staggerChildren>
          <p className="meta mb-6">(03) — Currently learning</p>
          {about.currentlyLearning.map((item) => (
            <p key={item} className="font-display text-h2 font-semibold">
              {item}
            </p>
          ))}
        </Reveal>
        <Reveal className="col-span-12 md:col-span-6 md:col-start-7" staggerChildren>
          <p className="meta mb-6">(04) — Fun facts</p>
          {about.funFacts.map((fact, i) => (
            <p key={i} className="text-lead border-b border-line py-4 text-fg-muted">
              {fact}
            </p>
          ))}
        </Reveal>
      </section>

      {/* Travel strip */}
      <section className="overflow-x-clip border-t border-line py-24">
        <div className="container-grid mb-10 items-end gap-y-4">
          <p className="meta col-span-12 md:col-span-6">(05) — Off screen</p>
          <TransitionLink href="/adventures" className="meta col-span-12 text-fg md:col-span-6 md:text-right" data-cursor="link">
            <RollText text="See the adventures →" />
          </TransitionLink>
        </div>
        <ul className="flex gap-(--gutter) px-(--page-margin)">
          {adventures.map((trip, i) => (
            <li key={trip.slug} className="w-[70vw] shrink-0 md:w-[30vw]">
              <Parallax speed={i % 2 ? 0.12 : -0.08}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <MediaImage media={trip.cover} sizes="(min-width: 768px) 30vw, 70vw" />
                </div>
                <p className="meta mt-3">
                  {trip.place} · {trip.country}
                </p>
              </Parallax>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="container-grid gap-y-10 border-t border-line py-32">
        <SplitHeading className="font-display text-display col-span-12 font-semibold">
          Let&apos;s make something that moves.
        </SplitHeading>
        <div className="col-span-12 flex flex-wrap items-center gap-8">
          <Magnetic>
            <CopyEmail email={site.email} />
          </Magnetic>
          <TransitionLink href="/resume" className="meta text-fg" data-cursor="link">
            <RollText text="Read the resume →" />
          </TransitionLink>
        </div>
      </section>
    </PageTransition>
  );
}
