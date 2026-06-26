import type { SectionKey } from "@/global/@types";

export type ScoreCategoryKey =
  | "atsReadability"
  | "keywords"
  | "formatting"
  | "experience"
  | "skills";

export interface ScoreCategory {
  key: ScoreCategoryKey;
  label: string;
  /** 0-100 for this category. */
  score: number;
  /** Short, human explanation of the score. */
  detail: string;
}

export interface AtsCheck {
  id: string;
  label: string;
  passed: boolean;
  /** Hint shown when the check fails. */
  hint: string;
  /** Section to jump to when the user acts on this check. */
  section?: SectionKey | "basics";
}

export interface MissingItem {
  label: string;
  section: SectionKey | "basics";
}

export interface ResumeScore {
  /** Headline 0-100 overall score (weighted category average). */
  overall: number;
  /** 0-100 completeness based on filled key sections. */
  completeness: number;
  categories: ScoreCategory[];
  checks: AtsCheck[];
  atsPassCount: number;
  atsTotal: number;
  missing: MissingItem[];
  /** Prioritized, actionable suggestions. */
  suggestions: string[];
}
