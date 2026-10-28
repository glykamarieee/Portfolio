import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

// Display face is a placeholder for Clash Display (DESIGN.md §3). To swap:
// drop the .woff2 files in app/fonts/ and replace this with next/font/local.
export const displayFont = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin"],
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
