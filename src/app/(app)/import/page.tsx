import type { Metadata } from "next";

import { ImportFlow } from "@/features/import";

export const metadata: Metadata = {
  title: "Import",
  description: "Import an existing resume from JSON. Nothing is uploaded.",
};

export default function ImportPage() {
  return <ImportFlow />;
}
