"use client";

import { ArrowRight, Check, Flame } from "lucide-react";

import type { TemplateMeta } from "@/global/@types";
import { ResumeThumbnail } from "@/global/templates";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { cn } from "@/global/utils/cn";

import { buildSampleResume } from "../utils/sample";

interface TemplateCardProps {
  template: TemplateMeta;
  onUse: (templateId: string) => void;
  pending?: boolean;
  selected?: boolean;
  useLabel?: string;
}

/** A gallery card: a live, scaled thumbnail of the template + metadata + CTA. */
export function TemplateCard({
  template,
  onUse,
  pending,
  selected,
  useLabel = "Use this template",
}: TemplateCardProps) {
  const sample = buildSampleResume(template.id);

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
      )}
    >
      <div className="relative flex justify-center overflow-hidden border-b border-border bg-surface-2 p-4">
        <div className="overflow-hidden rounded-md shadow-sm ring-1 ring-black/5">
          <ResumeThumbnail resume={sample} width={236} maxHeight={300} />
        </div>
        {template.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10.5px] font-semibold text-primary-foreground shadow-sm">
            <Flame className="size-3" />
            {template.badge}
          </span>
        )}
        {selected && (
          <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground shadow">
            <Check className="size-3.5" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{template.name}</h3>
          {template.atsSafe ? (
            <Badge variant="success">ATS-safe</Badge>
          ) : (
            <Badge variant="outline">{template.columns}-col</Badge>
          )}
        </div>
        <p className="line-clamp-2 text-[12.5px] leading-snug text-muted-foreground">
          {template.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <Button
          size="sm"
          className="mt-3 w-full"
          loading={pending}
          onClick={() => onUse(template.id)}
        >
          {useLabel}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
