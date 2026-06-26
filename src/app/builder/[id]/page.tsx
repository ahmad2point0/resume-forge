import type { Metadata } from "next";

import { BuilderShell } from "@/features/resumes";

export const metadata: Metadata = {
  title: "Builder",
};

/** Thin route: unwrap the async params and hand off to the builder feature. */
export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BuilderShell resumeId={id} />;
}
