"use client";

import { Sparkles } from "lucide-react";

import { useAiAssistant } from "@/global/ai";
import { Button, toast } from "@/global/components/ui";

import { useEditorStore } from "../../../store/editor.store";
import { TextareaField } from "../fields/Fields";

/** Professional summary editor with a context-aware AI generate action. */
export function SummarySection() {
  const resume = useEditorStore((s) => s.resume);
  const updateBasics = useEditorStore((s) => s.updateBasics);
  const { enabled, loading, generateSummary } = useAiAssistant();

  if (!resume) return null;
  const { basics, work, skills } = resume.data;

  async function handleGenerate() {
    const result = await generateSummary({
      jobTitle: basics.jobTitle,
      skills: skills.flatMap((g) => g.keywords).slice(0, 12),
      highlights: work.flatMap((w) => w.highlights).slice(0, 6),
    });
    if (result.ok && result.text) {
      updateBasics({ summary: result.text.trim() });
      toast.success("Summary generated");
    } else {
      toast.error(result.error ?? "AI request failed.");
    }
  }

  return (
    <TextareaField
      label="Summary"
      value={basics.summary}
      rows={4}
      onChange={(v) => updateBasics({ summary: v })}
      hint="2-4 sentences. Lead with your title, years of experience, and biggest strengths."
      placeholder="Senior frontend engineer with 8+ years building accessible, high-performance web apps…"
      action={
        enabled ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={loading}
            onClick={handleGenerate}
          >
            {!loading && <Sparkles />}
            Generate
          </Button>
        ) : undefined
      }
    />
  );
}
