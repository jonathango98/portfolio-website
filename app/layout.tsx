import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SITE_URL } from "./site";

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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jonathan Goenadibrata",
  jobTitle: "Robotics Engineer",
  url: SITE_URL,
  sameAs: [
    "https://www.linkedin.com/in/jonathangoenadibrata/",
    "https://github.com/jonathango98",
  ],
};

// Runs before paint to apply the saved (or system) theme and avoid a flash.
const themeInit = `(function(){try{var t=localStorage.getItem("theme")||"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInit }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
