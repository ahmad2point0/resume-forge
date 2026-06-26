import type { TemplateDefinition } from "@/global/@types";

import { CenteredRuleLayout } from "../components/layouts";

/**
 * Recruiter - the Harvard-based, single-column format favored by recruiters at
 * top tech companies: a centered name over one pipe-separated contact line and
 * full-width ruled section headings. Clean, monochrome, and ATS-parseable.
 */
export const recruiter: TemplateDefinition = {
  id: "recruiter",
  name: "Recruiter",
  description:
    "A Harvard-based single-column format favored by recruiters: centered header, one contact line, and full-width section rules.",
  category: "professional",
  tags: ["Single column", "ATS-safe", "Recruiter"],
  columns: 1,
  atsSafe: true,
  badge: "Recruiter pick",
  defaults: { accentColor: "#111827", fontFamily: "georgia", spacing: "cozy" },
  Renderer: (props) => <CenteredRuleLayout {...props} />,
};
