"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./DesignCarousel.module.css";

export type Design = {
  src: string;
  title: string;
  width: number;
  height: number;
};

const SWIPE_THRESHOLD = 40;
// Offsets rendered around the center slide; ±2 sit fully faded at the
// edges so a stepping slide always animates from/to somewhere.
const WINDOW = [-2, -1, 0, 1, 2];

const mod = (n: number, m: number) => ((n % m) + m) % m;

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DesignCarousel({ designs: initial }: { designs: Design[] }) {
  // Server HTML renders the given order; reshuffle per visit after
  // hydration (pre-paint) so the markup matches during hydration.
  const [designs, setDesigns] = useState(initial);
  useIsoLayoutEffect(() => {
    setDesigns(shuffle(initial));
  }, [initial]);

  // Unbounded position: mod picks the design, and using it in slide keys
  // lets React keep each slide's DOM as the window shifts, so the CSS
  // transform transition carries slides between positions.
  const [index, setIndex] = useState(0);
  const swipeRef = useRef<{ id: number; startX: number } | null>(null);
  const swipedRef = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    swipeRef.current = { id: e.pointerId, startX: e.clientX };
    swipedRef.current = false;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const swipe = swipeRef.current;
    if (!swipe || swipe.id !== e.pointerId) return;
    swipeRef.current = null;
    const dx = e.clientX - swipe.startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      swipedRef.current = true;
      setIndex((i) => i + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <div
      className={styles.carousel}
      role="group"
      aria-roledescription="carousel"
      aria-label="Design work"
    >
      <div
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeRef.current = null)}
      >
        {WINDOW.map((offset) => {
          const design = designs[mod(index + offset, designs.length)];
          return (
            <div
              key={index + offset}
              className={styles.slide}
              data-pos={
                offset === 0 ? "center" : Math.abs(offset) === 1 ? "near" : "edge"
              }
              style={{ "--offset": offset } as React.CSSProperties}
              aria-hidden={offset !== 0 || undefined}
              onClick={() => {
                if (offset !== 0 && !swipedRef.current) {
                  setIndex((i) => i + offset);
                }
              }}
            >
              <Image
                src={design.src}
                alt={offset === 0 ? design.title : ""}
                width={design.width}
                height={design.height}
                sizes="(max-width: 600px) 72vw, 420px"
                className={styles.artwork}
                draggable={false}
              />
            </div>
          );
        })}

        <button
          type="button"
          className={`${styles.control} ${styles.prev}`}
          aria-label="Previous design"
          onClick={() => setIndex((i) => i - 1)}
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path
              d="M13 3l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.control} ${styles.next}`}
          aria-label="Next design"
          onClick={() => setIndex((i) => i + 1)}
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path
              d="M7 3l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
