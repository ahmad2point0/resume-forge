import {
  Eye,
  FileDown,
  FileInput,
  Gauge,
  LayoutTemplate,
  Lock,
  Moon,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";

const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "ATS-friendly templates",
    description:
      "Clean, single-column layouts that parse cleanly in applicant tracking systems.",
  },
  {
    icon: Eye,
    title: "Live preview",
    description:
      "See every edit reflected instantly in a pixel-accurate document view.",
  },
  {
    icon: LayoutTemplate,
    title: "9 professional templates",
    description:
      "Switch between curated looks for any role without losing your content.",
  },
  {
    icon: Gauge,
    title: "Real-time resume scoring",
    description:
      "Actionable checks help you tighten your resume against ATS criteria.",
  },
  {
    icon: FileInput,
    title: "Import from JSON",
    description:
      "Bring an existing resume in seconds and pick up right where you left off.",
  },
  {
    icon: Lock,
    title: "100% private & local",
    description:
      "Your data never leaves the browser. No accounts, no servers, no tracking.",
  },
  {
    icon: FileDown,
    title: "One-click PDF export",
    description:
      "Export a crisp, selectable-text PDF that stays true to the preview.",
  },
  {
    icon: Moon,
    title: "Dark mode & shortcuts",
    description:
      "A fast, keyboard-friendly editor with light and dark themes built in.",
  },
];

/** Feature grid explaining the product value proposition. */
export function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-primary">
          Why resumeforge
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Built for people who want a fast, private, no-nonsense way to keep
          their resume sharp.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="transition-colors hover:border-primary/40"
          >
            <CardHeader>
              <span className="mb-1 inline-flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-[18px]" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
