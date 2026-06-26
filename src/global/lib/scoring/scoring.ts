import type { ResumeData } from "@/global/@types";

import { resumeKeywordSet } from "./keywords";
import type {
  AtsCheck,
  MissingItem,
  ResumeScore,
  ScoreCategory,
} from "./types";

export interface ScoreOptions {
  /** Whether the selected template is single-column / ATS-safe. */
  atsSafeTemplate?: boolean;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const hasDigit = (s: string) => /\d/.test(s);

const nonEmpty = (s: string | undefined) => Boolean(s && s.trim().length > 0);

/* ----------------------------- completeness ----------------------------- */

interface SectionWeight {
  weight: number;
  filled: (d: ResumeData) => number; // 0..1
}

const COMPLETENESS_WEIGHTS: SectionWeight[] = [
  {
    weight: 20,
    filled: (d) => {
      const fields = [
        d.basics.fullName,
        d.basics.jobTitle,
        d.basics.email,
        d.basics.phone,
        d.basics.location,
      ];
      return fields.filter(nonEmpty).length / fields.length;
    },
  },
  { weight: 12, filled: (d) => (nonEmpty(d.basics.summary) ? 1 : 0) },
  {
    weight: 28,
    filled: (d) => {
      if (d.work.length === 0) return 0;
      const withBullets = d.work.filter((w) => w.highlights.some(nonEmpty));
      return Math.min(1, (withBullets.length / Math.min(d.work.length, 2)) * 1);
    },
  },
  {
    weight: 15,
    filled: (d) => {
      const total = d.skills.reduce((n, g) => n + g.keywords.length, 0);
      return Math.min(1, total / 6);
    },
  },
  { weight: 12, filled: (d) => (d.education.length > 0 ? 1 : 0) },
  { weight: 8, filled: (d) => (d.projects.length > 0 ? 1 : 0) },
  {
    weight: 5,
    filled: (d) =>
      d.certifications.length + d.achievements.length + d.languages.length > 0
        ? 1
        : 0,
  },
];

function computeCompleteness(data: ResumeData): number {
  const score = COMPLETENESS_WEIGHTS.reduce(
    (sum, s) => sum + s.weight * s.filled(data),
    0,
  );
  return clamp(score);
}

/* ------------------------------- checks --------------------------------- */

function computeChecks(data: ResumeData, atsSafe: boolean): AtsCheck[] {
  const allHighlights = data.work.flatMap((w) => w.highlights).filter(nonEmpty);
  const skillCount = data.skills.reduce((n, g) => n + g.keywords.length, 0);

  return [
    {
      id: "name-title",
      label: "Name and job title present",
      passed: nonEmpty(data.basics.fullName) && nonEmpty(data.basics.jobTitle),
      hint: "Add your full name and a target job title.",
      section: "basics",
    },
    {
      id: "contact",
      label: "Reachable contact details",
      passed: nonEmpty(data.basics.email) && nonEmpty(data.basics.phone),
      hint: "Add a professional email and a phone number.",
      section: "basics",
    },
    {
      id: "summary",
      label: "Professional summary written",
      passed: data.basics.summary.trim().length >= 40,
      hint: "Write a 2-4 sentence summary leading with your title.",
      section: "summary",
    },
    {
      id: "experience",
      label: "At least one work experience",
      passed: data.work.length > 0,
      hint: "Add your most recent roles.",
      section: "work",
    },
    {
      id: "bullets",
      label: "Experience uses bullet points",
      passed: allHighlights.length >= 2,
      hint: "Add achievement bullets to each role (one per line).",
      section: "work",
    },
    {
      id: "quantified",
      label: "Bullets quantify impact",
      passed: allHighlights.filter(hasDigit).length >= 1,
      hint: "Add metrics - %, $, time saved, scale - to at least one bullet.",
      section: "work",
    },
    {
      id: "skills",
      label: "Skills are listed",
      passed: skillCount >= 4,
      hint: "List at least 4 relevant, parseable skills.",
      section: "skills",
    },
    {
      id: "education",
      label: "Education included",
      passed: data.education.length > 0,
      hint: "Add your degree or relevant education.",
      section: "education",
    },
    {
      id: "ats-template",
      label: "ATS-safe layout",
      passed: atsSafe,
      hint: "Pick a single-column template for best ATS parsing.",
    },
  ];
}

/* ----------------------------- categories ------------------------------- */

function computeCategories(
  data: ResumeData,
  atsSafe: boolean,
): ScoreCategory[] {
  const highlights = data.work.flatMap((w) => w.highlights).filter(nonEmpty);
  const quantified = highlights.filter(hasDigit).length;
  const skillCount = data.skills.reduce((n, g) => n + g.keywords.length, 0);
  const uniqueKeywords = resumeKeywordSet(data).size;
  const longBullets = highlights.filter((h) => h.length > 230).length;

  // ATS readability - parseable contact + safe template + no missing core.
  const contactFields = [
    data.basics.fullName,
    data.basics.email,
    data.basics.phone,
    data.basics.location,
  ].filter(nonEmpty).length;
  const atsReadability = clamp(
    (atsSafe ? 55 : 25) + (contactFields / 4) * 45,
  );

  // Keywords - breadth of distinct keywords across the resume.
  const keywords = clamp(Math.min(1, uniqueKeywords / 45) * 100);

  // Formatting - penalize overly long bullets, reward consistent structure.
  const structureBase = highlights.length > 0 ? 70 : 30;
  const formatting = clamp(structureBase + (atsSafe ? 20 : 0) - longBullets * 12);

  // Experience quality - roles count, bullets per role, quantification.
  const bulletsPerRole = data.work.length
    ? highlights.length / data.work.length
    : 0;
  const experience = clamp(
    Math.min(1, data.work.length / 2) * 35 +
      Math.min(1, bulletsPerRole / 3) * 35 +
      Math.min(1, quantified / 3) * 30,
  );

  // Skills coverage - count + sensible grouping.
  const grouped = data.skills.filter((g) => nonEmpty(g.name)).length;
  const skills = clamp(
    Math.min(1, skillCount / 10) * 75 + Math.min(1, grouped / 2) * 25,
  );

  return [
    {
      key: "atsReadability",
      label: "ATS readability",
      score: atsReadability,
      detail: atsSafe
        ? "Single-column, parseable layout."
        : "Two-column layouts can confuse some parsers.",
    },
    {
      key: "keywords",
      label: "Keywords",
      score: keywords,
      detail: `${uniqueKeywords} distinct keywords detected.`,
    },
    {
      key: "formatting",
      label: "Formatting",
      score: formatting,
      detail: longBullets
        ? `${longBullets} bullet(s) are too long - tighten them up.`
        : "Bullets are a readable length.",
    },
    {
      key: "experience",
      label: "Experience quality",
      score: experience,
      detail: `${highlights.length} bullet(s) across ${data.work.length} role(s); ${quantified} quantified.`,
    },
    {
      key: "skills",
      label: "Skills coverage",
      score: skills,
      detail: `${skillCount} skill(s) in ${data.skills.length} group(s).`,
    },
  ];
}

/* ------------------------------- missing -------------------------------- */

function computeMissing(data: ResumeData): MissingItem[] {
  const missing: MissingItem[] = [];
  if (!nonEmpty(data.basics.fullName) || !nonEmpty(data.basics.email))
    missing.push({ label: "Contact details", section: "basics" });
  if (data.basics.summary.trim().length < 40)
    missing.push({ label: "Professional summary", section: "summary" });
  if (data.work.length === 0)
    missing.push({ label: "Work experience", section: "work" });
  else if (!data.work.some((w) => w.highlights.some(nonEmpty)))
    missing.push({ label: "Experience bullet points", section: "work" });
  if (data.skills.reduce((n, g) => n + g.keywords.length, 0) < 4)
    missing.push({ label: "Skills", section: "skills" });
  if (data.education.length === 0)
    missing.push({ label: "Education", section: "education" });
  return missing;
}

function computeSuggestions(
  categories: ScoreCategory[],
  checks: AtsCheck[],
): string[] {
  const suggestions: string[] = [];
  for (const check of checks) {
    if (!check.passed) suggestions.push(check.hint);
  }
  // Surface the weakest categories that aren't already covered by a check.
  const weakest = [...categories]
    .filter((c) => c.score < 60)
    .sort((a, b) => a.score - b.score);
  for (const c of weakest) {
    suggestions.push(`Improve ${c.label.toLowerCase()}: ${c.detail}`);
  }
  return [...new Set(suggestions)].slice(0, 6);
}

/* ------------------------------- public --------------------------------- */

/** Compute the full resume score, ATS checks, and suggestions. */
export function scoreResume(
  data: ResumeData,
  options: ScoreOptions = {},
): ResumeScore {
  const atsSafe = options.atsSafeTemplate ?? true;
  const categories = computeCategories(data, atsSafe);
  const checks = computeChecks(data, atsSafe);
  const completeness = computeCompleteness(data);

  const CATEGORY_WEIGHTS: Record<string, number> = {
    atsReadability: 0.25,
    keywords: 0.2,
    formatting: 0.15,
    experience: 0.25,
    skills: 0.15,
  };
  const overall = clamp(
    categories.reduce((sum, c) => sum + c.score * CATEGORY_WEIGHTS[c.key], 0),
  );

  const atsPassCount = checks.filter((c) => c.passed).length;

  return {
    overall,
    completeness,
    categories,
    checks,
    atsPassCount,
    atsTotal: checks.length,
    missing: computeMissing(data),
    suggestions: computeSuggestions(categories, checks),
  };
}

/** Cheap completeness-only computation for dashboard summaries. */
export function getCompleteness(data: ResumeData): number {
  return computeCompleteness(data);
}
