import { Geist, Geist_Mono } from "next/font/google";

// Geist carries both body and display type (display = medium weight, tight
// tracking, sentence case — see .font-display in app/globals.css).
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
