/**
 * The resumeforge domain model.
 *
 * This is the single canonical shape for a resume across the whole app -
 * editor, templates, scoring, import and export all speak this schema.
 * It is intentionally close to the JSON Resume standard (jsonresume.org) so
 * imported/exported `resume.json` files interoperate with the wider ecosystem,
 * with a few additions (stable entry ids, section ordering) we need for the UI.
 */

/** Every section key the builder knows about. Drives ordering & visibility. */
export type SectionKey =
  | "summary"
  | "work"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "achievements"
  | "publications"
  | "languages"
  | "interests"
  | "references";

/** Contact + identity. Always present, never reorderable. */
export interface Basics {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  /** Professional summary - its own section in the UI but stored on basics. */
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM (empty when current)
  current: boolean;
  /** One achievement bullet per line; rendered as a list. */
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  /** Tech stack / keywords shown as inline chips. */
  keywords: string[];
}

export interface SkillGroup {
  id: string;
  /** e.g. "Languages", "Frameworks". Empty for a flat skill list. */
  name: string;
  /** Individual, parseable skill keywords. */
  keywords: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  summary: string;
}

export interface Language {
  id: string;
  name: string;
  /** Free-form fluency: "Native", "Professional", "Conversational". */
  fluency: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  contact: string;
  reference: string;
}

/** The full content payload - what the templates render. */
export interface ResumeData {
  basics: Basics;
  work: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  achievements: Achievement[];
  publications: Publication[];
  languages: Language[];
  interests: Interest[];
  references: Reference[];
}

export type PageSize = "a4" | "letter";

export type SpacingPreset = "compact" | "cozy" | "relaxed";

export type FontPreset =
  | "geist"
  | "inter"
  | "georgia"
  | "times"
  | "garamond"
  | "mono";

/** Presentation settings - independent of content, swappable any time. */
export interface ResumeSettings {
  templateId: string;
  /** Accent / heading color as a hex string. */
  accentColor: string;
  fontFamily: FontPreset;
  /** Multiplier applied to template base font sizes (0.85-1.15). */
  fontScale: number;
  spacing: SpacingPreset;
  pageSize: PageSize;
  /** Section render order (Basics is always first and excluded). */
  sectionOrder: SectionKey[];
  /** Sections the user has hidden from the rendered resume. */
  hiddenSections: SectionKey[];
  /** Show contact icons in templates that support them. */
  showIcons: boolean;
}

/** A complete, persisted resume document. */
export interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: ResumeData;
  settings: ResumeSettings;
}

/** Lightweight projection for dashboard lists (avoids loading full data). */
export interface ResumeSummary {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  createdAt: string;
  completeness: number;
}
