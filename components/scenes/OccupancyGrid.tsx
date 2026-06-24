"use client";

import { useEffect, useRef } from "react";

const CELL = 40;
const DURATION = 1800;

type CellState = 0 | 1 | 2; // 0=unknown, 1=free, 2=occupied

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function OccupancyGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = window.devicePixelRatio || 1;

    function setup() {
      if (!canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      return { W, H };
    }

    let dims = setup();
    if (!dims) return;
    let { W, H } = dims;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cols = Math.ceil(W / CELL) + 1;
    const rows = Math.ceil(H / CELL) + 1;
    const total = cols * rows;

    // Predetermined cell states: ~15% occupied, rest free
    const targetState: CellState[] = Array.from({ length: total }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      // Create wall-like clusters near edges
      if (col === 0 || col === cols - 1 || row === 0 || row === rows - 1)
        return 2;
      // Sparse interior walls
      const seed = (col * 7 + row * 13) % 97;
      if (seed < 10) return 2;
      return 1;
    });

    // BFS order from center
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    const order: number[] = [];
    const visited = new Set<number>();
    const queue: [number, number][] = [[cx, cy]];
    while (queue.length) {
      const [c, r] = queue.shift()!;
      const idx = r * cols + c;
      if (visited.has(idx)) continue;
      visited.add(idx);
      order.push(idx);
      for (const [dc, dr] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nc = c + dc;
        const nr = r + dr;
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
          if (!visited.has(nr * cols + nc)) {
            queue.push([nc, nr]);
          }
        }
      }
    }

    const currentState: CellState[] = new Array(total).fill(0);
    let revealedCount = 0;

    function draw(progress: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const toReveal = Math.floor(easeOut(progress) * total);
      while (revealedCount < toReveal && revealedCount < order.length) {
        currentState[order[revealedCount]] = targetState[order[revealedCount]];
        revealedCount++;
      }

      for (let i = 0; i < total; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * CELL;
        const y = row * CELL;
        const state = currentState[i];

        if (state === 0) {
          // Unknown: tiny dot
          ctx.fillStyle = "#d2d7de";
          ctx.beginPath();
          ctx.arc(x + CELL / 2, y + CELL / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (state === 1) {
          // Free: hairline cell border only
          ctx.strokeStyle = "#e3e5e9";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
        } else {
          // Occupied: dark fill
          ctx.fillStyle = "#2b313b";
          ctx.fillRect(x, y, CELL, CELL);
        }
      }
    }

    if (prefersReduced) {
      revealedCount = 0;
      draw(1);
      return;
    }

    let startTime: number | null = null;
    let animId: number;

    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / DURATION, 1);
      draw(progress);
      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    }

    animId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(() => {
      revealedCount = 0;
      dims = setup();
      if (!dims) return;
      W = dims.W;
      H = dims.H;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
