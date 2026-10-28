import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Adventures" };

export default function AdventuresPage() {
  return <PageStub title="Field Notes" note="(Adventures) — coming in phase 3b" />;
}
