import type {
  ContactFieldKey,
  ResumeSettings,
  TemplateDefinition,
  TemplateMeta,
} from "@/global/@types";

import { ALL_CONTACT_FIELDS } from "./components/contact";
import { atsPro } from "./definitions/ats-pro";
import { recruiter } from "./definitions/recruiter";
import { minimalAts } from "./definitions/minimal-ats";
import { harvard } from "./definitions/harvard";
import { modernProfessional } from "./definitions/modern-professional";
import { softwareEngineer } from "./definitions/software-engineer";
import { startupFounder } from "./definitions/startup-founder";
import { executive } from "./definitions/executive";
import { academic } from "./definitions/academic";

/** Ordered list of all registered templates (gallery + builder order). */
export const TEMPLATES: TemplateDefinition[] = [
  atsPro,
  recruiter,
  minimalAts,
  softwareEngineer,
  modernProfessional,
  harvard,
  startupFounder,
  executive,
  academic,
];

const TEMPLATE_MAP: Record<string, TemplateDefinition> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t]),
);

/** Look up a template by id, falling back to Minimal ATS if unknown. */
export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATE_MAP[id] ?? minimalAts;
}

/** Whether the given template id renders an ATS-safe single-column layout. */
export function isAtsSafe(id: string): boolean {
  return getTemplate(id).atsSafe;
}

/** Optional contact links a template renders (defaults to all three). */
export function templateContactFields(id: string): ContactFieldKey[] {
  return getTemplate(id).contactFields ?? ALL_CONTACT_FIELDS;
}

/** Metadata-only projection for the gallery (no React component reference). */
export function listTemplateMeta(): TemplateMeta[] {
  return TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    tags: t.tags,
    columns: t.columns,
    atsSafe: t.atsSafe,
    badge: t.badge,
    defaults: t.defaults,
  }));
}

/**
 * Switch a resume's template, applying that template's tasteful defaults
 * (accent, font, spacing) while preserving the user's section order and
 * visibility choices. This is what "switch anytime without re-entering a
 * thing" relies on.
 */
export function applyTemplate(
  settings: ResumeSettings,
  templateId: string,
): ResumeSettings {
  const template = getTemplate(templateId);
  return {
    ...settings,
    templateId: template.id,
    accentColor: template.defaults.accentColor,
    fontFamily: template.defaults.fontFamily,
    spacing: template.defaults.spacing,
  };
}

export const TEMPLATE_COUNT = TEMPLATES.length;
