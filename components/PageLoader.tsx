"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import styles from "./PageLoader.module.css";

/**
 * Artificial hold on top of the real load — 0 in production. Set it to a few
 * thousand ms to actually see the skeleton while working on it.
 */
const FORCED_DELAY_MS = 0;

/** Floor for a real load, so a fast one doesn't flash the skeleton. */
const MIN_VISIBLE_MS = 400;

/** Matches the staggered exit in PageLoader.module.css (620ms + 180ms). */
const FADE_MS = 800;

type Phase = "loading" | "leaving" | "done";

/** A stat cell: how wide the number is, and the label under it. */
type Stat = [value: number, label: number];

type Silhouette = {
  /**
   * identity — portrait above a two-line name (/ and /life)
   * case     — back link, headline, stat strip (the write-ups)
   * feature  — headline beside a product shot (/rosmaster)
   */
  hero: "identity" | "case" | "feature";
  /** Night palette. The overlay sits outside the /life wrapper that sets it. */
  life?: boolean;
  /** Widths of the nav links standing left of the mode toggle. */
  navLinks: number[];
  /** The eyebrow over the headline. */
  eyebrow: number;
  /** The two headline lines, as a share of the column they sit in. */
  title?: [string, string];
  /** identity — how far the tagline wraps. */
  tagline?: string[];
  /** identity — widths of the links in the hero's action row. */
  actions?: number[];
  /** identity — what follows the About section, and that section's label. */
  below?: "work" | "photos";
  /** The two section labels under an identity hero / the one under a case. */
  labels: number[];
  /** case — the lead paragraph under the headline. */
  sub?: string[];
  /**
   * case — the four-up stat strip. "lead" is RoboForce's: flush left,
   * bottom-aligned, with the headline number set larger than the rest.
   */
  stats?: { align: "lead" | "even"; cells: Stat[] };
  /** case — the role/date line under the strip. */
  badge?: number;
  /** case/feature — the four-column meta grid closing the hero. */
  meta?: number[];
  /** /rosmaster runs 40px wider than every other page. */
  wide?: boolean;
};

const WORK_NAV = [50, 81, 58]; // Robots · Experience · Contact
const LIFE_NAV = [43, 50, 50, 58]; // About · Photos · Design · Contact

const SILHOUETTES: Record<string, Silhouette> = {
  "/": {
    hero: "identity",
    navLinks: WORK_NAV,
    eyebrow: 139, // Robotics Engineer
    tagline: ["62%", "15%"],
    actions: [71, 57, 48, 70], // Resume · LinkedIn · GitHub · Instagram
    below: "work",
    labels: [41, 49], // About · Robots
  },
  "/life": {
    hero: "identity",
    life: true,
    navLinks: LIFE_NAV,
    eyebrow: 105, // Off the clock
    tagline: ["62%", "34%"],
    actions: [69, 58, 48], // Instagram · LinkedIn · GitHub
    below: "photos",
    labels: [41, 90], // About · Photography
  },
  "/roboforce": {
    hero: "case",
    navLinks: WORK_NAV,
    eyebrow: 252, // RoboForce · Robot Learning Data
    title: ["65%", "39%"], // Teleoperation / at Scale
    sub: ["80%", "37%"],
    stats: {
      align: "lead",
      cells: [
        [135, 118],
        [43, 143],
        [42, 149],
        [13, 88],
      ],
    },
    badge: 501,
    meta: [30, 72, 88, 54], // Role · Platforms · Controllers · Output
    labels: [147], // Where This Started
  },
  "/trifinger": {
    hero: "case",
    navLinks: WORK_NAV,
    eyebrow: 316, // UC San Diego · MAE 156B Senior Capstone
    title: ["42%", "62%"], // TriFinger / Manipulation
    sub: ["68%", "40%"],
    stats: {
      align: "even",
      cells: [
        [15, 134],
        [56, 117],
        [40, 110],
        [29, 126],
      ],
    },
    badge: 531,
    labels: [66], // Overview
  },
  "/fod-testing": {
    hero: "case",
    navLinks: WORK_NAV,
    eyebrow: 310, // Apple Inc. · Product Safety Automation
    title: ["71%", "47%"], // Foreign Object / Detection
    sub: ["77%", "71%", "43%"],
    stats: {
      align: "even",
      cells: [
        [71, 126],
        [41, 94],
        [43, 73],
        [98, 104],
      ],
    },
    badge: 558,
    labels: [107], // The Challenge
  },
  "/rosmaster": {
    hero: "feature",
    navLinks: WORK_NAV,
    wide: true,
    eyebrow: 246, // UC Berkeley · Capstone Project
    // Wider than the grid column: the real headline overflows it too.
    title: ["108%", "89%"], // Autonomous / SAR Rover
    sub: ["83%", "100%", "90%", "93%", "9%"],
    meta: [56, 66, 74, 60], // Context · Platform · Autonomy · Payload
    labels: [107], // The Challenge
  },
};

