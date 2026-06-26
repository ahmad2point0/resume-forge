import type { MetadataRoute } from "next";

import { siteConfig } from "@/global/config/site";

// Prerender to a static file (required by `output: export`).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The builder is user-specific (data lives in the browser) - skip it.
      disallow: "/builder",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
