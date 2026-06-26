import type { Metadata } from "next";

import { TemplateGallery } from "@/features/templates";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse ATS-friendly resume templates. Switch anytime without re-entering a thing.",
};

export default function TemplatesPage() {
  return <TemplateGallery />;
}
