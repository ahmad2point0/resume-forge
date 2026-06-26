import type {
  ResolvedTemplateTheme,
  ResumeData,
  ResumeSettings,
  SectionKey,
} from "@/global/@types";
import {
  DEFAULT_SECTION_ORDER,
  FONT_PRESETS,
  SPACING_PRESETS,
} from "@/global/constants";

/** Derive concrete render tokens (sizes, gaps, fonts) from user settings. */
export function resolveTheme(settings: ResumeSettings): ResolvedTemplateTheme {
  const spacing = SPACING_PRESETS[settings.spacing];
  const font = FONT_PRESETS[settings.fontFamily];
  // Page renders at 794px (A4) ≈ 210mm, so ~13.5px ≈ 10pt body text.
  const baseFontPx = Math.round(13.5 * settings.fontScale * 10) / 10;
  return {
    accent: settings.accentColor,
    fontFamily: font.stack,
    baseFontPx,
    sectionGapPx: spacing.sectionGap,
    entryGapPx: spacing.entryGap,
    lineHeight: spacing.lineHeight,
  };
}

/** True when a list-backed section actually has content. */
export function sectionHasContent(data: ResumeData, key: SectionKey): boolean {
  switch (key) {
    case "summary":
      return data.basics.summary.trim().length > 0;
    case "skills":
      return data.skills.some((g) => g.keywords.length > 0);
    default:
      return Array.isArray(data[key]) && (data[key] as unknown[]).length > 0;
  }
}

/**
 * Resolve the ordered list of sections to render: follow the user's order,
 * drop hidden sections, and (when `hideEmpty`) drop sections with no content.
 */
export function resolveSections(
  data: ResumeData,
  settings: ResumeSettings,
  hideEmpty = true,
): SectionKey[] {
  // Defensive fallbacks so a legacy/corrupt stored resume never crashes render.
  const order = settings.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const hidden = settings.hiddenSections ?? [];
  return order.filter((key) => {
    if (hidden.includes(key)) return false;
    if (hideEmpty && !sectionHasContent(data, key)) return false;
    return true;
  });
}
