"use client";

import dynamic from "next/dynamic";
import styles from "./RobotSection.module.css";

const MapScene = dynamic(() => import("@/components/scenes/MapScene"), { ssr: false });
const SweepScene = dynamic(() => import("@/components/scenes/SweepScene"), { ssr: false });
const HandScene = dynamic(() => import("@/components/scenes/HandScene"), { ssr: false });

type SceneKey = "map" | "sweep" | "hand";

type Props = {
  id: string;
  detectionId: string;
  hardware: string;
  context: string;
  statement: string;
  href: string;
  ctaLabel: string;
  ctaExternal?: boolean;
  scene: SceneKey;
  bg: "paper" | "mist";
  flip?: boolean;
};

function Scene({ type, className }: { type: SceneKey; className: string }) {
  if (type === "map") return <MapScene className={className} />;
  if (type === "sweep") return <SweepScene className={className} />;
  return <HandScene className={className} />;
}

export default function RobotSection({
  id,
  detectionId,
  hardware,
  context,
  statement,
  href,
  ctaLabel,
  ctaExternal,
  scene,
  bg,
  flip,
}: Props) {
  return (
    <section
      id={id}
      className={`${styles.section} ${bg === "mist" ? styles.mist : ""} ${
        flip ? styles.flip : ""
      }`}
      aria-label={statement}
    >
      <div className={styles.sceneWrap} aria-hidden="true">
        <Scene type={scene} className={styles.scene} />
      </div>

      <div className={styles.overlay}>
        <div className={styles.textBlock}>
          <p className={`${styles.detection} label`}>
            {detectionId}&nbsp;&nbsp;·&nbsp;&nbsp;{hardware}&nbsp;&nbsp;·&nbsp;&nbsp;{context}
          </p>
          <h2 className={styles.statement}>{statement}</h2>
          <a
            href={href}
            className={styles.cta}
            target={ctaExternal ? "_blank" : undefined}
            rel={ctaExternal ? "noopener noreferrer" : undefined}
          >
            {ctaLabel}&nbsp;&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
}
