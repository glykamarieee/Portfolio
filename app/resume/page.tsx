import type { Metadata } from "next";
import type { ReactNode } from "react";
import { about, certificates, education, experience, projects, site, skillCategories, skills } from "@/content";
import { PageTransition } from "@/components/system/PageTransition";
import { WorkTogether } from "@/components/system/WorkTogether";
import { Magnetic } from "@/components/ui/Magnetic";
import { MediaImage } from "@/components/ui/MediaImage";
import { PrintButton } from "@/components/ui/PrintButton";
import { Reveal } from "@/components/ui/Reveal";
import { formatMonth, telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resume",
  description: `${site.name} — ${site.role}. Experience, education, skills and certificates.`,
};

// /resume — calm, recruiter-friendly and print-ready, generated from /content.
// A sticky profile card (contacts, downloads, skills) beside the sections as
// cards. styles/print.css strips the site chrome and card styling when printing.
export default function ResumePage() {
  return (
    <PageTransition>
      <div className="resume-page">
        <aside className="resume-profile">
          <div className="resume-photo">
            <MediaImage media={about.portrait} sizes="96px" quality={90} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="meta">(Resume)</p>
            <h1 className="font-display text-h2">{site.name}</h1>
            <p className="text-fg-muted">
              {site.role} · {site.location}
            </p>
            {site.available && (
              <p className="resume-available">
                <span className="status-dot" aria-hidden="true" />
                Open to projects
              </p>
            )}
          </div>

          <ul className="resume-contacts">
            <li>
              <span className="meta">Email</span>
              <a href={`mailto:${site.email}`} className="link-underline" data-cursor="link">
                {site.email}
              </a>
            </li>
            <li>
              <span className="meta">Phone</span>
              <a href={telHref(site.phone)} className="link-underline" data-cursor="link">
                {site.phone}
              </a>
            </li>
            {site.socials.map((social) => (
              <li key={social.href}>
                <span className="meta">{social.label}</span>
                <a href={social.href} target="_blank" rel="noreferrer" className="link-underline" data-cursor="link">
                  {social.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </li>
            ))}
          </ul>

          <div className="print-hide flex flex-wrap gap-2">
            <Magnetic>
              <a href={site.resumePdf} download className="btn-pill" data-magnetic-inner>
                Download PDF ↓
              </a>
            </Magnetic>
            <PrintButton />
          </div>

          <div className="flex flex-col gap-4 border-t border-line pt-6">
            <p className="meta">Skills</p>
            {skillCategories.map((category) => (
              <div key={category.name} className="flex flex-col gap-2">
                <p className="text-sm font-medium">{category.name}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {skills
                    .filter((s) => s.category === category.name)
                    .map((s) => (
                      <li key={s.name} className="resume-skill">
                        {s.name}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <Section title="Profile">
            <p className="text-lead">{about.shortBio}</p>
          </Section>

          <Section title="Experience">
            <ol className="resume-timeline">
              {experience.map((job) => (
                <Entry
                  key={`${job.organization}-${job.start}`}
                  title={job.role}
                  subtitle={[job.organization, job.location].filter(Boolean).join(" · ")}
                  dates={`${formatMonth(job.start)} — ${formatMonth(job.end)}`}
                  points={job.achievements}
                />
              ))}
            </ol>
          </Section>

          <Section title="Education">
            <ol className="resume-timeline">
              {education.map((school) => (
                <Entry
                  key={school.school}
                  title={school.program}
                  subtitle={school.school}
                  dates={`${school.start} — ${school.end === "present" ? "Present" : school.end}`}
                  points={[...(school.honors ?? []), ...(school.highlights ?? [])]}
                />
              ))}
            </ol>
          </Section>

          <Section title="Selected projects">
            <ul className="grid gap-3 sm:grid-cols-2">
              {projects
                .filter((p) => p.featured)
                .map((project) => (
                  <li key={project.slug} className="resume-project">
                    <span className="meta">
                      {project.year} · {project.role}
                    </span>
                    <span className="font-medium">{project.title}</span>
                    <span className="text-sm text-fg-muted">{project.outcome}</span>
                    <span className="text-sm text-fg-muted">{project.stack.join(" · ")}</span>
                  </li>
                ))}
            </ul>
          </Section>

          <Section title="Certificates">
            <ul className="flex flex-col">
              {certificates.map((cert) => (
                <li key={cert.id} className="resume-cert">
                  <span>
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                        data-cursor="link"
                      >
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
        </div>
      </div>
      <WorkTogether />
    </PageTransition>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal className="resume-section">
      <h2 className="resume-section-title">{title}</h2>
      {children}
    </Reveal>
  );
}

function Entry({
  title,
  subtitle,
  dates,
  points,
}: {
  title: string;
  subtitle: string;
  dates: string;
  points: string[];
}) {
  return (
    <li className="resume-entry">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-lead font-medium">{title}</h3>
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
    </li>
  );
}
