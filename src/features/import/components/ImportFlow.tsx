"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  FileUp,
  Flame,
  Loader2,
  Upload,
} from "lucide-react";

import type { Resume, TemplateMeta } from "@/global/@types";
import { resumeRepository } from "@/global/lib/resume";
import {
  applyTemplate,
  listTemplateMeta,
  ResumeThumbnail,
} from "@/global/templates";
import {
  COVER_LETTER_PROMPT,
  IMPORT_PROMPT,
  IMPROVE_PROMPT,
  SAMPLE_RESUME_DATA,
} from "@/global/constants";
import { readFileAsText } from "@/global/utils/download";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Textarea,
  toast,
} from "@/global/components/ui";
import { CopyButton } from "@/global/components/shared";
import { cn } from "@/global/utils/cn";

import { validateImportText, type ImportValidation } from "../utils/validateImport";

type Step = "convert" | "paste" | "template";

const CONVERT_STEPS = [
  {
    title: "Attach your file",
    body: "Open ChatGPT and drag your existing resume (PDF or DOCX) into the chat.",
  },
  {
    title: "Paste the prompt",
    body: "Copy the prompt below and send it in the same chat.",
  },
  {
    title: "Copy the JSON",
    body: "Copy the JSON output ChatGPT returns, then come back here.",
  },
];

const SAMPLE_JSON = JSON.stringify(
  { title: "Jordan Avery - Sample", data: SAMPLE_RESUME_DATA },
  null,
  2,
);

