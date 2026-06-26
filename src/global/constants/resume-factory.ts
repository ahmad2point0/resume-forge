import type {
  Achievement,
  Basics,
  Certification,
  Education,
  Interest,
  Language,
  Project,
  Publication,
  Reference,
  Resume,
  ResumeData,
  ResumeSettings,
  SkillGroup,
  WorkExperience,
} from "@/global/@types";
import { createId, createShortId } from "@/global/utils/id";
import { nowIso } from "@/global/utils/date";

import { DEFAULT_SECTION_ORDER } from "./sections";

export const DEFAULT_TEMPLATE_ID = "minimal-ats";

export function createEmptyBasics(): Basics {
  return {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  };
}

export function createDefaultSettings(
  overrides: Partial<ResumeSettings> = {},
): ResumeSettings {
  // Drop undefined override values so they can never erase a default.
  const clean = Object.fromEntries(
    Object.entries(overrides).filter(([, v]) => v !== undefined),
  ) as Partial<ResumeSettings>;

  return {
    templateId: DEFAULT_TEMPLATE_ID,
    accentColor: "#2563eb",
    fontFamily: "geist",
    fontScale: 1,
    spacing: "cozy",
    pageSize: "a4",
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    hiddenSections: [],
    showIcons: false,
    ...clean,
  };
}

export function createEmptyResumeData(): ResumeData {
  return {
    basics: createEmptyBasics(),
    work: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    publications: [],
    languages: [],
    interests: [],
    references: [],
  };
}

export function createResume(title = "Untitled resume"): Resume {
  const ts = nowIso();
  return {
    id: createId("res"),
    title,
    createdAt: ts,
    updatedAt: ts,
    data: createEmptyResumeData(),
    settings: createDefaultSettings(),
  };
}

/* ------------------------------------------------------------------ *
 * Per-section entry factories. Each produces a blank, id-stamped row. *
 * ------------------------------------------------------------------ */

export const createWorkEntry = (): WorkExperience => ({
  id: createShortId(),
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  highlights: [],
});

export const createEducationEntry = (): Education => ({
  id: createShortId(),
  institution: "",
  degree: "",
  field: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  gpa: "",
  highlights: [],
});

export const createProjectEntry = (): Project => ({
  id: createShortId(),
  name: "",
  description: "",
  url: "",
  startDate: "",
  endDate: "",
  highlights: [],
  keywords: [],
});

export const createSkillGroup = (): SkillGroup => ({
  id: createShortId(),
  name: "",
  keywords: [],
});

export const createCertificationEntry = (): Certification => ({
  id: createShortId(),
  name: "",
  issuer: "",
  date: "",
  url: "",
});

export const createAchievementEntry = (): Achievement => ({
  id: createShortId(),
  title: "",
  description: "",
  date: "",
});

export const createPublicationEntry = (): Publication => ({
  id: createShortId(),
  title: "",
  publisher: "",
  date: "",
  url: "",
  summary: "",
});

export const createLanguageEntry = (): Language => ({
  id: createShortId(),
  name: "",
  fluency: "",
});

export const createInterestEntry = (): Interest => ({
  id: createShortId(),
  name: "",
});

export const createReferenceEntry = (): Reference => ({
  id: createShortId(),
  name: "",
  title: "",
  contact: "",
  reference: "",
});
