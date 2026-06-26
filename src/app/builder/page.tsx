import { Suspense } from "react";
import type { Metadata } from "next";

import { BuilderRoute } from "@/features/resumes";

export const metadata: Metadata = {
  title: "Builder",
};

/**
 * Thin, fully-static route. The resume id is read client-side from `?id=`
 * (see BuilderRoute), which keeps the app exportable for static hosting.
 */
export default function BuilderPage() {
  return (
    <Suspense fallback={null}>
      <BuilderRoute />
    </Suspense>
  );
}
