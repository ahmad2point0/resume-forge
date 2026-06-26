import type { TemplateDefinition } from "@/global/@types";

import { SingleColumnLayout } from "../components/layouts";

/** Academic - research-focused, serif, designed for long publication lists. */
export const academic: TemplateDefinition = {
  id: "academic",
  name: "Academic CV",
  description:
    "A research-focused CV with a serif body, built for education, publications, and a longer format.",
  category: "academic",
  tags: ["Research", "Publications", "CV"],
  columns: 1,
  atsSafe: true,
  // Academics list a personal/department site and LinkedIn, not GitHub.
  contactFields: ["website", "linkedin"],
  defaults: { accentColor: "#0f172a", fontFamily: "garamond", spacing: "relaxed" },
  Renderer: (props) => (
    <SingleColumnLayout
      {...props}
      headingStyle="underline"
      nameAlign="center"
      nameScale={2}
      serifName
    />
  ),
};
