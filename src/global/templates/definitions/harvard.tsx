import type { TemplateDefinition } from "@/global/@types";

import { SingleColumnLayout } from "../components/layouts";

/** Harvard - the traditional, centered, serif resume taught at career offices. */
export const harvard: TemplateDefinition = {
  id: "harvard",
  name: "Harvard",
  description:
    "The traditional centered, serif resume. Conservative and widely accepted across industries.",
  category: "professional",
  tags: ["Traditional", "Serif", "Centered"],
  columns: 1,
  atsSafe: true,
  // Traditional Harvard format lists a personal site and LinkedIn, not GitHub.
  contactFields: ["linkedin", "website"],
  defaults: { accentColor: "#0f172a", fontFamily: "georgia", spacing: "cozy" },
  Renderer: (props) => (
    <SingleColumnLayout
      {...props}
      headingStyle="serif-center"
      nameAlign="center"
      nameScale={2}
      uppercaseName
      serifName
      contactSeparator="|"
    />
  ),
};
