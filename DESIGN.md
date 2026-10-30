# DESIGN.md — Portfolio Design System

The single source of truth for how the site looks, moves, and feels.
Code tokens live in `styles/tokens.css` and `lib/motion/`. Keep them in sync with this file.

> **Concept:** the site is a film you scroll through. Every section is a *scene*,
> scroll is the *timeline*, and the cursor is a *lens* that reveals hidden layers.
> Mood: calm, gallery-like, confident, restrained — white space, medium-weight
> type, tactile objects (tilted cover cards, frosted glass) with soft shadows.
> Motion inspired by the feel of horizonx.so and getlayers.ai. Never copy layouts or assets.

---

## 1. Principles
1. **One hero moment per scene.** If two things compete, cut one.
2. **Motion explains, never decorates.** Every animation reveals content, shows depth, or gives feedback.
3. **Depth through objects.** Parallax, scale and soft layered shadows on a few physical-feeling objects.
4. **Restraint in color.** A monochrome page; color comes from content (covers, photos) and one small accent.
5. **Content survives without motion.** With reduced motion or no JS, everything stays readable.
6. **Fast is part of the design.** A janky effect is a broken effect.

---

## 2. Color

Two themes. **Light is the default**; dark is one click away (nav toggle) and
remembered per visitor. Both are the same custom properties: light in `@theme`,
dark overriding them under `:root[data-theme="dark"]` (`styles/tokens.css`).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | `#0A0A0B` | page background |
| `--color-bg-elev` | `#F4F4F6` | `#111114` | cards, panels |
| `--color-line` | `rgba(10,10,11,0.1)` | `rgba(255,255,255,0.08)` | grid lines, dividers |
| `--color-fg` | `#0A0A0B` | `#EDEDED` | primary text |
| `--color-fg-muted` | `#5F5F66` | `#8A8A8F` | secondary text, meta labels |
| `--color-fg-faint` | `#C2C2C8` | `#4A4A50` | disabled, unrevealed manifesto words |
| `--color-accent` | `#C6FF3D` | `#C6FF3D` | fills: CTAs, chips, selection *(placeholder: lime)* |
| `--color-accent-fg` | `#3F7A00` | `#C6FF3D` | accent **text and thin lines** (readable on bg) |
| `--color-accent-ink` | `#0A0A0B` | `#0A0A0B` | text on an accent fill |
| `--color-bloom-1` | `#D9D0FF` | `#5B3DF5` @ 25% | atmospheric light |
| `--color-bloom-2` | `#C8EEFF` | `#1FB6FF` @ 15% | atmospheric light |

**Accent options** (pick one, then update the token): electric lime `#C6FF3D`, ultraviolet `#7B5CFF`, signal orange `#FF5B1F`.

Rules:
- Accent covers ≤ 5% of any screen.
- Never use `--color-accent` for text — lime on white fails contrast. Use `text-accent-fg`.
- Text contrast must meet WCAG AA in **both** themes.
- Elements with `mix-blend-mode: difference` (nav, cursor, scene counter) draw in white; the blend makes them read correctly on either theme.
- WebGL scenes read colors from the tokens and remount when the theme changes.
- Switching theme opens the new one as a lens from the toggle (view transition, type `theme`).

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display | **Geist** — weight 500, tight tracking, sentence case | hero, scene titles, big statements |
| Body | **Geist** | paragraphs, UI |
| Mono | **Geist Mono** | meta labels, HUDs, counters, timecodes |

The display style is quiet and editorial: medium weight, tight negative tracking,
sentence case, balanced line wraps. It is applied to every `.font-display` element
in `app/globals.css`. Fonts load via `next/font` with `display: swap`.

**Fluid scale** (`clamp(min, preferred, max)`):

| Token | Value | Use |
|---|---|---|
| `--text-hero` | `clamp(2.75rem, 6.4vw, 7rem)` | hero headline, "Let's get in touch" |
| `--text-display` | `clamp(2.25rem, 4.6vw, 5rem)` | scene titles |
| `--text-h2` | `clamp(1.75rem, 2.8vw, 2.75rem)` | sub-titles |
| `--text-lead` | `clamp(1.25rem, 2vw, 1.75rem)` | manifesto, intros |
| `--text-body` | `clamp(1rem, 1.1vw, 1.125rem)` | body |
| `--text-meta` | `0.75rem` | mono uppercase labels, `letter-spacing: 0.08em` |

Rules:
- Display type uses leading `1.02–1.1` and tracking `-0.03em` to `-0.045em`.
- Meta labels are always mono and uppercase, e.g. `(03) — SELECTED WORK`, `2025`, `14.5995° N`.
- Body text width is ≤ 65ch.

---

