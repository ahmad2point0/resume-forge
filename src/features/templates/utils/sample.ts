import type { Resume } from "@/global/@types";
import { createResume, SAMPLE_RESUME_DATA } from "@/global/constants";
import { applyTemplate } from "@/global/templates";

/** Build an in-memory sample resume for previewing a template in the gallery. */
export function buildSampleResume(templateId: string): Resume {
  const base = createResume("Sample");
  return {
    ...base,
    data: structuredClone(SAMPLE_RESUME_DATA),
    settings: applyTemplate(base.settings, templateId),
  };
}
