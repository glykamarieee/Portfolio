// Small display helpers shared by scenes and pages.

export const pad = (n: number, size = 2) => String(n).padStart(size, "0");

/** "2025-04" → "Apr 2025"; "present" → "Present" */
export function formatMonth(iso: string) {
  if (iso === "present") return "Present";
  const [year, month] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const yearOf = (iso: string) => iso.slice(0, 4);

/** seconds → "00:01:12:05" (hh:mm:ss:ff at 24fps) */
export function timecode(seconds: number) {
  const frames = Math.floor((seconds % 1) * 24);
  const s = Math.floor(seconds);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60, frames].map((n) => pad(n)).join(":");
}

/** Splits "plain *emphasised* plain" into segments. */
export function parseEmphasis(text: string) {
  return text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("*") ? { text: part.slice(1, -1), em: true } : { text: part, em: false },
    );
}

/** "Glyka Marie Amahan" → "GA" (first and last word) */
export function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}