## 4. Layout & Spacing
- **Grid:** 12 columns. Gutter is `clamp(16px, 2vw, 32px)`. Page margin is `clamp(16px, 4vw, 64px)`.
- **Spacing scale (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192. Never use other values.
- **Breakpoints:** 375 · 768 · 1024 · 1440 · 1920.
- **Z-index tokens:** `base 0` · `content 10` · `nav 50` · `overlay 80` · `cursor 90` · `transition 100` · `preloader 110`.
- Use subtle 1px grid/coordinate lines (`--color-line`) as an atmospheric layer.

---

## 5. Motion

Defined once in `lib/motion/`. **Don't add ad-hoc easings or durations.**

| Token | Value | Use |
|---|---|---|
| `ease.reveal` | `expo.out` | text/image reveals, entrances |
| `ease.scrub` | `none` / `power2.inOut` | scroll-linked scrubs |
| `ease.ui` | `power3.out` | hovers, UI state |
| `ease.spring` | magnetic springs: `elastic.out(1, 0.4)` | magnetic release only |
| `dur.fast` | `0.4s` | hovers, micro-feedback |
| `dur.base` | `0.8s` | reveals |
| `dur.slow` | `1.2s` | scene entrances, page transitions |
| `stagger.chars` | `0.02s` | split-text letters |
| `stagger.words` | `0.06s` | split-text words |
| `stagger.items` | `0.1s` | lists, cards |

Rules:
- Animate only `transform`, `opacity`, `clip-path`, and `filter`. Never animate layout properties.
- Hover response time is under 100ms.
- Lenis smooth scroll uses `lerp ≈ 0.1` and is synced to the GSAP ticker, so there's a single RAF loop.
- Pinned scenes have explicit lengths (e.g. `end: "+=300%"`) so the pacing is intentional.
- **Reduced motion:** no smooth scroll, no pinning (stack normally), no parallax, crossfades of 0.2s max.

---

## 6. Signature System — The Lens (cursor)

The cursor is a dot (6px) plus a lagging ring (40px, lerp 0.15) using `mix-blend-mode: difference`.
Components opt in declaratively with `data-cursor`:

| `data-cursor` | Lens behavior |
|---|---|
| *(none)* | default dot + ring |
| `link` | ring grows to 64px; text under it reveals its alternate layer through a clip-path mask |
| `view` | lens grows to a 160px window showing the item's preview media, with RGB-shift by velocity; label "VIEW" |
| `play` | like `view`, label "PLAY" (videos) |
| `drag` | label "DRAG", squashes in the drag direction |
| `text` | thin caret bar |
| `magnetic` | element + label pulled toward the pointer (strength 0.3–0.4), spring back on leave |
| `hide` | cursor hidden (e.g. over WebGL scenes with their own feedback) |

The lens motif also shows up in:
- the preloader opening as a circular reveal
- page transitions, a circular wipe from the click point
- the contact scene, where the lens expands to fill the screen

**Touch:** no custom cursor. Lens behaviors become press states and scroll-linked reveals.

---

## 7. Micro-interactions
- Magnetic CTAs and social links
- Nav links with letter-stagger roll on hover
- Text scramble on meta labels as they enter
- Underlines that draw in from left on hover and out to right
- Cards that tilt up to 6° toward the pointer
- A click ripple
- Copy email: label morphs to `Copied ✓`, then back after 1.5s
- Nav: live local time and a pulsing "available" status dot
- Scroll progress bar and section counter `03 / 10`
- Buttons: fill wipe from the cursor entry side

---

## 8. Atmosphere & Effects
- **Grain:** an animated noise overlay at 3–5% opacity, `pointer-events: none`.
- **Depth of field:** layered elements blur with distance (`filter: blur()` scaled by depth).
- **Image treatment:** slightly desaturated at rest, full color plus scale 1.05 on hover or focus.
- **Hero cover cards:** tilted, book-cover-like cards ring the hero headline, each linking to a
  section. Typographic covers by default (`art`: type / ring / stripes / grid / mark), or a photo via
  `image`. They rise from a fanned stack, lean away from the cursor by `depth`, and drift outward on
  scroll. Content and placement: `content/hero.ts`. Phones show four.
- **Soft shadows:** objects use `--shadow-card` / `--shadow-card-hover` (layered, low-contrast).
- **Black pill:** primary CTAs (`.btn-pill`) are a solid `--color-fg` pill with `--color-bg` text.
- **Floating objects (dormant):** `components/ui/Decor.tsx` + `content/decor.ts` can still place
  floating images in any section; every set is empty in the current look.

---

## 9. Scenes — Spec Sheet

| # | Scene | Hero moment | Mobile | Reduced motion |
|---|---|---|---|---|
| 0 | Preloader | counter 0→100, lens opens | same | instant fade |
| 1 | Hero | centered headline with inline image; cover cards fan out from a stack, drift outward on scroll | 4 cards | static cards |
| 2 | Manifesto | centered statement over three giant outlined rows (Code/Cut/Capture) drifting opposite ways; lime quote mark; words light up as you scroll, key phrases get a lime highlighter swipe and an animated craft chip (code tag, splitting film strip, REC viewfinder); first name drawn as a signature + Code/Cut/Capture | same | all lit + highlighted |
| 3 | About teaser | tilted photo stack (lens reveals the alternate shot, hover fans the cards), "Hi, I'm Glyka", value cards | same | static |
| 4 | Selected Work | header with REC dot, frame count, running timecode + progress rail; pinned horizontal 35mm film strip (sprocket holes, edge markings) of browser-window project cards that rack into focus at center; ends on a lime "That's a wrap" frame linking to contact | vertical film strip | vertical film strip |
| 5 | Skills | three stacking cards — code editor, edit timeline with scrubbing playhead, viewfinder with rack focus | cards in a column | cards, no playhead/rack focus |
| 6 | Journey | two-lane timeline of cards (monogram, Work/School pill, Now badge, highlights); spine draws, dots light, year badge rides the spine | single lane | all dots lit |
| 7 | Certificates — The Archive | camera flies forward through paper certificate cards with issuer seals; frosted HUD with progress; two-column lightbox | swipeable card deck | grid |
| 8 | Resume | blocks fly in and stack into a paper sheet | static sheet | static |
| 9 | Contact | magnetic "Let's get in touch", contact cards (email copy, Cebu time, availability), social pills, form in a card | stacked | static |
| 10 | Footer | end slate: a clapperboard whose striped arm snaps shut on enter (claps again on hover), cells for production line, status, scene/roll/take, location + LIVE time, links, name set edge to edge (letters rise), fine print + back-to-top. No CTA here: home ends on Contact; sub-pages end on `<WorkTogether />` (crossed tapes + dark CTA card) above the footer | 2-col links | static name |

### Certificates — The Archive (detail)
- Pinned scene, `+=350%`. Cards sit on z-planes −200 / −800 / −1400 / −2000px under `perspective: 1200px`.
- Scroll moves the camera forward. Near layers move fastest, and blur scales with distance.
- Pointer adds camera tilt of ±4°.
- Hover focuses a card (unblur, lift, `data-cursor="view"`). Click opens a lightbox (issuer, date, credential link).
- The HUD at the right edge shows `07 / 12`, the issuer, and the year in mono.

### Skills — three crafts (detail)
- Categories: Programming, Editing, Videography (`skillCategories` in `content/skills.ts`).
- One card per craft: copy (number, name, blurb, skill pills) beside a mock of the tool where that craft happens. The mock is decorative (`aria-hidden`); the pills are the real list.
  - **Programming:** a code editor. The stack is a typed array with a ●●●●○ level comment per skill; lines type in on enter; a caret blinks.
  - **Editing:** a sequence timeline. Skills are clips on V3/V2/V1 (length follows `level`) over a soundtrack bed on A1. The playhead and timecode scrub with scroll, and clips under the playhead light up.
  - **Videography:** a camera viewfinder (fixed dark: thirds grid, corner brackets, REC, exposure HUD). Focus racks from skill to skill (blur + a focus box); hovering pulls focus by hand. Paused offscreen.
- Desktop: cards are sticky and stack, each a little lower than the last; the one underneath scales back to 0.94 as the next slides over.

---

## 10. Pages
- **`/work/[slug]`:** hero media → overview (role, stack, year) → challenge → process (pinned image sequence) → outcome/metrics → next project (lens transition).
- **`/about`:** greeting + photo stack → long bio word-reveal → numbers as cards → values as tilted swatch covers (hover straightens) → learning pills / fun-fact cards → two next-step cards (work, resume).
- **`/resume`:** sticky profile card (photo, contacts, PDF/print, skills by craft) beside section cards; experience/education on a thin rail. Print flattens it to plain black on white.

---

## 11. Media Standards
- **Images:** `next/image`, AVIF/WebP, always set `sizes`, blur placeholders. Project covers are 16:10, certificates 4:3 or the original ratio.
- **Videos:** 1080p H.264 MP4 plus a WebM version, plus a 3–6s muted loop preview (≤ 1.5MB) and a poster JPG. Use `muted playsinline preload="none"`. Never autoplay with sound.
- **Raw footage:** goes in `public/media/_raw/` (git-ignored). Large finals go to a video host (Cloudinary, Mux, or Bunny).

---

## 12. Accessibility
- Semantic landmarks, a skip link, and one `h1` per page.
- Focus-visible ring styled as the lens (accent outline, rounded).
- Lightbox, carousels, and the video player are fully keyboard-operable, with `Esc` to close and arrows to navigate.
- All media has alt text or captions. Decorative canvases are `aria-hidden`.
- Respect `prefers-reduced-motion` everywhere.

---

## 13. Quality Checklist (before any scene is "done")
- [ ] Looks intentional at 375 / 768 / 1440 / 1920
- [ ] 60fps while scrolling (DevTools Performance)
- [ ] Reduced-motion version reads well
- [ ] Keyboard-only usable
- [ ] No layout shift on load or font swap
- [ ] Uses only tokens (color, space, type, motion)
- [ ] Has exactly one hero moment
