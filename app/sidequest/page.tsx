import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hairline from "@/components/Hairline";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { SITE_URL } from "@/app/site";

const REPO_URL = "https://github.com/jonathango98/nextgen27-sidequest";

const description =
  "An optional phone game for NextGen Conference 2027 that helps youth leaders meet people from other churches. Join with one QR scan, play in the browser, nothing to install.";

const heroImage = {
  url: "/images/headshot.jpg",
  width: 800,
  height: 1000,
  alt: "Portrait of Jonathan Goenadibrata",
};

export const metadata: Metadata = {
  title: "Side Quest",
  description,
  alternates: {
    canonical: "/sidequest",
  },
  openGraph: {
    title: "Side Quest — Jonathan Goenadibrata",
    description,
    url: "/sidequest",
    images: [heroImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Side Quest — Jonathan Goenadibrata",
    description,
    images: [heroImage.url],
  },
};

const pageUrl = `${SITE_URL}/sidequest`;

const heroMeta: { label: string; value: string; detail?: string }[] = [
  { label: "Event", value: "NextGen Conference 2027", detail: "March 2027" },
  { label: "Status", value: "In development" },
  { label: "Role", value: "Lead developer, game master, UI designer, project manager" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Side Quest", item: pageUrl },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Side Quest",
      applicationCategory: "GameApplication",
      operatingSystem: "Web browser (iOS, Android)",
      creativeWorkStatus: "In development",
      keywords:
        "conference game, QR code networking, FastAPI, mobile web app, event software",
      description,
      url: pageUrl,
      codeRepository: REPO_URL,
      author: { "@id": `${SITE_URL}/#person` },
      creator: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en-US",
    },
  ],
};

// Real screens from a local run of the app, seeded with its preview test player.
const screens: { src: string; title: string }[] = [
  {
    src: "/images/sidequest/join.jpg",
    title: "Join",
  },
  {
    src: "/images/sidequest/home.jpg",
    title: "Home",
  },
  {
    src: "/images/sidequest/code.jpg",
    title: "My Code",
  },
  {
    src: "/images/sidequest/quests.jpg",
    title: "Quests",
  },
];

const surfaces: { title: string; desc: string }[] = [
  { title: "Player phones", desc: "Join, My Code, scan, quests" },
  { title: "Usher console", desc: "Find a player, record visits" },
  { title: "Admin console", desc: "Start, pause, or switch off" },
  { title: "Main screen", desc: "Secret link, no login" },
];

const system: { title: string; desc: string }[] = [
  {
    title: "Phone-First Web App",
    desc: "FastAPI and server-rendered Jinja pages on Railway. One QR to join, no app store, tested on the iPhone browser engine.",
  },
  {
    title: "One Points Service",
    desc: "Every award goes through one place that pays it once. Each pair of players counts once, even when both phones scan at the same moment, and every award lands in an append-only audit trail.",
  },
  {
    title: "Built for the Room",
    desc: "Pauses during sessions, an usher console for help at the door, and a big-screen view that cycles leaderboards and shared journals.",
  },
  {
    title: "Safe by Default",
    desc: "No messaging, no email or phone numbers, no photo uploads. Personal QR codes rotate so screenshots can't be shared, and all player data is deleted after the event.",
  },
];

const team: { title: string; desc: string }[] = [
  {
    title: "One Rulebook",
    desc: "AGENTS.md holds the rules for volunteers and their AI agents alike. The agent stops and asks before schema changes, auth, minors' data, point values, or a new dependency.",
  },
  {
    title: "Plan, Then Teach",
    desc: "Before touching a file, the agent shows a plan that cites the written rules. After each change, it explains in plain words what changed and why.",
  },
  {
    title: "Proven on a Phone",
    desc: "The agent checks every changed screen at 360px, then a person runs each test step on a real phone.",
  },
  {
    title: "A Person Merges",
    desc: "One task, one branch, one PR. Game rules and settings change only with my approval through code owner review, and agents never merge.",
  },
];

