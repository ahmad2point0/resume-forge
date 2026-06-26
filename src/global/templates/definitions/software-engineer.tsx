import type { TemplateDefinition } from "@/global/@types";

import { SingleColumnLayout } from "../components/layouts";

/** Software Engineer - project- and skills-forward, accent rules, single column. */
export const softwareEngineer: TemplateDefinition = {
  id: "software-engineer",
  name: "Software Engineer",
  description:
    "Project- and skills-forward, with crisp accent rules. Inspired by Jake's Resume and Deedy, kept ATS-safe.",
  category: "technical",
  tags: ["Projects", "Skills", "Developer"],
  columns: 1,
  atsSafe: true,
  defaults: { accentColor: "#2563eb", fontFamily: "geist", spacing: "compact" },
  Renderer: (props) => (
    <SingleColumnLayout {...props} headingStyle="underline" nameScale={1.9} />
  ),
};
