import type { AiProviderConfig, ProviderId } from "../../@types/ai.types";

/**
 * Provider registry - static, non-secret configuration for every supported
 * provider. The user only ever stores their chosen provider id, model, and key
 * (see `AiSettings`); everything else is looked up here.
 *
 * Most providers expose an OpenAI-compatible `/chat/completions` endpoint, so
 * they share the `apiShape: "openai"` adapter. Anthropic uses its own Messages
 * API shape.
 */
export const AI_PROVIDERS: Record<ProviderId, AiProviderConfig> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini"],
    docsUrl: "https://platform.openai.com/api-keys",
    apiShape: "openai",
  },
  groq: {
    id: "groq",
    label: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    docsUrl: "https://console.groq.com/keys",
    apiShape: "openai",
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
    docsUrl: "https://platform.deepseek.com/api_keys",
    apiShape: "openai",
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    // Gemini exposes an OpenAI-compatible surface at this base URL.
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
    docsUrl: "https://aistudio.google.com/apikey",
    apiShape: "openai",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic Claude",
    baseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-3-5-haiku-latest",
    models: ["claude-3-5-haiku-latest", "claude-3-5-sonnet-latest"],
    docsUrl: "https://console.anthropic.com/settings/keys",
    apiShape: "anthropic",
  },
};

/** Convenience array for rendering provider selectors. */
export const PROVIDER_LIST = Object.values(AI_PROVIDERS);
