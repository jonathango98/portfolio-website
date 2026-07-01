import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = { title: "Autonomous SAR Rover — Jonathan Goenadibrata" };

const heroMeta = [
  { label: "Context", value: "UC Berkeley M.Eng Capstone · 2024–25" },
  { label: "Platform", value: "Yahboom RDK X3 · ROS 2 Foxy" },
  { label: "Autonomy", value: "SLAM · exploration · A* navigation" },
  { label: "Payload", value: "Electromagnetic aid-delivery arm" },
];

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
    tech: "LiDAR · Cartographer SLAM",
    desc: "LiDAR, wheel odometry, and IMU data are fused into a live 2D map, giving the system the room layout and the robot's position within it — no GPS, no prior floor plan.",
  },
  {
    tag: "02",
    title: "Navigation",
    tech: "Nav2 · A* · frontier exploration",
    desc: "The robot explores unmapped space on its own, planning paths with A* over the live map and re-routing around obstacles. Operators can also steer manually via the live camera feed.",
  },
  {
    tag: "03",
    title: "Survivor Detection",
    tech: "OpenCV · AprilTags",
    desc: "The front-facing camera detects survivors and a converter node projects each detection from camera frame into map coordinates, so found survivors become navigation goals.",
  },
  {
    tag: "04",
    title: "Aid Delivery",
    tech: "Electromagnet · custom arm",
    desc: "A custom electromagnetic arm carries first-aid packages to survivors. A magnet switch gives binary, repeatable pickup and release — no grasp planning required.",
  },
];

const decisions = [
  {
    title: "AprilTags as survivor proxies",
    desc: "Human detection wasn't the research question — the delivery pipeline was. Tags stand in for survivors so the full detect → localize → navigate → deliver loop could be proven end-to-end, with the vision model swappable later.",
  },
  {
    title: "Electromagnet instead of a gripper",
    desc: "A gripper needs grasp planning and fails in unpredictable ways. Magnetic attachments on the aid packages reduce pickup and release to a single switch — reliable enough to demo repeatedly.",
  },
  {
    title: "Cartographer SLAM with sensor fusion",
    desc: "Collapsed interiors are GPS-denied and cluttered. Fusing LiDAR scans with odometry and IMU keeps the map and pose estimate stable when any single sensor degrades.",
  },
  {
    title: "Autonomy with an operator in the loop",
    desc: "The robot maps, explores, and navigates on its own, but RViz streams the live map and detections to an operator who can override with a goal pose at any time. In a rescue, a human stays in command.",
  },
];

const stack = [
  "ROS 2 Foxy", "Ubuntu 20.04", "Navigation2",
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
          <dl className={styles.heroMeta}>
            {heroMeta.map((m) => (
              <div key={m.label} className={styles.heroMetaItem}>
                <dt className={`label ${styles.heroMetaLabel}`}>{m.label}</dt>
                <dd className={styles.heroMetaValue}>{m.value}</dd>
              </div>
            ))}
          </dl>
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
            So we send the robot in first. It maps the interior, finds
            survivors, delivers aid, and reports conditions — before any
            responder steps inside.
          </p>
        </div>

        {/* ── Capabilities ─────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="caps-h">
          <h2 id="caps-h" className={`label ${styles.sectionLabel}`}>
            Capabilities
          </h2>
          <p className={styles.sectionIntro}>
            Four subsystems, each a set of ROS 2 nodes, running together
            on a palm-sized rover.
          </p>
          <div className={styles.capabilities}>
            {capabilities.map((c) => (
              <div key={c.tag} className={styles.capability}>
                <span className={`caption ${styles.capTag}`}>
                  {c.tag} <span className={styles.capTech}>{c.tech}</span>
                </span>
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
            The full ROS 2 node graph. Sensors feed the mapping and
            detection pipelines; both converge on a master script that
            plans navigation and commands the rescue tool.
          </p>
          <a
            href="/images/rosmaster-software-architecture.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.archLink}
          >
            <Image
              src="/images/rosmaster-software-architecture.jpg"
              alt="ROSMASTER software architecture diagram showing the ROS2 node graph"
              width={8823}
              height={5553}
              className={styles.archImg}
            />
          </a>
          <p className={styles.archCaption}>Click to open full size</p>
          <div className={styles.stackRow}>
            {stack.map((s) => (
              <span key={s} className={styles.stackBadge}>{s}</span>
            ))}
          </div>
        </section>

        {/* ── Decisions ────────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="dec-h">
          <h2 id="dec-h" className={`label ${styles.sectionLabel}`}>
            Engineering Decisions
          </h2>
          <div className={styles.decisions}>
            {decisions.map((d) => (
              <div key={d.title} className={styles.decision}>
                <h3 className={styles.decisionTitle}>{d.title}</h3>
                <p className={styles.decisionDesc}>{d.desc}</p>
              </div>
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
