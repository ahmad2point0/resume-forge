import { AI_SYSTEM_PROMPTS } from "@/global/constants/prompts";

import type {
  AiResult,
  AiSettings,
  ChatMessage,
} from "../@types/ai.types";
import { AI_PROVIDERS } from "./providers/registry";

/**
 * Core AI routing + provider adapters.
 *
 * All calls run client-side (browser → provider) using the user's own key and
 * return a `Promise<AiResult>`. Functions here NEVER throw - every failure path
 * (network error, non-2xx response, unexpected body) is caught and surfaced as
 * `{ ok: false, error }` so callers can render it without try/catch.
 */

/** Trim a provider error body to something readable in a toast. */
function concise(raw: string): string {
  const text = raw.trim();
  if (!text) return "Request failed.";
  // Many providers wrap errors as { error: { message } } or { error: string }.
  try {
    const json = JSON.parse(text);
    const message =
      json?.error?.message ?? json?.error ?? json?.message ?? null;
    if (typeof message === "string" && message) {
      return message.slice(0, 300);
    }
  } catch {
    // Not JSON - fall through to the raw text.
  }
  return text.slice(0, 300);
}

/** OpenAI-compatible chat/completions adapter (OpenAI, Groq, DeepSeek, Gemini). */
async function openAICompatibleChat(
  messages: ChatMessage[],
  settings: AiSettings,
): Promise<AiResult> {
  const config = AI_PROVIDERS[settings.provider];
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: concise(body) || `HTTP ${response.status}` };
    }

    const json = await response.json();
    const text: unknown = json?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) {
      return { ok: false, error: "The provider returned an empty response." };
    }
    return { ok: true, text: text.trim() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network error.",
    };
  }
}

/** Anthropic Messages API adapter (client-side direct browser access). */
async function anthropicChat(
  messages: ChatMessage[],
  settings: AiSettings,
): Promise<AiResult> {
  const config = AI_PROVIDERS[settings.provider];

  // Anthropic takes the system prompt as a top-level field, not as a message.
  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const nonSystemMessages = messages.filter((m) => m.role !== "system");

  try {
    const response = await fetch(`${config.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": settings.apiKey,
        "anthropic-version": "2023-06-01",
        // Required to call the Anthropic API directly from a browser.
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: 1024,
        system,
        messages: nonSystemMessages,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: concise(body) || `HTTP ${response.status}` };
    }

    const json = await response.json();
    const text: unknown = json?.content?.[0]?.text;
    if (typeof text !== "string" || !text.trim()) {
      return { ok: false, error: "The provider returned an empty response." };
    }
    return { ok: true, text: text.trim() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network error.",
    };
  }
}

/**
 * Send a chat request to the configured provider. Validates the key, looks up
 * the provider config, and routes to the matching adapter by `apiShape`.
 */
export async function chat(
  messages: ChatMessage[],
  settings: AiSettings,
): Promise<AiResult> {
  if (!settings.apiKey.trim()) {
    return { ok: false, error: "Add your API key in Settings → AI." };
  }

  const config = AI_PROVIDERS[settings.provider];
  if (!config) {
    return { ok: false, error: "Unknown AI provider." };
  }

  return config.apiShape === "anthropic"
    ? anthropicChat(messages, settings)
    : openAICompatibleChat(messages, settings);
}

/* ------------------------------------------------------------------ */
/* High-level helpers - build messages from AI_SYSTEM_PROMPTS + call chat. */
/* ------------------------------------------------------------------ */

/** Generate a professional summary from structured candidate input. */
export function generateSummary(
  input: {
    jobTitle: string;
    yearsExperience?: string;
    skills?: string[];
    highlights?: string[];
  },
  settings: AiSettings,
): Promise<AiResult> {
  const lines: string[] = [`Job title: ${input.jobTitle || "(unspecified)"}`];
  if (input.yearsExperience) {
    lines.push(`Years of experience: ${input.yearsExperience}`);
  }
  if (input.skills?.length) {
    lines.push(`Key skills: ${input.skills.join(", ")}`);
  }
  if (input.highlights?.length) {
    lines.push("Notable highlights:");
    lines.push(...input.highlights.map((h) => `- ${h}`));
  }

  return chat(
    [
      { role: "system", content: AI_SYSTEM_PROMPTS.summary },
      {
        role: "user",
        content: `Write a professional resume summary for this candidate.\n\n${lines.join("\n")}`,
      },
    ],
    settings,
  );
}

/** Rewrite a single resume bullet to be stronger and ATS-friendly. */
export function improveBullet(
  text: string,
  settings: AiSettings,
): Promise<AiResult> {
  return chat(
    [
      { role: "system", content: AI_SYSTEM_PROMPTS.bullet },
      { role: "user", content: `Rewrite this resume bullet:\n\n${text}` },
    ],
    settings,
  );
}

/** Produce ATS optimization suggestions for the resume as plain text. */
export function atsSuggestions(
  resumeText: string,
  settings: AiSettings,
): Promise<AiResult> {
  return chat(
    [
      { role: "system", content: AI_SYSTEM_PROMPTS.ats },
      {
        role: "user",
        content: `Analyze this resume and suggest improvements:\n\n${resumeText}`,
      },
    ],
    settings,
  );
}

/** Compare the resume against a job description and report the match. */
export function matchJob(
  resumeText: string,
  jobDescription: string,
  settings: AiSettings,
): Promise<AiResult> {
  return chat(
    [
      { role: "system", content: AI_SYSTEM_PROMPTS.match },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob description:\n${jobDescription}`,
      },
    ],
    settings,
  );
}
