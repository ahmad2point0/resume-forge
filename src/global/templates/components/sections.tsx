import * as React from "react";

import type {
  ResolvedTemplateTheme,
  ResumeData,
  SectionKey,
} from "@/global/@types";
import { SECTION_REGISTRY } from "@/global/constants";
import { formatDateRange, formatMonth } from "@/global/utils/date";

/** The human heading for a section, as shown on the rendered resume. */
export function sectionLabel(key: SectionKey): string {
  return SECTION_REGISTRY[key].label;
}

const NBSP = " ";

function Bullets({
  items,
  theme,
}: {
  items: string[];
  theme: ResolvedTemplateTheme;
}) {
  const visible = items.filter((i) => i.trim());
  if (visible.length === 0) return null;
  return (
    <ul
      style={{
        margin: `${theme.entryGapPx / 3}px 0 0`,
        paddingLeft: 18,
        // Explicit list styling: Tailwind's preflight resets list-style, and a
        // flex <ul> suppresses markers entirely, so set both here.
        listStyleType: "disc",
        listStylePosition: "outside",
      }}
    >
      {visible.map((item, i) => (
        <li
          key={i}
          style={{ lineHeight: theme.lineHeight, marginTop: i === 0 ? 0 : 2 }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function EntryHeader({
  title,
  subtitle,
  meta,
  metaSub,
  theme,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  metaSub?: string;
  theme: ResolvedTemplateTheme;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 12,
      }}
    >
      <div>
        <span style={{ fontWeight: 600 }}>{title}</span>
        {subtitle && (
          <span style={{ color: theme.accent }}>
            {NBSP}·{NBSP}
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
        {meta && (
          <div style={{ fontSize: theme.baseFontPx - 1.5, opacity: 0.75 }}>
            {meta}
          </div>
        )}
        {metaSub && (
          <div style={{ fontSize: theme.baseFontPx - 2, opacity: 0.6 }}>
            {metaSub}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the *body* of a section (everything below its heading). Layout is
 * deliberately template-agnostic; templates supply their own heading style and
 * spacing wrapper. This keeps all 8 templates consistent and in one place.
 */
export function SectionBody({
  sectionKey,
  data,
  theme,
}: {
  sectionKey: SectionKey;
  data: ResumeData;
  theme: ResolvedTemplateTheme;
}) {
  const entryGap = { display: "flex", flexDirection: "column" as const, gap: theme.entryGapPx };

  switch (sectionKey) {
    case "summary":
      return (
        <p style={{ lineHeight: theme.lineHeight, margin: 0 }}>
          {data.basics.summary}
        </p>
      );

    case "work":
      return (
        <div style={entryGap}>
          {data.work.map((w) => (
            <div key={w.id}>
              <EntryHeader
                title={w.position || "Role"}
                subtitle={w.company}
                meta={formatDateRange(w.startDate, w.endDate, w.current)}
                metaSub={w.location}
                theme={theme}
              />
              <Bullets items={w.highlights} theme={theme} />
            </div>
          ))}
        </div>
      );

    case "education":
      return (
        <div style={entryGap}>
          {data.education.map((e) => (
            <div key={e.id}>
              <EntryHeader
                title={e.institution || "Institution"}
                subtitle={[e.degree, e.field].filter(Boolean).join(", ")}
                meta={formatDateRange(e.startDate, e.endDate, e.current)}
                metaSub={e.gpa ? `GPA ${e.gpa}` : e.location}
                theme={theme}
              />
              <Bullets items={e.highlights} theme={theme} />
            </div>
          ))}
        </div>
      );

    case "projects":
      return (
        <div style={entryGap}>
          {data.projects.map((p) => (
            <div key={p.id}>
              <EntryHeader
                title={p.name || "Project"}
                subtitle={p.url}
                meta={formatDateRange(p.startDate, p.endDate)}
                theme={theme}
              />
              {p.description && (
                <p style={{ margin: "2px 0 0", lineHeight: theme.lineHeight }}>
                  {p.description}
                </p>
              )}
              <Bullets items={p.highlights} theme={theme} />
              {p.keywords.length > 0 && (
                <div style={{ marginTop: 3, opacity: 0.8 }}>
                  <span style={{ fontWeight: 600 }}>Tech:</span>{" "}
                  {p.keywords.join(" · ")}
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case "skills":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {data.skills.map((g) => (
            <div key={g.id} style={{ lineHeight: theme.lineHeight }}>
              {g.name && <span style={{ fontWeight: 600 }}>{g.name}: </span>}
              <span>{g.keywords.join(", ")}</span>
            </div>
          ))}
        </div>
      );

    case "certifications":
      return (
        <div style={entryGap}>
          {data.certifications.map((c) => (
            <EntryHeader
              key={c.id}
              title={c.name}
              subtitle={c.issuer}
              meta={formatMonth(c.date)}
              theme={theme}
            />
          ))}
        </div>
      );

    case "achievements":
      return (
        <div style={entryGap}>
          {data.achievements.map((a) => (
            <div key={a.id}>
              <EntryHeader
                title={a.title}
                meta={formatMonth(a.date)}
                theme={theme}
              />
              {a.description && (
                <p style={{ margin: "1px 0 0", lineHeight: theme.lineHeight }}>
                  {a.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case "publications":
      return (
        <div style={entryGap}>
          {data.publications.map((p) => (
            <div key={p.id}>
              <EntryHeader
                title={p.title}
                subtitle={p.publisher}
                meta={formatMonth(p.date)}
                theme={theme}
              />
              {p.summary && (
                <p style={{ margin: "1px 0 0", lineHeight: theme.lineHeight }}>
                  {p.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case "languages":
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
          {data.languages.map((l) => (
            <span key={l.id}>
              <span style={{ fontWeight: 600 }}>{l.name}</span>
              {l.fluency && <span style={{ opacity: 0.7 }}> - {l.fluency}</span>}
            </span>
          ))}
        </div>
      );

    case "interests":
      return <p style={{ margin: 0 }}>{data.interests.map((i) => i.name).join(" · ")}</p>;

    case "references":
      return (
        <div style={entryGap}>
          {data.references.map((r) => (
            <div key={r.id}>
              <EntryHeader title={r.name} subtitle={r.title} theme={theme} />
              {r.contact && <div style={{ opacity: 0.8 }}>{r.contact}</div>}
              {r.reference && (
                <p style={{ margin: "1px 0 0", lineHeight: theme.lineHeight }}>
                  {r.reference}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
