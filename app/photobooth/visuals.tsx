import type { ReactNode } from "react";
import styles from "./page.module.css";

/* ---------- icons ---------- */

const icon = (path: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

export const icons = {
  camera: icon(
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>,
  ),
  qr: icon(
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
    </>,
  ),
  phone: icon(
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </>,
  ),
  image: icon(
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M20 15l-4.5-4.5L6 20" />
    </>,
  ),
  tablet: icon(
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>,
  ),
  server: icon(
    <>
      <rect x="4" y="4" width="16" height="7" rx="1.5" />
      <rect x="4" y="13" width="16" height="7" rx="1.5" />
      <path d="M8 7.5h.01M8 16.5h.01" />
    </>,
  ),
  wifiOff: icon(
    <>
      <path d="M3 3l18 18" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M14.5 10.4A10 10 0 0 1 19 13M2 9.5a15 15 0 0 1 4.5-2.8M11 6a15 15 0 0 1 11 3.5" />
      <path d="M12 20h.01" />
    </>,
  ),
};

/* ---------- flow diagram ---------- */

export type FlowStep = {
  icon: ReactNode;
  title: string;
  sub?: string;
  chips?: string[];
  arrow?: "next" | "back";
};

export function Flow({ steps, label }: { steps: FlowStep[]; label: string }) {
  return (
    <ol className={styles.flow} aria-label={label}>
      {steps.map((s, i) => (
        <li key={s.title} className={styles.flowStep}>
          <div className={styles.flowNode}>
            <span className={styles.flowIcon}>{s.icon}</span>
            <span className={styles.flowText}>
              <span className={styles.flowTitle}>{s.title}</span>
              {s.sub && <span className={styles.flowSub}>{s.sub}</span>}
              {s.chips && (
                <span className={styles.flowChips}>
                  {s.chips.map((c) => (
                    <span key={c} className={styles.flowChip}>
                      {c}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span className={styles.flowArrow} aria-hidden="true">
              {s.arrow === "back" ? "←" : "→"}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ---------- tablet illustrations ---------- */

function Tablet({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 260" role="img" aria-label={label}>
      <rect x="10" y="10" width="180" height="240" rx="18" className={styles.svBezel} />
      <rect x="22" y="22" width="156" height="216" rx="8" className={styles.svScreen} />
      {children}
    </svg>
  );
}

function MiniFrame({ x, y, w, h, active }: { x: number; y: number; w: number; h: number; active?: boolean }) {
  const pad = w * 0.12;
  const gap = h * 0.05;
  const winH = (h - pad * 2 - gap * 2) / 3;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="3"
        className={active ? styles.svFrameActive : styles.svFrame}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={x + pad}
          y={y + pad + i * (winH + gap)}
          width={w - pad * 2}
          height={winH}
          className={styles.svWindow}
        />
      ))}
    </g>
  );
}

export function TapScreen() {
  return (
    <Tablet label="Booth screen showing the camera and a Tap to start button">
      <circle cx="100" cy="100" r="24" className={styles.svPerson} />
      <path d="M52 190 Q100 128 148 190 Z" className={styles.svPerson} />
      <circle cx="146" cy="70" r="7" className={styles.svSignal} />
      <circle cx="146" cy="70" r="15" className={styles.svSignalRing} />
      <rect x="55" y="200" width="90" height="24" rx="12" className={styles.svInk} />
      <text x="100" y="216" textAnchor="middle" className={styles.svTextLight}>
        Tap to start
      </text>
    </Tablet>
  );
}

export function PickScreen() {
  return (
    <Tablet label="Booth screen showing three frames to choose from, one selected">
      <text x="100" y="52" textAnchor="middle" className={styles.svTextInk}>
        Choose a frame
      </text>
      <MiniFrame x={34} y={72} w={38} h={68} />
      <MiniFrame x={81} y={72} w={38} h={68} active />
      <MiniFrame x={128} y={72} w={38} h={68} />
      <circle cx="100" cy="164" r="10" className={styles.svSignal} />
      <path d="M95 164l3.5 3.5L105 160" className={styles.svCheck} />
      <rect x="55" y="200" width="90" height="24" rx="12" className={styles.svInk} />
      <text x="100" y="216" textAnchor="middle" className={styles.svTextLight}>
        Continue
      </text>
    </Tablet>
  );
}

const QR_CELLS = [
  [3, 0], [5, 1], [4, 2], [3, 3], [6, 3], [0, 3], [2, 4], [4, 4], [5, 5],
  [3, 5], [6, 6], [4, 6], [3, 7], [5, 7], [0, 5], [1, 6], [6, 4], [2, 6],
];

export function ScanScreen() {
  const qx = 98, qy = 48, m = 8;
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={qx + x * m} y={qy + y * m} width={m * 3} height={m * 3} className={styles.svInk} />
      <rect x={qx + x * m + 3} y={qy + y * m + 3} width={m * 3 - 6} height={m * 3 - 6} className={styles.svPaper} />
      <rect x={qx + x * m + 7} y={qy + y * m + 7} width={m * 3 - 14} height={m * 3 - 14} className={styles.svInk} />
    </g>
  );
  return (
    <Tablet label="Booth screen showing the finished collage, a QR code, and a phone scanning it">
      <MiniFrame x={36} y={48} w={46} h={84} />
      <rect x={qx - 6} y={qy - 6} width={m * 8 + 12} height={m * 8 + 12} rx="4" className={styles.svPaper} />
      {finder(0, 0)}
      {finder(5, 0)}
      {finder(0, 5)}
      {QR_CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={qx + x * m} y={qy + y * m} width={m} height={m} className={styles.svInk} />
      ))}
      <path d="M130 124 Q132 150 118 166" className={styles.svDash} />
      <rect x="78" y="160" width="50" height="86" rx="9" className={styles.svPhone} />
      <MiniFrame x={90} y={172} w={26} h={48} />
    </Tablet>
  );
}

/* ---------- on-screen instructions mock ---------- */

export function BoothPopup({ rules, note }: { rules: string[]; note: string }) {
  return (
    <figure className={styles.booth}>
      <div className={styles.popup}>
        <p className={styles.popupTitle}>How it works</p>
        <ol className={styles.popupList}>
          {rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <p className={styles.popupNote}>{note}</p>
        <span className={styles.popupBtn} aria-hidden="true">
          Got it
        </span>
      </div>
    </figure>
  );
}
