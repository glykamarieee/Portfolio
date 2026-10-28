import { PageTransition } from "@/components/system/PageTransition";
import { TransitionLink } from "@/components/system/TransitionLink";
import { RollText } from "./RollText";
import { SplitHeading } from "./SplitHeading";

// Temporary sub-page body until Phase 3b builds the real page.
export function PageStub({ title, note }: { title: string; note: string }) {
  return (
    <PageTransition>
      <section className="container-grid min-h-svh content-center gap-y-8 bg-bg">
        <p className="meta col-span-12">{note}</p>
        <SplitHeading as="h1" by="chars" className="font-display text-hero col-span-12 font-semibold">
          {title}
        </SplitHeading>
        <TransitionLink href="/" className="meta col-span-12 text-fg" data-cursor="link">
          <RollText text="← Back home" />
        </TransitionLink>
      </section>
    </PageTransition>
  );
}
