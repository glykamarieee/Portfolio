<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Rules — Portfolio Experience

An immersive, scroll-driven portfolio. Read these before changing code:
- `PROMPT.md`: the full creative brief (what to build)
- `DESIGN.md`: the design system (tokens, motion, Lens cursor, scene specs)
- `PLAN.md`: the phased build plan and current scope

## Stack
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · GSAP + ScrollTrigger + SplitText (`@gsap/react`) · Lenis · React Three Fiber + drei · Motion (UI state only).

## Commands
- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build (must pass before committing)
- `npm run lint`: ESLint

## Structure
- `app/`: routes: `/`, `/about`, `/work/[slug]`, `/adventures`, `/resume`
- `components/scenes/`: one folder per home-page scene, each self-contained
- `components/ui/`: reusable primitives (MagneticLink, SplitHeading, ScrambleText, Marquee, Tag)
- `components/system/`: global systems (Cursor/Lens, SmoothScroll, Preloader, Grain, PageTransition)
- `components/webgl/`: R3F canvases, shaders, materials (always dynamic-imported)
- `lib/motion/`: the only place eases, durations, and timeline helpers are defined
- `lib/hooks/`: `usePrefersReducedMotion`, `useMediaQuery`, `usePointer`, etc.
- `content/`: typed data (projects, certificates, education, experience, skills, adventures, about, site). It's the single source of truth for every page, including `/resume`.
- `styles/tokens.css`: design tokens that mirror DESIGN.md
- `public/media/`: assets. `adventures/_raw/` is git-ignored raw footage.

## Rules
1. **Server components by default.** Add `"use client"` only for interactive or animated components.
2. **GSAP:** use `useGSAP` from `@gsap/react` (scoped and auto-cleaned). Register plugins once in `lib/motion`. Every ScrollTrigger must be cleaned up on unmount.
3. **Single RAF loop:** Lenis is driven by `gsap.ticker`. Don't create other RAF loops, except R3F's own, which must pause offscreen.
4. **Motion tokens only:** import eases and durations from `lib/motion`. Don't use inline magic numbers.
5. **Design tokens only:** colors, spacing, type, and z-index come from `styles/tokens.css` / Tailwind theme.
6. **Cursor:** opt in with `data-cursor="link|view|play|drag|text|magnetic|hide"`. Don't build one-off cursor logic.
7. **Reduced motion:** every scene needs a `prefers-reduced-motion` path (no pin, no parallax, no smooth scroll).
8. **Performance:** animate only transform/opacity/clip-path/filter. Dynamic-import WebGL, matter.js, and heavy scenes. Use `next/image` for images. Videos are `muted playsinline preload="none"` with a poster.
9. **Accessibility:** semantic HTML, a visible focus state, keyboard-operable overlays, alt text, and content must not be hidden behind animation.
10. **Content:** never hard-code personal data in components. Read it from `content/`.
11. **Pages & links:** wrap every `page.tsx` body in `<PageTransition>`; use `<TransitionLink>` (not bare `next/link`) for internal links so navigations get the lens wipe.
12. **Late GSAP tweens:** tweens created after the `useGSAP` callback returns (in promises, timers, event handlers) must be wrapped in `contextSafe` so cleanup kills them. Only pass `scope` to `useGSAP` when using selector strings.
13. **Intro animations:** start them with `onReady()` from `lib/motion` (fired when the preloader opens), not on mount.

## Definition of done (per scene)
Passes the checklist in DESIGN.md §13, `npm run build` succeeds, and it has been checked at 375 / 768 / 1440 / 1920.
