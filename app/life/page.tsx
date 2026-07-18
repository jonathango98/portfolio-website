import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { imageSizeFromFile } from "image-size/fromFile";
import Nav from "@/components/Nav";
import PhotoGallery from "@/components/PhotoGallery";
import DesignCarousel from "@/components/DesignCarousel";
import styles from "./page.module.css";

const lifeDescription =
  "The other side of the toggle — design, photography, guitar, and time with friends talking life and faith.";

const heroImage = {
  url: "/images/headshot-life.jpeg",
  width: 3120,
  height: 4160,
  alt: "Jonathan Goenadibrata",
};

export const metadata: Metadata = {
  title: "Life",
  description: lifeDescription,
  alternates: { canonical: "/life" },
  openGraph: {
    url: "/life",
    title: "Life — Jonathan Goenadibrata",
    description: lifeDescription,
    images: [heroImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life — Jonathan Goenadibrata",
    description: lifeDescription,
    images: [heroImage.url],
  },
};

const PHOTOS_DIR = path.join(process.cwd(), "public/images/photography");
const DESIGNS_DIR = path.join(process.cwd(), "public/images/design");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

const lifeLinks = [
  { label: "About", href: "/life#about" },
  { label: "Photos", href: "/life#photography" },
  { label: "Design", href: "/life#design" },
  { label: "Contact", href: "/life#contact" },
];

// Curated order; titles are used as alt text. Dimensions are read
// from the files.
const designManifest = [
  { file: "love.jpg", title: "爱 — Love" },
  { file: "the-go-blog.png", title: "the.go.blog" },
  { file: "marketplace-ministry.jpg", title: "Marketplace Ministry" },
  { file: "southbound.jpg", title: "Southbound" },
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

async function getDesigns() {
  const designs = await Promise.all(
    designManifest.map(async ({ file, title }) => {
      try {
        const { width = 1, height = 1 } = await imageSizeFromFile(
          path.join(DESIGNS_DIR, file)
        );
        return { src: `/images/design/${file}`, title, width, height };
      } catch {
        return null;
      }
    })
  );
  return designs.filter((d) => d !== null);
}

export default async function Life() {
  const [photos, designs] = await Promise.all([getPhotos(), getDesigns()]);

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

        <section id="about" className={styles.section} aria-labelledby="about-h">
          <h2 id="about-h" className={`label ${styles.sectionLabel}`}>
            About
          </h2>
          <p className={styles.aboutBody}>
            People like to call me the engineer with design skills. Off the
            clock, that&apos;s the side I feed — designing, shooting photos,
            and playing my guitar, purely for the fun of it.
          </p>
          <p className={styles.aboutBody}>
            But what really fills my time is people. I&apos;m about as
            extroverted as they come, so most evenings end up with friends —{" "}
            <a
              href="https://foodie.jonathango.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutLink}
            >
              good food
            </a>
            , long conversations, usually drifting toward life and faith.
          </p>
        </section>

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
          {photos.length > 0 && <PhotoGallery photos={photos} />}
        </section>

        <section
          id="design"
          className={styles.section}
          aria-labelledby="design-h"
        >
          <h2 id="design-h" className={`label ${styles.sectionLabel}`}>
            Design
          </h2>
          {designs.length > 0 && <DesignCarousel designs={designs} />}
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
