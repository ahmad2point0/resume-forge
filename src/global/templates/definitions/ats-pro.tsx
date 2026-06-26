import type { TemplateDefinition } from "@/global/@types";

import { HeaderTwoColumnLayout } from "../components/layouts";

/**
 * ATS Pro - the widely-used atsresume.vercel.app layout: a centered, iconized
 * header above a two-column body (summary, education, skills on the left;
 * experience and projects on the right) with underlined section headings.
 * Flagged "Most used" in the gallery.
 */
export const atsPro: TemplateDefinition = {
  id: "ats-pro",
  name: "ATS Pro",
  description:
    "The popular two-column ATS layout: a centered header with contact icons, summary and skills on the left, experience and projects on the right.",
  category: "ats",
  tags: ["Two column", "Most used", "ATS-friendly"],
  columns: 2,
  atsSafe: true,
  badge: "Most used",
  defaults: { accentColor: "#2563eb", fontFamily: "geist", spacing: "cozy" },
  Renderer: (props) => <HeaderTwoColumnLayout {...props} />,
};
