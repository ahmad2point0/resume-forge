import * as React from "react";

import type { Basics, ContactFieldKey } from "@/global/@types";

/** Every optional contact link, in canonical order. */
export const ALL_CONTACT_FIELDS: ContactFieldKey[] = [
  "website",
  "linkedin",
  "github",
];

/**
 * Ordered, non-empty contact fields for header rendering. Email/phone/location
 * are always included; the optional links are filtered to those the active
 * template supports (`fields`).
 */
export function contactItems(
  basics: Basics,
  fields: ContactFieldKey[] = ALL_CONTACT_FIELDS,
): string[] {
  const allow = new Set(fields);
  return [
    basics.email,
    basics.phone,
    basics.location,
    allow.has("website") ? basics.website : "",
    allow.has("linkedin") ? basics.linkedin : "",
    allow.has("github") ? basics.github : "",
  ].filter((v) => v && v.trim());
}

/** Inline contact line: "a · b · c", separator color follows the accent. */
export function ContactLine({
  basics,
  fields,
  separator = "·",
  accent,
  className,
  style,
}: {
  basics: Basics;
  fields?: ContactFieldKey[];
  separator?: string;
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const items = contactItems(basics, fields);
  if (items.length === 0) return null;
  return (
    <div className={className} style={style}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span style={{ color: accent, opacity: 0.6, margin: "0 6px" }}>
              {separator}
            </span>
          )}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

/** Stacked contact list for sidebar (two-column) templates. */
export function ContactStack({
  basics,
  fields,
  style,
}: {
  basics: Basics;
  fields?: ContactFieldKey[];
  style?: React.CSSProperties;
}) {
  const items = contactItems(basics, fields);
  if (items.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, ...style }}>
      {items.map((item, i) => (
        <span key={i} style={{ wordBreak: "break-word" }}>
          {item}
        </span>
      ))}
    </div>
  );
}
