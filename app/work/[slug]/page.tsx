import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { projects } from "@/content";
import { CaseProcess } from "@/components/case/CaseProcess";
import { PageTransition } from "@/components/system/PageTransition";
import { TransitionLink } from "@/components/system/TransitionLink";
import { CountUp } from "@/components/ui/CountUp";
import { MediaImage } from "@/components/ui/MediaImage";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RollText } from "@/components/ui/RollText";
import { ScrubText } from "@/components/ui/ScrubText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { pad } from "@/lib/format";
import { Decor } from "@/components/ui/Decor";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.problem } : {};
}

// Case study: hero media → overview → challenge → process (sticky image
// sequence) → outcome/metrics → next project (lens transition).
// The params read sits behind Suspense so the route's shell stays URL-independent
// (instant navigation); every slug is still prerendered via generateStaticParams.
export default function WorkPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-svh" />}>
        <CaseStudy params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function CaseStudy({ params }: Pick<PageProps<"/work/[slug]">, "params">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      {/* Hero */}
      <section className="container-grid gap-y-8 pt-40 pb-16 relative isolate">
        <Decor set="caseStudy" />
        <p className="meta col-span-12">
          ({pad(index + 1)}) — Case study · {project.year}
        </p>
        <SplitHeading as="h1" by="chars" trigger="ready" className="font-display text-hero col-span-12 font-semibold">
          {project.title}
        </SplitHeading>
        <dl className="meta col-span-12 grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
          <div>
            <dt>Role</dt>
            <dd className="mt-2 text-fg">{project.role}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd className="mt-2 text-fg">{project.year}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd className="mt-2 text-fg">{project.stack.join(" · ")}</dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd className="mt-2 flex gap-4">
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" className="link-underline text-accent-fg" data-cursor="link">
                  Live ↗
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer" className="link-underline text-accent-fg" data-cursor="link">
                  Code ↗
                </a>
              )}
              {!project.url && !project.repo && <span className="text-fg">—</span>}
            </dd>
          </div>
        </dl>
      </section>

      <div className="overflow-hidden px-(--page-margin)">
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-bg-elev">
          <Parallax speed={0.08} className="absolute -inset-y-[10%] inset-x-0">
            <MediaImage media={project.cover} sizes="100vw" eager />
          </Parallax>
        </div>
      </div>

      {/* Overview + challenge */}
      <section className="container-grid gap-y-16 py-32">
        <h2 className="meta col-span-12 md:col-span-3">(01) — Overview</h2>
        <ScrubText className="font-display text-h2 col-span-12 font-semibold md:col-span-9">
          {project.overview ?? project.problem}
        </ScrubText>
        {project.challenge && (
          <>
            <h2 className="meta col-span-12 md:col-span-3">(02) — Challenge</h2>
            <ScrubText className="text-lead col-span-12 md:col-span-8">{project.challenge}</ScrubText>
          </>
        )}
      </section>

      {/* Process */}
      {project.process && project.process.length > 0 && (
        <section className="container-grid gap-y-10 pb-32">
          <h2 className="meta col-span-12">(03) — Process</h2>
          <div className="col-span-12">
            <CaseProcess steps={project.process} />
          </div>
        </section>
      )}

      {/* Outcome */}
      <section className="container-grid gap-y-12 border-t border-line py-32">
        <h2 className="meta col-span-12 md:col-span-3">(04) — Outcome</h2>
        <Reveal className="col-span-12 md:col-span-9">
          <p className="font-display text-h2 font-semibold">{project.outcome}</p>
        </Reveal>
        {project.metrics && (
          <dl className="col-span-12 grid gap-10 sm:grid-cols-3 md:col-span-9 md:col-start-4">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col-reverse gap-2 border-t border-line pt-6">
                <dt className="meta">{metric.label}</dt>
                <dd className="font-display text-display font-semibold">
                  <CountUp value={metric.value} />
                  {metric.suffix}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* Next project */}
      <section className="border-t border-line">
        <TransitionLink
          href={`/work/${next.slug}`}
          className="container-grid group gap-y-6 py-32"
          data-cursor="view"
          data-cursor-label="Next"
          data-cursor-media={next.cover.src}
        >
          <span className="meta col-span-12">Next project</span>
          <span className="font-display text-hero col-span-12 font-semibold transition-colors duration-(--dur-fast) group-hover:text-accent-fg">
            {next.title}
          </span>
          <span className="meta col-span-12">
            <RollText text={`${next.role} · ${next.year} →`} />
          </span>
        </TransitionLink>
      </section>
    </>
  );
}
