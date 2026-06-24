import ThemeToggle from "./ThemeToggle";
import styles from "./Nav.module.css";

const links = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="#main" className={styles.monogram} aria-label="Home">
          <span>JG</span>
        </a>

        <nav aria-label="Main">
          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={styles.link}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
