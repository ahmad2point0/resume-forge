"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { TemplateCategory } from "@/global/@types";
import { listTemplateMeta } from "@/global/templates";
import { cn } from "@/global/utils/cn";

import { CATEGORY_LABELS } from "../constants";
import { useTemplateActions } from "../hooks/useTemplateActions";
import { TemplateCard } from "./TemplateCard";

type Filter = "all" | TemplateCategory;

/**
 * The reusable filter-chips + template-card grid. Renders no page chrome so it
 * can drop into both the /templates page and the create-resume picker dialog.
 * When `highlightId` is set, that card shows the selected ring and is scrolled
 * into view (used when the picker is opened from a specific showcase card).
 */
export function TemplateGrid({ highlightId }: { highlightId?: string }) {
  const templates = useMemo(() => listTemplateMeta(), []);
  const { createWithTemplate, pendingId } = useTemplateActions();
  const [filter, setFilter] = useState<Filter>("all");
  const highlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (highlightId) {
      highlightRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightId]);

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
    <div>
      <div className="flex flex-wrap gap-2">
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

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template) => (
          <div
            key={template.id}
            ref={template.id === highlightId ? highlightRef : null}
            className="h-full"
          >
            <TemplateCard
              template={template}
              onUse={createWithTemplate}
              pending={pendingId === template.id}
              selected={template.id === highlightId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
