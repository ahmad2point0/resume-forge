import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/global/components/ui/badge";
import { listTemplateMeta, ResumeThumbnail } from "@/global/templates";
import { buildSampleResume, CATEGORY_LABELS } from "@/features/templates";

/**
 * Landing-page template teaser. Shows the first 8 templates (2 rows of 4) with
 * real, scaled-down previews. Clicking a card opens the create-resume picker
 * with that template highlighted.
 */
export function TemplateShowcase() {
  const templates = listTemplateMeta().slice(0, 8);

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
            <Link
              href={`/resumes?new=1&template=${template.id}`}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:shadow-md"
            >
              {/* Real, scaled-down preview of the template. */}
              <div className="mb-4 flex justify-center overflow-hidden rounded-lg border border-slate-200 bg-white ring-1 ring-black/5">
                <ResumeThumbnail
                  resume={buildSampleResume(template.id)}
                  width={236}
                  maxHeight={300}
                />
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
              <p className="mt-1 text-[12px] text-muted-foreground">
                {CATEGORY_LABELS[template.category]}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
