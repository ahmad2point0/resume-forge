import type { Resume } from "@/global/@types";
import { normalizeResume } from "@/global/lib/resume";

export interface ImportValidation {
  ok: boolean;
  resume?: Resume;
  errors: string[];
  warnings: string[];
}

/**
 * Validate pasted JSON before import. Parsing is strict (clear errors on bad
 * JSON); structure is lenient - anything object-shaped is normalized into a
 * valid resume, with warnings for likely-missing sections.
 */
export function validateImportText(text: string): ImportValidation {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, errors: ["Paste your JSON to import."], warnings: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      ok: false,
      errors: [
        "That isn’t valid JSON. Paste the JSON exactly as produced - no extra text, comments, or markdown fences.",
      ],
      warnings: [],
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      errors: ["Expected a JSON object like { \"title\": …, \"data\": … }."],
      warnings: [],
    };
  }

  const resume = normalizeResume(parsed);
  const warnings: string[] = [];
  if (!resume.data.basics.fullName)
    warnings.push("No name was found - you can add it in the builder.");
  if (resume.data.work.length === 0)
    warnings.push("No work experience was found.");
  if (resume.data.skills.length === 0) warnings.push("No skills were found.");

  return { ok: true, resume, errors: [], warnings };
}