export function ImportFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("convert");
  const [json, setJson] = useState("");
  const [result, setResult] = useState<ImportValidation | null>(null);
  // The validated resume, held in memory until the user picks a template.
  const [validated, setValidated] = useState<Resume | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleValidate() {
    const validation = validateImportText(json);
    setResult(validation);
    if (!validation.ok || !validation.resume) return;
    setValidated(validation.resume);
    setStep("template");
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      setJson(text);
      setStep("paste");
    } catch {
      toast.error("Couldn't read that file.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-primary">
          Import
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Import an existing resume
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Bring a PDF or DOCX into structured JSON using ChatGPT, then load it
          here. No file is ever uploaded to us - everything stays on your device.
        </p>
      </header>

      {step === "convert" && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div>
                <h2 className="text-sm font-semibold">
                  Step 1 · Convert it with ChatGPT
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  resumeforge never uploads or reads your file. Open ChatGPT,
                  attach your old resume there, then use this prompt to turn it
                  into our JSON format.
                </p>
              </div>

              <ol className="grid gap-3 sm:grid-cols-3">
                {CONVERT_STEPS.map((s, i) => (
                  <li
                    key={s.title}
                    className="rounded-lg border border-border bg-surface p-3"
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="mt-2 text-[13px] font-medium">{s.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="rounded-lg border border-border bg-surface-2">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-[12px] font-medium text-muted-foreground">
                    Conversion prompt
                  </span>
                  <CopyButton value={IMPORT_PROMPT} label="Copy prompt" />
                </div>
                <pre className="scrollarea max-h-48 overflow-auto p-3 text-[11.5px] leading-relaxed text-foreground/80">
                  {IMPORT_PROMPT}
                </pre>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep("paste")}>
                  I have my JSON <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <HelperPrompts />
        </div>
      )}

      {step === "paste" && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold">
                    Step 2 · Paste your JSON
                  </h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    We validate the structure before importing.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInput.current?.click()}
                  >
                    <Upload className="size-4" /> Upload JSON
                  </Button>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setJson(SAMPLE_JSON)}
                  >
                    Load a sample
                  </Button>
                </div>
              </div>

              <Textarea
                value={json}
                onChange={(e) => setJson(e.target.value)}
                placeholder='{ "title": "My resume", "data": { "basics": { … } } }'
                className="scrollarea min-h-56 font-mono text-[12px]"
              />

              {result && !result.ok && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-[12.5px] text-destructive">
                  {result.errors.map((e) => (
                    <p key={e}>{e}</p>
                  ))}
                </div>
              )}
              {result?.ok && result.warnings.length > 0 && (
                <div className="flex flex-col gap-1 rounded-md border border-warning/40 bg-warning/10 p-3 text-[12.5px] text-warning">
                  {result.warnings.map((w) => (
                    <span key={w} className="flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5" /> {w}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep("convert")}>
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button onClick={handleValidate} disabled={!json.trim()}>
                  <FileUp className="size-4" /> Validate &amp; import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "template" && validated && (
        <TemplatePickerStep
          resume={validated}
          warnings={result?.ok ? result.warnings : []}
          onBack={() => setStep("paste")}
          onPick={async (templateId) => {
            const next: Resume = {
              ...validated,
              settings: applyTemplate(validated.settings, templateId),
            };
            const saved = await resumeRepository.save(next);
            toast.success("Resume imported");
            router.push(`/builder/${saved.id}`);
          }}
        />
      )}
    </div>
  );
}

/**
 * Step 3: choose a template. Each card previews the *user's own imported data*
 * in that template, so the choice is concrete. Picking one applies the
 * template's defaults, saves the resume, and routes straight to the builder.
 */
function TemplatePickerStep({
  resume,
  warnings,
  onBack,
  onPick,
}: {
  resume: Resume;
  warnings: string[];
  onBack: () => void;
  onPick: (templateId: string) => Promise<void>;
}) {
  const templates = listTemplateMeta();
  // The id currently being saved/navigated; also drives per-card loading state.
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function pick(templateId: string) {
    if (pendingId) return;
    setPendingId(templateId);
    try {
      await onPick(templateId);
    } catch {
      toast.error("Couldn't open the builder. Please try again.");
      setPendingId(null);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">
                Step 3 · Choose a template
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Previewing your imported resume. Pick one to open it in the
                builder - you can switch anytime.
              </p>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="flex flex-col gap-1 rounded-md border border-warning/40 bg-warning/10 p-3 text-[12.5px] text-warning">
              {warnings.map((w) => (
                <span key={w} className="flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5" /> {w}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {templates.map((template) => (
              <ImportTemplateCard
                key={template.id}
                template={template}
                resume={resume}
                pending={pendingId === template.id}
                disabled={!!pendingId && pendingId !== template.id}
                onSelect={() => pick(template.id)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button variant="ghost" onClick={onBack} disabled={!!pendingId}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <p className="text-[12px] text-muted-foreground">
              Selecting a template opens the builder automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ImportTemplateCard({
  template,
  resume,
  pending,
  disabled,
  onSelect,
}: {
  template: TemplateMeta;
  resume: Resume;
  pending: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  // Preview the user's data with this template's defaults applied.
  const preview: Resume = {
    ...resume,
    settings: applyTemplate(resume.settings, template.id),
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={`Use the ${template.name} template`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:border-primary hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="relative flex justify-center overflow-hidden border-b border-border bg-surface-2 p-3">
        <div className="overflow-hidden rounded-md shadow-sm ring-1 ring-black/5">
          <ResumeThumbnail resume={preview} width={180} maxHeight={236} />
        </div>
        {template.badge && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
            <Flame className="size-2.5" />
            {template.badge}
          </span>
        )}
        {pending && (
          <div className="absolute inset-0 grid place-items-center bg-card/70 backdrop-blur-[1px]">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-primary/90 py-1.5 text-[11px] font-semibold text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Use this template <Check className="size-3" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <h3 className="truncate text-[13px] font-semibold">{template.name}</h3>
        {template.atsSafe ? (
          <Badge variant="success">ATS</Badge>
        ) : (
          <Badge variant="outline">{template.columns}-col</Badge>
        )}
      </div>
    </button>
  );
}

function HelperPrompts() {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div>
          <h2 className="text-sm font-semibold">Bonus · ChatGPT helper prompts</h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            These are prompts you run in ChatGPT yourself. For built-in AI, add
            your own API key in{" "}
            <Link href="/settings" className="text-primary hover:underline">
              Settings → AI
            </Link>
            .
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-[13px] font-medium">Improve my resume</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Sharpen bullets, summary and projects with stronger verbs and real
              metrics.
            </p>
            <CopyButton
              value={IMPROVE_PROMPT}
              label="Copy prompt"
              className="mt-2"
            />
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-[13px] font-medium">Write a cover letter</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Generate a tailored cover letter from your resume, the role and a
              job description.
            </p>
            <CopyButton
              value={COVER_LETTER_PROMPT}
              label="Copy prompt"
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
