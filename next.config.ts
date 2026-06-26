import type { NextConfig } from "next";

/**
 * Static export is opt-in via `STATIC_EXPORT=true` (set by the GitHub Pages
 * workflow) so local `next dev` / `next start` keep working normally. When on,
 * the app builds to fully static HTML in `out/` - it has no backend or API, so
 * everything runs in the browser.
 *
 * `NEXT_PUBLIC_BASE_PATH` is the subpath the site is served from (e.g.
 * "/resume-builder" for a GitHub project page). Empty for a user/org page or a
 * custom domain.
 */
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export",
        // GitHub Pages serves folder/index.html, so emit trailing-slash routes.
        trailingSlash: true,
        // next/image optimization needs a server; disable it for static export.
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
