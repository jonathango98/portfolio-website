import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Explicit allow rules for search and AI crawlers, so intent is
      // unambiguous: this site wants to be indexed, quoted, and cited.
      {
        userAgent: [
          // Search indexes
          "Googlebot",
          "Bingbot",
          "DuckDuckBot",
          "Applebot",
          // Answer engines / assistants
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "Claude-User",
          "Claude-SearchBot",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "DuckAssistBot",
          "MistralAI-User",
          "Amazonbot",
          "YouBot",
          "cohere-ai",
          // Model / dataset training crawlers
          "Google-Extended",
          "Applebot-Extended",
          "Google-CloudVertexBot",
          "meta-externalagent",
          "CCBot",
          "Diffbot",
          "Timpibot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
