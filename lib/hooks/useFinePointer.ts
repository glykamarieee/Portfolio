"use client";

import { useMediaQuery } from "./useMediaQuery";

// True on devices with a precise hovering pointer (mouse/trackpad).
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
