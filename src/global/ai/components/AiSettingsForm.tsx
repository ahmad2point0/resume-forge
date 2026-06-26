"use client";

import { ExternalLink } from "lucide-react";

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

import type { ProviderId } from "../@types/ai.types";
import { AI_PROVIDERS, PROVIDER_LIST } from "../services/providers/registry";
import { useAiStore } from "../store/ai.store";

/**
 * Settings → AI form. Lets the user pick a provider, paste their own API key,
 * choose a model, and toggle the assistant on. Everything is written straight
 * through to the persisted `useAiStore`.
 */
export function AiSettingsForm({ className }: { className?: string }) {
  const provider = useAiStore((s) => s.provider);
  const apiKey = useAiStore((s) => s.apiKey);
  const model = useAiStore((s) => s.model);
  const enabled = useAiStore((s) => s.enabled);
  const setProvider = useAiStore((s) => s.setProvider);
  const setApiKey = useAiStore((s) => s.setApiKey);
  const setModel = useAiStore((s) => s.setModel);
  const setEnabled = useAiStore((s) => s.setEnabled);

  const config = AI_PROVIDERS[provider];

  return (
    <div className={cn("space-y-5 text-sm", className)}>
      {/* Enable toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="ai-enabled">Enable AI assistant</Label>
          <p className="text-xs text-muted-foreground">
            Opt in to AI-assisted writing using your own API key.
          </p>
        </div>
        <Switch
          id="ai-enabled"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>

      {/* Provider */}
      <div className="space-y-1.5">
        <Label htmlFor="ai-provider">Provider</Label>
        <Select
          value={provider}
          onValueChange={(value) => setProvider(value as ProviderId)}
        >
          <SelectTrigger id="ai-provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDER_LIST.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* API key */}
      <div className="space-y-1.5">
        <Label htmlFor="ai-key">API key</Label>
        <Input
          id="ai-key"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder={`Paste your ${config.label} API key`}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <a
          href={config.docsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Get an API key
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* Model */}
      <div className="space-y-1.5">
        <Label htmlFor="ai-model">Model</Label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger id="ai-model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {config.models.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Privacy note */}
      <p className="rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
        Your key is stored only in this browser. Requests go directly from your
        browser to the provider - resumeforge has no server.
      </p>
    </div>
  );
}
