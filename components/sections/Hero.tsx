"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

const OccupancyGrid = dynamic(() => import("@/components/scenes/OccupancyGrid"), {
  ssr: false,
});

const socials = [
  { label: "in", href: "https://www.linkedin.com/in/jonathangoenadibrata/", aria: "LinkedIn" },
  { label: "gh", href: "https://github.com/jonathango98", aria: "GitHub" },
  { label: "ig", href: "https://www.instagram.com/jonathango98/", aria: "Instagram" },
];

export default function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const delay = prefersReduced ? 0 : 1600;
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.canvas}>
        <OccupancyGrid className={styles.grid} />
      </div>

      <div className={`${styles.content} ${ready ? styles.contentVisible : ""}`}>
        <p className={`${styles.eyebrow} label`}>
          Robotics Engineer&nbsp;&nbsp;//&nbsp;&nbsp;Localized
        </p>

        <h1 className={styles.name}>
          Jonathan<br />
          Goenadibrata
        </h1>

        <p className={styles.tagline}>
          I build practical robots that make everyday life easier.
        </p>

        <div className={styles.actions}>
          <Button href="/resumes/Tech Resume - Jonathan Goenadibrata.pdf" download>
            Resume ↓ 
          </Button>

          <div className={styles.socials}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className={`${styles.social} caption`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.aria}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <span className={`${styles.scrollLabel} caption`}>scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
