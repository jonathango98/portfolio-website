import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { SITE_URL } from "@/app/site";

const description =
  "Robotic automation of Apple's wireless-charging foreign-object safety tests: 2,700 tests per product run unattended, cutting manual labor 96%.";

const heroImage = {
  url: "/images/fod.png",
  width: 467,
  height: 678,
  alt: "Test setup: phone (receiver), foreign object, and wireless charger (transmitter)",
};

export const metadata: Metadata = {
  title: "Foreign Object Detection",
  description,
  alternates: {
    canonical: "/fod-testing",
  },
  openGraph: {
    title: "Foreign Object Detection — Jonathan Goenadibrata",
    description,
    url: "/fod-testing",
    images: [heroImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foreign Object Detection — Jonathan Goenadibrata",
    description,
    images: [heroImage.url],
  },
};

const pageUrl = `${SITE_URL}/fod-testing`;

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
          name: "Foreign Object Detection",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "CreativeWork",
      name: "Foreign Object Detection",
      description,
      url: pageUrl,
      image: `${SITE_URL}${heroImage.url}`,
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

const volumeCards = [
  { n: "3",  label: "object types"   },
  { n: "3",  label: "placements"     },
  { n: "2",  label: "charge states"  },
  { n: "2",  label: "sequences"      },
  { n: "3",  label: "spacer heights" },
  { n: "25", label: "alignments"     },
];

const features: { title: string; desc: string }[] = [
  {
    title: "Autonomous Test Execution",
    desc: "Places the foreign object, runs the charge cycle, and logs temperature data — no operator needed after initialization.",
  },
  {
    title: "End-to-End Device Preparation",
    desc: "Charges, drains, and configures devices for each scenario, so every run starts from the same repeatable state.",
  },
  {
    title: "Continuous & Scalable",
    desc: "Runs unattended, including overnight. Nine systems operate in parallel to cover the full 2,700-test matrix in a day.",
  },
];

const comparison = [
  { metric: "Tests per product", manual: "108", automated: "2,700" },
  { metric: "Time per product", manual: "2.4 days", automated: "1 day" },
  {
    metric: "Throughput",
    manual: "3 engineers · 10 min/test",
    automated: "9 robots · 5 min/test",
  },
  { metric: "Person-hours per product", manual: "36.5", automated: "1.5" },
  { metric: "Labor per year (8 products)", manual: "292 hrs", automated: "12 hrs" },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", href: "https://github.com/jonathango98" },
];

export default function FodTestingPage() {
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
          <p className={`label ${styles.heroEyebrow}`}>
            Apple Inc. · Product Safety Automation
          </p>
          <h1 className={styles.heroTitle}>
            Foreign Object<br />Detection
          </h1>
          <p className={styles.heroSub}>
            Robotic systems that run Apple&apos;s wireless-charging safety
            tests end to end — device prep, test execution, temperature data
            collection — unattended, overnight.
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
            Safety Test Automation Engineer · Hyulim DTR-MU · Aug 2021 – Jun 2024
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
            2,700 repetitive tests per product, per year. Every hour an
            engineer spends running them is an hour not spent on problems
            that need an engineer.
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
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={styles.srOnly}>Metric</span>
                </th>
                <th scope="col">Manual</th>
                <th scope="col">Automated</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.metric}>
                  <th scope="row" className={styles.compareMetric}>
                    {row.metric}
                  </th>
                  <td className={styles.compareManual}>{row.manual}</td>
                  <td className={styles.compareAuto}>{row.automated}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={`caption ${styles.tableNote}`}>
            108 tests was the practical ceiling for a team of three — running
            the full 2,700-test matrix manually would take 75 days per
            product. Automation runs all of it in one.
          </p>
          <p className={`caption ${styles.tableNote}`}>
            Built as internal tooling on Apple&apos;s product safety team, so
            the hardware and source aren&apos;t public. Happy to walk through
            the design in conversation.
          </p>
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
