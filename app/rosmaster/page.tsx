import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hairline from "@/components/Hairline";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { SITE_URL } from "@/app/site";

const description =
  "UC Berkeley M.Eng capstone: an autonomous ROS 2 rover that uses SLAM and exploration to map disaster interiors, detect survivors, and deliver first aid.";

const heroImage = {
  url: "/images/robot-sar.png",
  width: 1024,
  height: 1024,
  alt: "Yahboom RDK X3 SAR robot with Mecanum wheels and front camera",
};

export const metadata: Metadata = {
  title: "Autonomous SAR Rover",
  description,
  alternates: {
    canonical: "/rosmaster",
  },
  openGraph: {
    title: "Autonomous SAR Rover — Jonathan Goenadibrata",
    description,
    url: "/rosmaster",
    images: [heroImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autonomous SAR Rover — Jonathan Goenadibrata",
    description,
    images: [heroImage.url],
  },
};

const pageUrl = `${SITE_URL}/rosmaster`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Autonomous SAR Rover",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "CreativeWork",
      name: "Autonomous SAR Rover",
      datePublished: "2025-05-01",
      temporalCoverage: "2024-08/2025-05",
      keywords:
        "ROS 2, SLAM, frontier exploration, A* path planning, AprilTag detection, autonomous navigation, search and rescue robotics, Yahboom RDK X3",
      about: [
        { "@type": "Thing", name: "Search and rescue robotics" },
        { "@type": "Thing", name: "Simultaneous localization and mapping" },
      ],
      description,
      url: pageUrl,
      image: `${SITE_URL}${heroImage.url}`,
      author: { "@id": `${SITE_URL}/#person` },
      creator: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en-US",
    },
  ],
};

const heroMeta: { label: string; value: string; detail?: string }[] = [
  { label: "Program", value: "M.Eng Capstone", detail: "UC Berkeley · 2024–25" },
  { label: "Platform", value: "Yahboom RDK X3" },
  { label: "Software", value: "ROS 2 Foxy", detail: "Ubuntu 20.04 · Python 3" },
  { label: "Payload", value: "Electromagnetic arm" },
];

const crisisStats = [
  { value: "65%", desc: "of aftershocks happen within the first 24 hours of an earthquake" },
  { value: "−30%", desc: "drop in a trapped survivor's chance of survival after the first 24 hours" },
  { value: "46%", desc: "of first responders are injured following a major earthquake" },
];

const needs = [
  {
    title: "On-Site Care",
    desc: "Survivors often need first aid before evacuation. With the right supplies delivered early, a conscious survivor can treat life-threatening bleeding themselves.",
  },
  {
    title: "Psychological Support",
    desc: "Being trapped brings severe fear. Knowing they've been found, and being able to communicate, improves cooperation and survival odds while rescue is underway.",
  },
  {
    title: "Rescue Path",
    desc: "When a safe path opens, survivors need clear guidance to the exit, with as little movement as possible near unstable structures.",
  },
];

const capabilities = [
  {
    title: "Mapping",
    desc: "Cartographer SLAM fuses LiDAR, wheel odometry, and IMU into a live 2D map and the robot's place in it. No GPS, no prior floor plan.",
  },
  {
    title: "Navigation",
    desc: "Frontier exploration pushes into unmapped space, and Nav2 plans A* paths over the live map, re-routing around obstacles. Operators can also drive from the live camera feed.",
  },
  {
    title: "Survivor Detection",
    desc: "OpenCV finds AprilTags in the front camera, and a converter node projects each detection into map coordinates, so every survivor found becomes a navigation goal.",
  },
  {
    title: "Aid Delivery",
    desc: "A custom electromagnetic arm carries first-aid packages. One magnet switch gives repeatable pickup and release, with no grasp planning.",
  },
];

