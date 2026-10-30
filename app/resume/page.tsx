import type { Metadata } from "next";
import type { ReactNode } from "react";
import { about, certificates, education, experience, projects, site, skills, type SkillCategory } from "@/content";
import { PageTransition } from "@/components/system/PageTransition";
import { Magnetic } from "@/components/ui/Magnetic";
import { PrintButton } from "@/components/ui/PrintButton";
import { Reveal } from "@/components/ui/Reveal";
import { formatMonth } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resume",
  description: `${site.name} — ${site.role}. Experience, education, skills and certificates.`,
};

const CATEGORIES: SkillCategory[] = ["Programming", "Editing", "Videography"];

// /resume — calm, recruiter-friendly and print-ready, generated from /content.
// styles/print.css strips the site chrome when printing.
export default function ResumePage() {
  return (
    <PageTransition>
      <article className="resume-page mx-auto flex max-w-4xl flex-col gap-16 px-(--page-margin) pt-40 pb-32">
        <header className="flex flex-col gap-6 border-b border-line pb-10">
          <p className="meta">(Resume)</p>
          <h1 className="font-display text-display font-semibold">{site.name}</h1>
          <p className="text-lead text-fg-muted">
            {site.role} · {site.location}
          </p>
          <ul className="meta flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href={`mailto:${site.email}`} className="link-underline text-fg" data-cursor="link">
                {site.email}
              </a>
            </li>
            {site.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="link-underline text-fg" data-cursor="link">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="print-hide flex flex-wrap gap-4">
            <Magnetic>
              <a href={site.resumePdf} download className="btn-pill" data-magnetic-inner>
                Download PDF ↓
              </a>
            </Magnetic>
            <PrintButton />
          </div>
        </header>

        <Section title="Profile">
          <p className="text-lead">{about.shortBio}</p>
        </Section>

        <Section title="Experience">
          {experience.map((job) => (
            <Entry
              key={`${job.organization}-${job.start}`}
              title={job.role}
              subtitle={[job.organization, job.location].filter(Boolean).join(" · ")}
              dates={`${formatMonth(job.start)} — ${formatMonth(job.end)}`}
              points={job.achievements}
            />
          ))}
        </Section>

        <Section title="Education">
          {education.map((school) => (
            <Entry
              key={school.school}
              title={school.program}
              subtitle={school.school}
              dates={`${school.start} — ${school.end === "present" ? "Present" : school.end}`}
              points={[...(school.honors ?? []), ...(school.highlights ?? [])]}
            />
          ))}
        </Section>

        <Section title="Selected projects">
          {projects
            .filter((p) => p.featured)
            .map((project) => (
              <Entry
                key={project.slug}
                title={project.title}
                subtitle={`${project.role} · ${project.stack.join(", ")}`}
                dates={String(project.year)}
                points={[project.outcome]}
              />
            ))}
        </Section>

        <Section title="Skills">
          <dl className="grid gap-6 sm:grid-cols-2">
            {CATEGORIES.map((category) => (
              <div key={category}>
                <dt className="meta">{category}</dt>
                <dd className="mt-2">
                  {skills
                    .filter((s) => s.category === category)
                    .map((s) => s.name)
                    .join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Certificates">
          <ul className="flex flex-col">
            {certificates.map((cert) => (
              <li key={cert.id} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-line py-3">
                <span>
                  {cert.credentialUrl ? (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="link-underline" data-cursor="link">
                      {cert.title}
                    </a>
                  ) : (
                    cert.title
                  )}{" "}
                  <span className="text-fg-muted">— {cert.issuer}</span>
                </span>
                <span className="meta">{formatMonth(cert.date)}</span>
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </PageTransition>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal className="resume-section grid gap-6 md:grid-cols-[12rem_1fr]">
      <h2 className="meta pt-1">{title}</h2>
      <div className="flex flex-col gap-8">{children}</div>
    </Reveal>
  );
}

function Entry({ title, subtitle, dates, points }: { title: string; subtitle: string; dates: string; points: string[] }) {
  return (
    <div className="resume-entry">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-lead font-semibold">{title}</h3>
        <span className="meta">{dates}</span>
      </div>
      <p className="text-fg-muted">{subtitle}</p>
      {points.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {points.map((point, i) => (
            <li key={i}>— {point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
