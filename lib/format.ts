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

export function formatCoords({ lat, lng }: { lat: number; lng: number }) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
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
