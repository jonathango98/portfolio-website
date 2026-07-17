import { Link } from "next-view-transitions";
import styles from "./ModeToggle.module.css";

export type Mode = "work" | "life";

export default function ModeToggle({ mode }: { mode: Mode }) {
  return (
    <span className={styles.toggle} aria-label="Site mode">
      <Link
        href="/"
        className={styles.seg}
        aria-current={mode === "work" ? "page" : undefined}
      >
        Work
      </Link>
      <Link
        href="/life"
        className={styles.seg}
        aria-current={mode === "life" ? "page" : undefined}
      >
        Life
      </Link>
    </span>
  );
}
