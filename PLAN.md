# Portfolio Website — Master Prompt + Build Plan

## Context
You want a portfolio that feels like an **interactive digital experience**, not a page of cards: scroll-driven storytelling, pinned scenes, smooth scroll, a signature cursor/micro-interaction system, atmospheric visual effects, and a multi-layer parallax showcase for certificates. Use the *feel* of horizonx.so and getlayers.ai as references: cinematic pacing, dark atmospheric palettes, big type, depth, and polish. Don't copy their layouts or assets.

There's no existing project yet (the working dir is `C:\Users\glyka`), so this is a greenfield build. The project will live in `C:\Users\glyka\portfolio`.

Part 1 is the **master prompt**. You can paste it into Claude (or any builder) to generate the site, and the build follows it. Part 2 is the **execution plan**.

---

## Part 1 — MASTER PROMPT (copy-paste ready)

```
ROLE
You are a senior creative developer + motion designer (Awwwards / FWA level).
Build my personal portfolio as an immersive, scroll-driven digital experience —
not a traditional portfolio. Every section is a "scene"; scrolling is the
timeline. Mood references: horizonx.so and getlayers.ai (cinematic pacing,
dark atmospheric palettes, oversized typography, depth, restraint). Take
inspiration from their FEEL only — no copied layouts, copy, or assets.

ABOUT ME (fill in)
- Name: [NAME]  · Role: [e.g. Frontend Developer / UI Designer]
- One-line positioning: [e.g. "I build interfaces that feel alive."]
- Projects (4–6): title, year, role, stack, 1-line problem, 1-line outcome, link, media
- Certificates (6–15): title, issuer, date, credential URL, image
- Education: school, degree/strand, years, honors, highlights
- Experience: company/org, role, dates, 2–3 achievements each
- Skills/tools grouped by category, with an optional proficiency level
- About: bio (short + long), portrait photos, values, fun facts, currently-learning
- Travel & adventures: videos + photos, each with place, country, date,
  lat/lng, 1-line story
- Socials, email, resume PDF

TECH STACK (non-negotiable)
- Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS v4
- GSAP 3 + ScrollTrigger + SplitText (all free now) for scroll choreography
- Lenis for smooth scroll, synced to GSAP's ticker (single RAF loop)
- React Three Fiber + drei (or OGL if lighter) for WebGL hero/atmosphere,
  custom GLSL shaders; lazy-loaded, never blocks first paint
- Motion (framer-motion) only for component-level UI state transitions
- Content in typed local files (/content/*.ts) — no CMS needed yet
- Deploy: Vercel

ARCHITECTURE
- /app            routes: / (the main scroll experience), /about,
                  /work/[slug] (case studies), /adventures (travel film reel),
                  /resume (web resume + PDF download)
- /components/scenes   one folder per scene (Hero, Manifesto, Work, ...)
- /components/ui       Button, MagneticLink, SplitHeading, Marquee, Tag
- /components/system   Cursor, SmoothScroll, Preloader, Grain, PageTransition
- /components/webgl    Canvas root, shaders, materials
- /lib/motion     shared eases, durations, timeline factories, useGsap hook
- /lib/hooks      usePrefersReducedMotion, useMediaQuery, usePointer
- /content        site.ts, about.ts, projects.ts, certificates.ts,
                  education.ts, experience.ts, skills.ts, adventures.ts
- /styles         tokens.css (color, type scale, spacing, z-index, motion tokens)
Rules: every scene is self-contained (own ScrollTrigger, cleaned up on
unmount via gsap.context). There is ONE motion vocabulary in /lib/motion: no ad-hoc
easings. Server components by default, "use client" only where interactive.

SIGNATURE INTERACTION SYSTEM — "THE LENS"
One concept that ties the whole site together: the cursor is a lens.
- Default: small dot + lagging ring (lerped), blend-mode difference.
- Over text links: ring expands and the text under it reveals an alternate
  layer (e.g. outline → filled, or a hidden word) via a CSS clip-path mask
  that follows the pointer.
- Over projects: lens grows into a circular "preview window" showing the
  project video/image with slight WebGL distortion (RGB shift on velocity).
- Over draggable areas: the lens shows "DRAG" and squashes in the drag direction.
- Over CTAs: magnetic pull (element + label move toward the pointer, spring back).
- Lens state is driven by data-cursor="link|view|drag|hide|text" attributes
  so any component opts in declaratively.
- The same lens motif reappears in the hero shader, section transitions
  (circular wipe), and the contact scene.
- Touch devices: cursor disabled. Lens behaviors become tap/press states
  and scroll-linked reveals.

MICRO-INTERACTIONS
- Magnetic buttons, letter-stagger hover on nav links, text scramble on
  labels, underline draw-in, hover-tilt on cards (max 6°), click ripple,
  copy-email-to-clipboard with morphing "Copied ✓" feedback, live local time
  + status dot in nav, scroll progress indicator, section index counter (01/07).

VISUAL EFFECTS & ATMOSPHERE
- Dark base (#0A0A0B-ish) with one vivid accent [pick: electric lime /
  ultraviolet / signal orange] + soft gradient light blooms.
- Animated film grain overlay (canvas or SVG noise, 3–5% opacity).
- WebGL hero: a fluid/noise gradient field that reacts to the pointer and
  scroll velocity. The lens distorts it.
- Subtle grid/coordinate lines, monospace meta-labels (index, year, coords).
- Depth via blur + scale + parallax, not drop shadows.
- Typography: one expressive display face (e.g. Clash Display / PP Neue
  Montreal / Satoshi variable) + one mono (JetBrains Mono / Geist Mono).
  Fluid type scale with clamp(); hero type ≥ 12vw on desktop.

SCENES (scroll story, in order)
0. PRELOADER — counter 0→100 tied to real asset loading, then the lens
   "opens" (circular clip-path reveal) into the hero.
1. HERO — name in giant split type, WebGL field behind, role line types in,
   scroll cue. On scroll: letters disperse/scale back in depth.
2. MANIFESTO (pinned) — 2–3 sentences about me. Words light up one by one
   as you scroll (scrubbed opacity/color), with key words swapping to images.
3. SELECTED WORK (pinned horizontal scroll) — vertical scroll drives a
   horizontal track of 4–6 large project panels. Each panel: parallax media,
   index number, title reveal, tags. Lens = "VIEW". Click → page transition
   (lens wipe) into /work/[slug].
2b. ABOUT TEASER — portrait split into 3 parallax layers (bg / me / fg
   cutout) with the lens revealing an alternate photo (e.g. work me →
   travel me). Links to the full /about page.
4. SKILLS — skills as an interactive constellation/orbit (draggable
   nodes, or physics tags falling into place with matter.js), grouped by
   Design / Frontend / Motion / Tools. Hovering a skill highlights the
   projects that used it.
5. JOURNEY — EXPERIENCE + EDUCATION as one pinned timeline with two lanes
   (Work lane / School lane). An SVG path draws as you scroll, milestone
   cards pop in along it, and a year counter ticks in the corner. Each card
   expands into achievements.
6. CERTIFICATES — "THE ARCHIVE" (multi-layer parallax, see below).
7. ADVENTURES — "FIELD NOTES" (travel videos, see below). This is the
   emotional peak of the story.
8. RESUME — a pinned "document assembles itself" moment: resume sections
   fly in from the scenes above and stack into a sheet. Download PDF button,
   link to /resume.
9. CONTACT — giant "Let's talk" with magnetic letters, the lens enlarges to
   fill the screen on hover, copy-email button, socials.
10. FOOTER — marquee, local time, back-to-top that smooth-scrolls up.

ADVENTURES — "FIELD NOTES" (travel & adventure videos)
- Home scene (pinned): a dark 3D globe or stylized map (R3F, low-poly or
  dotted) with glowing pins at each lat/lng. Scrolling flies a route line
  from trip to trip. At each stop, that trip's video plays in the lens
  window (muted, autoplay when in view) with place, date, and story in
  mono HUD text.
- /adventures page: a full-bleed film reel. Videos are a vertical-scroll
  snap sequence (one per screen) with letterbox bars, a timecode HUD,
  a location stamp, and a "sound on" toggle. Filter by country/year.
  A grid view toggle shows all clips as a mosaic with hover-scrub previews.
- Click → fullscreen player with keyboard controls, captions slot, next/prev.
- Video pipeline: compress to 1080p H.264 + WebM/AV1, 3–6s muted loop
  previews for hover/scroll, poster frames, lazy-load, never autoplay
  with sound. Large originals hosted on Cloudinary/Mux/Bunny, not in /public.

ABOUT PAGE (/about)
- Pinned intro: large portrait with the lens reveal, then the long bio
  with a scrubbed word-reveal.
- "By the numbers" counters (years, projects, countries visited, certificates).
- Values / how I work (3 cards with hover tilt), currently learning,
  fun facts, a photo strip from adventures, and a CTA to contact/resume.

RESUME PAGE (/resume)
- Clean, print-friendly web resume generated from the same /content data
  (single source of truth). Includes a print stylesheet and a Download PDF
  button. Calm, minimal motion so it's recruiter-friendly.

CERTIFICATES — "THE ARCHIVE" (multi-layer parallax)
- Pinned scene ~300–400vh tall. Certificates are cards laid out in 3–4
  depth layers (z-planes). Scrolling flies the camera FORWARD through them
  (CSS 3D perspective + translateZ, or R3F planes): near layer moves fast,
  far layers slow, cards blur/fade by depth (depth-of-field feel).
- Pointer adds subtle camera tilt (±4°) for extra parallax.
- Hovering a card brings it into focus (unblur, lift, lens = "VIEW").
  Click opens a lightbox with issuer, date, credential link.
- A side HUD shows count "07 / 12", issuer, year as you pass each card.
- Mobile fallback: a swipeable stacked-card deck (drag to cycle) with the
  same focus/unblur behavior.

PAGE TRANSITIONS
- Route changes use the lens: circular clip-path expands from the click
  point, new page reveals underneath. Case study pages: hero media →
  overview → challenge → process (pinned image sequence) → outcome → next project.

PERFORMANCE (hard budgets)
- Lighthouse ≥ 90 performance on mobile, LCP < 2.5s, CLS < 0.05, INP < 200ms.
- Initial JS < 200KB gz. WebGL, matter.js, and heavy scenes are dynamic-imported
  when near the viewport.
- Animate only transform/opacity/clip-path/filter. Use will-change sparingly.
- Images via next/image (AVIF/WebP, sizes set). Videos are muted, playsinline,
  preload=none, with poster images. Fonts are self-hosted with font-display: swap
  and a subset.
- Pause WebGL/RAF when the tab is hidden or the scene is offscreen. Cap DPR at 2.

RESPONSIVE & ACCESSIBILITY
- Breakpoints: 375 / 768 / 1024 / 1440 / 1920. Every scene has a designed
  mobile version (not shrunk desktop). Horizontal scroll → vertical stack
  with swipe on mobile.
- prefers-reduced-motion: disable smooth scroll, pinning becomes static
  layout, parallax off, crossfades only. The content is fully readable.
- Semantic HTML, focus-visible states styled like the lens, skip link,
  alt text, color contrast AA, keyboard-operable lightbox/carousels.
- No content hidden behind animation. It works with JS disabled (SSR text).

DESIGN QUALITY STANDARDS
- 12-col grid with consistent gutters. Spacing comes only from the token scale.
- One easing family (e.g. expo.out for reveals, power2.inOut for scrubs),
  durations 0.4/0.8/1.2s. Nothing bounces unless it's intentional.
- Every hover has a response within 100ms. Every scene has ONE hero moment.
- Pixel-check at every breakpoint. No layout shift on font load.
- Copy is short and confident. Meta labels are in mono uppercase.

SEO & EXTRAS
- Metadata + OG image per route, sitemap, robots, JSON-LD Person schema.
- Optional: sound toggle with subtle UI sounds (off by default), and a
  hidden easter egg (e.g. Konami code or typing "hello" swaps the theme).

DELIVERABLE
Build it scene by scene. Each scene must work before you start the next.
Explain any deviation from this brief.
```

