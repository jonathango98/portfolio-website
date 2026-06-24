import Link from "next/link";
import styles from "./ComingSoon.module.css";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        <span aria-hidden="true">←</span> Back
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.note}>More coming soon.</p>
    </main>
  );
}
