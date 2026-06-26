import type { TemplateDefinition } from "@/global/@types";

import { SingleColumnLayout } from "../components/layouts";

/** Startup Founder - bold accent bars, achievement-forward, energetic. */
export const startupFounder: TemplateDefinition = {
  id: "startup-founder",
  name: "Startup Founder",
  description:
    "Achievement-forward with bold accent bars. Leads with impact and metrics for operator and founder roles.",
  category: "modern",
  tags: ["Impact", "Bold", "Metrics"],
  columns: 1,
  atsSafe: true,
  defaults: { accentColor: "#7c3aed", fontFamily: "geist", spacing: "cozy" },
  Renderer: (props) => (
    <SingleColumnLayout {...props} headingStyle="bar" nameScale={2.1} />
  ),
};
