import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SITE_URL } from "./site";
import NavigationFlag from "@/components/NavigationFlag";

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
    "Computer Vision",
    "Sensor Fusion",
    "Controls Engineering",
    "Automation",
    "CODESYS",
    "Python",
    "C++",
  ],
  sameAs: [
    "https://www.linkedin.com/in/jonathangoenadibrata/",
    "https://github.com/jonathango98",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Jonathan Goenadibrata",
  url: SITE_URL,
  publisher: { "@id": PERSON_ID },
  about: { "@id": PERSON_ID },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([personJsonLd, websiteJsonLd]),
            }}
          />
        </head>
        <body>
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
