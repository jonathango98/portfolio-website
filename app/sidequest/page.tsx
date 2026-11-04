import type { Metadata } from "next";
import Nav from "@/components/Nav";
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
const screens: { src: string; title: string; desc: string }[] = [
  {
    src: "/images/sidequest/join.jpg",
    title: "Join",
    desc: "Name, church, and a PIN. Others see only first name and church.",
  },
  {
    src: "/images/sidequest/home.jpg",
    title: "Home",
    desc: "Your score, the next blind box, and one big button: meet friends.",
  },
  {
    src: "/images/sidequest/code.jpg",
    title: "My Code",
    desc: "A personal QR that changes every 30 seconds. The bar counts down.",
  },
  {
    src: "/images/sidequest/quests.jpg",
    title: "Quests",
    desc: "Every way to score, with its points and your progress.",
  },
];

// Values from foundation/game-config.yaml. Still proposed, tuned after Playtest 1.
const MAX_POINTS = 25;

const points: {
  group: string;
  rows: { action: string; pts: number; prefix?: string; rule: string; href?: string }[];
}[] = [
  {
    group: "Meet people",
    rows: [
      { action: "Someone from another church", pts: 10, rule: "Each pair, both players" },
      { action: "First from a church new to you", pts: 5, prefix: "+", rule: "Bonus, once per church" },
      { action: "Someone from your own church", pts: 2, rule: "Kept low so groups can't pad scores" },
    ],
  },
  {
    group: "Sessions",
    rows: [
      { action: "Check in before a session", pts: 25, prefix: "up to ", rule: "First 10 in earn most, then it steps down" },
      { action: "Write a takeaway", pts: 20, rule: "Once per session, 15+ words" },
    ],
  },
  {
    group: "Explore",
    rows: [
      { action: "Find a hidden item", pts: 15, rule: "Each item pays out once in total" },
      { action: "Visit a booth", pts: 10, rule: "Once per booth, usher scans My Code" },
      { action: "Join the game", pts: 10, rule: "Once" },
      { action: "Take a photobooth photo", pts: 5, rule: "Up to 5 a day", href: "/photobooth" },
    ],
  },
];

const scan: { tag: string; title: string; detail: string }[] = [
  {
    tag: "01 · Show",
    title: "My Code",
    detail: "The code changes every 30 seconds, so a screenshot goes stale fast.",
  },
  {
    tag: "02 · Scan",
    title: "In-app scanner",
    detail: "Opens the back camera and reads the code, on iPhone Safari too.",
  },
  {
    tag: "03 · Check",
    title: "Server",
    detail: "Refuses expired codes and scanning yourself. Each pair counts once, whoever scans whom.",
  },
  {
    tag: "04 · Answer",
    title: "Icebreaker",
    detail: "Both phones get the same question, like “Favorite food?” Each player scores when they type the other's answer.",
  },
];

type GameState = "on" | "paused" | "off";

// Schematic: segment widths show the pattern of the day, not real minutes.
const days: {
  day: string;
  when: string;
  what: string;
  bar: { state: GameState; grow: number; label?: string }[];
}[] = [
  {
    day: "Day 1",
    when: "Evening",
    what: "Game intro on stage. Everyone scans the join QR together, then first connections.",
    bar: [
      { state: "paused", grow: 1, label: "Intro" },
      { state: "on", grow: 3 },
    ],
  },
  {
    day: "Day 2",
    when: "Full day",
    what: "Meeting people, booths, hidden items, and a takeaway after each session.",
    bar: [
      { state: "on", grow: 1 },
      { state: "paused", grow: 2, label: "Session" },
      { state: "on", grow: 1 },
      { state: "paused", grow: 2, label: "Session" },
      { state: "on", grow: 1 },
      { state: "paused", grow: 2, label: "Session" },
      { state: "on", grow: 1 },
    ],
  },
  {
    day: "Day 3",
    when: "Sunday service",
    what: "Final player and church results, prizes, and each player's Wrapped recap.",
    bar: [{ state: "off", grow: 1, label: "Results" }],
  },
];

const stateLabel: Record<GameState, string> = {
  on: "On",
  paused: "Paused",
  off: "Off",
};

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
    desc: "Every award goes through one place that pays it once, even when two phones tap at the same moment, and logs it to an append-only audit trail.",
  },
  {
    title: "Built for the Room",
    desc: "Pauses during sessions, an usher console for help at the door, and a big-screen view that cycles leaderboards and takeaways.",
  },
  {
    title: "Safe by Default",
    desc: "No messaging, no email or phone numbers, no photo uploads. Personal QR codes rotate so screenshots can't be shared, and all player data is deleted after the event.",
  },
];