---

## Part 2 — Execution Plan

### Phase 0 — Create the project on disk (first action after approval)
- Scaffold the project at **`C:\Users\glyka\portfolio`**.
- Save Part 1 verbatim as `C:\Users\glyka\portfolio\PROMPT.md` so the brief lives with the code.
- Save this plan as `C:\Users\glyka\portfolio\PLAN.md`.
- Create the folder skeleton from the ARCHITECTURE section (`app/`, `components/{scenes,ui,system,webgl}`, `lib/{motion,hooks}`, `content/`, `styles/`, `public/media/{projects,certificates}`), so you know where to drop your assets.
- `git init` with an initial commit.

### Phase 1 — Foundation
- From `C:\Users\glyka`, run `npx create-next-app@latest portfolio --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*"`, then add `gsap`, `@gsap/react`, `lenis`, `@react-three/fiber`, `@react-three/drei`, `three`, `motion`.
- `styles/tokens.css`: colors, fluid type scale, spacing, z-index, motion tokens.
- `lib/motion/` with eases, durations, and the `useGsap` wrapper (gsap.context cleanup).
- `components/system/SmoothScroll.tsx`: Lenis + ScrollTrigger sync on one RAF, disabled under reduced motion.
- `content/*.ts` typed data with placeholder entries.

