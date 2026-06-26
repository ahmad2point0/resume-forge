/**
 * Type contracts for the opt-in, bring-your-own-key AI assistant.
 *
 * Every AI call happens client-side (browser → provider) with the user's own
 * API key - resumeforge has no server. These types describe the provider
 * registry, the persisted user settings, and the request/response shapes used
 * by the provider abstraction layer.
 */

/** Supported provider identifiers. */
export type ProviderId = "openai" | "anthropic" | "gemini" | "deepseek" | "groq";

/**
 * Static configuration for a single provider. Lives in the registry; never
 * persisted (only the user's chosen `ProviderId` / model / key are stored).
 */
export interface AiProviderConfig {
  id: ProviderId;
  /** Human-readable label shown in the UI. */
  label: string;
  /** API base URL (no trailing slash). */
  baseUrl: string;
  /** Model selected by default when the user picks this provider. */
  defaultModel: string;
  /** Selectable models for this provider. */
  models: string[];
  /** Where the user gets an API key. */
  docsUrl: string;
  /**
   * Wire format. "openai" → OpenAI-compatible chat/completions; "anthropic" →
   * Anthropic Messages API. Determines which adapter the router uses.
   */
  apiShape: "openai" | "anthropic";
}

/** User-chosen, locally persisted AI settings (bring-your-own-key). */
export interface AiSettings {
  provider: ProviderId;
  apiKey: string;
  model: string;
  /** Master opt-in toggle. AI features are inert until this is true. */
  enabled: boolean;
}

/** A single chat turn in provider-neutral form. */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Result of an AI call. Never throws - failures are returned, not raised. */
export interface AiResult {
  ok: boolean;
  text?: string;
  error?: string;
}
