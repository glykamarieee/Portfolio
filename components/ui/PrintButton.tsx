"use client";

import { RollText } from "./RollText";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="copy-email" data-cursor="link">
      <RollText text="Print" />
    </button>
  );
}
