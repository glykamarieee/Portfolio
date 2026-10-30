import type { Metadata } from "next";
import { adventures } from "@/content";
import { AdventureReel } from "@/components/adventures/AdventureReel";
import { PageTransition } from "@/components/system/PageTransition";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { pad } from "@/lib/format";
import { Decor } from "@/components/ui/Decor";

export const metadata: Metadata = {
  title: "Adventures",
  description: "Field notes — cinematic films from days out around Cebu with friends.",
};

const areas = new Set(adventures.map((a) => a.area)).size;

export default function AdventuresPage() {
  return (
    <PageTransition>
      <section className="container-grid gap-y-8 pt-40 pb-12 relative isolate">
        <Decor set="adventures" />
        <p className="meta col-span-12">
          (Adventures) — {pad(adventures.length)} films · {pad(areas)} places around Cebu
        </p>
        <SplitHeading as="h1" by="chars" trigger="ready" className="font-display text-hero col-span-12 font-semibold">
          Field Notes
        </SplitHeading>
        <p className="text-lead col-span-12 text-fg-muted md:col-span-6">
          Days out around Cebu with friends — shot and edited by me. Scroll the reel, or switch to the grid.
        </p>
      </section>
      <AdventureReel />
    </PageTransition>
  );
}
