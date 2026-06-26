import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import styles from "./page.module.css";

export const metadata = {
  title: "Foreign Object Detection — Jonathan Goenadibrata",
};

const volumeCards = [
  { n: "3",  label: "object types"   },
  { n: "3",  label: "placements"     },
  { n: "2",  label: "charge states"  },
  { n: "2",  label: "sequences"      },
  { n: "3",  label: "spacer heights" },
  { n: "25", label: "alignments"     },
];

const features: { title: string; desc: ReactNode }[] = [
  {
    title: "Autonomous Test Execution",
    desc: <>Executes simple tests with <strong>minimal setup</strong> — <u>no manual intervention required</u> after initialization.</>,
  },
  {
    title: "End-to-End Device Preparation",
    desc: <>Manages all device prep: charging, draining, and configuring for each scenario. <em>Consistent and repeatable.</em></>,
  },
  {
    title: "Continuous & Scalable",
    desc: <>Runs <strong>unattended</strong>, including <em>overnight</em>. Modular design supports parallel systems for higher throughput.</>,
  },
];

const stats = [
  { value: "25×", label: "test coverage", caption: "vs. manual baseline" },
  { value: "96%", label: "labor reduction", caption: "per product cycle" },
  { value: "280", label: "hours freed / yr", caption: "across 8 products" },
  { value: "1.5", label: "hrs per product", caption: "automated runtime" },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", href: "https://github.com/jonathango98" },
];

export default function FodTestingPage() {
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
            Apple Inc. · Product Safety Automation
          </p>
          <h1 className={styles.heroTitle}>
            Foreign Object<br />Detection
          </h1>
          <p className={styles.heroSub}>
            Robotic system that replaced <strong>280 hrs/yr</strong> of
            manual wireless-charging safety tests at Apple with{" "}
            <em>a single unattended overnight run</em>.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>2,700</span>
              <span className={styles.heroStatLabel}>tests per product</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>25×</span>
              <span className={styles.heroStatLabel}>more coverage</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>96%</span>
              <span className={styles.heroStatLabel}>less labor</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>280 hrs</span>
              <span className={styles.heroStatLabel}>freed per year</span>
            </div>
          </div>
          <p className={`caption ${styles.heroBadge}`}>
            Hyulim DTR-MU · Aug 2021 – Jun 2024
          </p>
        </header>

        {/* challenge */}
        <section className={styles.section} aria-labelledby="challenge-h">
          <h2 id="challenge-h" className={`label ${styles.sectionLabel}`}>
            The Challenge
          </h2>
          <div className={styles.challenge}>
            <div className={styles.challengeCol}>
              <p className={`label ${styles.colLabel}`}>Low Complexity</p>
              <p className={styles.colIntro}>The task itself is <strong>simple</strong>.</p>
              <div className={styles.fodDiagram}>
                <Image
                  src="/images/fod.png"
                  alt="Test setup: phone (receiver), foreign object, and wireless charger (transmitter)"
                  width={400}
                  height={560}
                  className={styles.fodDiagramImg}
                />
              </div>
              <ol className={styles.steps}>
                {[
                  "Place foreign object",
                  "Turn on wireless charger",
                  "Collect temperature data",
                ].map((step, i) => (
                  <li key={i} className={styles.stepItem}>
                    <span className={`caption ${styles.stepNum}`}>
                      0{i + 1}
                    </span>
                    <span className={styles.stepText}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.challengeDivider} aria-hidden="true" />

            <div className={styles.challengeCol}>
              <p className={`label ${styles.colLabel}`}>High Volume</p>
              <p className={styles.colIntro}>Per product, per year:</p>
              <div className={styles.volumeGrid}>
                {volumeCards.map((c) => (
                  <div key={c.label} className={styles.volumeCard}>
                    <span className={styles.volumeN}>{c.n}</span>
                    <span className={styles.volumeFactorLabel}>{c.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.volumeTotal}>
                <span className={styles.volumeTotalN}>2,700</span>
                <span className={styles.volumeTotalLabel}>tests total</span>
              </div>
            </div>
          </div>
        </section>

        {/* callout */}
        <div className={styles.callout}>
          <p className={styles.calloutText}>
            How to <em>better allocate time</em> for engineers in order to
            maximize <strong>human problem-solving</strong>{" "}
            <u>where it matters most</u>?
          </p>
        </div>

        {/* solution */}
        <section className={styles.section} aria-labelledby="solution-h">
          <h2 id="solution-h" className={`label ${styles.sectionLabel}`}>
            The Solution
          </h2>
          <div className={styles.features}>
            {features.map((f) => (
              <div key={f.title} className={styles.feature}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* results */}
        <section className={styles.section} aria-labelledby="results-h">
          <h2 id="results-h" className={`label ${styles.sectionLabel}`}>
            Results
          </h2>
          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={`caption ${styles.statCaption}`}>
                  {s.caption}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* contact */}
        <section className={styles.section} aria-labelledby="ct-h">
          <h2 id="ct-h" className={`label ${styles.sectionLabel}`}>
            Let's Connect
          </h2>
          <p className={styles.ctaLead}>Building something? Let's talk.</p>
          <a
            className={styles.ctaEmail}
            href="mailto:jonathangoenadibrata@gmail.com"
          >
            jonathangoenadibrata@gmail.com
          </a>
          <ul className={styles.ctaSocials}>
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaSocial}
                >
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
