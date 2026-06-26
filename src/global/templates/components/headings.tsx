import * as React from "react";

import type { ResolvedTemplateTheme } from "@/global/@types";

export type HeadingStyle =
  | "underline" // accent text + full underline rule
  | "bar" // accent vertical bar before caps text
  | "caps-rule" // uppercase text with a thin rule to the right
  | "serif-center" // centered small-caps serif (Harvard/Executive)
  | "rule" // Title Case accent text + full gray underline (atsresume style)
  | "plain"; // uppercase, letter-spaced, no rule (sidebar)

/** A section heading rendered in one of several template-specific styles. */
export function SectionHeading({
  children,
  style,
  theme,
  color,
}: {
  children: React.ReactNode;
  style: HeadingStyle;
  theme: ResolvedTemplateTheme;
  color?: string;
}) {
  const accent = color ?? theme.accent;
  const size = theme.baseFontPx + 1.5;

  const base: React.CSSProperties = {
    fontSize: size,
    fontWeight: 700,
    letterSpacing: 0.4,
    margin: 0,
  };

  switch (style) {
    case "underline":
      return (
        <h2
          style={{
            ...base,
            color: accent,
            textTransform: "uppercase",
            borderBottom: `2px solid ${accent}`,
            paddingBottom: 2,
            marginBottom: 4,
          }}
        >
          {children}
        </h2>
      );

    case "bar":
      return (
        <h2
          style={{
            ...base,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: size,
              background: accent,
              borderRadius: 2,
            }}
          />
          {children}
        </h2>
      );

    case "caps-rule":
      return (
        <h2
          style={{
            ...base,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{children}</span>
          <span style={{ flex: 1, height: 1, background: accent, opacity: 0.4 }} />
        </h2>
      );

    case "serif-center":
      return (
        <h2
          style={{
            ...base,
            fontWeight: 700,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 2,
            borderBottom: `1px solid currentColor`,
            paddingBottom: 2,
            marginBottom: 5,
          }}
        >
          {children}
        </h2>
      );

    case "rule":
      return (
        <h2
          style={{
            ...base,
            color: accent,
            letterSpacing: 0,
            borderBottom: `1px solid #cbd5e1`,
            paddingBottom: 2,
            marginBottom: 5,
          }}
        >
          {children}
        </h2>
      );

    case "plain":
    default:
      return (
        <h2
          style={{
            ...base,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {children}
        </h2>
      );
  }
}
