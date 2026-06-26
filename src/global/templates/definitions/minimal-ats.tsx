import type { TemplateDefinition } from "@/global/@types";

import { SingleColumnLayout } from "../components/layouts";

/** Minimal ATS - clean single column, neutral accent, maximum parseability. */
export const minimalAts: TemplateDefinition = {
  id: "minimal-ats",
  name: "Minimal ATS",
  description:
    "A clean, single-column layout tuned for applicant tracking systems. No columns, no tables, no surprises.",
  category: "ats",
  tags: ["Single column", "ATS-safe", "Minimal"],
  columns: 1,
  atsSafe: true,
  defaults: { accentColor: "#0f172a", fontFamily: "geist", spacing: "cozy" },
  Renderer: (props) => (
    <SingleColumnLayout {...props} headingStyle="caps-rule" nameScale={2} />
  ),
};
