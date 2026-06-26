"use client";

import { Sparkles } from "lucide-react";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

import { useAiAssistant } from "../hooks/useAiAssistant";

interface ImproveButtonProps {
  /** "summary" generates a new summary; "bullet" rewrites a single bullet. */
  kind: "summary" | "bullet";
  /** Current text. For "bullet" it's rewritten; for "summary" it's the job title. */
  value: string;
  /** Optional extra context (currently unused by the helpers but reserved). */
  context?: string;
  /** Receives the generated/improved text on success. */
  onResult: (text: string) => void;
  className?: string;
  /** Override the default button label. */
  label?: string;
}

/**
 * Inline "Improve" / "Generate" action that calls the AI assistant and pipes
 * the result back via `onResult`. When AI is disabled it renders a disabled
 * button wrapped in a tooltip pointing the user to Settings → AI.
 */
export function ImproveButton({
  kind,
  value,
  onResult,
  className,
  label,
}: ImproveButtonProps) {
  const { enabled, loading, generateSummary, improveBullet } = useAiAssistant();

  const text = label ?? (kind === "summary" ? "Generate" : "Improve");

  async function handleClick() {
    const result =
      kind === "summary"
        ? await generateSummary({ jobTitle: value })
        : await improveBullet(value);

    if (result.ok && result.text) {
      onResult(result.text);
    } else {
      toast.error(result.error ?? "AI request failed.");
    }
  }

  if (!enabled) {
    // Disabled buttons don't fire pointer events, so wrap in a focusable span
    // to keep the tooltip reachable.
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn("inline-flex", className)}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="pointer-events-none"
              >
                <Sparkles />
                {text}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Enable AI in Settings → AI</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      loading={loading}
      disabled={loading}
      onClick={handleClick}
      className={className}
    >
      {!loading && <Sparkles />}
      {text}
    </Button>
  );
}
