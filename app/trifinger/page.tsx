import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const SITE_URL =
  "https://sites.google.com/eng.ucsd.edu/156b-2021-winter-team03/home_1";

const description =
  "A low-cost, 9-DOF three-fingered robotic manipulator built in-house at UC San Diego as a dexterous manipulation platform for robotics and RL research.";

export const metadata: Metadata = {
  title: "TriFinger Manipulation",
  description,
  alternates: {
    canonical: "/trifinger",
  },
  openGraph: {
    title: "TriFinger Manipulation — Jonathan Goenadibrata",
    description,
    url: "/trifinger",
  },
};

const principles: { title: string; desc: string }[] = [
  {
    title: "Cost Efficient",
    desc: "$1,800 to build, versus $5,000 for the original.",
  },
  {
    title: "Readily Available Parts",
    desc: "Every component is off-the-shelf — no custom actuators.",
  },
  {
    title: "Easy to Manufacture",
    desc: "3D-printed on a desktop printer, assembled with common tools.",
  },
];

const system: { title: string; desc: string }[] = [
  {
    title: "Mechanical",
    desc: "Three identical 3-DOF finger modules on an aluminum frame, with swappable fingertips.",
  },
  {
    title: "Actuation & Electronics",
    desc: "Belt-driven steppers and feedback servos, coordinated by an Arduino Mega.",
  },
  {
    title: "Software & Controls",
    desc: "A MATLAB GUI solves the inverse kinematics and streams joint angles to the Arduino.",
  },
];

export default function TrifingerPage() {
  return (
    <>
      <Nav />
      <main id="main" className={styles.page}>
        <Link href="/" className={styles.back}>
          <span aria-hidden="true">←</span> Back
        </Link>

        {/* hero */}
        <header className={styles.hero}>
          <p className={`label ${styles.heroEyebrow}`}>
            UC San Diego · MAE 156B Senior Capstone
          </p>
          <h1 className={styles.heroTitle}>
            TriFinger<br />Manipulation
          </h1>
          <p className={styles.heroSub}>
            A low-cost three-fingered manipulator, built in-house for
            dexterous manipulation research.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>9</span>
              <span className={styles.heroStatLabel}>degrees of freedom</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>−64%</span>
              <span className={styles.heroStatLabel}>cost vs original</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>&lt;1°</span>
              <span className={styles.heroStatLabel}>joint precision</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>3D</span>
              <span className={styles.heroStatLabel}>printed structure</span>
            </div>
          </div>
          <p className={`caption ${styles.heroBadge}`}>
            Team 03 · Sponsored by Prof. Xiaolong Wang, UCSD ECE · Winter 2021
          </p>
        </header>

        {/* overview */}
        <section className={styles.section} aria-labelledby="overview-h">
          <h2 id="overview-h" className={`label ${styles.sectionLabel}`}>
            Overview
          </h2>
          <div className={styles.overview}>
            <div className={styles.overviewText}>
              <p className={styles.overviewLead}>
                A ground-up rebuild of the research-grade TriFinger robot —
                cheaper, easier to source, easier to build.
              </p>
              <p className={styles.overviewBody}>
                Three fingers, nine joints: it grasps, lifts, and repositions
                objects as a learning platform for UCSD robotics and ML
                students.
              </p>
            </div>
            <div className={styles.overviewImage}>
              <Image
                src="/images/robot-trifinger.png"
                alt="TriFinger robot — three articulated fingers mounted above a shared workspace"
                width={420}
                height={420}
                className={styles.overviewImg}
              />
            </div>
          </div>
        </section>

        {/* design principles */}
        <section className={styles.section} aria-labelledby="principles-h">
          <h2 id="principles-h" className={`label ${styles.sectionLabel}`}>
            Design Principles
          </h2>
          <div className={styles.features}>
            {principles.map((p) => (
              <div key={p.title} className={styles.feature}>
                <h3 className={styles.featureTitle}>{p.title}</h3>
                <p className={styles.featureDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* callout */}
        <div className={styles.callout}>
          <p className={styles.calloutText}>
            Nine axes, sub-degree accuracy — from 3D-printed parts and
            off-the-shelf components.
          </p>
        </div>

        {/* how it works */}
        <section className={styles.section} aria-labelledby="system-h">
          <h2 id="system-h" className={`label ${styles.sectionLabel}`}>
            How It Works
          </h2>
          <ol className={styles.sysList}>
            {system.map((s, i) => (
              <li key={s.title} className={styles.sysItem}>
                <span className={`caption ${styles.sysNum}`}>0{i + 1}</span>
                <div className={styles.sysBody}>
                  <h3 className={styles.sysTitle}>{s.title}</h3>
                  <p className={styles.sysDesc}>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* full project site */}
        <section className={styles.section} aria-labelledby="site-h">
          <h2 id="site-h" className={`label ${styles.sectionLabel}`}>
            Want the Full Story?
          </h2>
          <p className={styles.ctaLead}>
            CAD models, reports, and videos — all on the project site.
          </p>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.siteButton}
          >
            Visit the project site <span aria-hidden="true">↗</span>
          </a>
        </section>

        <footer className={styles.footer}>
          <span className="caption">Jonathan Goenadibrata · 2026</span>
        </footer>
      </main>
    </>
  );
}
