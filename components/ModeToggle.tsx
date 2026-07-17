"use client";

import { useRef } from "react";
import { Link, useTransitionRouter } from "next-view-transitions";
import styles from "./ModeToggle.module.css";

export type Mode = "work" | "life";

export default function ModeToggle({ mode }: { mode: Mode }) {
  const router = useTransitionRouter();
  const scrolling = useRef(false);

  // Scroll to the top first, then switch modes, so the crossfade always
  // happens between the two heroes instead of from mid-page.
  const handleClick =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.scrollY <= 0) return; // already at top — Link transitions as usual
      e.preventDefault();
      if (scrolling.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo(0, 0);
        router.push(href);
        return;
      }

      scrolling.current = true;
      const start = performance.now();
      const settle = () => {
        // Bail out after 2s in case the smooth scroll gets interrupted.
        if (window.scrollY <= 0 || performance.now() - start > 2000) {
          scrolling.current = false;
          router.push(href);
        } else {
          requestAnimationFrame(settle);
        }
      };
      window.scrollTo({ top: 0, behavior: "smooth" });
      requestAnimationFrame(settle);
    };

  return (
    <span className={styles.toggle} aria-label="Site mode">
      <Link
        href="/"
        className={styles.seg}
        aria-current={mode === "work" ? "page" : undefined}
        onClick={handleClick("/")}
      >
        Work
      </Link>
      <Link
        href="/life"
        className={styles.seg}
        aria-current={mode === "life" ? "page" : undefined}
        onClick={handleClick("/life")}
      >
        Life
      </Link>
    </span>
  );
}
