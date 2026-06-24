"use client";

import { useEffect, useRef } from "react";

const CELL = 36;
const SIGNAL = "#ff4d2e";

// Hardcoded room layout: 1=free, 2=wall
// 0 stays unknown at start
const ROOM_MAP = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,2],
  [2,2,2,2,1,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// Path waypoints (col, row) through the room
const PATH = [
  [4,8],[4,6],[4,4],[4,2],[8,2],[10,2],[10,4],[10,6],
  [10,8],[10,10],[13,10],[16,10],[16,8],[16,4],[16,2],
];

// Victim location (col, row)
const VICTIM = [16, 10];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function MapScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = window.devicePixelRatio || 1;

    function setupCanvas() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }

    setupCanvas();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const rows = ROOM_MAP.length;
    const cols = ROOM_MAP[0].length;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const offsetX = (W - cols * CELL) / 2;
    const offsetY = (H - rows * CELL) / 2;

    // Revealed state per cell (0=unknown, 1=free, 2=wall)
    const revealed: number[][] = Array.from({ length: rows }, () =>
      new Array(cols).fill(0)
    );

    function drawCell(col: number, row: number, state: number) {
      const x = offsetX + col * CELL;
      const y = offsetY + row * CELL;
      if (state === 0) {
        // Unknown dot
        ctx!.fillStyle = "#d2d7de";
        ctx!.beginPath();
        ctx!.arc(x + CELL / 2, y + CELL / 2, 2.5, 0, Math.PI * 2);
        ctx!.fill();
      } else if (state === 1) {
        ctx!.fillStyle = "#f5f5f7";
        ctx!.fillRect(x, y, CELL, CELL);
        ctx!.strokeStyle = "#e3e5e9";
        ctx!.lineWidth = 0.5;
        ctx!.strokeRect(x + 0.25, y + 0.25, CELL - 0.5, CELL - 0.5);
      } else {
        ctx!.fillStyle = "#2b313b";
        ctx!.fillRect(x, y, CELL, CELL);
      }
    }

    function drawPath(pathProgress: number) {
      if (pathProgress <= 0) return;
      const totalSegments = PATH.length - 1;
      const segProgress = pathProgress * totalSegments;
      const segIdx = Math.floor(segProgress);
      const segFrac = segProgress - segIdx;

      ctx!.save();
      ctx!.strokeStyle = "#6e7681";
      ctx!.lineWidth = 2;
      ctx!.setLineDash([6, 4]);
      ctx!.lineCap = "round";
      ctx!.beginPath();

      for (let i = 0; i <= segIdx && i < PATH.length - 1; i++) {
        const [c1, r1] = PATH[i];
        const [c2, r2] = PATH[i + 1];
        const x1 = offsetX + c1 * CELL + CELL / 2;
        const y1 = offsetY + r1 * CELL + CELL / 2;
        const x2 = offsetX + c2 * CELL + CELL / 2;
        const y2 = offsetY + r2 * CELL + CELL / 2;

        if (i === 0) ctx!.moveTo(x1, y1);

        if (i < segIdx) {
          ctx!.lineTo(x2, y2);
        } else {
          ctx!.lineTo(x1 + (x2 - x1) * segFrac, y1 + (y2 - y1) * segFrac);
        }
      }
      ctx!.stroke();
      ctx!.restore();

      // Robot dot at current position
      let robotX: number, robotY: number;
      if (segIdx < PATH.length - 1) {
        const [c1, r1] = PATH[Math.min(segIdx, PATH.length - 1)];
        const [c2, r2] = PATH[Math.min(segIdx + 1, PATH.length - 1)];
        robotX = offsetX + (c1 + (c2 - c1) * segFrac) * CELL + CELL / 2;
        robotY = offsetY + (r1 + (r2 - r1) * segFrac) * CELL + CELL / 2;
      } else {
        const [vc, vr] = PATH[PATH.length - 1];
        robotX = offsetX + vc * CELL + CELL / 2;
        robotY = offsetY + vr * CELL + CELL / 2;
      }

      ctx!.save();
      ctx!.fillStyle = "#14181f";
      ctx!.beginPath();
      ctx!.arc(robotX, robotY, 5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawVictim(show: boolean, pulse: number) {
      if (!show) return;
      const [vc, vr] = VICTIM;
      const x = offsetX + vc * CELL + CELL / 2;
      const y = offsetY + vr * CELL + CELL / 2;

      // Pulse ring
      const radius = 12 + pulse * 10;
      ctx!.save();
      ctx!.strokeStyle = SIGNAL;
      ctx!.globalAlpha = (1 - pulse) * 0.6;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(x, y, radius, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.globalAlpha = 1;

      // Core dot
      ctx!.fillStyle = SIGNAL;
      ctx!.beginPath();
      ctx!.arc(x, y, 6, 0, Math.PI * 2);
      ctx!.fill();

      // Label
      ctx!.font = `500 10px var(--font-geist-mono, ui-monospace)`;
      ctx!.fillStyle = SIGNAL;
      ctx!.letterSpacing = "0.08em";
      ctx!.fillText("DETECTED", x + 12, y + 4);
      ctx!.restore();
    }

    function draw(mapP: number, pathP: number, victimP: number, pulse: number) {
      ctx!.clearRect(0, 0, W, H);

      // Reveal cells based on mapProgress
      const revealRadius = Math.sqrt((cols / 2) ** 2 + (rows / 2) ** 2) * mapP;
      const cx = cols / 2;
      const cy = rows / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
          if (dist <= revealRadius) {
            revealed[r][c] = ROOM_MAP[r][c];
          }
          drawCell(c, r, revealed[r][c]);
        }
      }

      drawPath(pathP);
      drawVictim(victimP > 0, pulse);
    }

    if (prefersReduced) {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) revealed[r][c] = ROOM_MAP[r][c];
      draw(1, 1, 1, 0);
      return;
    }

    // Animate in three phases
    const PHASE1 = 2000; // map reveals
    const PHASE2 = 2000; // path traces
    const PHASE3 = 600;  // victim appears
    const TOTAL = PHASE1 + PHASE2 + PHASE3;

    let startTime: number | null = null;
    let animId: number;

    // detection rings a few times, then settles — no ambient loop
    const SETTLE = 2200;

    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const mapP = Math.min(elapsed / PHASE1, 1);
      const pathP = elapsed > PHASE1 ? Math.min((elapsed - PHASE1) / PHASE2, 1) : 0;
      const victimP = elapsed > PHASE1 + PHASE2 ? Math.min((elapsed - PHASE1 - PHASE2) / PHASE3, 1) : 0;

      const sinceDetect = elapsed - (PHASE1 + PHASE2 + PHASE3);
      let pulse = 0;
      if (sinceDetect > 0) {
        const decay = Math.exp(-sinceDetect / 700);
        pulse = ((Math.sin((sinceDetect / 700) * Math.PI * 2) + 1) / 2) * decay;
      }

      draw(easeInOut(mapP), easeInOut(pathP), victimP, pulse);

      if (elapsed < TOTAL + SETTLE) {
        animId = requestAnimationFrame(animate);
      } else {
        // settle to a still, resolved final frame
        draw(1, 1, 1, 0);
      }
    }

    // Start when in view
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animId = requestAnimationFrame(animate);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
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
