# DESIGN.md — Portfolio Design System

The single source of truth for how the site looks, moves, and feels.
Code tokens live in `styles/tokens.css` and `lib/motion/`. Keep them in sync with this file.

> **Concept:** the site is a film you scroll through. Every section is a *scene*,
> scroll is the *timeline*, and the cursor is a *lens* that reveals hidden layers.
> Mood: cinematic, dark, atmospheric, confident, restrained. Inspired by the feel
> of horizonx.so and getlayers.ai. Never copy their layouts or assets.

---

## 1. Principles
1. **One hero moment per scene.** If two things compete, cut one.
2. **Motion explains, never decorates.** Every animation reveals content, shows depth, or gives feedback.
3. **Depth over shadow.** Create depth with parallax, scale, blur, and light, not drop shadows.
4. **Restraint in color.** It's a dark world with one vivid accent, used sparingly.
5. **Content survives without motion.** With reduced motion or no JS, everything stays readable.
6. **Fast is part of the design.** A janky effect is a broken effect.

---

## 2. Color

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0A0A0B` | page background |
| `--color-bg-elev` | `#111114` | cards, panels |
| `--color-line` | `rgba(255,255,255,0.08)` | grid lines, dividers |
| `--color-fg` | `#EDEDED` | primary text |
| `--color-fg-muted` | `#8A8A8F` | secondary text, meta labels |
| `--color-fg-faint` | `#4A4A50` | disabled, unrevealed manifesto words |
| `--color-accent` | `#C6FF3D` *(placeholder: lime)* | CTAs, active states, lens highlights |
| `--color-accent-ink` | `#0A0A0B` | text on accent |
| `--bloom-1` | `#5B3DF5` @ 25% | atmospheric gradient light |
| `--bloom-2` | `#1FB6FF` @ 15% | atmospheric gradient light |

**Accent options** (pick one, then update the token): electric lime `#C6FF3D`, ultraviolet `#7B5CFF`, signal orange `#FF5B1F`.

Rules:
- Accent covers ≤ 5% of any screen.
- Text contrast must meet WCAG AA at minimum. `--color-fg-muted` on `--color-bg` passes for body text.
- A light theme is optional and only available as an easter egg. Dark is the default.

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display | **Clash Display** (or PP Neue Montreal / Satoshi variable) | hero, scene titles |
| Body | **Satoshi** / **Inter** | paragraphs, UI |
| Mono | **Geist Mono** / **JetBrains Mono** | meta labels, HUDs, counters, timecodes |

Self-host the fonts with `next/font/local`, subset them, and set `display: swap`.

**Fluid scale** (`clamp(min, preferred, max)`):

| Token | Value | Use |
|---|---|---|
| `--text-hero` | `clamp(4rem, 12vw, 14rem)` | hero name, "Let's talk" |
| `--text-display` | `clamp(2.75rem, 6vw, 6.5rem)` | scene titles |
| `--text-h2` | `clamp(2rem, 3.5vw, 3.5rem)` | sub-titles |
| `--text-lead` | `clamp(1.25rem, 2vw, 1.75rem)` | manifesto, intros |
| `--text-body` | `clamp(1rem, 1.1vw, 1.125rem)` | body |
| `--text-meta` | `0.75rem` | mono uppercase labels, `letter-spacing: 0.08em` |

Rules:
- Display type uses tight leading (`0.9`) and negative tracking (`-0.03em`).
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
| `play` | like `view`, label "PLAY" (adventure videos) |
| `drag` | label "DRAG", squashes in the drag direction |
| `text` | thin caret bar |
| `magnetic` | element + label pulled toward the pointer (strength 0.3–0.4), spring back on leave |
| `hide` | cursor hidden (e.g. over WebGL scenes with their own feedback) |

The lens motif also shows up in:
- the preloader opening as a circular reveal
- the hero shader, which is distorted under the pointer
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
- **Light blooms:** large blurred radial gradients (`--bloom-*`) that drift slowly and react to scroll.
- **WebGL hero field:** a noise/fluid gradient that reacts to pointer and scroll velocity. DPR is capped at 2 and it pauses offscreen.
- **Depth of field:** layered elements blur with distance (`filter: blur()` scaled by depth).
- **Image treatment:** slightly desaturated at rest, full color plus scale 1.05 on hover or focus.

---

## 9. Scenes — Spec Sheet

| # | Scene | Hero moment | Mobile | Reduced motion |
|---|---|---|---|---|
| 0 | Preloader | counter 0→100, lens opens | same | instant fade |
| 1 | Hero | giant split name over WebGL field; disperses into depth on scroll | static gradient fallback | static |
| 2 | Manifesto | words light up as you scroll; key words become images | shorter text | all words lit |
| 3 | About teaser | 3-layer portrait parallax; lens reveals "travel me" | tap to swap | static |
| 4 | Selected Work | pinned horizontal track of project panels | vertical stack + swipe | vertical stack |
| 5 | Skills | draggable constellation; hover highlights related projects | tag cloud | grouped list |
| 6 | Journey | two-lane timeline (work / school), path draws on scroll | single lane | static list |
| 7 | Certificates — The Archive | camera flies forward through 3–4 depth layers | swipeable card deck | grid |
| 8 | Adventures — Field Notes | globe with pins, route flies trip to trip, video plays in the lens | map card + video list | list with posters |
| 9 | Resume | sections fly in and stack into a document | static sheet | static |
| 10 | Contact | magnetic "Let's talk", lens fills the screen | big tap target | static |
| 11 | Footer | marquee, local time, back-to-top | same | no marquee |

### Certificates — The Archive (detail)
- Pinned scene, `+=350%`. Cards sit on z-planes −200 / −800 / −1400 / −2000px under `perspective: 1200px`.
- Scroll moves the camera forward. Near layers move fastest, and blur scales with distance.
- Pointer adds camera tilt of ±4°.
- Hover focuses a card (unblur, lift, `data-cursor="view"`). Click opens a lightbox (issuer, date, credential link).
- The HUD at the right edge shows `07 / 12`, the issuer, and the year in mono.

### Adventures — Field Notes (detail)
- Use a dotted/low-poly globe with accent pins. A route arc animates between stops as you scroll.
- At each stop, the clip autoplays muted inside the lens window. The HUD shows the place, date, coordinates, and a one-line story.
- `/adventures` is a full-bleed snap reel with letterbox bars, a timecode, a sound toggle, filters, and a grid/mosaic toggle with hover-scrub previews.

---

## 10. Pages
- **`/work/[slug]`:** hero media → overview (role, stack, year) → challenge → process (pinned image sequence) → outcome/metrics → next project (lens transition).
- **`/about`:** portrait with lens reveal → long bio word-reveal → by-the-numbers counters → values cards → currently learning / fun facts → adventure photo strip → CTA.
- **`/adventures`:** see above.
- **`/resume`:** calm and print-friendly, generated from `/content` data, with a print stylesheet and a PDF download.

---

## 11. Media Standards
- **Images:** `next/image`, AVIF/WebP, always set `sizes`, blur placeholders. Project covers are 16:10, certificates 4:3 or the original ratio.
- **Videos:** 1080p H.264 MP4 plus a WebM version, plus a 3–6s muted loop preview (≤ 1.5MB) and a poster JPG. Use `muted playsinline preload="none"`. Never autoplay with sound.
- **Raw footage:** goes in `public/media/adventures/_raw/` (git-ignored). Large finals go to a video host (Cloudinary, Mux, or Bunny).

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
