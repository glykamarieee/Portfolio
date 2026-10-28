"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type TransitionLinkProps = ComponentProps<typeof Link>;

// next/link that tags the navigation with the "lens" transition type and
// records the click point as the lens origin. Keyboard activation opens from
// the viewport center.
export function TransitionLink({ onClick, ...props }: TransitionLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const keyboard = e.detail === 0;
    const root = document.documentElement.style;
    root.setProperty("--lens-x", `${keyboard ? window.innerWidth / 2 : e.clientX}px`);
    root.setProperty("--lens-y", `${keyboard ? window.innerHeight / 2 : e.clientY}px`);
    onClick?.(e);
  };

  return <Link {...props} transitionTypes={["lens"]} onClick={handleClick} />;
}
