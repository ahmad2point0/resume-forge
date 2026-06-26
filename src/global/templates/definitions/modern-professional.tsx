import type { SectionKey, TemplateDefinition } from "@/global/@types";

import { TwoColumnLayout } from "../components/layouts";

const SIDEBAR: SectionKey[] = [
  "skills",
  "certifications",
  "languages",
  "interests",
];

/** Modern Professional - two-column with a soft slate sidebar for skills/contact. */
export const modernProfessional: TemplateDefinition = {
  id: "modern-professional",
  name: "Modern Professional",
  description:
    "A polished two-column layout with a sidebar for contact and skills. Great when you have a lot to show.",
  category: "modern",
  tags: ["Two column", "Sidebar", "Polished"],
  columns: 2,
  atsSafe: false,
  defaults: { accentColor: "#2563eb", fontFamily: "geist", spacing: "cozy" },
  Renderer: (props) => (
    <TwoColumnLayout
      {...props}
      headingStyle="plain"
      sidebarSections={SIDEBAR}
      sidebarBg="#f1f5f9"
    />
  ),
};
