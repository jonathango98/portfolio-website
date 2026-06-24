import styles from "./Timeline.module.css";

const entries = [
  {
    id: "W3",
    dates: "2024–2025",
    institution: "UC Berkeley",
    role: "Master of Engineering — Mechanical Engineering",
  },
  {
    id: "W2",
    dates: "2021–2024",
    institution: "Apple Inc.",
    role: "Safety Test Automation Engineer · Product Safety Automation",
  },
  {
    id: "W1",
    dates: "2018–2021",
    institution: "UC San Diego",
    role: "B.S. Mechanical Engineering — Controls & Robotics",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className={styles.section} aria-label="Experience">
      <div className={styles.shell}>
        <p className={`${styles.eyebrow} label`}>Experience</p>
        <h2 className={styles.heading}>Where I&rsquo;ve been.</h2>
        <ol className={styles.list}>
          {entries.map((e, i) => (
            <li key={e.id} className={styles.entry}>
              <div className={styles.rail}>
                <span className={`${styles.nodeId} caption`}>{e.id}</span>
                <div className={styles.dot} />
                {i < entries.length - 1 && <div className={styles.line} />}
              </div>
              <div className={styles.body}>
                <span className={`${styles.dates} caption`}>{e.dates}</span>
                <h3 className={styles.institution}>{e.institution}</h3>
                <p className={styles.role}>{e.role}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
