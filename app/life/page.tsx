import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { imageSizeFromFile } from "image-size/fromFile";
import Nav from "@/components/Nav";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Life",
  description:
    "The other side of the toggle — photography and life outside of work.",
  alternates: { canonical: "/life" },
  openGraph: {
    url: "/life",
    title: "Life — Jonathan Goenadibrata",
    description:
      "The other side of the toggle — photography and life outside of work.",
  },
};

const PHOTOS_DIR = path.join(process.cwd(), "public/images/photography");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

const lifeLinks = [
  { label: "Photos", href: "/life#photography" },
  { label: "Contact", href: "/life#contact" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/jonathango98/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathangoenadibrata/" },
  { label: "GitHub", href: "https://github.com/jonathango98" },
];

async function getPhotos() {
  let files: string[];
  try {
    files = fs
      .readdirSync(PHOTOS_DIR)
      .filter((f) => IMAGE_EXT.test(f))
      .sort();
  } catch {
    return [];
  }
  return Promise.all(
    files.map(async (file) => {
      const {
        width = 3,
        height = 2,
        orientation,
      } = await imageSizeFromFile(path.join(PHOTOS_DIR, file));
      // EXIF orientations 5–8 are rotated 90°: displayed dims are swapped.
      const rotated = (orientation ?? 1) >= 5;
      return {
        src: `/images/photography/${file}`,
        width: rotated ? height : width,
        height: rotated ? width : height,
      };
    })
  );
}

export default async function Life() {
  const photos = await getPhotos();

  return (
    <div data-mode="life" className={styles.lifeRoot}>
      <Nav mode="life" links={lifeLinks} />
      <main id="main" className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.portrait}>
            <Image
              src="/images/headshot-life.jpeg"
              alt="Jonathan Goenadibrata"
              fill
              sizes="96px"
              className={styles.portraitImg}
              priority
            />
          </div>
          <p className={`label ${styles.eyebrow}`}>Off the clock</p>
          <h1 className={styles.name}>
            <span className={styles.nameLine}>Jonathan</span>
            <span className={styles.nameLine}>Goenadibrata</span>
          </h1>
          <p className={styles.tagline}>
            I automate the mundane so I can do what I love. This is what I
            love.
          </p>
          <div className={styles.heroActions}>
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

        <section
          id="photography"
          className={styles.section}
          aria-labelledby="photo-h"
        >
          <h2 id="photo-h" className={`label ${styles.sectionLabel}`}>
            Photography
          </h2>
          <p className={`caption ${styles.gear}`}>
            GEAR — Olympus OM-D E-M1 · Olympus 45mm f/1.8 · Olympus 17mm f/2.8
            · Retropia 32mm f/11
          </p>
          {photos.length > 0 && (
            <ul className={styles.gallery}>
              {photos.map((p) => (
                <li key={p.src} className={styles.galleryItem}>
                  <Image
                    src={p.src}
                    alt=""
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 520px) 92vw, (max-width: 880px) 46vw, 280px"
                    className={styles.photo}
                    draggable={false}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="contact" className={styles.section} aria-labelledby="ct-h">
          <h2 id="ct-h" className={`label ${styles.sectionLabel}`}>
            Contact
          </h2>
          <p className={styles.contactLead}>Building something? Let&apos;s talk.</p>
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
    </div>
  );
}
