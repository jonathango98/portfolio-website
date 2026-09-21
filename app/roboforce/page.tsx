import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Link from "next/link";
import styles from "./page.module.css";
import { SITE_URL } from "@/app/site";

const description =
  "Robot-learning data collection at RoboForce Inc.: 1,000+ demonstration episodes a day across 10+ stations and 20+ operators — the rigs, the task design, and the translation layer between AI engineers and the floor.";

export const metadata: Metadata = {
  title: "Teleoperation at Scale",
  description,
  alternates: {
    canonical: "/roboforce",
  },
  openGraph: {
    title: "Teleoperation at Scale — Jonathan Goenadibrata",
    description,
    url: "/roboforce",
    // TODO: swap for a station photo / operator-UI screenshot when available.
    images: [
      {
        url: "/images/headshot.jpg",
        width: 800,
        height: 1000,
        alt: "Portrait of Jonathan Goenadibrata",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teleoperation at Scale — Jonathan Goenadibrata",
    description,
    images: ["/images/headshot.jpg"],
  },
};

const pageUrl = `${SITE_URL}/roboforce`;

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
          name: "Teleoperation at Scale",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "CreativeWork",
      name: "Teleoperation at Scale — Robot Learning Data at RoboForce Inc.",
      description,
      url: pageUrl,
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

const heroStats = [
  { value: "1,000+", label: "episodes per day", primary: true },
  { value: "10+", label: "collection stations" },
  { value: "20+", label: "operators supported" },
  { value: "2", label: "daily shifts" },
];

const heroMeta = [
  { label: "Role", value: "Data Operations Shift Lead" },
  { label: "Platforms", value: "RoboForce Titan · Universal Robots UR5e" },
  { label: "Controllers", value: "GELLO · UMI · Vive Trackers · VR" },
  { label: "Output", value: "Demonstration data for VLA training" },
];

const capabilities = [
  {
    tag: "01",
    title: "Teleoperation Systems",
    tech: "GELLO · UMI · Vive Trackers · VR",
    lead: "The rig is the ceiling on everything downstream.",
    desc: "I improve the setup in hardware and software. Every gain multiplies across 20+ operators at once.",
  },
  {
    tag: "02",
    title: "Task Design & SOPs",
    tech: "Methodology",
    lead: "I write the SOPs from doing the task, not from watching it.",
    desc: "Not just the procedure — the specific way of performing it that a human repeats without drifting and a model can still learn.",
  },
  {
    tag: "03",
    title: "Team Operations",
    tech: "20+ operators",
    lead: "Hiring through performance review, built as systems that run themselves.",
    desc: "Interviewing, onboarding, training, daily summaries, scheduling, reviews, continuous feedback — automated wherever it would otherwise become recurring manual work.",
  },
  {
    tag: "04",
    title: "Station Uptime",
    tech: "Linux · Python · ROS 2",
    lead: "A down station is data that never gets collected.",
    desc: "I triage failures directly — terminal, logs, ROS 2 graph — and work with engineering on the rest.",
  },
];

const pipeline = [
  { stage: "Data Collection", ours: true },
  { stage: "Annotation" },
  { stage: "AI Model" },
  { stage: "Model Eval" },
];

const loop = [
  {
    tag: "01",
    title: "Requirements",
    owner: "AI team",
    detail: "What the models need next, in the AI team's language.",
  },
  {
    tag: "02",
    title: "Task Design",
    owner: "Me",
    mine: true,
    detail: "Turned into an SOP the floor can execute identically every time.",
  },
  {
    tag: "03",
    title: "Collection",
    owner: "Me + 20 operators",
    mine: true,
    detail: "10+ stations, 2 shifts, rigs kept running.",
  },
  {
    tag: "04",
    title: "Episodes",
    owner: "→ training",
    detail: "1,000+ a day, shipped as demonstration data.",
  },
];

const systems = [
  {
    title: "Shift Output Tracking",
    tech: "Python · curses · QR",
    lead: "A terminal UI, not a web dashboard.",
    desc: "Stakeholders wanted per-operator output per shift. Operators already work in a Linux terminal, so a TUI meant no context switch and nothing new to log into. QR tracking keeps entry fast on the floor; the same numbers roll up to leadership.",
  },
  {
    title: "Structured Technical Interview",
    tech: "Rubrics · scoring",
    lead: "Rubrics, so the interview measures aptitude instead of confidence.",
    desc: "Collectors come from mostly non-technical backgrounds, so an unstructured interview selects for vocabulary and self-assurance. Explicit scoring plus a guide that walks the interviewer to an objective write-up — same bar for everyone, whoever runs it.",
  },
];

const directions = [
  {
    from: "Engineers",
    to: "Collectors",
    lead: "An instruction that can't survive contact with the floor isn't a requirement yet.",
    desc: "Requirements arrive in the AI team's language. I turn them into something a non-technical operator can execute identically every time — Linux terminal included.",
  },
  {
    from: "Collectors",
    to: "Engineers",
    lead: "What's actually collectable, in terms engineers can design against.",
    desc: "At what quality, at what rate, which tasks are realistic at volume. That is why targets are reachable and the data comes back as asked.",
  },
];

const stack = [
  "RoboForce Titan", "Universal Robots UR5e", "GELLO",
  "UMI", "Vive Trackers", "VR Controllers",
  "ROS 2", "Python", "Linux",
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", href: "https://github.com/jonathango98" },
];

export default function RoboforcePage() {
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

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className={styles.hero}>
          <p className={`label ${styles.heroEyebrow}`}>
            RoboForce Inc. · Robot Learning Data
          </p>
          <h1 className={styles.heroTitle}>
            Teleoperation<br />at Scale
          </h1>
          <p className={styles.heroSub}>
            20+ operators on real-time robotic control. My job is volume
            that a model can actually learn from.
          </p>

          <div className={styles.heroStats}>
            {heroStats.map((s) => (
              <div
                key={s.label}
                className={
                  s.primary
                    ? `${styles.heroStat} ${styles.heroStatPrimary}`
                    : styles.heroStat
                }
              >
                <span className={styles.heroStatValue}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <p className={`caption ${styles.heroBadge}`}>
            Data Operations Shift Lead · Milpitas, CA · Apr 2026 – Present
          </p>

          <dl className={styles.heroMeta}>
            {heroMeta.map((m) => (
              <div key={m.label} className={styles.heroMetaItem}>
                <dt className={`label ${styles.heroMetaLabel}`}>{m.label}</dt>
                <dd className={styles.heroMetaValue}>{m.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* ── Origin ───────────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="origin-h">
          <h2 id="origin-h" className={`label ${styles.sectionLabel}`}>
            Where This Started
          </h2>
          <p className={styles.originLead}>
            I was RoboForce&apos;s first data collector.
          </p>
          <p className={styles.originBody}>
            Before the team, the shifts, or the stations, there was one
            person and one open question, worked out with the AI engineers:
            what makes a demonstration <em>good</em>? I ran the rigs, tested
            what models could and couldn&apos;t learn from, and set the
            quality bar with the people training on it.
          </p>
          <p className={styles.originBody}>
            The SOPs, the training, and the standard the team runs on all
            trace back to that. Benchmark first, scale second.
          </p>
        </section>

        {/* ── The tension ──────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="challenge-h">
          <h2 id="challenge-h" className={`label ${styles.sectionLabel}`}>
            The Challenge
          </h2>
          <p className={styles.sectionIntro}>
            Vision-Language-Action models train on human demonstrations.
            That puts people on the critical path — for two things at once,
            pulling opposite ways.
          </p>
          <div className={styles.tension}>
            <div className={styles.tensionCol}>
              <p className={`label ${styles.colLabel}`}>Quantity</p>
              <p className={styles.colIntro}>
                Models need <strong>volume</strong>.
              </p>
              <p className={styles.colBody}>
                An idle station collects nothing. A minute spent fighting
                the rig is a minute lost across 20+ people. Scale comes from
                the setup, not from asking anyone to work faster.
              </p>
            </div>

            <div className={styles.tensionDivider} aria-hidden="true" />

            <div className={styles.tensionCol}>
              <p className={`label ${styles.colLabel}`}>Quality</p>
              <p className={styles.colIntro}>
                Models need <strong>consistency</strong>.
              </p>
              <p className={styles.colBody}>
                A demonstration the model can&apos;t learn from is worse
                than none — it costs time, then teaches the wrong thing.
                Twenty operators solving a task twenty ways is a dataset with
                no signal.
              </p>
            </div>
          </div>
        </section>

        {/* ── Callout ──────────────────────────────────────────────────── */}
        <div className={styles.callout}>
          <p className={styles.calloutText}>
            Every task has two answers: the way a human can repeat a
            hundred times without drifting, and the way a model can learn.
            The job is the overlap.
          </p>
        </div>

        {/* ── The loop ─────────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="flow-h">
          <h2 id="flow-h" className={`label ${styles.sectionLabel}`}>
            Where We Sit
          </h2>
          <p className={styles.sectionIntro}>
            Data collection is the first stage of the project pipeline.
            Everything after it inherits the ceiling we set.
          </p>
          <ol className={styles.pipeline}>
            {pipeline.map((p) => (
              <li
                key={p.stage}
                className={
                  p.ours
                    ? `${styles.pipeCell} ${styles.pipeCellOurs}`
                    : styles.pipeCell
                }
              >
                {p.stage}
                {p.ours && (
                  <span className={`caption ${styles.pipeMine}`}>our team</span>
                )}
              </li>
            ))}
          </ol>
          <p className={`label ${styles.flowSubLabel}`}>Inside our stage</p>
          <ol className={styles.flowRow}>
            {loop.map((l) => (
              <li
                key={l.tag}
                className={
                  l.mine ? `${styles.stage} ${styles.stageMine}` : styles.stage
                }
              >
                <span className={`caption ${styles.stageTag}`}>{l.tag}</span>
                <h3 className={styles.stageTitle}>{l.title}</h3>
                <span className={`caption ${styles.stageOwner}`}>{l.owner}</span>
                <p className={styles.stageDetail}>{l.detail}</p>
              </li>
            ))}
          </ol>
          <p className={styles.flowReturn}>
            <span aria-hidden="true" className={styles.flowReturnArrow}>
              ↺
            </span>
            Collection statistics and model feedback set the next week&apos;s
            targets — which is where stage 01 comes from.
          </p>
        </section>

        {/* ── What I own ───────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="own-h">
          <h2 id="own-h" className={`label ${styles.sectionLabel}`}>
            What I Own
          </h2>
          <p className={styles.sectionIntro}>
            Four surfaces, one outcome: more demonstrations, more learnable.
          </p>
          <div className={styles.capabilities}>
            {capabilities.map((c) => (
              <div key={c.tag} className={styles.capability}>
                <span className={`caption ${styles.capTag}`}>
                  {c.tag} <span className={styles.capTech}>{c.tech}</span>
                </span>
                <h3 className={styles.capTitle}>{c.title}</h3>
                <p className={styles.lead}>{c.lead}</p>
                <p className={styles.capDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.stackRow}>
            {stack.map((s) => (
              <span key={s} className={styles.stackBadge}>{s}</span>
            ))}
          </div>
        </section>

        {/* ── Systems built ────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="systems-h">
          <h2 id="systems-h" className={`label ${styles.sectionLabel}`}>
            Systems I Built
          </h2>
          <p className={styles.sectionIntro}>
            Two examples, and the tradeoff behind each.
          </p>
          <div className={styles.systems}>
            {systems.map((sys) => (
              <div key={sys.title} className={styles.system}>
                <span className={`caption ${styles.systemTech}`}>{sys.tech}</span>
                <h3 className={styles.systemTitle}>{sys.title}</h3>
                <p className={styles.lead}>{sys.lead}</p>
                <p className={styles.systemDesc}>{sys.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Translation layer ────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="translate-h">
          <h2 id="translate-h" className={`label ${styles.sectionLabel}`}>
            Between the AI Team and the Floor
          </h2>
          <p className={styles.sectionIntro}>
            The engineers writing requirements have mostly never run a
            controller. The operators executing them mostly aren&apos;t
            technical. I sit between the two, because I&apos;ve done both jobs.
          </p>
          <div className={styles.directions}>
            {directions.map((d) => (
              <div key={d.from} className={styles.direction}>
                <p className={`label ${styles.directionLabel}`}>
                  {d.from}
                  <span aria-hidden="true" className={styles.directionArrow}>
                    →
                  </span>
                  {d.to}
                </p>
                <p className={styles.lead}>{d.lead}</p>
                <p className={styles.directionDesc}>{d.desc}</p>
              </div>
            ))}
          </div>
          <p className={styles.loopNote}>
            Weekly targets come out of that exchange — collection
            statistics on one side, the AI team&apos;s requirements on the
            other. Reviews measure against that, not raw volume.
          </p>
        </section>

        {/* ── Closing statement (peak-end) ─────────────────────────────── */}
        <div className={styles.closing}>
          <p className={styles.closingText}>
            I was the first person collecting this data, and I still run a
            controller. Every system here was built by someone who has to
            use it.
          </p>
        </div>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="ct-h">
          <h2 id="ct-h" className={`label ${styles.sectionLabel}`}>
            Let&apos;s Connect
          </h2>
          <p className={styles.ctaLead}>Building something? Let&apos;s talk.</p>
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
