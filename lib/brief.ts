import { CRAFTS, type Craft } from "@/components/ui/CraftChip";

// A project brief picked in the "Let's work together" viewfinder, carried to
// the contact form on the home page as query params (?need=Code,Cut&for=…).

export const BRIEF_FOR = ["A website", "A brand film", "An event", "Something new"] as const;
export type BriefFor = (typeof BRIEF_FOR)[number];

export function briefHref(need: Craft[], purpose: BriefFor) {
  const params = new URLSearchParams({ for: purpose });
  if (need.length) params.set("need", need.join(","));
  return `/?${params}#contact`;
}

// Reads the brief back, ignoring anything that isn't a known craft or purpose
export function readBrief(search: string): { need: Craft[]; purpose?: BriefFor } | null {
  const params = new URLSearchParams(search);
  const need = (params.get("need") ?? "")
    .split(",")
    .filter((c): c is Craft => (CRAFTS as readonly string[]).includes(c));
  const purpose = BRIEF_FOR.find((p) => p === params.get("for"));
  return need.length || purpose ? { need, purpose } : null;
}
