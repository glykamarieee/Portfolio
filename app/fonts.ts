import { Archivo, Geist, Geist_Mono } from "next/font/google";

// Display: Archivo variable with the width axis, used heavy + condensed +
// uppercase (see .font-display in app/globals.css) for the bold poster look.
export const displayFont = Archivo({
  variable: "--font-display-face",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const sansFont = Geist({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

export const monoFont = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});
