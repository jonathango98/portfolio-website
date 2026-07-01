# Project Page Feedback — Hiring EM Review

Two reviews of the project pages, each done from the perspective of a hiring engineering
manager doing a quick scan: *can I understand this project in ~15 seconds, and is there
depth waiting if I want to dig in?* Changes described below are implemented on the
`project-page-feedback` branch.

---

## FOD Testing page

### At a glance
**What works:** This page passes the 15-second test better than most portfolio pages. The
eyebrow ("Apple Inc. · Product Safety Automation") establishes stakes instantly, the hero
stat strip (2,700 tests / 25× / 96% / 280 hrs) is exactly what an EM scans for, and the
Low Complexity vs. High Volume two-column layout is a genuinely good piece of information
design — the tension that justifies the project is visible without reading a word of prose.

**What was missing:**
- **Role clarity.** Apple projects are team efforts. The page said what the system does but
  never what *the candidate's* position was. As an EM I immediately ask "what did *you* do
  here?" — the page gave no answer.
- **Off-brand emphasis noise.** The hero sub, feature descriptions, and callout were littered
  with `<strong>`, `<em>`, and especially `<u>` (underline reads as a broken link). On a site
  whose identity is "minimal and typographic, structure encodes information," decorative
  inline emphasis reads as marketing copy, not engineering writing.
