"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./PhotoGallery.module.css";

export type Photo = {
  src: string;
  width: number;
  height: number;
};

const ZOOM = 2.5;
const DRAG_THRESHOLD = 6;

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
  const photo = open ? photos[openIndex] : null;

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
        i === null ? i : (i + dir + photos.length) % photos.length
      );
      resetView();
    },
    [photos.length, resetView]
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

  const blockMenu = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <>
      <ul className={styles.gallery} onContextMenu={blockMenu}>
        {photos.map((p, i) => (
          <li key={p.src} className={styles.galleryItem}>
            <button
              type="button"
              className={styles.thumbButton}
              aria-label={`View photo ${i + 1} of ${photos.length}`}
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
                sizes="(max-width: 520px) 92vw, (max-width: 880px) 46vw, 280px"
                className={styles.photo}
                draggable={false}
              />
            </button>
          </li>
        ))}
      </ul>

      {open && photo && (
        <div
          ref={overlayRef}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${openIndex + 1} of ${photos.length}`}
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
          {photos.length > 1 && (
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
            {openIndex + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
}
