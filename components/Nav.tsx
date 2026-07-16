import ModeToggle, { type Mode } from "./ModeToggle";
import styles from "./Nav.module.css";

type NavLink = { label: string; href: string };

const workLinks: NavLink[] = [
  { label: "Robots", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav({
  links = workLinks,
  mode = "work",
}: {
  links?: NavLink[];
  mode?: Mode;
}) {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.monogram} aria-label="Home">
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
              <ModeToggle mode={mode} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
