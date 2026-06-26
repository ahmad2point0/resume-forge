import type {
  Resume,
  ResumeData,
  ResumeSettings,
  SectionKey,
} from "@/global/@types";
import { ALL_SECTION_KEYS, createDefaultSettings } from "@/global/constants";
import { createId, createShortId } from "@/global/utils/id";
import { nowIso } from "@/global/utils/date";

/**
 * Strip the markdown/link artifacts that LLM exports routinely smear into
 * field values: `[label](url)`, orphaned `](url)` left when a link spans JSON
 * boundaries, a leading `[` on a bare URL, and `mailto:`/`tel:` schemes.
 * Clean strings (the common case) are returned untouched via the early guard.
 */
function clean(s: string): string {
  if (!s.includes("[") && !s.includes("]") && !/\b(?:mailto|tel):/i.test(s)) {
    return s;
  }
  let out = s
    // [label](url) -> label
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, "$1")
    // orphaned ](url) where a markdown link was split across JSON keys
    .replace(/\]\([^)]*\)/g, "");
  // Strip a purely-orphaned leading "[" (e.g. "[https://...") - but only when
  // there is no closing "]" anywhere, so balanced brackets in real content
  // like "Senior Engineer [Contract]" are left untouched.
  if (out.includes("[") && !out.includes("]")) out = out.replace(/^\s*\[+/, "");
  // Likewise, a purely-orphaned trailing "]".
  if (out.includes("]") && !out.includes("[")) out = out.replace(/\]+\s*$/, "");
  return out
    // scheme prefixes auto-added to contact links
    .replace(/\b(?:mailto|tel):/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* Defensive coercion helpers - imported data is untrusted. */
const str = (v: unknown, fallback = ""): string =>
  clean(typeof v === "string" ? v : v == null ? fallback : String(v));

const bool = (v: unknown): boolean => v === true || v === "true";

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Accept a string[] OR a comma/newline-delimited string. */
function strList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => str(x)).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

/** Normalize a `YYYY-MM` date, tolerating `YYYY/MM`, `YYYY-MM-DD`, or year only. */
function normalizeMonth(v: unknown): string {
  const raw = str(v).trim();
  if (!raw) return "";
  const match = raw.match(/(\d{4})[-/.]?(\d{1,2})?/);
  if (!match) return "";
  const year = match[1];
  const month = match[2] ? match[2].padStart(2, "0") : "";
  return month ? `${year}-${month}` : year;
}

