"use client";

import { useEffect, useRef, useState } from "react";

// TriFinger: 3 fingers arranged 120° apart, each with 3 joints
// Viewed from above, looking down at the finger assembly

type Vec2 = { x: number; y: number };

function rotate(p: Vec2, angle: number, origin: Vec2 = { x: 0, y: 0 }): Vec2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: origin.x + cos * (p.x - origin.x) - sin * (p.y - origin.y),
    y: origin.y + sin * (p.x - origin.x) + cos * (p.y - origin.y),
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Each finger has 3 segments: proximal, medial, distal
const SEG_LENGTHS = [52, 40, 30];
const JOINT_R = 5;

// Rest angles (open) and grasp angles (closed) per joint per finger, relative to previous segment
const REST_ANGLES =  [0, 0, 0]; // fully open
const GRASP_ANGLES = [Math.PI * 0.35, Math.PI * 0.3, Math.PI * 0.25]; // closing

function drawFinger(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  baseAngle: number,
  jointAngles: number[],
  isActive: boolean
) {
  let x = baseX;
  let y = baseY;
  let angle = baseAngle;

  const points: Vec2[] = [{ x, y }];

  for (let i = 0; i < SEG_LENGTHS.length; i++) {
    angle += jointAngles[i];
    const nx = x + Math.cos(angle) * SEG_LENGTHS[i];
    const ny = y + Math.sin(angle) * SEG_LENGTHS[i];
    points.push({ x: nx, y: ny });
    x = nx;
    y = ny;
  }

  // Draw segments
  ctx.save();
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = isActive ? "#2b313b" : "#6e7681";

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Draw joints
  for (let i = 0; i < points.length - 1; i++) {
    ctx.fillStyle = isActive ? "#14181f" : "#d2d7de";
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, JOINT_R, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fingertip
  ctx.fillStyle = isActive ? "#ff4d2e" : "#6e7681";
  ctx.beginPath();
  ctx.arc(points[points.length - 1].x, points[points.length - 1].y, JOINT_R - 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function HandScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"open" | "closing" | "closed" | "opening">("open");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const cx = W / 2;
    const cy = H / 2;

    // 3 fingers, 120° apart, base positions on a circle of radius ~80px
    const fingerBaseRadius = 90;
    const fingerCount = 3;

    function draw(graspT: number) {
      ctx!.clearRect(0, 0, W, H);

      // Center hub
      ctx!.fillStyle = "#e3e5e9";
      ctx!.beginPath();
      ctx!.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#2b313b";
      ctx!.beginPath();
      ctx!.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx!.fill();

      // Label
      ctx!.save();
      ctx!.font = `500 10px var(--font-geist-mono, ui-monospace)`;
      ctx!.fillStyle = "#6e7681";
      ctx!.letterSpacing = "0.06em";
      ctx!.textAlign = "center";
      ctx!.fillText("TRIFINGER · 9-DOF", cx, H - 40);
      ctx!.restore();

      for (let f = 0; f < fingerCount; f++) {
        const fingerAngle = (f / fingerCount) * Math.PI * 2 + Math.PI / 2;
        const bx = cx + Math.cos(fingerAngle) * fingerBaseRadius;
        const by = cy + Math.sin(fingerAngle) * fingerBaseRadius;

        // Base angle points inward (toward center)
        const baseAngle = fingerAngle + Math.PI;

        const jointAngles = GRASP_ANGLES.map((grasp, i) =>
          lerp(REST_ANGLES[i], grasp, graspT)
        );

        drawFinger(ctx!, bx, by, baseAngle, jointAngles, graspT > 0.5);
      }
    }

    if (prefersReduced) {
      draw(0.6);
      return;
    }

    let startTime: number | null = null;
    let animId: number;
    const GRASP_MS = 1600; // single close, then hold — no ambient loop

    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / GRASP_MS, 1);

      // ease-in-out
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      draw(eased);

      if (t < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        draw(1); // settle grasped
      }
    }

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
