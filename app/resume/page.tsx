import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return <PageStub title="Resume" note="(Resume) — coming in phase 3b" />;
}
