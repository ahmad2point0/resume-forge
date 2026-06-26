"use client";

import { useState } from "react";

import type { AiResult, AiSettings } from "../@types/ai.types";
import * as aiService from "../services/ai.service";
import { useAiStore } from "../store/ai.store";

/**
 * React entry point for the AI assistant. Reads the persisted settings, exposes
 * the high-level helpers wrapped with shared `loading` / `lastError` state, and
 * returns each call's `AiResult` so callers can react to success/failure
 * inline (the methods never throw).
 *
 * Memoization is left to the React Compiler - no manual useCallback.
 */
export function useAiAssistant() {
  const provider = useAiStore((s) => s.provider);
  const apiKey = useAiStore((s) => s.apiKey);
  const model = useAiStore((s) => s.model);
  const enabled = useAiStore((s) => s.enabled);

  const settings: AiSettings = { provider, apiKey, model, enabled };

  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  /** Run an AI call with shared loading + error bookkeeping. */
  async function run(
    call: (s: AiSettings) => Promise<AiResult>,
  ): Promise<AiResult> {
    setLoading(true);
    setLastError(null);
    try {
      const result = await call({ provider, apiKey, model, enabled });
      if (!result.ok) setLastError(result.error ?? "Something went wrong.");
      return result;
    } finally {
      setLoading(false);
    }
  }

  return {
    enabled,
    settings,
    loading,
    lastError,
    generateSummary: (
      input: Parameters<typeof aiService.generateSummary>[0],
    ) => run((s) => aiService.generateSummary(input, s)),
    improveBullet: (text: string) =>
      run((s) => aiService.improveBullet(text, s)),
    atsSuggestions: (resumeText: string) =>
      run((s) => aiService.atsSuggestions(resumeText, s)),
    matchJob: (resumeText: string, jobDescription: string) =>
      run((s) => aiService.matchJob(resumeText, jobDescription, s)),
  };
}
