"use client";

import { useMemo, useState } from "react";

import type { TemplateCategory } from "@/global/@types";
import { listTemplateMeta } from "@/global/templates";
import { cn } from "@/global/utils/cn";

import { useTemplateActions } from "../hooks/useTemplateActions";
import { TemplateCard } from "./TemplateCard";

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  ats: "ATS",
  professional: "Professional",
  modern: "Modern",
  technical: "Technical",
  creative: "Creative",
  academic: "Academic",
  executive: "Executive",
};

type Filter = "all" | TemplateCategory;

export function TemplateGallery() {
  const templates = useMemo(() => listTemplateMeta(), []);
  const { createWithTemplate, pendingId } = useTemplateActions();
  const [filter, setFilter] = useState<Filter>("all");

  const categories = useMemo(() => {
    const present = new Set(templates.map((t) => t.category));
    return (Object.keys(CATEGORY_LABELS) as TemplateCategory[]).filter((c) =>
      present.has(c),
    );
  }, [templates]);

  const visible = templates.filter(
    (t) => filter === "all" || t.category === filter,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-primary">
          Template gallery
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Choose a template. Keep your data.
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Every template is ATS-friendly and fully editable. Switch anytime
          without re-entering a thing.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...categories] as Filter[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              filter === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {cat === "all" ? "All templates" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={createWithTemplate}
            pending={pendingId === template.id}
          />
        ))}
      </div>
    </div>
  );
}
