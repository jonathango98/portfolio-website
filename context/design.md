# Design — jonathango.xyz

The design language for the rebuild. For the full build contract (components, scroll mechanics, page-by-page specs, tech architecture) see `design-spec.md`.

---

## Concept — "Localize"

A robot builds a map by moving through space and resolving landmarks out of noise. This site **is** that map — of its operator. Every robot Jonathan has built is rendered as a **live, code-driven component embedded into the page** (full-bleed backgrounds, scroll-pinned scenes) — not a photo in a card. The page stays calm, white, and spacious in the manner of Apple product pages; the boldness is spent entirely on the robot scenes resolving as you scroll.

**No stock imagery** — none was captured from the old site. The visuals are the work itself.

---

## Aesthetic direction

- **Apple-clean.** Whitespace is the primary material. One idea per viewport. Short copy.
- **The component is the page.** Each robot's *behavior* renders as the section background; text floats over it.
- **Spend boldness once.** The vermilion accent appears only on "detections." Everything else is ink-on-white discipline.
- **Structure encodes truth.** Coordinates, waypoint numbers, and detection IDs reflect real data — never decoration.
- **Motion serves comprehension.** Scroll reveals *how a system works*. If motion isn't explaining something, cut it.

What this deliberately is **not**: the robotics-portfolio cliché of a black background, monospace everything, and an acid-green terminal. We go light — authentic to how real occupancy maps render — and de-clone the Apple look by making every scene a live representation of Jonathan's actual systems.

---

## Color

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper` | `#FFFFFF` | primary canvas |
| `--mist` | `#F5F5F7` | alternating section field |
| `--ink` | `#14181F` | primary text, linework |
| `--slate` | `#6E7681` | secondary text, faint grid, captions |
| `--hairline` | `#E3E5E9` | dividers, grid lines, borders |
| `--signal` | `#FF4D2E` | THE accent — detections, active states only |
| `--signal-wash` | `#FFF0ED` | rare tint behind a live detection |

**Accent budget:** `--signal` appears at most ~once per viewport. If two things want it, one is wrong.

---

## Typography

- **Geist Sans** — all structural type (headings + body). Hierarchy comes from size and tracking, not extra families (Apple's move).
- **Geist Mono** — the data layer only: coordinates, spec lines, detection IDs, eyebrows, captions. Used sparingly. This is the thread that keeps the design from being a soulless Apple clone.

| Step | Size | Weight | Tracking | Use |
|------|------|--------|----------|-----|
| `display` | `clamp(2.75rem, 6vw, 5.5rem)` | 600 | `-0.02em` | hero name, scene statements |
| `h1` | `clamp(2rem, 4vw, 3.25rem)` | 600 | `-0.015em` | section titles |
| `h2` | `clamp(1.5rem, 2.5vw, 2rem)` | 600 | `-0.01em` | sub-sections |
| `lead` | `clamp(1.125rem, 1.6vw, 1.375rem)` | 400 | `0` | intro paragraphs |
| `body` | `1.0625rem` | 400 | `0` | body, line-height 1.6 |
| `label` | `0.75rem` | Mono 500 | `0.08em` UPPER | eyebrows, data labels |
| `caption` | `0.8125rem` | Mono 400 | `0.02em` | spec values, footnotes |

---

## Layout & space

- **Spacing scale (4px base):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192.
- **Section padding:** `clamp(96px, 12vw, 192px)` — Apple-scale generosity, non-negotiable.
- **Content width:** max `1200px`, gutter `clamp(20px, 5vw, 64px)`, 12-col grid (4-col mobile).
- **Reading measure:** body capped at `64ch`.
- **Radii:** soft — `8 / 14 / 22px`. No zero-radius brutalism.
- **Elevation:** mostly flat; depth comes from the live scenes, not drop shadows.

---

## Motion

- Durations: fast `180ms` · base `320ms` · slow `600ms` · scenes `scroll-linked`.
- Easing: `cubic-bezier(.16,1,.3,1)` (Apple-like out).
- Smooth scroll via Lenis; pinned scenes via scroll-scrub.
- **One orchestrated moment per viewport.** Idle states are still — no ambient loops.
- `prefers-reduced-motion`: every scene jumps to its final resolved frame; no scroll hijack.

---

## Signature

The single thing the page is remembered by: **the robots rendering themselves as the page background.**

- Hero: an occupancy grid resolves from sparse dots and "locks" under the name.
- SAR Rover: a map builds itself, a path traces, a victim lights `--signal`.
- FOD: a scan sweep flags foreign objects, a counter climbs to 2,700.
- TriFinger: a 9-DOF hand articulates as you scroll.
- Vacuum chamber: its node-edge simulation graph *is* the background.

Everything around the signature stays quiet and disciplined.

---

## Identity details

- **Monogram / mark:** `⌖ JG` — an origin reticle. Returns in the footer as the map's origin (0,0).
- **Live coordinate readout** in the nav reflects the current section using real locations (Berkeley · Cupertino · San Diego).
- **Numbering** used only where order is real (timeline waypoints, FOD steps). Robots get detection IDs (`DET-01`), not ranks.
- **Voice:** plain, active, end-user framed. CTA: *"Tell me about the problem you're solving."*
