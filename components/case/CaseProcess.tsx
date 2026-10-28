"use client";

import { useRef, useState } from "react";
import type { Project } from "@/content";
import { MediaImage } from "@/components/ui/MediaImage";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { pad } from "@/lib/format";
import { cn } from "@/lib/cn";

type Step = NonNullable<Project["process"]>[number];

// Case-study process: steps scroll on the left while a sticky frame on the
// right crossfades to each step's image. On mobile each image sits inline.
export function CaseProcess({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-step]", ref.current).forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
  });

  return (
    <div ref={ref} className="grid gap-12 md:grid-cols-2 md:gap-(--gutter)">
      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li
            key={step.title}
            data-step
            className={cn(
              "flex flex-col gap-4 border-t border-line py-10 transition-opacity duration-(--dur-fast) md:min-h-[60svh]",
              i !== active && "md:opacity-40",
            )}
          >
            <p className="meta">
              {pad(i + 1)} / {pad(steps.length)}
            </p>
            <h3 className="font-display text-h2 font-semibold">{step.title}</h3>
            <p className="text-lead text-fg-muted">{step.body}</p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm md:hidden">
              <MediaImage media={step.media} sizes="100vw" />
            </div>
          </li>
        ))}
      </ol>

      <div className="hidden md:block">
        <div className="sticky top-28 aspect-[4/3] overflow-hidden rounded-sm bg-bg-elev">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={cn(
                "absolute inset-0 transition-[opacity,scale] duration-(--dur-base) ease-(--ease-reveal)",
                i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
              )}
              aria-hidden={i !== active}
            >
              <MediaImage media={step.media} sizes="50vw" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
