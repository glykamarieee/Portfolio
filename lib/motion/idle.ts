// Runs `fn` when the main thread is idle (fallback: a short timeout).
// Returns a cancel function. Used to keep non-essential animation setup out
// of the hydration/first-paint long tasks.
export function whenIdle(fn: () => void, timeout = 1500) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 300);
  return () => clearTimeout(id);
}
