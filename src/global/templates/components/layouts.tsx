import * as React from "react";

import type {
  ResolvedTemplateTheme,
  ResumeData,
  SectionKey,
  TemplateRenderProps,
} from "@/global/@types";

import { ContactLine, ContactStack } from "./contact";
import { SectionHeading, type HeadingStyle } from "./headings";
import { SectionBody, sectionLabel } from "./sections";

/** Candidate's name + target title block. */
export function ResumeName({
  data,
  theme,
  align = "left",
  color,
  sizeScale = 2,
  uppercase = false,
  serif = false,
}: {
  data: ResumeData;
  theme: ResolvedTemplateTheme;
  align?: "left" | "center";
  color?: string;
  sizeScale?: number;
  uppercase?: boolean;
  serif?: boolean;
}) {
  return (
    <div style={{ textAlign: align }}>
      <h1
        style={{
          margin: 0,
          fontSize: theme.baseFontPx * sizeScale,
          fontWeight: 700,
          letterSpacing: uppercase ? 1.5 : -0.2,
          textTransform: uppercase ? "uppercase" : "none",
          fontFamily: serif ? "Georgia, serif" : "inherit",
          lineHeight: 1.1,
        }}
      >
        {data.basics.fullName || "Your Name"}
      </h1>
      {data.basics.jobTitle && (
        <div
          style={{
            marginTop: 2,
            fontSize: theme.baseFontPx + 1,
            fontWeight: 500,
            color: color ?? theme.accent,
          }}
        >
          {data.basics.jobTitle}
        </div>
      )}
    </div>
  );
}

/** Shared page padding by feel; kept generous for print margins. */
const PAGE_PADDING = 44;

interface SingleColumnProps extends TemplateRenderProps {
  headingStyle: HeadingStyle;
  nameAlign?: "left" | "center";
  nameScale?: number;
  uppercaseName?: boolean;
  serifName?: boolean;
  contactSeparator?: string;
}

/** Classic one-column resume body - the most ATS-friendly arrangement. */
export function SingleColumnLayout({
  data,
  theme,
  sections,
  contactFields,
  headingStyle,
  nameAlign = "left",
  nameScale = 2,
  uppercaseName = false,
  serifName = false,
  contactSeparator = "·",
}: SingleColumnProps) {
  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        fontSize: theme.baseFontPx,
        color: "#0f172a",
        lineHeight: theme.lineHeight,
        padding: PAGE_PADDING,
        height: "100%",
      }}
    >
      <header
        style={{
          marginBottom: theme.sectionGapPx,
          textAlign: nameAlign,
        }}
      >
        <ResumeName
          data={data}
          theme={theme}
          align={nameAlign}
          sizeScale={nameScale}
          uppercase={uppercaseName}
          serif={serifName}
        />
        <ContactLine
          basics={data.basics}
          fields={contactFields}
          accent={theme.accent}
          separator={contactSeparator}
          style={{
            marginTop: 6,
            fontSize: theme.baseFontPx - 1,
            opacity: 0.85,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: nameAlign === "center" ? "center" : "flex-start",
          }}
        />
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.sectionGapPx,
        }}
      >
        {sections.map((key) => (
          <section key={key}>
            <SectionHeading style={headingStyle} theme={theme}>
              {sectionLabel(key)}
            </SectionHeading>
            <SectionBody sectionKey={key} data={data} theme={theme} />
          </section>
        ))}
      </div>
    </div>
  );
}

interface TwoColumnProps extends TemplateRenderProps {
  headingStyle: HeadingStyle;
  sidebarSections: SectionKey[];
  sidebarBg?: string;
  sidebarColor?: string;
  /** When true, name + contact render inside the sidebar instead of the top. */
  nameInSidebar?: boolean;
  sidebarHeadingColor?: string;
}

