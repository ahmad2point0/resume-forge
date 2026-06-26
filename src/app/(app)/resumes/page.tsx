import { Suspense } from "react";
import type { Metadata } from "next";

import { ResumesDashboard } from "@/features/resumes";

export const metadata: Metadata = {
  title: "My resumes",
  description: "Manage the resumes saved locally in your browser.",
};

export default function ResumesPage() {
  return (
    <Suspense fallback={null}>
      <ResumesDashboard />
    </Suspense>
  );
}
