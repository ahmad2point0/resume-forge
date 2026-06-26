import type { ComponentType } from "react";

import type { Resume, ResumeData, ResumeSettings, SectionKey } from "./resume.types";

/**
 * Optional contact/link fields a template may or may not render. The core
 * fields (name, jobTitle, email, phone, location, summary) are universal and
 * always shown; only these links vary by template.
 */
export type ContactFieldKey = "website" | "linkedin" | "github";

/** Props every template renderer receives. Pure presentation - no stores. */
export interface TemplateRenderProps {
  data: ResumeData;
  settings: ResumeSettings;
  /** Resolved section order honoring visibility (excludes hidden + empty). */
  sections: SectionKey[];
  /** Resolved spacing/scale tokens, derived from settings. */
  theme: ResolvedTemplateTheme;
  /** Optional contact links this template renders (resolved; never undefined). */
  contactFields: ContactFieldKey[];
}

/** Concrete numeric tokens a renderer uses, derived from ResumeSettings. */
export interface ResolvedTemplateTheme {
  accent: string;
  fontFamily: string;
  /** Base body font size in px after applying fontScale. */
  baseFontPx: number;
  /** Vertical rhythm between sections in px. */
  sectionGapPx: number;
  /** Gap between entries within a section. */
  entryGapPx: number;
  lineHeight: number;
}

export type TemplateCategory =
  | "ats"
  | "professional"
  | "modern"
  | "technical"
  | "creative"
  | "academic"
  | "executive";

/** A registered template: metadata + the React renderer. */
export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  /** Marketing-friendly tags shown on gallery cards. */
  tags: string[];
  /** Two-column layouts render contact/skills in a sidebar. */
  columns: 1 | 2;
  /** Whether this template passes strict ATS parsing (single column, no tables). */
  atsSafe: boolean;
  /** Optional marketing flag shown on the gallery card (e.g. "Most used"). */
  badge?: string;
  /**
   * Which optional contact links this template renders. Omit to support all
   * three. Drives both rendering and which inputs the editor form shows.
   */
  contactFields?: ContactFieldKey[];
  /** Sensible defaults applied when a user picks this template. */
  defaults: Pick<
    ResumeSettings,
    "accentColor" | "fontFamily" | "spacing"
  >;
  Renderer: ComponentType<TemplateRenderProps>;
}

/** Public projection used by the gallery (no React component reference). */
export type TemplateMeta = Omit<TemplateDefinition, "Renderer">;

export type { Resume };
