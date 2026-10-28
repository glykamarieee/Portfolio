import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <PageStub title="About" note="(About) — coming in phase 3b" />;
}