### Phase 2 — Signature system
- `components/system/Cursor.tsx`: lens with state machine driven by `data-cursor`, lerp + velocity, and a mask-reveal layer.
- `components/ui/MagneticLink.tsx`, `SplitHeading.tsx`, `ScrambleText.tsx`.
- `Grain.tsx` overlay, `Preloader.tsx`, `PageTransition.tsx` (circular lens wipe).

### Phase 3 — Scenes, in order
Hero (with the WebGL field, lazy) → Manifesto → About teaser → Work (horizontal pin) → Skills → Journey (experience + education) → **Certificates Archive** → **Field Notes (adventures)** → Resume moment → Contact → Footer.

### Phase 3b — Sub-pages
`/about`, `/work/[slug]` case-study template, `/adventures` film reel + fullscreen player, `/resume` (print-friendly, with PDF download). All of them share the nav, the lens cursor, and the lens page transition.

### Phase 4 — Responsive, a11y, performance pass
- Mobile variants for each scene; reduced-motion paths; keyboard/focus audit.
- Bundle analysis, dynamic imports, image/video optimization, DPR caps, offscreen pausing.

### Phase 5 — Content, SEO, deploy
- Real content and media, OG images, sitemap, JSON-LD. Deploy to Vercel.

### Verification
- `npm run dev` and walk every scene at 375 / 768 / 1440 / 1920 widths.
- Toggle OS reduced-motion and confirm the static fallback is readable.
- Lighthouse mobile ≥ 90. Use the Performance panel to check 60fps on scroll through the Work and Archive scenes.
- Keyboard-only pass through nav, the work links, the certificate lightbox, and contact.
- `npm run build` must pass with no type or lint errors.

### Placeholders you'll need to supply
Name, role, positioning line, accent color choice, bio + portrait photos, 4–6 projects with media, certificates (images + links), education, experience, skills, travel/adventure videos (+ place, date, location), socials, and the resume PDF. Put your raw videos in `C:\Users\glyka\portfolio\public\media\adventures\_raw` and I'll compress them and generate the previews.
