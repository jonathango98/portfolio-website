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
}[] = [
  {
    path: "",
    lastModified: "2026-07-15T22:17:26-07:00", // app/page.tsx
    changeFrequency: "monthly",
    priority: 1.0,
  },
  {
    path: "/life",
    lastModified: "2026-07-16T20:30:23-07:00", // app/life/page.tsx
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/rosmaster",
    lastModified: "2026-07-15T14:25:19-07:00", // app/rosmaster/page.tsx
    changeFrequency: "yearly",
    priority: 0.8,
  },
  {
    path: "/trifinger",
    lastModified: "2026-07-15T14:25:19-07:00", // app/trifinger/page.tsx
    changeFrequency: "yearly",
    priority: 0.8,
  },
  {
    path: "/fod-testing",
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
  }));
}
