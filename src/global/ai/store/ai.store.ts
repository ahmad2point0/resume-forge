"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/global/lib/storage/types";

import type { AiSettings, ProviderId } from "../@types/ai.types";
import { AI_PROVIDERS } from "../services/providers/registry";

interface AiStore extends AiSettings {
  /** Switch provider and reset the model to that provider's default. */
  setProvider: (provider: ProviderId) => void;
  setApiKey: (apiKey: string) => void;
  setModel: (model: string) => void;
  setEnabled: (enabled: boolean) => void;
  /** Wipe key and settings back to defaults (e.g. on sign-out / "forget key"). */
  reset: () => void;
}

const DEFAULT_SETTINGS: AiSettings = {
  provider: "openai",
  apiKey: "",
  model: AI_PROVIDERS.openai.defaultModel,
  enabled: false,
};

/** True only in a browser - guards localStorage access during SSR. */
const isBrowser = typeof window !== "undefined";

/**
 * Persisted AI settings store (bring-your-own-key). The key never leaves the
 * browser - `persist` writes it to localStorage under `STORAGE_KEYS.aiSettings`.
 * `createJSONStorage` is only consulted in the browser, so SSR is safe.
 */
export const useAiStore = create<AiStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setProvider: (provider) =>
        set({ provider, model: AI_PROVIDERS[provider].defaultModel }),
      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
      setEnabled: (enabled) => set({ enabled }),
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEYS.aiSettings,
      storage: createJSONStorage(() =>
        // Fall back to a no-op store on the server so hydration never touches
        // an undefined `localStorage`.
        isBrowser
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => undefined,
              removeItem: () => undefined,
            },
      ),
      // Persist only the settings fields, not the action functions.
      partialize: (state): AiSettings => ({
        provider: state.provider,
        apiKey: state.apiKey,
        model: state.model,
        enabled: state.enabled,
      }),
    },
  ),
);
