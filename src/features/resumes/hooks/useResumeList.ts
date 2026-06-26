"use client";

import { useCallback, useEffect, useState } from "react";

import type { ResumeSummary } from "@/global/@types";
import { resumeRepository } from "@/global/lib/resume";

/**
 * Loads and mutates the user's resume collection for the dashboard.
 * All persistence goes through the repository; this hook owns the React state
 * and keeps it in sync after each operation.
 */
export function useResumeList() {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await resumeRepository.list();
    setResumes(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (title?: string) => {
      const resume = await resumeRepository.create(title);
      await refresh();
      return resume;
    },
    [refresh],
  );

  const duplicate = useCallback(
    async (id: string) => {
      const copy = await resumeRepository.duplicate(id);
      await refresh();
      return copy;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await resumeRepository.remove(id);
      await refresh();
    },
    [refresh],
  );

  const rename = useCallback(
    async (id: string, title: string) => {
      await resumeRepository.rename(id, title);
      await refresh();
    },
    [refresh],
  );

  return { resumes, loading, refresh, create, duplicate, remove, rename };
}
