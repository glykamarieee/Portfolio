"use client";

import { useMemo, useSyncExternalStore } from "react";

const subscribe = (onTick: () => void) => {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
};

// Live clock in the given time zone. Renders "--:--" on the server.
export function LocalTime({ timeZone }: { timeZone: string }) {
  const format = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }),
    [timeZone],
  );
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(Date.now()),
    () => "--:--",
  );

  return <time>{time}</time>;
}