/** Anything off the map (404) gets the plainest shape: a headline and a line. */
const FALLBACK: Silhouette = {
  hero: "case",
  navLinks: WORK_NAV,
  eyebrow: 240,
  title: ["62%", "40%"],
  sub: ["78%", "40%"],
  labels: [100],
};

function silhouetteFor(pathname: string): Silhouette {
  return SILHOUETTES[pathname.replace(/(.)\/+$/, "$1")] ?? FALLBACK;
}

/** One shimmering placeholder, for anything that isn't a run of text. */
function Block({ className, w }: { className?: string; w?: number | string }) {
  return (
    <span
      className={className ? `${styles.block} ${className}` : styles.block}
      style={{ width: w }}
    />
  );
}

/**
 * A run of text: one bar per line, each sitting inside the leading of the
 * real line box. Bars alone would stack tighter than the type they stand in
 * for, and the skeleton would drift up the page as it goes.
 */
function Text({
  widths,
  className,
}: {
  widths: (number | string)[];
  className?: string;
}) {
  return (
    <div className={className ? `${styles.text} ${className}` : styles.text}>
      {widths.map((w, i) => (
        <span
          key={i}
          className={`${styles.block} ${styles.line}`}
          style={{ width: w }}
        />
      ))}
    </div>
  );
}

/* ---------- / and /life ---------- */

