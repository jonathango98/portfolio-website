import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Link from "next/link";
import styles from "./page.module.css";
import { SITE_URL } from "@/app/site";

const LIVE_URL = "https://photobooth.jonathango.xyz";
const REPO_URL = "https://github.com/jonathango98/photobooth";

const description =
  "A browser-based event photobooth for iPad. Guests take photos, pick a collage template, and scan a QR code to download it on their phone, even when the venue Wi-Fi drops.";

const heroImage = {
  url: "/images/headshot.jpg",
  width: 800,
  height: 1000,
  alt: "Portrait of Jonathan Goenadibrata",
};

export const metadata: Metadata = {
  title: "Photobooth",
  description,
  alternates: {
    canonical: "/photobooth",
  },
  openGraph: {
    title: "Photobooth — Jonathan Goenadibrata",
    description,
    url: "/photobooth",
    images: [heroImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photobooth — Jonathan Goenadibrata",
    description,
    images: [heroImage.url],
  },
};

const pageUrl = `${SITE_URL}/photobooth`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Photobooth", item: pageUrl },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Photobooth",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web browser (iPad kiosk)",
      keywords:
        "event photobooth, kiosk PWA, QR code download, MediaPipe gesture trigger, offline-first, Node.js, MongoDB, S3",
      description,
      url: pageUrl,
      sameAs: LIVE_URL,
      codeRepository: REPO_URL,
      author: { "@id": `${SITE_URL}/#person` },
      creator: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en-US",
    },
  ],
};

const flow: { title: string; desc: string }[] = [
  {
    title: "Strike a Pose",
    desc: "Tap the screen, hold up a peace sign, or click a Bluetooth remote. A countdown runs, then the shots.",
  },
  {
    title: "Pick a Frame",
    desc: "Every template previews live with the guest's own photos already in it.",
  },
  {
    title: "Scan to Keep",
    desc: "A QR code on screen opens the collage on the guest's phone, ready to save.",
  },
];

const system: { title: string; desc: string }[] = [
  {
    title: "Kiosk in a Browser",
    desc: "Plain HTML, CSS, and JS on Netlify, installed on the iPad as a full-screen web app. Collages are composited on a canvas right on the device.",
  },
  {
    title: "Hands-Free Trigger",
    desc: "MediaPipe hand tracking reads peace, palm, and thumbs-up gestures, with a hold-to-confirm ring so a passing wave doesn't fire the shutter.",
  },
  {
    title: "Offline-First Upload",
    desc: "The QR appears before the upload finishes. If the Wi-Fi drops, the photos wait in on-device storage and retry every minute, and the guest's link fills in once they land.",
  },
  {
    title: "One Server, Many Events",
    desc: "Node.js, MongoDB, and an S3 bucket on Railway. Each event has its own templates, shot count, and gestures, with an organizer panel for ZIP downloads and a projector slideshow.",
  },
];

export default function PhotoboothPage() {
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
            Side Project · Live
          </p>
          <h1 className={styles.heroTitle}>Photobooth</h1>
          <p className={styles.heroSub}>
            An event photobooth that runs on an iPad browser and hands every
            guest their collage with one QR scan.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>4</span>
              <span className={styles.heroStatLabel}>ways to fire the shutter</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>1</span>
              <span className={styles.heroStatLabel}>QR scan to download</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>3</span>
              <span className={styles.heroStatLabel}>hand gestures</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>0</span>
              <span className={styles.heroStatLabel}>apps for guests</span>
            </div>
          </div>
          <p className={`caption ${styles.heroBadge}`}>
            Solo build · Since February 2026
          </p>
        </header>

        {/* overview */}
        <section className={styles.section} aria-labelledby="overview-h">
          <h2 id="overview-h" className={`label ${styles.sectionLabel}`}>
            Overview
          </h2>
          <div className={styles.overviewText}>
            <p className={styles.overviewLead}>
              A full event photobooth with no special hardware: just an iPad
              and a web page.
            </p>
            <p className={styles.overviewBody}>
              Each event gets its own frames, shot count, and countdown, set
              up from an admin panel. Guests walk away with their photos on
              their own phone.
            </p>
          </div>
        </section>

        {/* guest flow */}
        <section className={styles.section} aria-labelledby="flow-h">
          <h2 id="flow-h" className={`label ${styles.sectionLabel}`}>
            The Guest Flow
          </h2>
          <div className={styles.features}>
            {flow.map((p) => (
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
            Venue Wi-Fi is never a given, so the booth never waits on it.
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

        {/* live site */}
        <section className={styles.section} aria-labelledby="site-h">
          <h2 id="site-h" className={`label ${styles.sectionLabel}`}>
            See It Live
          </h2>
          <p className={styles.ctaLead}>
            The booth front end is open source.
          </p>
          <div className={styles.ctaRow}>
            <a
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.siteButton}
            >
              Open the booth <span aria-hidden="true">↗</span>
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.siteButton}
            >
              View on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <footer className={styles.footer}>
          <span className="caption">Jonathan Goenadibrata · 2026</span>
        </footer>
      </main>
    </>
  );
}
