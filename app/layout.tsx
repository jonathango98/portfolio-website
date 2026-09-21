import type { Metadata, Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SITE_URL } from "./site";
import NavigationFlag from "@/components/NavigationFlag";
import PageLoader from "@/components/PageLoader";

const SITE_NAME = "Jonathan Goenadibrata";
const SITE_DESCRIPTION =
  "Robotics engineer building practical robots that make everyday life easier. Autonomous search & rescue, safety-test automation, dexterous manipulation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jonathan Goenadibrata — Robotics Engineer",
    template: "%s — Jonathan Goenadibrata",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: "Jonathan Goenadibrata", url: SITE_URL }],
  creator: "Jonathan Goenadibrata",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "Jonathan Goenadibrata — Robotics Engineer",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/headshot.jpg",
        width: 800,
        height: 1000,
        alt: "Portrait of Jonathan Goenadibrata",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Goenadibrata — Robotics Engineer",
    description: SITE_DESCRIPTION,
    images: ["/images/headshot.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const PERSON_ID = `${SITE_URL}/#person`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Jonathan Goenadibrata",
  jobTitle: "Robotics Engineer",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/images/headshot.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Jose",
    addressRegion: "CA",
    addressCountry: "US",
  },
  seeks: {
    "@type": "Demand",
    name: "Robotics and test automation roles in the South Bay",
  },
  email: "jonathangoenadibrata@gmail.com",
  knowsLanguage: ["en", "id"],
  worksFor: {
    "@type": "Organization",
    name: "RoboForce Inc.",
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Robotics Engineer",
    // O*NET-SOC code for Robotics Engineers — lets knowledge graphs slot the
    // profile into a known occupation rather than guessing from prose.
    occupationalCategory: "17-2199.08",
    occupationLocation: {
      "@type": "AdministrativeArea",
      name: "South Bay, California",
    },
    skills:
      "Robot integration, test automation, motion planning, PLC controls, teleoperation and robot-learning data collection",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of California, Berkeley",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "University of California, San Diego",
    },
  ],
  knowsAbout: [
    "Robotics",
    "ROS 2",
    "SLAM",
    "Motion Planning",
    "Path Planning",
    "MoveIt 2",
    "Computer Vision",
    "Sensor Fusion",
    "Controls Engineering",
    "Test Automation",
    "Robotic Process Automation",
    "Industrial Automation",
    "PLC Programming",
    "CODESYS",
    "Structured Text (IEC 61131-3)",
    "Teleoperation",
    "Robot Learning",
    "Imitation Learning",
    "Vision-Language-Action (VLA) Models",
    "Reinforcement Learning",
    "Universal Robots UR5e",
    "Dexterous Manipulation",
    "Webots",
    "Python",
    "C++",
    "PyTorch",
    "Linux",
    "SolidWorks",
    "Siemens NX",
    "CAD",
  ],
  sameAs: [
    "https://www.linkedin.com/in/jonathangoenadibrata/",
    "https://github.com/jonathango98",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Jonathan Goenadibrata",
  alternateName: "jonathango.xyz",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
  about: { "@id": PERSON_ID },
  copyrightHolder: { "@id": PERSON_ID },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        // Held from the first paint; PageLoader clears it on reveal.
        data-loading="true"
      >
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([personJsonLd, websiteJsonLd]),
            }}
          />
          {/* Without JS nothing ever clears the loading state, so undo it. */}
          <noscript>
            <style>{`
              .site-loader { display: none !important; }
              html[data-loading="true"] { overflow: visible; }
              html[data-loading="true"] main *,
              html[data-loading="true"] main *::before,
              html[data-loading="true"] main *::after {
                animation-play-state: running !important;
              }
            `}</style>
          </noscript>
        </head>
        <body>
          <PageLoader />
          <NavigationFlag />
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
