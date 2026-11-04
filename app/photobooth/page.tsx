import type { Metadata } from "next";
import type { ComponentType } from "react";
import Nav from "@/components/Nav";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { SITE_URL } from "@/app/site";
import {
  BoothPopup,
  Flow,
  PickScreen,
  ScanScreen,
  TapScreen,
  icons,
  type FlowStep,
} from "./visuals";

const LIVE_URL = "https://photobooth.jonathango.xyz";
const REPO_URL = "https://github.com/jonathango98/photobooth";

const description =
  "A photobooth built to be simple: an iPad, a web page, and a QR code. Guests tap, pick a frame, and scan to get their photos. No app, no sign-up, and a new event takes minutes.";

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
        "simple event photobooth, iPad kiosk, QR code download, no app, offline-first, vanilla JavaScript, Node.js, MongoDB, S3",
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

type Item = { title: string; desc: string };

const use: (Item & { Visual: ComponentType })[] = [
  {
    title: "Tap",
    desc: "The whole screen is the button. A peace sign or a Bluetooth remote works too.",
    Visual: TapScreen,
  },
  {
    title: "Pick",
    desc: "Every frame previews with the guest's own photos in it. One frame? This step is skipped.",
    Visual: PickScreen,
  },
  {
    title: "Scan",
    desc: "A QR code opens the collage on the guest's phone. Save it and go.",
    Visual: ScanScreen,
  },
];

const instructions: string[] = [
  "Tap the screen or show a peace sign ✌️ to start.",
  "After 3 shots, choose a template.",
  "Scan the QR code to download your picture!",
];

const delivery: FlowStep[] = [
  { icon: icons.camera, title: "Shots taken", sub: "on the iPad" },
  { icon: icons.qr, title: "QR on screen", sub: "right away" },
  { icon: icons.phone, title: "Guest scans", sub: "with the phone camera" },
  { icon: icons.image, title: "Photo appears", sub: "ready to save" },
];

const architecture: FlowStep[] = [
  { icon: icons.tablet, title: "iPad", sub: "the booth web page" },
  {
    icon: icons.server,
    title: "One server",
    chips: ["Database", "Photos"],
    arrow: "back",
  },
  { icon: icons.phone, title: "Guest phone", sub: "the download page" },
];

const setup: Item[] = [
  {
    title: "Duplicate an Event",
    desc: "Copy the last event in the admin panel. Change the name and shot count.",
  },
  {
    title: "Drop In a Frame",
    desc: "Design it in Canva on a starter file. A script finds the photo windows, so nothing is placed by hand.",
  },
  {
    title: "Open the Link",
    desc: "Open the booth link on the iPad. The organizer gets their own link to download every photo as a ZIP.",
  },
];

const system: Item[] = [
  {
    title: "Plain Web Page",
    desc: "HTML, CSS, and JavaScript. No framework, no build step. Collages are drawn right on the iPad.",
  },
  {
    title: "One Server",
    desc: "One Node.js server, one database, and one photo bucket run every event.",
  },
  {
    title: "Settings, Not Code",
    desc: "Frames, shots, countdown, and gestures are event settings. A new event never needs a code change.",
  },
];

function Steps({ items, numbered }: { items: Item[]; numbered?: boolean }) {
  return (
    <ol className={styles.sysList}>
      {items.map((s, i) => (
        <li key={s.title} className={styles.sysItem}>
          {numbered && (
            <span className={`caption ${styles.sysNum}`}>0{i + 1}</span>
          )}
          <div className={styles.sysBody}>
            <h3 className={styles.sysTitle}>{s.title}</h3>
            <p className={styles.sysDesc}>{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

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
            A photobooth built to be simple. An iPad, a web page, and a QR
            code.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>1</span>
              <span className={styles.heroStatLabel}>iPad</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>3</span>
              <span className={styles.heroStatLabel}>steps for guests</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>1</span>
              <span className={styles.heroStatLabel}>scan to get your photos</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>0</span>
              <span className={styles.heroStatLabel}>apps to install</span>
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
              A photobooth has one job: take a good photo and get it into the
              guest&apos;s hands.
            </p>
            <p className={styles.overviewBody}>
              So every part is kept simple. Simple to use, simple to explain,
              simple to get your photos, and simple to set up for the next
              event.
            </p>
          </div>
        </section>

        {/* simple to use */}
        <section className={styles.section} aria-labelledby="use-h">
          <h2 id="use-h" className={`label ${styles.sectionLabel}`}>
            Simple to Use
          </h2>
          <div className={styles.features}>
            {use.map((p) => (
              <div key={p.title} className={styles.feature}>
                <div className={styles.illus}>
                  <p.Visual />
                </div>
                <h3 className={styles.featureTitle}>{p.title}</h3>
                <p className={styles.featureDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* simple instructions */}
        <section className={styles.section} aria-labelledby="instructions-h">
          <h2 id="instructions-h" className={`label ${styles.sectionLabel}`}>
            Simple Instructions
          </h2>
          <p className={styles.instructionsIntro}>
            This is everything the booth says, word for word. The steps are
            written from the event&apos;s settings, so they always match what
            the booth does.
          </p>
          <BoothPopup rules={instructions} note="Please be gentle with the iPad 😢" />
        </section>

        {/* callout */}
        <div className={styles.callout}>
          <p className={styles.calloutText}>
            If it needs a staff member standing next to it, it isn&apos;t
            simple enough.
          </p>
        </div>

        {/* simple to keep */}
        <section className={styles.section} aria-labelledby="keep-h">
          <h2 id="keep-h" className={`label ${styles.sectionLabel}`}>
            Simple to Get Your Photos
          </h2>
          <Flow steps={delivery} label="How a guest gets their photo" />
          <div className={styles.note}>
            <span className={styles.flowIcon}>{icons.wifiOff}</span>
            <p className={styles.noteText}>
              <strong>Wi-Fi down?</strong> The QR still works. Photos wait on
              the iPad, retry every minute, and appear on the guest&apos;s
              link once they land.
            </p>
          </div>
          <div className={styles.chips}>
            <span className={styles.chip}>No app</span>
            <span className={styles.chip}>No sign-up</span>
            <span className={styles.chip}>Nothing to type</span>
          </div>
        </section>

        {/* simple to set up */}
        <section className={styles.section} aria-labelledby="setup-h">
          <h2 id="setup-h" className={`label ${styles.sectionLabel}`}>
            Simple to Set Up an Event
          </h2>
          <div className={styles.frames}>
            <figure className={styles.frame}>
              <Image
                src="/images/photobooth/frame-starter.png"
                alt="Canva starter file with three magenta photo windows"
                width={540}
                height={960}
                sizes="(max-width: 680px) 38vw, 180px"
                className={styles.frameImg}
              />
              <figcaption className="caption">Starter file</figcaption>
            </figure>
            <span className={styles.framesArrow} aria-hidden="true">
              →
            </span>
            <figure className={styles.frame}>
              <Image
                src="/images/photobooth/frame-finished.webp"
                alt="Finished three-photo frame designed for a conference"
                width={540}
                height={960}
                sizes="(max-width: 680px) 38vw, 180px"
                className={styles.frameImg}
              />
              <figcaption className="caption">Finished frame</figcaption>
            </figure>
          </div>
          <Steps items={setup} numbered />
        </section>

        {/* simple system */}
        <section className={styles.section} aria-labelledby="system-h">
          <h2 id="system-h" className={`label ${styles.sectionLabel}`}>
            Simple Under the Hood
          </h2>
          <Flow steps={architecture} label="The whole system" />
          <Steps items={system} />
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
