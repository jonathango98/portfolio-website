import styles from "./MicroProjects.module.css";

const projects = [
  {
    label: "Photobooth",
    description: "Web-based photobooth — captures photos, applies templates, generates QR codes.",
    href: "https://github.com/jonathango98/photobooth",
    external: true,
  },
  {
    label: "Snake AI",
    description: "Python Snake game for training reinforcement learning agents.",
    href: "https://github.com/jonathango98/snake-game",
    external: true,
  },
];

export default function MicroProjects() {
  return (
    <section id="projects" className={styles.section} aria-label="Side projects">
      <div className={styles.shell}>
        <p className={`${styles.eyebrow} label`}>Side projects</p>
        <h2 className={styles.heading}>More things I&rsquo;ve built.</h2>
        <ul className={styles.grid}>
          {projects.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                className={styles.card}
                target={p.external ? "_blank" : undefined}
                rel={p.external ? "noopener noreferrer" : undefined}
              >
                <span className={styles.marker} aria-hidden="true" />
                <div>
                  <span className={styles.cardLabel}>{p.label}</span>
                  {p.external && (
                    <span className={`${styles.extIcon} caption`} aria-label="(external)">
                      &nbsp;↗
                    </span>
                  )}
                  <p className={styles.cardDesc}>{p.description}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
