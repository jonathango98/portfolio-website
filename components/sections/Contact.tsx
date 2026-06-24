import styles from "./Contact.module.css";

const nodes = [
  { label: "Email", value: "jonathangoenadibrata@gmail.com", href: "mailto:jonathangoenadibrata@gmail.com" },
  { label: "LinkedIn", value: "jonathangoenadibrata", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", value: "jonathango98", href: "https://github.com/jonathango98" },
  { label: "Instagram", value: "@jonathango98", href: "https://www.instagram.com/jonathango98/" },
];

export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-label="Contact">
      <div className={styles.shell}>
        <p className={`${styles.eyebrow} label`}>Contact</p>
        <h2 className={styles.heading}>
          Tell me about the problem<br />
          you&rsquo;re solving.
        </h2>

        <ul className={styles.nodes}>
          {nodes.map((n) => (
            <li key={n.label} className={styles.node}>
              <span className={`${styles.nodeLabel} caption`}>{n.label}</span>
              <a
                href={n.href}
                className={styles.nodeValue}
                target={n.href.startsWith("mailto") ? undefined : "_blank"}
                rel={n.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              >
                {n.value}
              </a>
            </li>
          ))}
        </ul>

        <footer className={styles.footer}>
          <div className={styles.origin}>
            <span className={styles.reticle} aria-hidden="true">⌖</span>
            <span className={`${styles.originLabel} caption`}>0,0&nbsp;&nbsp;·&nbsp;&nbsp;Jonathan Goenadibrata</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
