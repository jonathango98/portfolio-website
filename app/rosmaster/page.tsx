import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = { title: "Autonomous SAR Rover — Jonathan Goenadibrata" };

const crisisStats = [
  { value: "65%", desc: "of aftershocks happen within the first 24 hours of an earthquake" },
  { value: "−30%", desc: "drop in a trapped survivor's chance of survival after the first 24 hours" },
  { value: "46%", desc: "of first responders are injured following a major earthquake" },
];

const needs = [
  {
    title: "On-Site Care",
    desc: "Survivors often need first aid before evacuation. Life-threatening conditions like external bleeding can be treated by conscious survivors themselves — with the right supplies and guidance delivered early.",
  },
  {
    title: "Psychological Support",
    desc: "Being trapped triggers severe fear and uncertainty. Knowing they've been found and having communication dramatically improves cooperation and survival odds while rescue is underway.",
  },
  {
    title: "Rescue Path",
    desc: "When a safe path opens, survivors need clear, reliable guidance to reach the exit — minimising unnecessary movement that risks disturbing unstable structures.",
  },
];

const capabilities = [
  {
    tag: "01",
    title: "Mapping",
    desc: "LiDAR builds a live map of the environment, giving the system a real-time understanding of the room layout and the robot's position within it.",
  },
  {
    tag: "02",
    title: "Navigation",
    desc: "With the map, the robot patrols the space while continuously updating its model. Operators can also steer manually via live camera feed over a wireless link.",
  },
  {
    tag: "03",
    title: "Image Detection",
    desc: "The front-facing camera detects and localises survivors. In the prototype, AprilTags simulate survivor detection to simplify image recognition while proving the pipeline.",
  },
  {
    tag: "04",
    title: "Pick-Up Tool",
    desc: "A custom electromagnetic arm carries aid supplies directly to survivors. Magnetic attachments enable simple, reliable pickup and release of the aid packages.",
  },
];

const stack = [
  "ROS2 Jazzy", "Ubuntu Linux", "Navigation2",
  "Cartographer SLAM", "OpenCV", "Python 3",
  "Yahboom RDK X3", "A* Pathfinding",
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", href: "https://github.com/jonathango98" },
];

export default function RosmasterPage() {
  return (
    <>
      <Nav />
      <main id="main" className={styles.page}>
        <Link href="/" className={styles.back}>
          <span aria-hidden="true">←</span> Back
        </Link>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className={styles.hero}>
          <p className={`label ${styles.heroEyebrow}`}>
            UC Berkeley · Capstone Project
          </p>
          <div className={styles.heroLayout}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Autonomous<br />SAR Rover
              </h1>
              <p className={styles.heroSub}>
                A compact robotic platform that enters damaged buildings
                after earthquakes to locate survivors, deliver first aid,
                and relay critical information — <em>without putting
                responders at risk</em>.
              </p>
              <p className={`caption ${styles.heroBadge}`}>
                Yahboom RDK X3 · 2024–2025
              </p>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="/images/robot-sar.png"
                alt="Yahboom RDK X3 SAR robot with Mecanum wheels and front camera"
                width={340}
                height={340}
                className={styles.heroImg}
                priority
              />
            </div>
          </div>
        </header>

        {/* ── Crisis stats ─────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="crisis-h">
          <h2 id="crisis-h" className={`label ${styles.sectionLabel}`}>
            The Challenge
          </h2>
          <p className={styles.sectionIntro}>
            Earthquakes create a lethal window. The first 24 hours are
            critical — yet they are also when operating conditions are
            most hazardous for human responders.
          </p>
          <div className={styles.crisisGrid}>
            {crisisStats.map((s) => (
              <div key={s.value} className={styles.crisisCard}>
                <span className={styles.crisisValue}>{s.value}</span>
                <p className={styles.crisisDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Needs ────────────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="needs-h">
          <h2 id="needs-h" className={`label ${styles.sectionLabel}`}>
            What Survivors Need
          </h2>
          <div className={styles.needsLayout}>
            <div className={styles.needsCols}>
              {needs.map((n) => (
                <div key={n.title} className={styles.need}>
                  <h3 className={styles.needTitle}>{n.title}</h3>
                  <p className={styles.needDesc}>{n.desc}</p>
                </div>
              ))}
            </div>
            <div className={styles.needsImage}>
              <Image
                src="/images/project-diagram.png"
                alt="Sketch of the SAR robot navigating a disaster scene and delivering aid"
                width={620}
                height={414}
                className={styles.needsImg}
              />
            </div>
          </div>
        </section>

        {/* ── Callout ──────────────────────────────────────────────────── */}
        <div className={styles.callout}>
          <p className={styles.calloutText}>
            What if there's a way to meet <em>all three needs</em>{" "}
            without putting a single responder at risk?
          </p>
        </div>

        {/* ── Capabilities ─────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="caps-h">
          <h2 id="caps-h" className={`label ${styles.sectionLabel}`}>
            Big Impact in Small Packages
          </h2>
          <p className={styles.sectionIntro}>
            A modular software stack turns a palm-sized rover into a
            complete search-and-rescue platform.
          </p>
          <div className={styles.capabilities}>
            {capabilities.map((c) => (
              <div key={c.tag} className={styles.capability}>
                <span className={`caption ${styles.capTag}`}>{c.tag}</span>
                <h3 className={styles.capTitle}>{c.title}</h3>
                <p className={styles.capDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture ─────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="arch-h">
          <h2 id="arch-h" className={`label ${styles.sectionLabel}`}>
            Software Architecture
          </h2>
          <p className={styles.sectionIntro}>
            Full ROS2 node graph — pan, zoom, and explore interactively.
          </p>
          <iframe
            src="https://miro.com/app/live-embed/uXjVL8SRo48=/"
            className={styles.miroEmbed}
            frameBorder="0"
            scrolling="no"
            allow="fullscreen; clipboard-read; clipboard-write"
            allowFullScreen
          />
          <div className={styles.stackRow}>
            {stack.map((s) => (
              <span key={s} className={styles.stackBadge}>{s}</span>
            ))}
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="ct-h">
          <h2 id="ct-h" className={`label ${styles.sectionLabel}`}>
            Let's Connect
          </h2>
          <p className={styles.ctaLead}>Building something? Let's talk.</p>
          <a className={styles.ctaEmail} href="mailto:jonathangoenadibrata@gmail.com">
            jonathangoenadibrata@gmail.com
          </a>
          <ul className={styles.ctaSocials}>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.ctaSocial}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.footer}>
          <span className="caption">Jonathan Goenadibrata · 2026</span>
        </footer>
      </main>
    </>
  );
}
