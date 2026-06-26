"use client";

import { useMemo } from "react";
import { Check, ChevronRight, X } from "lucide-react";

import { scoreResume } from "@/global/lib/scoring";
import { isAtsSafe } from "@/global/templates";
import type { SectionKey } from "@/global/@types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Progress,
} from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

import { useEditorStore } from "../../../store/editor.store";

function jumpTo(section: SectionKey | "basics") {
  const el = document.getElementById(`section-${section}`);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function barColor(score: number): string {
  if (score >= 70) return "bg-success";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function CompletenessPanel() {
  const resume = useEditorStore((s) => s.resume);

  const score = useMemo(() => {
    if (!resume) return null;
    return scoreResume(resume.data, {
      atsSafeTemplate: isAtsSafe(resume.settings.templateId),
    });
  }, [resume]);

  if (!resume || !score) return null;

  const allChecksPass = score.atsPassCount === score.atsTotal;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold">Resume completeness</h2>
        <span className="text-lg font-bold tabular-nums text-primary">
          {score.completeness}%
        </span>
      </div>
      <Progress value={score.completeness} className="mt-2" />

      <div className="mt-3 flex items-center gap-2">
        <Badge variant={allChecksPass ? "success" : "outline"}>
          {allChecksPass && <Check className="size-3" />}
          {score.atsPassCount} / {score.atsTotal} ATS checks
        </Badge>
        <Badge variant="primary">Score {score.overall}</Badge>
      </div>

      {score.missing.length > 0 ? (
        <div className="mt-3">
          <p className="text-[12px] font-medium text-muted-foreground">
            Still missing - tap to jump there:
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {score.missing.map((m) => (
              <button
                key={m.label}
                onClick={() => jumpTo(m.section)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11.5px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {m.label}
                <ChevronRight className="size-3" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-success">
          <Check className="size-4" /> All key sections complete. Ready to export.
        </p>
      )}

      <Accordion type="multiple" className="mt-3 border-t border-border">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-[12.5px]">
            Category scores
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {score.categories.map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium">{c.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {c.score}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn("h-full rounded-full", barColor(c.score))}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="checks">
          <AccordionTrigger className="text-[12.5px]">
            ATS checks ({score.atsPassCount}/{score.atsTotal})
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1.5">
              {score.checks.map((check) => (
                <li key={check.id}>
                  <button
                    onClick={() => check.section && jumpTo(check.section)}
                    disabled={!check.section}
                    className="flex w-full items-start gap-2 rounded-md p-1 text-left text-[12px] enabled:hover:bg-secondary"
                  >
                    {check.passed ? (
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                    ) : (
                      <X className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                    )}
                    <span>
                      <span
                        className={cn(
                          "font-medium",
                          check.passed
                            ? "text-foreground"
                            : "text-foreground",
                        )}
                      >
                        {check.label}
                      </span>
                      {!check.passed && (
                        <span className="block text-[11px] text-muted-foreground">
                          {check.hint}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
