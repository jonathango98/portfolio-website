import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

// lastModified dates are pinned to each page file's most recent git commit
// (`git log -1 --format=%cI -- <path>`), not build time — bump the date here
// when a page's content materially changes.
const routes: {
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  /** Hero image, surfaced to image search via the sitemap's image extension. */
  images?: string[];
}[] = [
  {
    path: "",
    images: ["/images/headshot.jpg"],
    lastModified: "2026-09-20T12:00:00-07:00", // app/page.tsx
    changeFrequency: "monthly",
    priority: 1.0,
  },
  {
    path: "/roboforce",
    images: ["/images/headshot.jpg"],
    lastModified: "2026-09-20T01:32:48-07:00", // app/roboforce/page.tsx
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/life",
    images: ["/images/headshot-life.jpeg"],
    lastModified: "2026-07-16T20:30:23-07:00", // app/life/page.tsx
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/rosmaster",
    images: ["/images/robot-sar.png"],
    lastModified: "2026-07-15T14:25:19-07:00", // app/rosmaster/page.tsx
    changeFrequency: "yearly",
    priority: 0.8,
  },
  {
    path: "/trifinger",
    images: ["/images/robot-trifinger.png"],
    lastModified: "2026-07-15T14:25:19-07:00", // app/trifinger/page.tsx
    changeFrequency: "yearly",
    priority: 0.8,
  },
  {
    path: "/fod-testing",
    images: ["/images/fod.png"],
    lastModified: "2026-07-15T14:25:19-07:00", // app/fod-testing/page.tsx
    changeFrequency: "yearly",
    priority: 0.8,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    images: route.images?.map((image) => `${SITE_URL}${image}`),
  }));
}
