import type { CSSProperties } from "react";

export const CRAFTS = ["Code", "Cut", "Capture"] as const;
export type Craft = (typeof CRAFTS)[number];

// A small inline chip, sized in em, that names its craft visually: a code tag
// with a caret, a film strip in two halves, a viewfinder with a REC dot.
// Used in the hero headline and the Manifesto (styles: `.mchip` in scenes.css).
export function CraftChip({ craft, tilt = 0 }: { craft: Craft; tilt?: number }) {
  return (
    <span
      data-chip
      data-tilt={tilt}
      className={`mchip is-${craft.toLowerCase()}`}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
      aria-hidden="true"
    >
      {craft === "Code" && (
        <>
          <span className="mchip-code">&lt;/&gt;</span>
          <span className="mchip-caret" />
        </>
      )}
      {craft === "Cut" && (
        <>
          <span data-half className="mchip-half is-left" />
          <span data-half className="mchip-half is-right" />
        </>
      )}
      {craft === "Capture" && (
        <>
          <span className="mchip-corners" />
          <span className="mchip-rec" />
        </>
      )}
    </span>
  );
}
