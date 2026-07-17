"use client";

import { useEffect, useRef, useState } from "react";
import ModeToggle, { type Mode } from "./ModeToggle";
import styles from "./Nav.module.css";

type NavLink = { label: string; href: string };

const workLinks: NavLink[] = [
  { label: "Robots", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  const [path, hash] = href.split("#");
  if (!hash || window.location.pathname !== (path || "/")) return;
  const target = document.getElementById(hash);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView();
  history.pushState(null, "", `#${hash}`);
}

export default function Nav({
  links = workLinks,
  mode = "work",
}: {
  links?: NavLink[];
  mode?: Mode;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape-to-close (returning focus to the button), body scroll lock,
  // and state reset when resizing/rotating past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const mql = window.matchMedia("(max-width: 520px)");
    const onMedia = (e: MediaQueryListEvent) => {
      if (!e.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onMedia);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onMedia);
    };
  }, [open]);

  // Close synchronously — clearing the scroll lock right away so a scroll
  // started in the same click (anchor jump, mode-toggle scroll-to-top)
  // isn't blocked; the effect cleanup only runs after the next render.
  const closeMenu = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
  };

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.monogram} aria-label="Home">
          <span>JG</span>
        </a>

        <nav aria-label="Main">
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Menu"}
            onClick={() => (open ? closeMenu() : setOpen(true))}
          >
            <span className={styles.menuLine} aria-hidden="true" />
            <span className={styles.menuLine} aria-hidden="true" />
          </button>

          {open && (
            <div
              className={styles.scrim}
              aria-hidden="true"
              onClick={closeMenu}
            />
          )}

          <div
            id="site-menu"
            className={open ? `${styles.panel} ${styles.open}` : styles.panel}
          >
            <ul className={styles.links}>
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={styles.link}
                    onClick={(e) => {
                      closeMenu(); // close before the smooth scroll runs
                      handleAnchorClick(e, l.href);
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {/* Capture phase: close before ModeToggle's own click handler
                  navigates, so the view transition never snapshots an open
                  panel. */}
              <li className={styles.modeItem} onClickCapture={closeMenu}>
                <ModeToggle mode={mode} />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
