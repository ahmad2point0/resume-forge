import { ImageResponse } from "next/og";

import { siteConfig } from "@/global/config/site";

export const alt = `${siteConfig.name} - ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prerender to a static image (required by `output: export`).
export const dynamic = "force-static";

/** Branded social card used for Open Graph and Twitter previews. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            r
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#0f172a" }}>
            {siteConfig.name}
          </div>
          <div
            style={{
              marginLeft: 8,
              padding: "4px 12px",
              borderRadius: 999,
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            OSS
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <span>Build ATS-friendly</span>
            <span>resumes in minutes.</span>
          </div>
          <div style={{ fontSize: 30, color: "#475569", maxWidth: 900 }}>
            Free, open source, and 100% local. Your resume never leaves your
            device.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#64748b" }}>
          <span>9 ATS templates</span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span>Resume scoring</span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span>No accounts. No tracking.</span>
        </div>
      </div>
    ),
    size,
  );
}
