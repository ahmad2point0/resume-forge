import type { TemplateDefinition } from "@/global/@types";

import { SingleColumnLayout } from "../components/layouts";

/** Executive - restrained serif, leadership-focused, generous whitespace. */
export const executive: TemplateDefinition = {
  id: "executive",
  name: "Executive",
  description:
    "Restrained and authoritative. A refined serif treatment with generous whitespace for senior leadership roles.",
  category: "executive",
  tags: ["Leadership", "Serif", "Refined"],
  columns: 1,
  atsSafe: true,
  // A senior, restrained header: LinkedIn and a personal site only - no GitHub.
  contactFields: ["linkedin", "website"],
  defaults: { accentColor: "#334155", fontFamily: "georgia", spacing: "relaxed" },
  Renderer: (props) => (
    <SingleColumnLayout
      {...props}
      headingStyle="caps-rule"
      nameScale={2.2}
      serifName
    />
  ),
};
