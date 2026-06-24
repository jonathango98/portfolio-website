import styles from "./Button.module.css";

type Props = {
  href?: string;
  download?: boolean;
  external?: boolean;
  children: React.ReactNode;
  variant?: "ghost" | "solid";
};

export default function Button({
  href,
  download,
  external,
  children,
  variant = "ghost",
}: Props) {
  const cls = `${styles.btn} ${variant === "solid" ? styles.solid : styles.ghost}`;
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return <button className={cls}>{children}</button>;
}
