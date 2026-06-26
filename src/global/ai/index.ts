/**
 * Public surface of the AI feature module - an opt-in, bring-your-own-key
 * assistant whose calls run entirely client-side (browser → provider).
 */
export { useAiAssistant } from "./hooks/useAiAssistant";
export { useAiStore } from "./store/ai.store";
export { AiSettingsForm } from "./components/AiSettingsForm";
export { ImproveButton } from "./components/ImproveButton";
export { AI_PROVIDERS, PROVIDER_LIST } from "./services/providers/registry";

export type * from "./@types/ai.types";