/** Two-column layout with a sidebar for skills/contact/short sections. */
export function TwoColumnLayout({
  data,
  theme,
  sections,
  contactFields,
  headingStyle,
  sidebarSections,
  sidebarBg = "#f1f5f9",
  sidebarColor = "#0f172a",
  nameInSidebar = false,
  sidebarHeadingColor,
}: TwoColumnProps) {
  const sidebarSet = new Set(sidebarSections);
  const inSidebar = sections.filter((s) => sidebarSet.has(s));
  const inMain = sections.filter((s) => !sidebarSet.has(s));

  const Sidebar = (
    <aside
      style={{
        background: sidebarBg,
        color: sidebarColor,
        padding: 28,
        width: "34%",
        display: "flex",
        flexDirection: "column",
        gap: theme.sectionGapPx,
      }}
    >
      {nameInSidebar && (
        <div>
          <ResumeName
            data={data}
            theme={theme}
            color={sidebarHeadingColor ?? theme.accent}
            sizeScale={1.7}
          />
        </div>
      )}
      <div>
        <SectionHeading
          style={headingStyle}
          theme={theme}
          color={sidebarHeadingColor}
        >
          Contact
        </SectionHeading>
        <ContactStack
          basics={data.basics}
          fields={contactFields}
          style={{ fontSize: theme.baseFontPx - 1 }}
        />
      </div>
      {inSidebar.map((key) => (
        <section key={key}>
          <SectionHeading
            style={headingStyle}
            theme={theme}
            color={sidebarHeadingColor}
          >
            {sectionLabel(key)}
          </SectionHeading>
          <SectionBody sectionKey={key} data={data} theme={theme} />
        </section>
      ))}
    </aside>
  );

  const Main = (
    <div
      style={{
        flex: 1,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: theme.sectionGapPx,
      }}
    >
      {!nameInSidebar && (
        <header>
          <ResumeName data={data} theme={theme} sizeScale={1.9} />
        </header>
      )}
      {inMain.map((key) => (
        <section key={key}>
          <SectionHeading style={headingStyle} theme={theme}>
            {sectionLabel(key)}
          </SectionHeading>
          <SectionBody sectionKey={key} data={data} theme={theme} />
        </section>
      ))}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        fontSize: theme.baseFontPx,
        color: "#0f172a",
        lineHeight: theme.lineHeight,
        display: "flex",
        minHeight: "100%",
        alignItems: "stretch",
      }}
    >
      {Sidebar}
      {Main}
    </div>
  );
}

/* ----------------------- atsresume-style template ----------------------- */

/** Minimal inline contact icons (self-contained, print-safe, no deps). */
const ICON: Record<string, React.ReactNode> = {
  phone: <path d="M6.6 10.8a11 11 0 005 5l1.7-1.7a1 1 0 011-.24 8 8 0 002.5.4 1 1 0 011 1V18a1 1 0 01-1 1A14 14 0 015 5a1 1 0 011-1h2.5a1 1 0 011 1 8 8 0 00.4 2.5 1 1 0 01-.24 1L6.6 10.8z" />,
  mail: <path d="M3 5h18v14H3z M3 6l9 7 9-7" />,
  pin: <path d="M12 21s-7-6-7-11a7 7 0 1114 0c0 5-7 11-7 11z M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
  globe: <path d="M12 3a9 9 0 100 18 9 9 0 000-18z M3 12h18 M12 3c2.5 2.7 2.5 15.3 0 18 M12 3c-2.5 2.7-2.5 15.3 0 18" />,
  github: <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0012 2z" />,
  linkedin: <path d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 105 0 2.5 2.5 0 00-2.52-2.5zM3 8.98h4v12H3zM9.5 8.98h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6v6.4h-4v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8h-4z" />,
};

function ContactBit({
  kind,
  children,
  filled,
}: {
  kind: string;
  children: React.ReactNode;
  filled?: boolean;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.75, flexShrink: 0 }}
        aria-hidden="true"
      >
        {ICON[kind]}
      </svg>
      <span>{children}</span>
    </span>
  );
}

const ATS_LEFT: SectionKey[] = [
  "summary",
  "education",
  "skills",
  "languages",
  "certifications",
  "interests",
];

/**
 * The widely-used atsresume layout: a centered header with iconized contact
 * lines and a dashed rule, then a two-column body (summary/education/skills on
 * the left, experience/projects on the right) with underlined section headings.
 */