function IdentityHero({ eyebrow, tagline, actions, below, labels }: Silhouette) {
  const photos = below === "photos";

  return (
    <>
      <div className={styles.identityHero}>
        <Block className={styles.portrait} />
        <Text className={styles.eyebrow} widths={[eyebrow]} />
        <Text
          className={styles.name}
          widths={["min(50%, 372px)", "min(71%, 536px)"]}
        />
        <Text className={styles.tagline} widths={tagline ?? []} />
        <div className={styles.actions}>
          {(actions ?? []).map((w, i) => (
            <Block key={i} className={styles.pill} w={w} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <Text className={styles.sectionLabel} widths={[labels[0]]} />
        {photos ? (
          <>
            <Text className={styles.body} widths={["97%", "93%", "58%"]} />
            <Text className={styles.body} widths={["95%", "91%", "86%", "44%"]} />
          </>
        ) : (
          <>
            <Text className={styles.greeting} widths={[180]} />
            <Text className={styles.body} widths={["96%", "92%", "89%", "54%"]} />
          </>
        )}
      </div>

      <div className={styles.section}>
        <Text className={styles.sectionLabel} widths={[labels[1]]} />
        {photos ? (
          <>
            <Text className={styles.gear} widths={["min(92%, 520px)"]} />
            <div className={styles.photoGrid}>
              {Array.from({ length: 3 }, (_, i) => (
                <Block key={i} className={styles.photo} />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.rows}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={styles.row}>
                <Block className={styles.thumb} />
                <div className={styles.rowText}>
                  <Text className={styles.rowTitle} widths={["min(38%, 270px)"]} />
                  <Text className={styles.rowHw} widths={["min(20%, 140px)"]} />
                  <Text className={styles.rowDesc} widths={["min(58%, 400px)"]} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------- the write-ups ---------- */

function StatStrip({ align, cells }: NonNullable<Silhouette["stats"]>) {
  return (
    <div
      className={
        align === "lead" ? `${styles.stats} ${styles.statsLead}` : styles.stats
      }
    >
      {cells.map(([value, label], i) => (
        <div key={i} className={styles.stat}>
          <Text
            className={
              align === "lead" && i === 0
                ? `${styles.statValue} ${styles.statValueLead}`
                : styles.statValue
            }
            widths={[value]}
          />
          <Text className={styles.statLabel} widths={[label]} />
        </div>
      ))}
    </div>
  );
}

function MetaGrid({ meta }: { meta: number[] }) {
  return (
    <div className={styles.meta}>
      {meta.map((w, i) => (
        <div key={i} className={styles.metaItem}>
          <Text className={styles.metaLabel} widths={[w]} />
          <Text className={styles.metaValue} widths={["92%", "58%"]} />
        </div>
      ))}
    </div>
  );
}

/** The first section under a write-up's hero: label, then an intro. */
function SectionStub({ label }: { label: number }) {
  return (
    <div className={styles.caseSection}>
      <Text className={styles.sectionLabel} widths={[label]} />
      <Text className={styles.intro} widths={["68%", "64%", "34%"]} />
    </div>
  );
}

function CaseHero({ eyebrow, title, sub, stats, badge, meta, labels }: Silhouette) {
  return (
    <>
      <Text className={styles.back} widths={[52]} />
      <div className={styles.caseHero}>
        <Text className={styles.eyebrow} widths={[eyebrow]} />
        <Text className={styles.title} widths={title ?? []} />
        <Text className={styles.sub} widths={sub ?? []} />
        {stats && <StatStrip {...stats} />}
        {badge && <Text className={styles.badge} widths={[badge]} />}
        {meta && <MetaGrid meta={meta} />}
      </div>
      <SectionStub label={labels[0]} />
    </>
  );
}

function FeatureHero({ eyebrow, title, sub, meta, labels }: Silhouette) {
  return (
    <>
      <Text className={styles.back} widths={[52]} />
      <div className={styles.caseHero}>
        <Text className={styles.eyebrow} widths={[eyebrow]} />
        <div className={styles.featureLayout}>
          <div className={styles.featureText}>
            <Text className={styles.title} widths={title ?? []} />
            <Text className={styles.sub} widths={sub ?? []} />
          </div>
          <Block className={styles.featureImage} />
        </div>
        {meta && <MetaGrid meta={meta} />}
      </div>
      <SectionStub label={labels[0]} />
    </>
  );
}

/**
 * Skeleton of the page silhouette, held over the content until fonts and
 * images have settled. <html data-loading="true"> comes from the server, so
 * the hold is in place on the very first paint (see globals.css); this
 * component is what releases it.
 *
 * The shape is picked from the pathname, so a write-up doesn't load behind
 * the home page's outline. Only the entry route ever needs one — the loader
 * is finished long before any client-side navigation can happen.
 */
export default function PageLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("loading");
  const silhouette = silhouetteFor(pathname);

  // Release the scroll lock / animation pause the moment the skeleton
  // starts fading, not when it finishes unmounting.
  useLayoutEffect(() => {
    if (phase === "loading") return;
    document.documentElement.removeAttribute("data-loading");
  }, [phase]);

  useEffect(() => {
    const start = performance.now();

    const reveal = () => {
      const held = performance.now() - start;
      const wait = Math.max(FORCED_DELAY_MS, MIN_VISIBLE_MS) - held;
      window.setTimeout(() => setPhase("leaving"), Math.max(wait, 0));
    };

    if (document.readyState === "complete") {
      reveal();
      return;
    }
    window.addEventListener("load", reveal, { once: true });
    return () => window.removeEventListener("load", reveal);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("done"), FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`site-loader ${styles.overlay} ${
        phase === "leaving" ? styles.leaving : ""
      }`}
      // The overlay sits outside the /life wrapper, so it has to carry the
      // mode itself — otherwise a dark page loads behind a white screen.
      data-mode={silhouette.life ? "life" : undefined}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.header} aria-hidden="true">
        <div className={styles.headerInner}>
          <Block className={styles.monogram} />
          <div className={styles.navLinks}>
            {silhouette.navLinks.map((w, i) => (
              <Block key={i} className={styles.navLink} w={w} />
            ))}
            <Block className={styles.toggle} />
          </div>
          <Block className={styles.menuButton} />
        </div>
      </div>

      <div
        className={
          silhouette.wide ? `${styles.frame} ${styles.frameWide}` : styles.frame
        }
        aria-hidden="true"
      >
        {silhouette.hero === "identity" && <IdentityHero {...silhouette} />}
        {silhouette.hero === "case" && <CaseHero {...silhouette} />}
        {silhouette.hero === "feature" && <FeatureHero {...silhouette} />}
      </div>
    </div>
  );
}