- **The callout was a fluffy rhetorical question** ("How to better allocate time for
  engineers…?") — grammatically awkward and abstract, in the most visually prominent block
  on the page.

### Digging deeper
- **The Results section was pure duplication.** It repeated the exact four numbers already in
  the hero stat strip. A second-pass reader got zero new information — while the content
  source had the *best* deep-dive material (108 vs. 2,700 tests, 2.4 days vs. 1 day,
  3 engineers·10 min vs. 9 robots·5 min, 36.5 vs. 1.5 person-hours, 292 vs. 12 hrs/yr),
  none of it on the page.
- **"Where's the code/demo?" had no answer.** For internal Apple work there can't be a repo,
  but silence looks like an omission. Saying so explicitly turns a dead end into a signal of
  professionalism (and an interview hook).
- **The "9 robots in parallel" fleet detail** — the most concrete engineering fact available —
  was buried in the content file and absent from the page.
- Still thin (not fixable without inventing facts): no architecture description (actuation,
  motion control, software stack, error recovery, safety interlocks).

### What was changed
1. Hero sub rewritten plain and concrete: "Robotic systems that run Apple's wireless-charging
   safety tests end to end — device prep, test execution, temperature data collection —
   unattended, overnight."
2. Role added to the hero badge: "Safety Test Automation Engineer · Hyulim DTR-MU ·
   Aug 2021 – Jun 2024" (title sourced from the homepage experience list).
3. Callout replaced with a concrete pivot: "2,700 repetitive tests per product, per year.
   Every hour an engineer spends running them is an hour not spent on problems that need an
   engineer."
4. Feature blurbs stripped of inline emphasis and made specific; the third now carries the
   fleet fact ("Nine systems operate in parallel to cover the full 2,700-test matrix in a day").
5. Results section rebuilt as a manual-vs-automated comparison table (5 rows, automated column
   in the site's `--signal` accent, mono numerals, hairline rules). Footnote explains the
   108-vs-2,700 baseline honestly.
6. Confidentiality note added: internal Apple tooling, hardware/source not public, "happy to
   walk through the design in conversation."
7. Route metadata description added.

### Suggestions not implemented (owner input needed)
- **Architecture / "How it works" section** — the single highest-value addition: actuation and
  gantry design, temperature data capture/validation, test scheduling, failure detection and
  recovery, calibration. Needs 5–8 sentences from you; layout would match the existing
  step-list style.
- **A photo of the actual system** — a real fixture photo (or the homepage `robot-fod.png`)
  would beat the abstract test diagram for credibility. Confirm what's publishable.

---

## RosMaster page

### At a glance
- **What worked before:** Strong problem framing — the three crisis stats are the fastest "why
  this matters" device on the site, and the hero sub-line already said what the robot does in
  one sentence. The visual language matched the homepage well.
- **What was missing:** In 15 seconds an EM couldn't answer "what's the platform, how
  autonomous is it, and what's the candidate's engineering contribution?" The only hard facts
  above the fold were a caption. "Big Impact in Small Packages" is a marketing headline that
  tells a scanner nothing; the callout was a rhetorical question where the one concrete
  sentence of the page should be.
- **The biggest miss:** the page shipped an 8823×5553 static JPEG for the architecture while a
  purpose-built interactive React Flow diagram (`RosmasterFlow.tsx`) sat orphaned in the repo —
  never imported anywhere, with a wrapper referencing a CSS class that didn't exist. A huge
  JPEG scaled to 920px is illegible; it read as "diagram exists" rather than "candidate can
  explain a system."

### Digging deeper
- **No tradeoffs anywhere.** The capability copy quietly contained real engineering decisions
  (AprilTags instead of human detection, electromagnet instead of a gripper) but presented
  them as apologies instead of scoping choices. Deliberately de-risking perception to prove
  the delivery pipeline end-to-end is the most hireable signal on the page.
- **Factual contradiction:** stack badges said "ROS2 Jazzy" while the architecture prose said
  "ROS2 Foxy on Ubuntu 20.04." Jazzy requires Ubuntu 24.04 and the RDK X3 ships on 20.04 —
  an EM who knows ROS would catch it instantly.
- **Flow diagram had a correctness bug:** rescue-tool edges pointed *actuator → planner*
  (Gripper/Magnet → Master Script). Anyone reading the graph carefully would flag it. Two
  data edges were unlabeled, and scroll-wheel zoom hijacked page scrolling.
- **Still missing:** results/metrics, a demo video, and a repo link (see suggestions).

### What was changed
1. **Hero at-a-glance meta row** (hairline-topped `<dl>`, 4 mono-labeled facts): Context /
   Platform / Autonomy / Payload — school, hardware, ROS version, autonomy scope, and payload
   in one glance.
2. **Interactive flow diagram wired into the page**, replacing the illegible static JPEG.
   Added the missing loading style, a color/edge legend (Sensor / Processing / Actuator,
   solid = ROS topic, dashed = launch/init), and a section intro that narrates the graph.
3. **Flow component fixed:** rescue-tool edges reversed to Master Script → Gripper/Magnet with
   `grip_cmd`/`magnet_cmd` labels; unlabeled edges labeled (`markers`, `frontier_goal`);
   scroll-zoom disabled so the diagram no longer hijacks page scroll; responsive height;
   `role="figure"` with descriptive aria-label.
4. **New "Engineering Decisions" section** (four entries): AprilTags as survivor proxies,
   electromagnet vs. gripper, Cartographer sensor fusion for GPS-denied interiors,
   operator-in-the-loop autonomy. All drawn from existing content — nothing invented.
5. **Copy tightening:** "Big Impact in Small Packages" → "Capabilities"; rhetorical callout →
   concrete statement; each capability carries a mono tech tag (e.g., "Nav2 · A* · frontier
   exploration"); "Image Detection"/"Pick-Up Tool" renamed to "Survivor Detection"/"Aid
   Delivery" (outcomes, not mechanisms).
6. **ROS version contradiction resolved** to "ROS 2 Foxy / Ubuntu 20.04" — **please confirm
   this against what actually ran on the robot.**

### Suggestions not implemented (owner input needed)
- **Demo video or GIF** of a full mission run (map → detect → deliver) — the single
  highest-value addition; no asset exists in the repo.
- **GitHub repo link** for the capstone code — if it's public, add it near the architecture
  section.
- **One results line** if numbers exist (arena size mapped, detection→delivery success rate
  over N trials, mission time). Modest real numbers beat none.
- **State your individual role** in the hero meta ("Role: navigation + system integration,"
  team size). It's a team capstone; EMs want to know what *you* owned.
- The crisis stats deserve source citations (footnote-style caption).

---

## Site-wide suggestions (shared files — not touched by either agent)

- **Shared `<ContactSection />` component** — the Let's Connect + footer block is copy-pasted
  across the homepage and both project pages and is already drifting (homepage includes
  Instagram; FOD page doesn't).
- **Global `.visually-hidden` utility in `app/globals.css`** — both project pages need
  screen-reader-only text; it's currently duplicated locally.
- **Dark-mode surface token** — `.fodDiagram` hardcodes `background: white`, which will glow
  in dark mode; a `--surface` token in globals would fix the class of problem site-wide. The
  RosMaster flow canvas has the same design call pending (light "figure" canvas vs.
  CSS-variable-driven node palette).
