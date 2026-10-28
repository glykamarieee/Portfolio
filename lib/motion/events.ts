// "App ready" signal: fired by the Preloader as the lens opens, so intro
// animations (hero split text, etc.) start in sync with the reveal.
const READY_EVENT = "app:ready";
let ready = false;

export function markReady() {
  if (ready) return;
  ready = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

export function isReady() {
  return ready;
}

// Runs `callback` once the app is ready (immediately if it already is).
// Returns an unsubscribe function.
export function onReady(callback: () => void) {
  if (ready) {
    callback();
    return () => {};
  }
  window.addEventListener(READY_EVENT, callback, { once: true });
  return () => window.removeEventListener(READY_EVENT, callback);
}