export default function SideQuestPage() {
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
                Side<br />Quest
              </h1>
              <p className={styles.heroSub}>
                A phone game that makes meeting other churches the easiest way
                to score.
              </p>
            </div>
            <div className={styles.heroFigure}>
              <Hairline name="sidequest" label="Two phones on a table, one scanning the QR code on the other" />
            </div>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>300</span>
              <span className={styles.heroStatLabel}>youth leaders</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>1</span>
              <span className={styles.heroStatLabel}>QR scan to join</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>0</span>
              <span className={styles.heroStatLabel}>apps to install</span>
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
            At most conferences, youth leaders spend their free time with
            their own church. Side Quest turns that around.
          </h2>
          <p className={styles.overviewBody}>
            An optional game that runs in the phone&apos;s browser. Players
            earn points for meeting people, exploring the venue, and sharing
            what they learned, with the biggest points for crossing church
            lines.
          </p>
        </section>

        {/* launch video */}
        <section className={styles.section} aria-labelledby="video-h">
          <h2 id="video-h" className={styles.sectionLabel}>
            How to Play
          </h2>
          <p className={styles.sectionIntro}>
            The how-to video players see before the conference, in 25
            seconds.
          </p>
          <div className={styles.video}>
            <video
              className={styles.videoEl}
              controls
              playsInline
              preload="metadata"
              poster="/images/sidequest/howto-poster.jpg"
              width={1280}
              height={720}
            >
              <source src="/videos/sidequest-howto.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="/videos/sidequest-howto.vtt"
                srcLang="en"
                label="English"
              />
            </video>
          </div>
        </section>

        {/* the app */}
        <section className={styles.section} aria-labelledby="app-h">
          <h2 id="app-h" className={styles.sectionLabel}>
            The App
          </h2>
          <ul className={styles.screens}>
            {screens.map((s) => (
              <li key={s.title} className={styles.screen}>
                <div className={styles.phone}>
                  <Image
                    src={s.src}
                    alt={`Side Quest ${s.title} screen`}
                    width={390}
                    height={844}
                    sizes="(max-width: 680px) 45vw, 200px"
                    className={styles.phoneImg}
                  />
                </div>
                <h3 className={styles.screenTitle}>{s.title}</h3>
              </li>
            ))}
          </ul>
        </section>

        {/* how it works */}
        <section className={styles.section} aria-labelledby="system-h">
          <h2 id="system-h" className={styles.sectionLabel}>
            How It Works
          </h2>
          <p className={styles.sectionIntro}>
            Load-tested with 300 phones joining within a minute, because
            everyone scans the join QR together on night one.
          </p>
          <div className={styles.arch} role="img" aria-label="Four screens talk to one FastAPI app, which checks the game state, pays points through one service, writes an audit log, and stores everything in SQLite on a Railway volume with daily, weekly, and monthly backups.">
            <ul className={styles.archCol}>
              {surfaces.map((s) => (
                <li key={s.title} className={styles.archNode}>
                  <span className={styles.archNodeTitle}>{s.title}</span>
                  <span className={`caption ${styles.archNodeDesc}`}>{s.desc}</span>
                </li>
              ))}
            </ul>
            <span className={styles.archArrow} aria-hidden="true" />
            <div className={`${styles.archNode} ${styles.archCore}`}>
              <span className={`caption ${styles.archCoreTag}`}>One app · FastAPI</span>
              <span className={styles.archStep}>Game on, paused, or off?</span>
              <span className={styles.archStep}>Points service, pays once</span>
              <span className={styles.archStep}>Audit log, append-only</span>
            </div>
            <span className={styles.archArrow} aria-hidden="true" />
            <div className={styles.archCol}>
              <div className={styles.archNode}>
                <span className={styles.archNodeTitle}>SQLite</span>
                <span className={`caption ${styles.archNodeDesc}`}>On a Railway volume</span>
              </div>
              <div className={`${styles.archNode} ${styles.archNodeQuiet}`}>
                <span className={styles.archNodeTitle}>Backups</span>
                <span className={`caption ${styles.archNodeDesc}`}>Daily, weekly, monthly</span>
              </div>
            </div>
          </div>
          <ol className={styles.sysList}>
            {system.map((s) => (
              <li key={s.title} className={styles.sysItem}>
                <h3 className={styles.sysTitle}>{s.title}</h3>
                <p className={styles.sysDesc}>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* team workflow */}
        <section className={styles.section} aria-labelledby="team-h">
          <h2 id="team-h" className={styles.sectionLabel}>
            How the Team Builds
          </h2>
          <p className={styles.sectionIntro}>
            Most of the team are volunteers still learning to code. I set up
            the repo so they learn to build with AI coding agents, and the
            guardrails catch mistakes before they reach players.
          </p>
          <ol className={styles.sysList}>
            {team.map((g) => (
              <li key={g.title} className={styles.sysItem}>
                <h3 className={styles.sysTitle}>{g.title}</h3>
                <p className={styles.sysDesc}>{g.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* repo */}
        <section className={styles.section} aria-labelledby="site-h">
          <h2 id="site-h" className={styles.sectionLabel}>
            Built in the Open
          </h2>
          <p className={styles.ctaLead}>
            Game rules, safety rules, and every change, written down so a
            volunteer team and AI coding agents build from the same plan.
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.siteButton}
          >
            View on GitHub <span aria-hidden="true">↗</span>
          </a>
        </section>

        <footer className={styles.footer}>
          <span className="caption">Jonathan Goenadibrata · 2026</span>
        </footer>
      </main>
    </>
  );
}