const decisions = [
  {
    title: "AprilTags as survivor proxies",
    desc: "Human detection wasn't the research question; the delivery pipeline was. Tags stand in for survivors so the full detect → localize → navigate → deliver loop could be proven end to end, with the vision model swappable later.",
  },
  {
    title: "Electromagnet instead of a gripper",
    desc: "A gripper needs grasp planning and fails in unpredictable ways. Magnetic attachments on the aid packages reduce pickup and release to one switch, reliable enough to demo repeatedly.",
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

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", href: "https://github.com/jonathango98" },
];

export default function RosmasterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main" className={styles.page}>
        <Link href="/" className={styles.back}>
          <span aria-hidden="true">←</span> Back
        </Link>

        {/* hero */}
        <header className={styles.hero}>
          <div className={styles.heroMain}>
            <div>
              <h1 className={styles.heroTitle}>
                Autonomous<br />SAR Rover
              </h1>
              <p className={styles.heroSub}>
                A compact rover that enters earthquake-damaged buildings to
                find survivors, deliver first aid, and relay conditions,{" "}
                <em>without putting responders at risk</em>.
              </p>
            </div>
            <div className={styles.heroFigure}>
              <Hairline name="rosmaster" label="The rescue rover on a round plate; point at a part to name it and see it work" />
            </div>
          </div>
          <dl className={styles.heroMeta}>
            {heroMeta.map((m) => (
              <div key={m.label}>
                <dt className={`label ${styles.heroMetaLabel}`}>{m.label}</dt>
                <dd className={styles.heroMetaValue}>
                  {m.value}
                  {m.detail && (
                    <span className={styles.heroMetaDetail}>{m.detail}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* challenge */}
        <section className={styles.section} aria-labelledby="crisis-h">
          <h2 id="crisis-h" className={styles.sectionLabel}>
            The Challenge
          </h2>
          <p className={styles.sectionIntro}>
            Earthquakes create a lethal window. The first 24 hours are
            critical, yet they are also when conditions are most hazardous
            for human responders.
          </p>
          <div className={styles.stats}>
            {crisisStats.map((s) => (
              <div key={s.value} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <p className={styles.statDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* needs */}
        <section className={styles.section} aria-labelledby="needs-h">
          <h2 id="needs-h" className={styles.sectionLabel}>
            What Survivors Need
          </h2>
          <div className={styles.features}>
            {needs.map((n) => (
              <div key={n.title} className={styles.feature}>
                <h3 className={styles.featureTitle}>{n.title}</h3>
                <p className={styles.featureDesc}>{n.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.needsFigure}>
            <Hairline name="rover" label="A rescue rover in a damaged room, driving a planned path around rubble to a goal on the floor" />
          </div>
        </section>

        {/* callout */}
        <div className={styles.callout}>
          <p className={styles.calloutText}>
            So we send the robot in first. It maps the interior, finds
            survivors, delivers aid, and reports conditions before any
            responder steps inside.
          </p>
        </div>

        {/* how it works */}
        <section className={styles.section} aria-labelledby="caps-h">
          <h2 id="caps-h" className={styles.sectionLabel}>
            How It Works
          </h2>
          <p className={styles.sectionIntro}>
            Four subsystems, each a set of ROS 2 nodes, running together on
            a palm-sized rover.
          </p>
          <div className={styles.capabilities}>
            {capabilities.map((c) => (
              <div key={c.title}>
                <h3 className={styles.capTitle}>{c.title}</h3>
                <p className={styles.capDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* architecture */}
        <section className={styles.section} aria-labelledby="arch-h">
          <h2 id="arch-h" className={styles.sectionLabel}>
            Software Architecture
          </h2>
          <p className={styles.sectionIntro}>
            The full ROS 2 node graph. Sensors feed the mapping and detection
            pipelines; both converge on a master script that plans navigation
            and commands the rescue tool.
          </p>
          <a
            href="/images/rosmaster-software-architecture.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.archLink}
          >
            <Image
              src="/images/rosmaster-software-architecture.jpg"
              alt="ROSMASTER software architecture diagram showing the ROS 2 node graph"
              width={8823}
              height={5553}
              className={styles.archImg}
            />
            <span className={styles.archCaption}>
              Open full size <span aria-hidden="true">↗</span>
            </span>
          </a>
        </section>

        {/* decisions */}
        <section className={styles.section} aria-labelledby="dec-h">
          <h2 id="dec-h" className={styles.sectionLabel}>
            Engineering Decisions
          </h2>
          <ul className={styles.sysList}>
            {decisions.map((d) => (
              <li key={d.title} className={styles.sysItem}>
                <h3 className={styles.sysTitle}>{d.title}</h3>
                <p className={styles.sysDesc}>{d.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* contact */}
        <section className={styles.section} aria-labelledby="ct-h">
          <h2 id="ct-h" className={styles.sectionLabel}>
            Building something? Let&apos;s talk.
          </h2>
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
