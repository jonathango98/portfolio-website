import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hairline from "@/components/Hairline";
import Link from "next/link";
import styles from "./page.module.css";
import { SITE_URL } from "@/app/site";

const PROJECT_SITE_URL =
  "https://sites.google.com/eng.ucsd.edu/156b-2021-winter-team03/home_1";

const description =
  "A low-cost, 9-DOF three-fingered robotic manipulator built in-house at UC San Diego as a dexterous manipulation platform for robotics and RL research.";

const heroImage = {
  url: "/images/robot-trifinger.png",
  width: 925,
  height: 925,
  alt: "TriFinger robot — three articulated fingers mounted above a shared workspace",
};

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
    images: [heroImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "TriFinger Manipulation — Jonathan Goenadibrata",
    description,
    images: [heroImage.url],
  },
};

const pageUrl = `${SITE_URL}/trifinger`;

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
          name: "TriFinger Manipulation",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "CreativeWork",
      name: "TriFinger Manipulation",
      datePublished: "2021-03-01",
      temporalCoverage: "2021-01/2021-03",
      keywords:
        "dexterous manipulation, 9-DOF manipulator, robot learning platform, reinforcement learning hardware, low-cost robotics",
      about: [{ "@type": "Thing", name: "Dexterous robotic manipulation" }],
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

const heroMeta: { label: string; value: string; detail?: string }[] = [
  { label: "Course", value: "MAE 156B Senior Capstone", detail: "UC San Diego" },
  { label: "Term", value: "Winter 2021" },
  { label: "Team", value: "Team 03" },
  { label: "Sponsor", value: "Prof. Xiaolong Wang", detail: "UCSD ECE" },
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
                TriFinger<br />Manipulation
              </h1>
              <p className={styles.heroSub}>
                A low-cost three-fingered manipulator, built in-house for
                dexterous manipulation research.
              </p>
            </div>
            <div className={styles.heroFigure}>
              <Hairline name="trifinger" label="Three robot fingers hanging from a frame, pinching a cube in a round arena" />
            </div>
          </div>
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

        {/* overview */}
        <section className={styles.section} aria-labelledby="overview-h">
          <h2 id="overview-h" className={styles.overviewLead}>
            A ground-up rebuild of the research-grade TriFinger robot:
            cheaper, easier to source, easier to build.
          </h2>
          <p className={styles.overviewBody}>
            Three fingers, nine joints: it grasps, lifts, and repositions
            objects as a learning platform for UCSD robotics and ML students.
          </p>
        </section>

        {/* design principles */}
        <section className={styles.section} aria-labelledby="principles-h">
          <h2 id="principles-h" className={styles.sectionLabel}>
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

        {/* how it works */}
        <section className={styles.section} aria-labelledby="system-h">
          <h2 id="system-h" className={styles.sectionLabel}>
            How It Works
          </h2>
          <ol className={styles.sysList}>
            {system.map((s) => (
              <li key={s.title} className={styles.sysItem}>
                <h3 className={styles.sysTitle}>{s.title}</h3>
                <p className={styles.sysDesc}>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* full project site */}
        <section className={styles.section} aria-labelledby="site-h">
          <h2 id="site-h" className={styles.sectionLabel}>
            Want the Full Story?
          </h2>
          <p className={styles.ctaLead}>
            CAD models, reports, and videos — all on the project site.
          </p>
          <a
            href={PROJECT_SITE_URL}
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
