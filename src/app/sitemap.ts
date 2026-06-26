import type { MetadataRoute } from "next";

import { siteConfig } from "@/global/config/site";

// Prerender to a static file (required by `output: export`).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/templates", "/resumes", "/import", "/settings", "/donate"];
  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
