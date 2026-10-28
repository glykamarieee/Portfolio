// Reads a design-token color (CSS custom property) as [r, g, b] in 0–1,
// so WebGL shaders use the same palette as the CSS. Any CSS color syntax works.
export function tokenColor(name: string, fallback: [number, number, number]): [number, number, number] {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) return fallback;

  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = value;
  const normalized = ctx.fillStyle; // "#rrggbb" or "rgba(r, g, b, a)"

  if (normalized.startsWith("#")) {
    const n = parseInt(normalized.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const [r, g, b] = normalized.match(/[\d.]+/g)?.map(Number) ?? [];
  return r === undefined ? fallback : [r / 255, g / 255, b / 255];
}
