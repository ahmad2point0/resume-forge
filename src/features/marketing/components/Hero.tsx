import Link from "next/link";
import { ArrowRight, CheckCircle2, FileJson, ShieldCheck } from "lucide-react";

import { Button } from "@/global/components/ui/button";
import { cn } from "@/global/utils/cn";

/**
 * Marketing hero: eyebrow, headline, subcopy, the two primary CTAs and a
 * mocked resume-card preview that hints at the real product. The preview is
 * pure markup (no real resume data) and keeps light "document" styling in both
 * themes so it always reads like a printed page.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft background wash behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent)_0%,transparent_70%)] opacity-70"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Left: copy + CTAs */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[12px] font-medium text-muted-foreground shadow-sm">
            <span className="size-1.5 rounded-full bg-success" />
            100% local · No accounts · No tracking · No backend
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Build ATS-friendly resumes in minutes.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Create, customize, import and export professional resumes with
            complete control of your data. Everything runs in your browser, so
            your resume never leaves your device.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/resumes?new=1">
                Create resume
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/import">Import existing resume</Link>
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <CheckCircle2 className="size-4 text-success" />
            Free and open source. No sign-up required.
          </p>
        </div>

        {/* Right: mocked resume preview */}
        <div className="animate-fade-up [animation-delay:120ms]">
          <ResumePreview />
        </div>
      </div>
    </section>
  );
}

/** A static, illustrative resume document. No real data is rendered. */
function ResumePreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Floating "resume.json" chip */}
      <div className="absolute -left-3 top-6 z-10 hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-600 shadow-md sm:inline-flex">
        <FileJson className="size-3.5 text-primary" />
        resume.json
      </div>

      {/* Floating ATS pill */}
      <div className="absolute -right-3 bottom-8 z-10 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 shadow-md">
        <ShieldCheck className="size-3.5" />
        ATS check passed · 9/9 criteria
      </div>

      {/* The "page" - kept light in both themes so it reads as a document. */}
      <div className="rounded-xl border border-slate-200 bg-white p-7 text-slate-900 shadow-xl ring-1 ring-black/5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Jordan Avery
          </h3>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Minimal · ATS
          </span>
        </div>
        <p className="mt-0.5 text-[13px] font-medium text-primary">
          Senior Frontend Engineer
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          jordan.avery@email.com · San Francisco, CA
        </p>

        <PreviewSection title="Experience">
          <PreviewEntry
            heading="Lead Frontend Engineer"
            sub="Northwind · 2021 - Present"
            lines={3}
          />
          <PreviewEntry
            heading="Frontend Engineer"
            sub="Vertex Labs · 2018 - 2021"
            lines={2}
          />
        </PreviewSection>

        <PreviewSection title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {["TypeScript", "React", "Next.js", "Tailwind", "Node"].map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  {skill}
                </span>
              ),
            )}
          </div>
        </PreviewSection>

        <PreviewSection title="Education">
          <PreviewEntry
            heading="B.S. Computer Science"
            sub="State University · 2014 - 2018"
            lines={1}
          />
        </PreviewSection>
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function PreviewEntry({
  heading,
  sub,
  lines,
}: {
  heading: string;
  sub: string;
  lines: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-semibold text-slate-800">
          {heading}
        </span>
        <span className="shrink-0 text-[10px] text-slate-400">{sub}</span>
      </div>
      <div className="mt-1 space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "block h-1.5 rounded-full bg-slate-100",
              i === lines - 1 ? "w-2/3" : "w-full",
            )}
          />
        ))}
      </div>
    </div>
  );
}
