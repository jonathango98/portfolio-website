import type { MetadataRoute } from "next";

const BASE_URL = "https://jonathango.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/rosmaster", "/trifinger", "/fod-testing"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
