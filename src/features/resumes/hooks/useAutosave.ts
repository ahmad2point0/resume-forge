"use client";

import { useEffect, useRef } from "react";

import { resumeRepository } from "@/global/lib/resume";

import { useEditorStore } from "../store/editor.store";

/**
 * Persists the resume shortly after edits stop. Subscribes to the editor store
 * and writes through the repository whenever the document is dirty, debounced
 * so rapid typing produces a single write.
 */
export function useAutosave(delay = 800) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fire a save `delay` ms after the resume reference last changed while dirty.
    const unsubscribe = useEditorStore.subscribe((state) => {
      if (!state.dirty || !state.resume) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const { resume, markSaved } = useEditorStore.getState();
        if (!resume) return;
        await resumeRepository.save(resume);
        markSaved();
      }, delay);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);
}
