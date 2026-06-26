import type { SectionKey } from "@/global/@types";

/** Lucide icon names (resolved where rendered) keep this file dependency-free. */
export interface SectionMeta {
  key: SectionKey;
  /** Plural section heading shown in the editor and resume. */
  label: string;
  /** Singular noun for "Add {singular}" buttons. */
  singular: string;
  icon: string;
  description: string;
  /** Whether the section holds a list of entries (vs. a single block). */
  list: boolean;
}

/**
 * The canonical section registry. The order here is the default section order
 * for new resumes; users can reorder via drag & drop in the editor.
 */
export const SECTION_REGISTRY: Record<SectionKey, SectionMeta> = {
  summary: {
    key: "summary",
    label: "Professional summary",
    singular: "Summary",
    icon: "FileText",
    description:
      "2-4 sentences. Lead with your title, years of experience, and biggest strengths.",
    list: false,
  },
  work: {
    key: "work",
    label: "Experience",
    singular: "Experience",
    icon: "Briefcase",
    description: "Use one bullet per line. Start with a verb; quantify impact.",
    list: true,
  },
  education: {
    key: "education",
    label: "Education",
    singular: "Education",
    icon: "GraduationCap",
    description: "Degrees, institutions, and relevant coursework.",
    list: true,
  },
  projects: {
    key: "projects",
    label: "Projects",
    singular: "Project",
    icon: "FolderGit2",
    description: "Side projects, open source, or notable work.",
    list: true,
  },
  skills: {
    key: "skills",
    label: "Skills",
    singular: "Skill group",
    icon: "Sparkles",
    description:
      "Type a skill and press Enter. These render as plain, parseable text.",
    list: true,
  },
  certifications: {
    key: "certifications",
    label: "Certifications",
    singular: "Certification",
    icon: "BadgeCheck",
    description: "Professional certifications and licenses.",
    list: true,
  },
  achievements: {
    key: "achievements",
    label: "Achievements",
    singular: "Achievement",
    icon: "Trophy",
    description: "Awards, honors, and standout accomplishments.",
    list: true,
  },
  publications: {
    key: "publications",
    label: "Publications",
    singular: "Publication",
    icon: "BookOpen",
    description: "Papers, articles, and published work.",
    list: true,
  },
  languages: {
    key: "languages",
    label: "Languages",
    singular: "Language",
    icon: "Languages",
    description: "Languages you speak and your fluency level.",
    list: true,
  },
  interests: {
    key: "interests",
    label: "Interests",
    singular: "Interest",
    icon: "Heart",
    description: "Personal interests and hobbies.",
    list: true,
  },
  references: {
    key: "references",
    label: "References",
    singular: "Reference",
    icon: "Users",
    description: "Professional references (or 'available on request').",
    list: true,
  },
};

/** Default section order for a new resume. */
export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "summary",
  "work",
  "education",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "publications",
  "languages",
  "interests",
  "references",
];

export const ALL_SECTION_KEYS = DEFAULT_SECTION_ORDER;
