"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { resumeRepository } from "@/global/lib/resume";
import { applyTemplate } from "@/global/templates";
import { toast } from "@/global/components/ui";

/** Create-with-template and apply-to-existing actions used by the gallery. */
export function useTemplateActions() {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  /** Start a fresh resume on the chosen template and open the builder. */
  const createWithTemplate = useCallback(
    async (templateId: string) => {
      setPendingId(templateId);
      try {
        const resume = await resumeRepository.create("Untitled resume");
        const updated = {
          ...resume,
          settings: applyTemplate(resume.settings, templateId),
        };
        await resumeRepository.save(updated);
        router.push(`/builder/${updated.id}`);
      } catch {
        toast.error("Could not create the resume. Please try again.");
        setPendingId(null);
      }
    },
    [router],
  );

  return { createWithTemplate, pendingId };
}
