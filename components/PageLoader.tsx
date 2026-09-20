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

/**
 * Skeleton of the page silhouette, held over the content until fonts and
 * images have settled. <html data-loading="true"> comes from the server, so
 * the hold is in place on the very first paint (see globals.css); this
 * component is what releases it.
 */
export default function PageLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("loading");

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
      data-mode={pathname.startsWith("/life") ? "life" : undefined}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.header} aria-hidden="true">
        <div className={styles.headerInner}>
          <span className={`${styles.block} ${styles.monogram}`} />
          <div className={styles.navLinks}>
            <span className={`${styles.block} ${styles.navLink}`} />
            <span className={`${styles.block} ${styles.navLink}`} />
            <span className={`${styles.block} ${styles.navLink}`} />
            <span className={`${styles.block} ${styles.toggle}`} />
          </div>
          <span className={`${styles.block} ${styles.menuButton}`} />
        </div>
      </div>

      <div className={styles.frame} aria-hidden="true">
        <span className={`${styles.block} ${styles.portrait}`} />
        <span className={`${styles.block} ${styles.eyebrow}`} />
        <span className={`${styles.block} ${styles.nameLine}`} />
        <span className={`${styles.block} ${styles.nameLineShort}`} />
        <span className={`${styles.block} ${styles.tagline}`} />
        <div className={styles.actions}>
          <span className={`${styles.block} ${styles.pill}`} />
          <span className={`${styles.block} ${styles.pill}`} />
          <span className={`${styles.block} ${styles.pill}`} />
        </div>
        <div className={styles.rows}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.row}>
              <span className={`${styles.block} ${styles.thumb}`} />
              <div className={styles.rowText}>
                <span className={`${styles.block} ${styles.rowTitle}`} />
                <span className={`${styles.block} ${styles.rowDesc}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
