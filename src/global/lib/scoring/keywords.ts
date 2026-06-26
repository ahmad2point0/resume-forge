import type { ResumeData } from "@/global/@types";

/** Common English stopwords excluded from keyword analysis. */
const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "your", "you",
  "are", "was", "were", "will", "have", "has", "had", "our", "their", "they",
  "them", "his", "her", "she", "him", "its", "but", "not", "all", "any", "can",
  "out", "use", "used", "using", "via", "per", "etc", "a", "an", "to", "of",
  "in", "on", "at", "by", "as", "is", "it", "or", "be", "we", "i", "my", "me",
  "able", "across", "over", "more", "most", "such", "than", "then", "also",
  "who", "what", "which", "when", "where", "how", "job", "role", "work",
  "experience", "responsible", "including", "various", "strong", "excellent",
]);

const WORD_RE = /[a-zA-Z][a-zA-Z+#.\-]{1,}/g;

/** Tokenize free text into normalized, deduplicated keyword candidates. */
export function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(WORD_RE) ?? [];
  return matches
    .map((w) => w.replace(/[.\-]+$/, ""))
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/** Frequency-ranked keywords extracted from arbitrary text. */
export function extractKeywords(text: string, limit = 30): string[] {
  const counts = new Map<string, number>();
  for (const token of tokenize(text)) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/** All searchable text from a resume, flattened to a single lowercase string. */
export function resumeToText(data: ResumeData): string {
  const parts: string[] = [
    data.basics.jobTitle,
    data.basics.summary,
    ...data.work.flatMap((w) => [w.position, w.company, ...w.highlights]),
    ...data.projects.flatMap((p) => [p.name, p.description, ...p.highlights, ...p.keywords]),
    ...data.skills.flatMap((s) => [s.name, ...s.keywords]),
    ...data.education.flatMap((e) => [e.degree, e.field, e.institution]),
    ...data.certifications.map((c) => c.name),
  ];
  return parts.join(" ").toLowerCase();
}

/** All distinct skill/keyword tokens declared anywhere in the resume. */
export function resumeKeywordSet(data: ResumeData): Set<string> {
  return new Set(tokenize(resumeToText(data)));
}

export interface JobMatchResult {
  /** 0-100 overlap of job keywords present in the resume. */
  score: number;
  matched: string[];
  missing: string[];
}

/** Compare a resume against a pasted job description. */
export function matchJobDescription(
  data: ResumeData,
  jobDescription: string,
): JobMatchResult {
  const jobKeywords = extractKeywords(jobDescription, 40);
  if (jobKeywords.length === 0) {
    return { score: 0, matched: [], missing: [] };
  }
  const resumeWords = resumeKeywordSet(data);
  const matched = jobKeywords.filter((k) => resumeWords.has(k));
  const missing = jobKeywords.filter((k) => !resumeWords.has(k));
  const score = Math.round((matched.length / jobKeywords.length) * 100);
  return { score, matched, missing };
}