// From AGENTS.md and the repo's Claude skills. Each step is a rule the agent follows, not a tip.
const loop: { tag: string; title: string; detail: string }[] = [
  {
    tag: "01 · Pick",
    title: "/pick-task",
    detail: "Offers three pieces that are ready to build, soonest due first, then claims one so nobody builds it twice.",
  },
  {
    tag: "02 · Plan",
    title: "Rule IDs",
    detail: "Before touching a file, the agent shows a short plan that cites the written rules, like GAME-013.",
  },
  {
    tag: "03 · Build",
    title: "Teaching mode",
    detail: "After each change, the agent explains in plain words what changed, why, and which commands it ran.",
  },
  {
    tag: "04 · Prove",
    title: "Phone check",
    detail: "The agent checks every changed screen at 360px. A person then runs each test step on a real phone.",
  },
];

const guardrails: { title: string; desc: string }[] = [
  {
    title: "One Rulebook",
    desc: "AGENTS.md holds the rules for volunteers and their AI agents alike. The agent stops and asks before schema changes, auth, minors' data, point values, or a new dependency.",
  },
  {
    title: "A Protected Plan",
    desc: "Game rules, game numbers, and agent settings change only with my approval, enforced by code owner review on GitHub. Agents never approve or merge a PR.",
  },
  {
    title: "Text Is Data",
    desc: "The repo is public, so the agent treats issues, comments, and web pages as data, never as instructions.",
  },
  {
    title: "Nothing Private",
    desc: "No secrets, real attendee data, or database files ever get committed. Test data is obviously fake, like “Test Player 1.”",
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
          <p className={`label ${styles.heroEyebrow}`}>
            NextGen Conference 2027 · In development
          </p>
          <h1 className={styles.heroTitle}>
            Side<br />Quest
          </h1>
          <p className={styles.heroSub}>
            A phone game that makes meeting other churches the easiest way to
            score.
          </p>
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
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>3</span>
              <span className={styles.heroStatLabel}>conference days</span>
            </div>
          </div>
          <p className={`caption ${styles.heroBadge}`}>
            Lead developer · Volunteer team · March 2027
          </p>
        </header>

        {/* overview */}
        <section className={styles.section} aria-labelledby="overview-h">
          <h2 id="overview-h" className={`label ${styles.sectionLabel}`}>
            Overview
          </h2>
          <div className={styles.overviewText}>
            <p className={styles.overviewLead}>
              At most conferences, youth leaders spend their free time with
              their own church. Side Quest turns that around.
            </p>
            <p className={styles.overviewBody}>
              An optional game that runs in the phone&apos;s browser. Players
              earn points for meeting people, exploring the venue, and sharing
              what they learned, with the biggest points for crossing church
              lines.
            </p>
          </div>
        </section>

        {/* launch video */}
        <section className={styles.section} aria-labelledby="video-h">
          <h2 id="video-h" className={`label ${styles.sectionLabel}`}>
            The Pitch
          </h2>
          <p className={styles.sectionIntro}>
            The how-to video players see before the conference, in 26
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
          <h2 id="app-h" className={`label ${styles.sectionLabel}`}>
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
                <p className={styles.screenDesc}>{s.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* points */}
        <section className={styles.section} aria-labelledby="loop-h">
          <h2 id="loop-h" className={`label ${styles.sectionLabel}`}>
            How You Play
          </h2>
          <p className={styles.sectionIntro}>
            Points per action. Check-ins pay the most at once, but meeting
            people never runs out: every new person pays again.
          </p>
          <div className={styles.points}>
            {points.map((g) => (
              <div key={g.group} className={styles.pointsGroup}>
                <h3 className={`caption ${styles.pointsGroupLabel}`}>{g.group}</h3>
                <ul className={styles.pointsList}>
                  {g.rows.map((r) => (
                    <li key={r.action} className={styles.pointsRow}>
                      <span className={styles.pointsAction}>
                        {r.href ? (
                          <Link href={r.href} className={styles.pointsLink}>
                            {r.action}
                            <span aria-hidden="true"> →</span>
                          </Link>
                        ) : (
                          r.action
                        )}
                        <span className={`caption ${styles.pointsRule}`}>{r.rule}</span>
                      </span>
                      <span className={styles.pointsTrack} aria-hidden="true">
                        <span
                          className={styles.pointsBar}
                          style={{ width: `${(r.pts / MAX_POINTS) * 100}%` }}
                        />
                      </span>
                      <span className={styles.pointsValue}>
                        {r.prefix}
                        {r.pts}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className={`caption ${styles.diagramNote}`}>
            Proposed values. They get tuned after the first playtest.
          </p>
        </section>

        {/* one scan */}
        <section className={styles.section} aria-labelledby="scan-h">
          <h2 id="scan-h" className={`label ${styles.sectionLabel}`}>
            One Scan
          </h2>
          <p className={styles.sectionIntro}>
            Meeting someone is the core loop. Here is what happens between two
            phones.
          </p>
          <ol className={styles.flowRow}>
            {scan.map((s) => (
              <li key={s.tag} className={styles.stage}>
                <span className={`caption ${styles.stageTag}`}>{s.tag}</span>
                <h3 className={styles.stageTitle}>{s.title}</h3>
                <p className={styles.stageDetail}>{s.detail}</p>
              </li>
            ))}
          </ol>
          <p className={styles.flowReturn}>
            <span aria-hidden="true" className={styles.flowReturnArrow}>
              ⌖
            </span>
            Only the two people see their answers. There is no chat, ever.
          </p>
        </section>

        {/* three days */}
        <section className={styles.section} aria-labelledby="days-h">
          <h2 id="days-h" className={`label ${styles.sectionLabel}`}>
            Three Days
          </h2>
          <p className={styles.sectionIntro}>
            Nothing should reward opening a phone during a talk, so the game
            pauses whenever a session runs.
          </p>
          <ul className={styles.legend} aria-label="Game states">
            {(Object.keys(stateLabel) as GameState[]).map((s) => (
              <li key={s} className={styles.legendItem}>
                <span className={`${styles.swatch} ${styles[`state_${s}`]}`} />
                {stateLabel[s]}
              </li>
            ))}
          </ul>
          <ol className={styles.days}>
            {days.map((d) => (
              <li key={d.day} className={styles.dayItem}>
                <div className={styles.dayHead}>
                  <span className={styles.dayName}>{d.day}</span>
                  <span className={`caption ${styles.dayWhen}`}>{d.when}</span>
                </div>
                <div
                  className={styles.dayBar}
                  role="img"
                  aria-label={`${d.day}: ${d.bar.map((b) => b.label ?? stateLabel[b.state]).join(", ")}`}
                >
                  {d.bar.map((b, i) => (
                    <span
                      key={i}
                      className={`${styles.daySeg} ${styles[`state_${b.state}`]}`}
                      style={{ flex: `${b.grow} 1 0` }}
                    >
                      {b.label && (
                        <span className={`caption ${styles.daySegLabel}`}>{b.label}</span>
                      )}
                    </span>
                  ))}
                </div>
                <p className={styles.dayWhat}>{d.what}</p>
              </li>
            ))}
          </ol>
          <p className={`caption ${styles.diagramNote}`}>
            Schematic, not to scale.
          </p>
        </section>

        {/* callout */}
        <div className={styles.callout}>
          <p className={styles.calloutText}>
            Load-tested with 300 phones joining within a minute, because
            everyone scans the join QR together on night one.
          </p>
        </div>

        {/* how it works */}
        <section className={styles.section} aria-labelledby="system-h">
          <h2 id="system-h" className={`label ${styles.sectionLabel}`}>
            How It Works
          </h2>
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

        {/* team workflow */}
        <section className={styles.section} aria-labelledby="team-h">
          <h2 id="team-h" className={`label ${styles.sectionLabel}`}>
            How the Team Builds
          </h2>
          <p className={styles.sectionIntro}>
            Most of the team are volunteers still learning to code. I set up
            the repo so they learn to build with AI coding agents, and the
            guardrails catch mistakes before they reach players.
          </p>
          <ol className={styles.flowRow}>
            {loop.map((s) => (
              <li key={s.tag} className={styles.stage}>
                <span className={`caption ${styles.stageTag}`}>{s.tag}</span>
                <h3 className={styles.stageTitle}>{s.title}</h3>
                <p className={styles.stageDetail}>{s.detail}</p>
              </li>
            ))}
          </ol>
          <p className={styles.flowReturn}>
            <span aria-hidden="true" className={styles.flowReturnArrow}>
              ⌖
            </span>
            One task, one branch, one PR. A person reviews every one before it
            merges.
          </p>
          <ol className={`${styles.sysList} ${styles.guardrails}`}>
            {guardrails.map((g, i) => (
              <li key={g.title} className={styles.sysItem}>
                <span className={`caption ${styles.sysNum}`}>0{i + 1}</span>
                <div className={styles.sysBody}>
                  <h3 className={styles.sysTitle}>{g.title}</h3>
                  <p className={styles.sysDesc}>{g.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* repo */}
        <section className={styles.section} aria-labelledby="site-h">
          <h2 id="site-h" className={`label ${styles.sectionLabel}`}>
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
