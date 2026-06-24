# jonathango.xyz — Design & Build Spec

**Concept:** "Localize" · **Aesthetic:** Apple-clean, whitespace-led · **Stack:** Next.js (App Router) + React + TypeScript
**Status:** Design direction approved in principle; this document is the build contract. Code not yet started.
**Last updated:** 2026-06-23

---

## 1. The idea in one paragraph

A robot builds a map by moving through space and resolving landmarks out of noise. This site *is* that map — of its operator. Every robot Jonathan has built is rendered **as a live, code-driven component embedded into the page** (full-bleed backgrounds and scroll-pinned scenes), not as a photo in a card. The page is calm, white, and spacious in the manner of Apple product pages; the boldness is spent entirely on the robot scenes resolving themselves as you scroll. No stock imagery (none was ever captured from the old site) — the visuals are the work.

**Page's single job:** convince a technical hiring manager (robotics *or* PM) that Jonathan builds real, working systems and can communicate them clearly.

---

## 2. Design principles

1. **Whitespace is the primary material.** Apple-level air. Sections breathe; copy is short; one idea per viewport.
2. **The component is the page.** Each robot's *behavior* renders as the section's background. Text floats over it, minimal.
3. **Spend boldness once.** `signal` vermilion appears only on "detections." Everything else is ink-on-white discipline.
4. **Structure encodes truth.** Coordinates, waypoint numbers, and detection IDs reflect real data (real locations, real chronology, real metrics) — never decoration.
5. **Quiet excellence in type.** One family across dramatic sizes (Apple's move), with a mono thread for the technical layer.
6. **Motion serves comprehension.** Scroll reveals *how a system works*. If motion isn't explaining something, cut it. Reduced-motion renders the final resolved state.

---

## 3. Design tokens

### 3.1 Color

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper` | `#FFFFFF` | primary canvas |
| `--mist` | `#F5F5F7` | alternating section field (Apple grey) |
| `--ink` | `#14181F` | primary text, linework |
| `--slate` | `#6E7681` | secondary text, faint grid, captions |
| `--hairline` | `#E3E5E9` | dividers, grid lines, borders |
| `--signal` | `#FF4D2E` | THE accent — detections, active states only |
| `--signal-wash` | `#FFF0ED` | rare tinted background behind a live detection |

**Dark mode:** out of scope for v1. Tokens are structured so a future dark theme only remaps these 7 values.

**Accent budget:** `--signal` may appear at most ~once per viewport. If two things want it, one is wrong.

### 3.2 Typography

| Role | Family | Notes |
|------|--------|-------|
| Structural (all headings + body) | **Geist Sans** | clean like SF Pro, free, Next/Vercel-native; hierarchy via size + tracking, not extra families |
| Data layer | **Geist Mono** | coordinates, spec lines, detection IDs, eyebrows, captions — used sparingly |

*Alternative on request:* SF system stack (`-apple-system, BlinkMacSystemFont, "SF Pro Text"`) for literal Apple rendering. Geist is the recommendation.

**Type scale** (fluid via `clamp`, 1.250 major-third base):

| Step | Size (clamp) | Family / weight | Tracking | Use |
|------|--------------|-----------------|----------|-----|
| `display` | `clamp(2.75rem, 6vw, 5.5rem)` | Geist 600 | `-0.02em` | hero name, scene statements |
| `h1` | `clamp(2rem, 4vw, 3.25rem)` | Geist 600 | `-0.015em` | section titles |
| `h2` | `clamp(1.5rem, 2.5vw, 2rem)` | Geist 600 | `-0.01em` | sub-sections |
| `lead` | `clamp(1.125rem, 1.6vw, 1.375rem)` | Geist 400 | `0` | intro paragraphs |
| `body` | `1.0625rem` | Geist 400 | `0` | body copy, `line-height 1.6` |
| `label` | `0.75rem` | Geist **Mono** 500 | `0.08em`, UPPERCASE | eyebrows, data labels |
| `caption` | `0.8125rem` | Geist Mono 400 | `0.02em` | spec values, footnotes |

### 3.3 Spacing scale (4px base)

`--space-1: 4px` · `2: 8` · `3: 12` · `4: 16` · `5: 24` · `6: 32` · `7: 48` · `8: 64` · `9: 96` · `10: 128` · `11: 192`

Section vertical padding: `clamp(96px, 12vw, 192px)` (steps 9–11). Apple-scale generosity is non-negotiable.

### 3.4 Layout grid

- **Max content width:** `1200px`, centered, `--gutter: clamp(20px, 5vw, 64px)`.
- **Grid:** 12-col, `24px` gap desktop; collapses to 4-col mobile.
- **Reading measure:** body text capped at `64ch`.
- **Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280`.

### 3.5 Radii, borders, elevation

- Radii: `--r-sm: 8px` · `--r-md: 14px` · `--r-lg: 22px`. Default to soft, Apple-ish; never zero-radius brutalism here.
- Borders: `1px solid var(--hairline)`.
- Elevation: shadows used *very* sparingly. `--shadow-soft: 0 1px 2px rgba(20,24,31,.04), 0 8px 24px rgba(20,24,31,.06)`. The design is mostly flat; depth comes from the live scenes, not drop shadows.

### 3.6 Motion tokens

- Durations: `--t-fast: 180ms` · `--t-base: 320ms` · `--t-slow: 600ms` · `--t-scene: scroll-linked`.
- Easing: `--ease-out: cubic-bezier(.16,1,.3,1)` (Apple-like) · `--ease-inout: cubic-bezier(.65,0,.35,1)`.
- Scroll smoothing: Lenis, lerp ~0.1.
- **`prefers-reduced-motion`:** all scroll-linked scenes jump to final resolved frame; entrance fades replaced by instant; no smooth-scroll hijack.

---

## 4. Global systems

### 4.1 Occupancy-grid background
A faint `--hairline` grid (graph-paper / occupancy-map cells, ~32px) underlies the whole site at very low contrast. In hero and scene transitions it animates from sparse "unknown" dots → resolved grid. Pure CSS background where static; Canvas where animated.

### 4.2 Navigation (fixed, minimal)
```
⌖ JG            Robots   Timeline   Projects   Contact          37.87°N · 122.27°W
```
- Left: `⌖ JG` monogram (origin reticle). Right: mono nav links + a subtle live coordinate readout that reflects the current section (real coordinates — Berkeley, Cupertino, San Diego — as you pass each region).
- Transparent over hero; gains a `--hairline` bottom border + slight `backdrop-blur` after scroll. Apple-style condensed behavior.
- Mobile: monogram + hamburger → full-screen overlay menu, generous spacing.

### 4.3 Localization rail (the secondary signature)
A thin fixed element (right edge desktop; hidden mobile) showing current section as map coordinates + a scroll-progress tick. Reinforces "you are moving through a mapped space." Subtle, mono, `--slate`.

### 4.4 Footer = Origin (0,0)
Vast whitespace. Large closing wordmark, the reticle returns, contact rendered as mono "nodes." See §5.7.

---

## 5. Homepage — section by section

> Source content: `website-content/home.md`. Narrative arc preserved: intro → credibility → proof → invite.

### 5.1 Hero — "Resolve"
- **Background:** occupancy grid resolves from sparse dots; near the name the grid "locks" solid. One orchestrated load moment (~1.2s), then idle-still.
- **Copy:**
  - Eyebrow (`label`): `ROBOTICS ENGINEER // LOCALIZED`
  - Display: `Jonathan Goenadibrata`
  - Lead: *"I build practical robots that make everyday life easier."*
  - Action: `[ Resume ↧ ]` — single ghost button, hairline border, fill `--ink` on hover. Links to `website-content/resume/Tech Resume - Jonathan Goenadibrata.pdf` → copy to `public/resumes/` at build setup.
  - Social: small mono-labeled nodes (`in` `gh` `ig`).
- **Layout:** centered, enormous top/bottom padding. Scroll cue at base (subtle).
- **Reduced motion:** grid renders pre-resolved.

### 5.2–5.4 Featured Robots — "Detections" (three full-viewport scroll-pinned scenes)

Shared pattern per scene:
- Section **pins** (sticky) while the embedded visualization plays scrubbed to scroll progress. A single short statement stays fixed, then the scene releases to the next.
- Mono detection header: `DET-0n · <HARDWARE> · <CONTEXT>`.
- One CTA: `View project →` (to detail page) — except TriFinger → external.
- `--signal` appears only at the detection moment.

**5.2 — DET-01 · SAR Rover** (`Yahboom RDK X3` · UC Berkeley Capstone → `/rosmaster`)
- Embedded component: **OccupancyMapBuild**. As you scroll, an occupancy grid resolves from grey "unknown," a robot path (dashed) traces through it, then a victim tag lights `--signal` ("detected"). Mirrors the rover's real job: LiDAR mapping + image detection.
- Statement: *"Maps the unknown in real time."*

**5.3 — DET-02 · FOD Automation** (`Hyulim DTR-MU` · Apple Product Safety → `/fod-testing`)
- Embedded component: **ScanSweep**. A wireless-charging pad; a sweep line passes; foreign objects flagged with vermilion detection ticks; a counter ticks up toward the real number (`2,700 tests/product`).
- Statement: *"Turns 2,700 tests into one unattended run."*

**5.4 — DET-03 · TriFinger** (`9-DOF manipulator` · UC San Diego → external site)
- Embedded component: **ArticulatedHand** — a lightweight 9-DOF rig (3 fingers × 3 joints) that flexes/grasps as you scroll. WebGL (react-three-fiber) or animated SVG fallback.
- Statement: *"Low-cost dexterity, built in-house."*
- CTA opens the external Google Site in a new tab (labeled as external).

### 5.5 Timeline — "Traversed Path"
- Quiet section on `--mist`. A vertical dashed path with waypoint nodes drawn as they enter view.
- Newest first; waypoint numbering is honest (real chronological sequence):

```
⊙ W3   2024–25   UC BERKELEY      M.Eng, Mechanical Engineering
╎
⊙ W2   2021–24   APPLE INC.       Safety Test Automation Engineer · Product Safety Automation
╎
⊙ W1   2018–21   UC SAN DIEGO     B.S. Mechanical Engineering — Controls & Robotics
```
- Date in `caption` mono; institution in `h2`; role in `body`. No icons, no card chrome.

### 5.6 Micro-projects — "Map Markers"
- 4-up grid (2-up tablet, 1-up mobile), compact, lots of whitespace. Each = a marker with mono coordinates + title + one line + outbound link. NOT bounding-box cards — flat, hairline-separated.
  - **Photobooth** → github.com/jonathango98/photobooth
  - **Vacuum Pump Chamber Simulation** → `/lykos-project` (internal)
  - **IPR Controller** → github.com/jonathango98/webot-ws
  - **Snake AI** → github.com/jonathango98/snake-game
- Hover: marker pulses `--signal` briefly.

### 5.7 Contact / CTA — "Origin (0,0)"
- Copy fix: ~~"Fill out some info and we will be in touch shortly"~~ → **"Tell me about the problem you're solving."**
- Decision needed: keep the form, or replace with a direct `mailto:` + social nodes? (See §11.) Recommendation: drop the Squarespace form; use a prominent email node + LinkedIn/GitHub/Instagram. Simpler, no backend.
- Reticle returns; large closing wordmark `Jonathan Goenadibrata`; coordinates settle to `0,0`.

---

## 6. Project page template

All three detail pages share one **scroll-scene system**: a sequence of pinned/contiguous sections, each pairing a short statement with an embedded live component. Preserves each page's existing storytelling arc (problem → solution → proof → connect). Quiet, white, generous — same tokens as homepage.

### 6.1 ROSMaster (`/rosmaster`) — source: `projects/rosmaster.md`
1. **Hero** — OccupancyMapBuild full-bleed; title overlay; context line `Yahboom RDK X3 · UC Berkeley Capstone`.
2. **Problem (stakes)** — three stat callouts animate as the grid darkens to "danger": `65%` aftershocks in 24h · `30%` survival drop · `46%` responders injured. (`--signal` for the human-risk numbers — justified.)
3. **Needs** — On-Site Care · Psychological Stress · Rescue Path. Three calm blocks, no icons; type + space only.
4. **Solution reveal** — statement: *"A compact platform that enters where responders can't."*
5. **Feature breakdown** — Mapping · Navigation · Image Detection · Pick-Up Tool. Each gets a small live diagram (reuse map/detection components at smaller scale).
6. **Software architecture** — node-graph of the ROS2 stack. Tech badges: ROS2, Ubuntu, Navigation2, Cartographer SLAM, OpenCV, Python3, RDK X3, A*. (⚠ resolve the ROS2 Foxy-vs-Jazzy discrepancy noted in source before publishing.)
7. **Let's Connect** — shared Origin footer.

### 6.2 FOD Testing (`/fod-testing`) — source: `projects/fod-testing.md`
The data-rich page — this is where live data-viz shines (Apple loves a good chart, kept minimal).
1. **Hero** — ScanSweep full-bleed; title `Foreign Object Detection`; context `Hyulim DTR-MU · Apple Product Safety`.
2. **Problem** — engineers spend `4–6 hrs/day` on simple high-volume tests.
3. **Low Complexity** — 3 numbered steps (honest sequence): Place Object → Turn On Charger → Collect Temp Data.
4. **High Volume** — the multiplication resolves on scroll: `3 × 3 × 2 × 2 × 3 × 25 = 2,700`. The simplicity-vs-volume tension is the centerpiece.
5. **Solution** — Autonomous Execution · End-to-End Prep · Continuous/Scalable.
6. **Strength in Numbers** — 4 restrained data visualizations: `25×` coverage · time-to-complete · annual calendar · `96%` labor reduction (`280 hrs/yr` saved). One headline metric per viewport, animated count-up.
7. **Let's Connect** — Origin footer.

### 6.3 Vacuum Chamber (`/lykos-project`) — source: `projects/vacuum-chamber.md`
1. **Hero** — embedded **NodeEdgeGraph** as background (the simulation literally is a node-edge graph): nodes = control volumes, edges = mass-flow paths; pressures animate. On-theme and unique.
2. **Overview** — control algorithm + state machine + pressure simulation.
3. **Mission statement** — centered standalone: *"The goal isn't mere functionality, but long-term reliability."*
4. **Attributes** — Modular · Compatible · Scalable.
5. **Simulation** — Node-Edge Structure → Conductance → Plug & Play, with the graph reacting per subsection.
6. **Tech stack** — CODESYS · Structured Text (IEC 61131-3) · OptoScript · PAC Control.
7. **Let's Connect** — Origin footer.

---

## 7. Embedded component catalog

The "components that are the website." All accept `progress` (0–1 scroll value) and render deterministically at any frame; all have a static reduced-motion frame.

| Component | Technique | Used in |
|-----------|-----------|---------|
| `OccupancyGrid` | CSS/Canvas background, sparse→resolved | global, hero |
| `OccupancyMapBuild` | Canvas — map resolves, path traces, victim detect | home DET-01, /rosmaster |
| `ScanSweep` | Canvas/SVG — sweep line, object flags, counter | home DET-02, /fod-testing |
| `ArticulatedHand` | react-three-fiber (SVG fallback) — 9-DOF flex | home DET-03 |
| `TraversedPath` | SVG `stroke-dashoffset` draw-on-scroll | timeline |
| `NodeEdgeGraph` | SVG/Canvas force-ish layout, pressure anim | /lykos-project |
| `CountUp` / `StatReveal` | number animation on enter | /fod-testing, /rosmaster |
| `DetectionFrame` | corner-tick framing that snaps to `--signal` | scene wrappers |

Each lives in `components/scenes/`, is a client component, lazy-loaded, and pauses off-screen (IntersectionObserver) for performance.

---

## 8. Motion & scroll mechanics

- **Smooth scroll:** Lenis (disabled under reduced-motion).
- **Pinning/scrub:** GSAP ScrollTrigger for the pinned robot scenes; progress drives each scene component.
- **Micro-interactions:** Framer Motion for hovers, entrances, nav condense.
- **Budget:** at most one orchestrated moment per viewport. Idle states are still. Avoid ambient looping animation (reads as AI-generated and costs battery).
- **Performance targets:** 60fps on the scenes; visualizations cap DPR, pause off-screen, and degrade to static on low-power / `save-data`.

---

## 9. Accessibility & responsive (quality floor)

- Semantic landmarks; one `<h1>` per page; logical heading order.
- All scenes have meaningful `aria-label` / text alternatives; decorative grids `aria-hidden`.
- Visible keyboard focus (`--signal` ring); full keyboard nav; skip-to-content link.
- Color contrast ≥ WCAG AA (`--ink` on `--paper` passes; `--slate` for secondary only).
- `prefers-reduced-motion` fully honored (final frames, no hijack).
- Responsive: every scene has a mobile-tuned (often simplified) variant; localization rail hidden < `lg`; touch targets ≥ 44px.

---

## 10. Tech architecture

```
app/
  layout.tsx            # fonts, Lenis provider, nav, footer
  page.tsx              # homepage (composes sections)
  rosmaster/page.tsx
  fod-testing/page.tsx
  lykos-project/page.tsx
components/
  nav/  footer/  rail/
  sections/             # Hero, RobotScene, Timeline, MicroProjects, Contact
  scenes/               # the embedded visual components (§7)
  ui/                   # Button, Eyebrow, StatCallout, Node...
lib/                    # scroll hooks, content loaders, motion presets
styles/                 # tokens.css (the §3 variables), globals.css
content/                # typed content sourced from website-content/*.md
public/resumes/         # re-hosted PDFs (see below)
```

- **Framework:** Next.js App Router, TypeScript, React Server Components where static; scenes are client components.
- **Styling:** Tailwind v4 with the §3 tokens wired as theme variables (or CSS Modules + `tokens.css` if preferred). Recommendation: Tailwind v4 token-driven.
- **Libraries:** `lenis`, `gsap` (+ScrollTrigger), `framer-motion`, `@react-three/fiber` + `three` (TriFinger only), `geist` font package.
- **Content:** lift copy from `website-content/*.md` into typed content modules so pages stay data-driven.
- **Resume asset:** single resume supplied at `website-content/resume/Tech Resume - Jonathan Goenadibrata.pdf` → copy to `public/resumes/` at build setup. (PM Resume dropped.)
- **Deploy:** Vercel (static + edge), custom domain `jonathango.xyz`.

---

## 11. Open decisions to confirm before/while building

1. **Contact:** drop the Squarespace form for a direct email + social nodes? (Recommended — no backend.)
2. **TriFinger scene:** WebGL (richer, heavier) vs animated SVG (lighter)? (Recommended: start SVG, upgrade if time.)
3. **Type:** Geist (recommended) vs SF system stack?
4. **ROS2 version discrepancy** (Foxy vs Jazzy) — which is correct for the architecture section?
5. **Domain/host** — confirm Vercel + that `jonathango.xyz` DNS can be moved off Squarespace.
6. **Scope of v1** — homepage + 3 project pages, or homepage first?

---

## 12. Self-critique (why this isn't the default)

- Rejected the robotics-portfolio cliché (black bg + mono + acid-green terminal). Went **light**, which is authentic to how real occupancy maps render.
- Apple-clean is the user's explicit brief — followed — but de-cloned by making the *content* of every scene a live representation of Jonathan's actual systems, not stock product shots.
- `--signal` vermilion is semantically gated to "detection," not sprinkled as brand garnish.
- Numbering used only where order is real (timeline, FOD steps); robots get IDs, not ranks.
- One orchestrated motion per viewport; no ambient loops. Boldness spent once, on the robots-as-page signature.
