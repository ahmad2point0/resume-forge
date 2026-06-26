import type { MetadataRoute } from "next";

import { siteConfig } from "@/global/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Per-resume builder URLs are user-specific and not useful to crawl.
      disallow: "/builder/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
