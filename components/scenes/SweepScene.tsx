"use client";

import { useEffect, useRef } from "react";

const SIGNAL = "#ff4d2e";
const TARGET_COUNT = 2700;

// Foreign objects: [angle_deg, radius_frac, detected]
const OBJECTS = [
  { angle: 30,  r: 0.45, shape: "rect" as const },
  { angle: 95,  r: 0.62, shape: "circle" as const },
  { angle: 155, r: 0.38, shape: "rect" as const },
  { angle: 210, r: 0.70, shape: "circle" as const },
  { angle: 270, r: 0.50, shape: "rect" as const },
  { angle: 330, r: 0.60, shape: "circle" as const },
  { angle: 15,  r: 0.30, shape: "rect" as const },
  { angle: 75,  r: 0.75, shape: "circle" as const },
];

export default function SweepScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

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
    const maxR = Math.min(W, H) * 0.42;

    const detected = new Set<number>();
    let count = 0;

    function updateCounter(n: number) {
      if (counterRef.current) {
        counterRef.current.textContent = n.toLocaleString();
      }
    }

    function drawPad() {
      // Outer rings
      for (let i = 3; i >= 1; i--) {
        ctx!.strokeStyle = "#e3e5e9";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(cx, cy, (maxR * i) / 3, 0, Math.PI * 2);
        ctx!.stroke();
      }
      // Cross hairs
      ctx!.strokeStyle = "#e3e5e9";
      ctx!.lineWidth = 0.5;
      ctx!.beginPath();
      ctx!.moveTo(cx - maxR, cy);
      ctx!.lineTo(cx + maxR, cy);
      ctx!.moveTo(cx, cy - maxR);
      ctx!.lineTo(cx, cy + maxR);
      ctx!.stroke();
      // Center dot
      ctx!.fillStyle = "#d2d7de";
      ctx!.beginPath();
      ctx!.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawSweep(angleDeg: number) {
      const angle = (angleDeg - 90) * (Math.PI / 180);

      // Sweep fan + fade
      ctx!.save();
      ctx!.globalAlpha = 0.18;
      ctx!.fillStyle = "#14181f";
      ctx!.beginPath();
      ctx!.moveTo(cx, cy);
      const sweepArc = Math.PI / 4;
      ctx!.arc(cx, cy, maxR, angle - sweepArc, angle);
      ctx!.closePath();
      ctx!.fill();
      ctx!.globalAlpha = 1;

      // Leading edge line
      ctx!.strokeStyle = "rgba(20,24,31,0.5)";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(cx, cy);
      ctx!.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawObjects(sweepAngle: number) {
      OBJECTS.forEach((obj, i) => {
        const rad = (obj.angle - 90) * (Math.PI / 180);
        const ox = cx + Math.cos(rad) * maxR * obj.r;
        const oy = cy + Math.sin(rad) * maxR * obj.r;
        const isDetected = detected.has(i);

        // Check if sweep hit this object
        const normalizedObjAngle = obj.angle % 360;
        const normalizedSweep = sweepAngle % 360;
        const diff = Math.abs(normalizedSweep - normalizedObjAngle);
        if (diff < 4 || diff > 356) {
          if (!isDetected) {
            detected.add(i);
            count = Math.min(count + Math.floor(TARGET_COUNT / OBJECTS.length), TARGET_COUNT);
            updateCounter(count);
          }
        }

        ctx!.save();
        if (isDetected) {
          ctx!.fillStyle = SIGNAL;
          ctx!.strokeStyle = SIGNAL;
        } else {
          ctx!.fillStyle = "#6e7681";
          ctx!.strokeStyle = "#6e7681";
        }

        if (obj.shape === "rect") {
          ctx!.fillRect(ox - 7, oy - 5, 14, 10);
        } else {
          ctx!.beginPath();
          ctx!.arc(ox, oy, 6, 0, Math.PI * 2);
          ctx!.fill();
        }

        if (isDetected) {
          // Detection tick marks (corner style)
          const size = 12;
          ctx!.strokeStyle = SIGNAL;
          ctx!.lineWidth = 1.5;
          ctx!.globalAlpha = 0.8;
          ctx!.beginPath();
          ctx!.moveTo(ox - size, oy - 4);
          ctx!.lineTo(ox - size, oy - size);
          ctx!.lineTo(ox - 4, oy - size);
          ctx!.moveTo(ox + 4, oy - size);
          ctx!.lineTo(ox + size, oy - size);
          ctx!.lineTo(ox + size, oy - 4);
          ctx!.moveTo(ox + size, oy + 4);
          ctx!.lineTo(ox + size, oy + size);
          ctx!.lineTo(ox + 4, oy + size);
          ctx!.moveTo(ox - 4, oy + size);
          ctx!.lineTo(ox - size, oy + size);
          ctx!.lineTo(ox - size, oy + 4);
          ctx!.stroke();
        }
        ctx!.restore();
      });
    }

    function draw(sweepAngle: number) {
      ctx!.clearRect(0, 0, W, H);
      drawPad();
      drawSweep(sweepAngle);
      drawObjects(sweepAngle);
    }

    if (prefersReduced) {
      OBJECTS.forEach((_, i) => detected.add(i));
      count = TARGET_COUNT;
      updateCounter(count);
      draw(360);
      return;
    }

    let startTime: number | null = null;
    let animId: number;
    const CYCLE = 3200; // ms for the single sweep pass

    function drawSettled() {
      ctx!.clearRect(0, 0, W, H);
      drawPad();
      // all objects flagged, no live sweep fan — idle and still
      OBJECTS.forEach((_, i) => detected.add(i));
      count = TARGET_COUNT;
      updateCounter(count);
      drawObjects(-999); // angle that matches nothing; just renders flagged state
    }

    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      // one full pass (plus a hair) to catch every object, then stop
      if (elapsed >= CYCLE * 1.04) {
        drawSettled();
        return;
      }
      const sweepAngle = (elapsed / CYCLE) * 360;
      draw(sweepAngle % 360);
      animId = requestAnimationFrame(animate);
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
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          ref={counterRef}
          style={{
            fontFamily: "var(--font-geist-mono, ui-monospace)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
          }}
        >
          0
        </div>
        <div
          className="caption"
          style={{ marginTop: "4px" }}
        >
          tests automated
        </div>
      </div>
    </div>
  );
}