function normalizeData(input: unknown): ResumeData {
  const data = obj(input);
  const basics = obj(data.basics);

  return {
    basics: {
      fullName: str(basics.fullName ?? basics.name),
      jobTitle: str(basics.jobTitle ?? basics.title ?? basics.label),
      email: str(basics.email),
      phone: str(basics.phone),
      location: str(basics.location ?? basics.city),
      website: str(basics.website ?? basics.url),
      linkedin: str(basics.linkedin),
      github: str(basics.github),
      summary: str(basics.summary ?? data.summary),
    },
    work: arr(data.work ?? data.experience).map((w) => {
      const e = obj(w);
      return {
        id: str(e.id) || createShortId(),
        company: str(e.company ?? e.organization ?? e.name),
        position: str(e.position ?? e.role ?? e.title),
        location: str(e.location),
        startDate: normalizeMonth(e.startDate ?? e.start),
        endDate: normalizeMonth(e.endDate ?? e.end),
        current: bool(e.current),
        highlights: strList(e.highlights ?? e.bullets ?? e.summary),
      };
    }),
    education: arr(data.education).map((ed) => {
      const e = obj(ed);
      return {
        id: str(e.id) || createShortId(),
        institution: str(e.institution ?? e.school),
        degree: str(e.degree ?? e.studyType),
        field: str(e.field ?? e.area),
        location: str(e.location),
        startDate: normalizeMonth(e.startDate ?? e.start),
        endDate: normalizeMonth(e.endDate ?? e.end),
        current: bool(e.current),
        gpa: str(e.gpa ?? e.score),
        highlights: strList(e.highlights ?? e.courses),
      };
    }),
    projects: arr(data.projects).map((pr) => {
      const e = obj(pr);
      return {
        id: str(e.id) || createShortId(),
        name: str(e.name ?? e.title),
        description: str(e.description),
        url: str(e.url ?? e.link),
        startDate: normalizeMonth(e.startDate),
        endDate: normalizeMonth(e.endDate),
        highlights: strList(e.highlights),
        keywords: strList(e.keywords ?? e.tech ?? e.tags),
      };
    }),
    skills: arr(data.skills).map((sk) => {
      const e = obj(sk);
      // Support both grouped ({name, keywords}) and flat ("React") shapes.
      if (typeof sk === "string") {
        return { id: createShortId(), name: "", keywords: [str(sk)] };
      }
      return {
        id: str(e.id) || createShortId(),
        name: str(e.name ?? e.category),
        keywords: strList(e.keywords ?? e.items ?? e.skills),
      };
    }),
    certifications: arr(data.certifications).map((c) => {
      const e = obj(c);
      return {
        id: str(e.id) || createShortId(),
        name: str(e.name ?? e.title),
        issuer: str(e.issuer),
        date: normalizeMonth(e.date),
        url: str(e.url),
      };
    }),
    achievements: arr(data.achievements ?? data.awards).map((a) => {
      const e = obj(a);
      return {
        id: str(e.id) || createShortId(),
        title: str(e.title ?? e.name),
        description: str(e.description ?? e.summary),
        date: normalizeMonth(e.date),
      };
    }),
    publications: arr(data.publications).map((p) => {
      const e = obj(p);
      return {
        id: str(e.id) || createShortId(),
        title: str(e.title ?? e.name),
        publisher: str(e.publisher),
        date: normalizeMonth(e.date ?? e.releaseDate),
        url: str(e.url),
        summary: str(e.summary),
      };
    }),
    languages: arr(data.languages).map((l) => {
      const e = obj(l);
      if (typeof l === "string")
        return { id: createShortId(), name: str(l), fluency: "" };
      return {
        id: str(e.id) || createShortId(),
        name: str(e.name ?? e.language),
        fluency: str(e.fluency ?? e.level),
      };
    }),
    interests: arr(data.interests).map((i) => {
      const e = obj(i);
      if (typeof i === "string") return { id: createShortId(), name: str(i) };
      return { id: str(e.id) || createShortId(), name: str(e.name) };
    }),
    references: arr(data.references).map((r) => {
      const e = obj(r);
      return {
        id: str(e.id) || createShortId(),
        name: str(e.name),
        title: str(e.title ?? e.position),
        contact: str(e.contact ?? e.email),
        reference: str(e.reference ?? e.summary),
      };
    }),
  } satisfies ResumeData;
}

function normalizeSettings(input: unknown): ResumeSettings {
  const s = obj(input);
  const order = arr(s.sectionOrder)
    .map((k) => str(k))
    .filter((k): k is SectionKey =>
      (ALL_SECTION_KEYS as string[]).includes(k),
    );

  // Only override keys that actually carry a value — passing `undefined`
  // would overwrite (and erase) the factory defaults.
  const overrides: Partial<ResumeSettings> = {};
  if (str(s.templateId)) overrides.templateId = str(s.templateId);
  if (str(s.accentColor)) overrides.accentColor = str(s.accentColor);
  if (order.length) overrides.sectionOrder = order;

  return createDefaultSettings(overrides);
}

/**
 * Turn arbitrary parsed JSON (from import) into a complete, valid Resume.
 * Always returns something renderable - unknown fields are dropped, missing
 * fields get sensible defaults, and every entry receives a stable id.
 */
export function normalizeResume(input: unknown): Resume {
  const root = obj(input);
  // Support both `{ title, data }` and a bare ResumeData payload.
  const looksLikeData =
    "basics" in root || "work" in root || "experience" in root;
  const dataInput = looksLikeData ? root : root.data;
  const ts = nowIso();

  return {
    id: str(root.id) || createId("res"),
    title: str(root.title) || "Imported resume",
    createdAt: str(root.createdAt) || ts,
    updatedAt: ts,
    data: normalizeData(dataInput),
    settings: normalizeSettings(root.settings),
  };
}
