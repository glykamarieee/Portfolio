"use client";

import { RollText } from "./RollText";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="chip" data-cursor="link">
      <RollText text="Print" />
    </button>
  );
}
