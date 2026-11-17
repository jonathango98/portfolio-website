"use client";

import { useEffect, useRef } from "react";
import styles from "./Hairline.module.css";

type Handle = { set(value: number): void; destroy(): void };
type Read = { textContent: string };
type Figure = {
  name: string;
  means: string;
  range: [number, number, number];
  mount(ctx: { stage: HTMLElement; svg: SVGSVGElement; read: Read }, value: number): Handle;
};
type Kernel = {
  inject(root: Document): void;
  mk(tag: string, attrs: Record<string, string>, parent: Element): SVGSVGElement;
};

declare global {
  interface Window {
    HL?: Kernel;
    hairline?: (figure: Figure) => void;
  }
}

function load(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`hairline: could not load ${src}`));
    document.head.append(s);
  });
}

// Each figure file ends by calling window.hairline(figure); load it once and keep the figure.
const figures = new Map<string, Promise<Figure>>();
function getFigure(name: string) {
  let f = figures.get(name);
  if (!f) {
    f = (async () => {
      if (!window.HL) await load("/hairline/kernel.js");
      const got = new Promise<Figure>((resolve) => (window.hairline = resolve));
      await load(`/hairline/${name}.js`);
      return got;
    })();
    figures.set(name, f);
  }
  return f;
}

/** One Hairline figure from /public/hairline/<name>.js, with its read-out in the corner. */
export default function Hairline({ name, label }: { name: string; label: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let handle: Handle | null = null;
    let svg: SVGSVGElement | null = null;
    let live = true;
    getFigure(name).then((figure) => {
      const stage = stageRef.current, HL = window.HL;
      if (!live || !stage || !HL) return;
      HL.inject(document);
      svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
      let text = "rest";
      const read: Read = {
        get textContent() { return text; },
        set textContent(v) { text = v ?? ""; if (readRef.current) readRef.current.textContent = text; },
      };
      handle = figure.mount({ stage, svg, read }, figure.range[1]);
    });
    return () => {
      live = false;
      handle?.destroy();
      svg?.remove();
    };
  }, [name]);

  return (
    <div className={styles.frame}>
      <div ref={stageRef} className={styles.stage} data-hairline={name} role="img" aria-label={label} />
      <span ref={readRef} className={styles.read} aria-hidden="true">rest</span>
    </div>
  );
}
