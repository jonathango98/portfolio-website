"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import styles from "./PhotoGallery.module.css";

export type Photo = {
  src: string;
  width: number;
  height: number;
};

const ZOOM = 2.5;
const DRAG_THRESHOLD = 6;
// How much of row 3 stays visible (and fades out) while collapsed.
const PEEK_RATIO = 0.5;

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Clip = { collapsed: number; full: number; fade: number };

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  // Server HTML renders the sorted order; reshuffle per visit after
  // hydration (pre-paint) so the markup matches during hydration.
  const [ordered, setOrdered] = useState(photos);
  useIsoLayoutEffect(() => {
    setOrdered(shuffle(photos));
  }, [photos]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const [clip, setClip] = useState<Clip | null>(null);

  const listRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{
    id: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
  } | null>(null);

  const open = openIndex !== null;
  const photo = open ? ordered[openIndex] : null;

  const resetView = useCallback(() => {
    setZoomed(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    resetView();
    lastTriggerRef.current?.focus();
    lastTriggerRef.current = null;
  }, [resetView]);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((i) =>
        i === null ? i : (i + dir + ordered.length) % ordered.length
      );
      resetView();
    },
    [ordered.length, resetView]
  );

  // Keep a zoomed image's edges pinned to the viewport edges.
  const clampOffset = useCallback((x: number, y: number) => {
    const frame = frameRef.current;
    const img = frame?.querySelector("img");
    if (!frame || !img) return { x, y };
    const maxX = Math.max(0, (img.clientWidth * ZOOM - frame.clientWidth) / 2);
    const maxY = Math.max(
      0,
      (img.clientHeight * ZOOM - frame.clientHeight) / 2
    );
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, []);

  const toggleZoom = useCallback(
    (clientX: number, clientY: number) => {
      if (zoomed) {
        resetView();
        return;
      }
      const frame = frameRef.current;
      const img = frame?.querySelector("img");
      if (!frame || !img) return;
      // Zoom toward the clicked point: translate it to the frame's center.
      const rect = img.getBoundingClientRect();
      const px = clientX - (rect.left + rect.width / 2);
      const py = clientY - (rect.top + rect.height / 2);
      setZoomed(true);
      setOffset(clampOffset(-px * ZOOM, -py * ZOOM));
    },
    [zoomed, resetView, clampOffset]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.x,
      baseY: offset.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.moved = true;
    if (zoomed) setOffset(clampOffset(drag.baseX + dx, drag.baseY + dy));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) toggleZoom(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    overlayRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close, step]);

  // Find where grid row 3 starts so the collapsed gallery can clip mid-row.
  // Row heights vary with each photo's aspect ratio and the column count
  // changes with the viewport, so this has to be measured, not computed.
  useIsoLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const listTop = list.getBoundingClientRect().top;
      let rows = 0;
      let lastTop = -Infinity;
      let row3: DOMRect | null = null;
      for (const item of Array.from(list.children)) {
        const rect = item.getBoundingClientRect();
        if (rect.top - listTop - lastTop > 1) {
          rows += 1;
          lastTop = rect.top - listTop;
          if (rows === 3) {
            row3 = rect;
            break;
          }
        }
      }
      if (!row3) {
        setClip(null);
        return;
      }
      const peek = row3.height * PEEK_RATIO;
      setClip({
        collapsed: row3.top - listTop + peek,
        full: list.offsetHeight,
        fade: peek,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [ordered]);

  const blockMenu = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <>
      <div
        className={styles.galleryClip}
        data-expanded={expanded || undefined}
        style={
          clip
            ? ({
                maxHeight: expanded ? clip.full : clip.collapsed,
                "--fade-h": `${clip.fade}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <ul ref={listRef} className={styles.gallery} onContextMenu={blockMenu}>
          {ordered.map((p, i) => (
            <li key={p.src} className={styles.galleryItem}>
              <button
                type="button"
                className={styles.thumbButton}
                aria-label={`View photo ${i + 1} of ${ordered.length}`}
                onClick={(e) => {
                  lastTriggerRef.current = e.currentTarget;
                  setOpenIndex(i);
                }}
              >
                <Image
                  src={p.src}
                  alt=""
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 880px) 31vw, 280px"
                  className={styles.photo}
                  draggable={false}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {clip && (
        <button
          type="button"
          className={styles.expandToggle}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? "Show fewer photos"
              : `Show all ${ordered.length} photos`
          }
          onClick={() => setExpanded((e) => !e)}
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path
              d="M3 7l7 6 7-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {open && photo && (
        <div
          ref={overlayRef}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${openIndex + 1} of ${ordered.length}`}
          tabIndex={-1}
          onContextMenu={blockMenu}
          onDragStart={blockMenu}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={frameRef}
            className={styles.frame}
            data-zoomed={zoomed || undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (dragRef.current = null)}
          >
            <Image
              key={photo.src}
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              sizes="100vw"
              quality={90}
              className={styles.full}
              draggable={false}
              style={{
                transform: zoomed
                  ? `translate(${offset.x}px, ${offset.y}px) scale(${ZOOM})`
                  : undefined,
              }}
              priority
            />
          </div>

          <button
            type="button"
            className={`${styles.control} ${styles.close}`}
            aria-label="Close"
            onClick={close}
          >
            ×
          </button>
          {ordered.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.control} ${styles.prev}`}
                aria-label="Previous photo"
                onClick={() => step(-1)}
              >
                ←
              </button>
              <button
                type="button"
                className={`${styles.control} ${styles.next}`}
                aria-label="Next photo"
                onClick={() => step(1)}
              >
                →
              </button>
            </>
          )}
          <span className={styles.counter} aria-hidden="true">
            {openIndex + 1} / {ordered.length}
          </span>
        </div>
      )}
    </>
  );
}
