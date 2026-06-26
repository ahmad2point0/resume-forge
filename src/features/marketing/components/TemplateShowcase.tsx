import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/global/components/ui/badge";
import { listTemplateMeta } from "@/global/templates";

/**
 * Lightweight template gallery teaser. Renders metadata-only mini-cards from
 * the template registry (no real ResumeDocument render) so the section stays
 * cheap and content-driven.
 */
export function TemplateShowcase() {
  const templates = listTemplateMeta();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Pick a look. Switch anytime.
        </h2>
        <Link
          href="/templates"
          className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Browse all templates
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <li key={template.id}>
            <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40">
              {/* Mini schematic preview built from divs. */}
              <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-3 ring-1 ring-black/5">
                <TemplateGlyph columns={template.columns} />
              </div>

              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {template.name}
                </h3>
                {template.atsSafe ? (
                  <Badge variant="success" className="shrink-0">
                    <ShieldCheck className="size-3" />
                    ATS
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-[12px] capitalize text-muted-foreground">
                {template.category}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Tiny abstract layout glyph that hints at one- vs two-column templates. */
function TemplateGlyph({ columns }: { columns: 1 | 2 }) {
  if (columns === 2) {
    return (
      <div className="flex aspect-[3/4] gap-2">
        <div className="flex w-1/3 flex-col gap-1.5 rounded bg-slate-100 p-1.5">
          <span className="h-2 rounded bg-slate-300" />
          <span className="h-1 rounded bg-slate-200" />
          <span className="h-1 w-2/3 rounded bg-slate-200" />
          <span className="mt-1 h-1 rounded bg-slate-200" />
          <span className="h-1 w-3/4 rounded bg-slate-200" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-0.5">
          <span className="h-2 w-3/4 rounded bg-slate-300" />
          <span className="h-1 rounded bg-slate-200" />
          <span className="h-1 rounded bg-slate-200" />
          <span className="h-1 w-2/3 rounded bg-slate-200" />
          <span className="mt-1 h-1 rounded bg-slate-200" />
          <span className="h-1 w-5/6 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-[3/4] flex-col gap-1.5 p-0.5">
      <span className="h-2 w-1/2 rounded bg-slate-300" />
      <span className="h-1 w-3/4 rounded bg-slate-200" />
      <span className="mt-1 h-1 rounded bg-slate-200" />
      <span className="h-1 rounded bg-slate-200" />
      <span className="h-1 w-2/3 rounded bg-slate-200" />
      <span className="mt-1 h-1 rounded bg-slate-200" />
      <span className="h-1 rounded bg-slate-200" />
      <span className="h-1 w-5/6 rounded bg-slate-200" />
    </div>
  );
}
