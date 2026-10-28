import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content";
import { PageStub } from "@/components/ui/PageStub";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: projects.find((p) => p.slug === slug)?.title };
}

// Case study template arrives in phase 3b.
export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <PageStub title={project.title} note={`(${project.year}) — case study coming in phase 3b`} />;
}