export function HeaderTwoColumnLayout({
  data,
  theme,
  sections,
  contactFields,
}: TemplateRenderProps) {
  const leftSet = new Set(ATS_LEFT);
  const left = sections.filter((s) => leftSet.has(s));
  const right = sections.filter((s) => !leftSet.has(s));
  const { basics } = data;
  const allow = new Set(contactFields);

  const line1 = [
    basics.phone && { kind: "phone", text: basics.phone },
    basics.email && { kind: "mail", text: basics.email },
    basics.location && { kind: "pin", text: basics.location },
  ].filter(Boolean) as { kind: string; text: string }[];

  const line2 = [
    allow.has("github") &&
      basics.github && { kind: "github", text: basics.github, filled: true },
    allow.has("linkedin") &&
      basics.linkedin && {
        kind: "linkedin",
        text: basics.linkedin,
        filled: true,
      },
    allow.has("website") &&
      basics.website && { kind: "globe", text: basics.website },
  ].filter(Boolean) as { kind: string; text: string; filled?: boolean }[];

  const column = (keys: SectionKey[]) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.sectionGapPx,
      }}
    >
      {keys.map((key) => (
        <section key={key}>
          <SectionHeading style="rule" theme={theme}>
            {sectionLabel(key)}
          </SectionHeading>
          <SectionBody sectionKey={key} data={data} theme={theme} />
        </section>
      ))}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        fontSize: theme.baseFontPx,
        color: "#0f172a",
        lineHeight: theme.lineHeight,
        padding: 40,
        height: "100%",
      }}
    >
      <header
        style={{
          textAlign: "center",
          borderBottom: "1.5px dashed #cbd5e1",
          paddingBottom: 12,
          marginBottom: theme.sectionGapPx,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: theme.baseFontPx * 2.05,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}
        >
          {basics.fullName || "Your Name"}
        </h1>
        {basics.jobTitle && (
          <div
            style={{
              marginTop: 2,
              fontSize: theme.baseFontPx + 1.5,
              color: "#475569",
            }}
          >
            {basics.jobTitle}
          </div>
        )}
        {line1.length > 0 && (
          <div
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2px 16px",
              fontSize: theme.baseFontPx - 1,
            }}
          >
            {line1.map((c) => (
              <ContactBit key={c.kind} kind={c.kind}>
                {c.text}
              </ContactBit>
            ))}
          </div>
        )}
        {line2.length > 0 && (
          <div
            style={{
              marginTop: 3,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2px 16px",
              fontSize: theme.baseFontPx - 1,
              color: theme.accent,
            }}
          >
            {line2.map((c) => (
              <ContactBit key={c.kind} kind={c.kind} filled={c.filled}>
                {c.text}
              </ContactBit>
            ))}
          </div>
        )}
      </header>

      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        <div style={{ width: "35%", flexShrink: 0 }}>{column(left)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>{column(right)}</div>
      </div>
    </div>
  );
}

/**
 * The Harvard-based, recruiter-favored single-column format: a centered name
 * over a single pipe-separated contact line (job title included), then
 * full-width ruled section headings. Monochrome and highly ATS-parseable.
 */
export function CenteredRuleLayout({
  data,
  theme,
  sections,
  contactFields,
}: TemplateRenderProps) {
  const { basics } = data;
  const allow = new Set(contactFields);
  const contact = [
    basics.jobTitle,
    basics.location,
    basics.phone,
    basics.email,
    allow.has("linkedin") ? basics.linkedin : "",
    allow.has("website") ? basics.website : "",
    allow.has("github") ? basics.github : "",
  ].filter((v) => v && v.trim());

  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        fontSize: theme.baseFontPx,
        color: "#0f172a",
        lineHeight: theme.lineHeight,
        padding: 44,
        height: "100%",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: theme.sectionGapPx }}>
        <h1
          style={{
            margin: 0,
            fontSize: theme.baseFontPx * 1.95,
            fontWeight: 700,
            letterSpacing: 0.2,
            lineHeight: 1.1,
          }}
        >
          {basics.fullName || "Your Name"}
        </h1>
        {contact.length > 0 && (
          <div
            style={{
              marginTop: 5,
              fontSize: theme.baseFontPx - 1.5,
              color: "#475569",
            }}
          >
            {contact.join("   |   ")}
          </div>
        )}
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.sectionGapPx,
        }}
      >
        {sections.map((key) => (
          <section key={key}>
            <SectionHeading style="rule" theme={theme}>
              {sectionLabel(key)}
            </SectionHeading>
            <SectionBody sectionKey={key} data={data} theme={theme} />
          </section>
        ))}
      </div>
    </div>
  );
}
