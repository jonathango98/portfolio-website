import Image from "next/image";
import Nav from "@/components/Nav";
import styles from "./page.module.css";

const RESUME = "/resumes/Tech Resume - Jonathan Goenadibrata.pdf";

const work = [
  {
    title: "Autonomous SAR Rover",
    hardware: "Yahboom RDK X3",
    desc: "Real-time mapping and victim detection for search & rescue.",
    href: "/rosmaster",
    external: false,
    img: "/images/robot-sar.png",
  },
  {
    title: "Robotic Process Automation",
    hardware: "Hyulim DTR-MU",
    desc: "Turned 2,700 wireless-charging safety tests into one unattended run.",
    href: "/fod-testing",
    external: false,
    img: "/images/robot-fod.png",
  },
  {
    title: "TriFinger Manipulation",
    hardware: "9-DOF, built in-house",
    desc: "Low-cost dexterous manipulation platform.",
    href: "/trifinger",
    external: false,
    img: "/images/robot-trifinger.png",
  },
];

const experience = [
  {
    dates: "Apr '26 – Present",
    org: "RoboForce",
    role: "Robotics Data Collection Lead",
  },
  {
    dates: "Aug '24 – May '25",
    org: "UC Berkeley",
    role: "M.Eng, Mechanical Engineering",
  },
  {
    dates: "Aug '21 – Jun '24",
    org: "Apple Inc.",
    role: "Safety Test Automation Engineer",
  },
  {
    dates: "Sep '18 – Jun '21",
    org: "UC San Diego",
    role: "B.S. Mechanical Engineering — Controls & Robotics",
  },
];

const projects = [
  {
    title: "The List",
    emoji: "🍜",
    type: "live",
    desc: "The exact dishes to order in LA, SF, NY & Seattle.",
    href: "https://jogo-menu.netlify.app",
  },
  {
    title: "Photobooth",
    emoji: "📸",
    type: "live",
    desc: "Capture, template, and generate QR codes.",
    href: "https://jogo-photobooth.netlify.app",
  },
  {
    title: "Snake AI",
    emoji: "🐍",
    type: "repo",
    desc: "RL training environment for Snake agents.",
    href: "https://github.com/jonathango98/snake-game/",
  },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", href: "https://github.com/jonathango98" },
  { label: "Instagram", href: "https://www.instagram.com/jonathango98/" },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.portrait}>
            <Image
              src="/images/headshot.jpg"
              alt="Jonathan Goenadibrata"
              fill
              sizes="96px"
              className={styles.portraitImg}
              priority
            />
          </div>
          <p className={`label ${styles.eyebrow}`}>Robotics Engineer</p>
          <h1 className={styles.name}>
            <span className={styles.nameLine}>Jonathan</span>
            <span className={styles.nameLine}>Goenadibrata</span>
          </h1>
          <p className={styles.tagline}>
            I build practical robots that make everyday life easier.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.resume} href={RESUME} download>
              Resume <span aria-hidden="true">↓</span>
            </a>
            <ul className={styles.socials}>
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.social}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section id="work" className={styles.section} aria-labelledby="work-h">
          <h2 id="work-h" className={`label ${styles.sectionLabel}`}>
            ROBOTS
          </h2>
          <ul className={styles.rows}>
            {work.map((w) => (
              <li key={w.title}>
                <a
                  className={styles.workRow}
                  href={w.href}
                  target={w.external ? "_blank" : undefined}
                  rel={w.external ? "noopener noreferrer" : undefined}
                >
                  <span className={styles.workThumb}>
                    <Image
                      src={w.img}
                      alt={`${w.title} — ${w.hardware}`}
                      fill
                      sizes="(max-width: 520px) 72px, 96px"
                      className={styles.workThumbImg}
                    />
                  </span>
                  <span className={styles.workText}>
                    <span className={styles.workHead}>
                      <span className={styles.workTitle}>{w.title}</span>
                      <span className={styles.arrow} aria-hidden="true">
                        {w.external ? "↗" : "→"}
                      </span>
                    </span>
                    <span className={styles.workMeta}>
                      <span className={`caption ${styles.workHw}`}>{w.hardware}</span>
                      <span className={styles.workDesc}>{w.desc}</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="experience"
          className={styles.section}
          aria-labelledby="exp-h"
        >
          <h2 id="exp-h" className={`label ${styles.sectionLabel}`}>
            Experience
          </h2>
          <ul className={styles.expList}>
            {experience.map((e) => (
              <li key={e.org} className={styles.expRow}>
                <span className={`caption ${styles.expDates}`}>{e.dates}</span>
                <span className={styles.expBody}>
                  <span className={styles.expOrg}>{e.org}</span>
                  <span className={styles.expRole}>{e.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="more" className={styles.section} aria-labelledby="more-h">
          <h2 id="more-h" className={`label ${styles.sectionLabel}`}>
            Also building
          </h2>
          <ul className={styles.miniList}>
            {projects.map((p) => (
              <li key={p.title}>
                <a
                  className={styles.miniRow}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.miniEmoji} aria-hidden="true">
                    {p.emoji}
                  </span>
                  <span className={styles.miniTitle}>{p.title}</span>
                  <span
                    className={`caption ${styles.miniStatus} ${
                      p.type === "live" ? styles.isLive : ""
                    }`}
                  >
                    {p.type}
                  </span>
                  <span className={styles.miniDesc}>{p.desc}</span>
                  <span className={styles.miniArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={styles.section} aria-labelledby="ct-h">
          <h2 id="ct-h" className={`label ${styles.sectionLabel}`}>
            Contact
          </h2>
          <p className={styles.contactLead}>Building something? Let's talk.</p>
          <a
            className={styles.email}
            href="mailto:jonathangoenadibrata@gmail.com"
          >
            jonathangoenadibrata@gmail.com
          </a>
          <ul className={styles.socials}>
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social}
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
