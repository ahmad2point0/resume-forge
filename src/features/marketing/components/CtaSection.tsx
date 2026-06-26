import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/global/components/ui/button";
import { GithubIcon } from "@/global/components/shared";
import { siteConfig } from "@/global/config/site";

/** Final conversion band: tinted background, centered copy and CTAs. */
export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-accent px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_50%_-10%,var(--primary)_0%,transparent_60%)] opacity-[0.08]"
        />

        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your resume. Your data. Your call.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
          Free and open source, forever. Start building in seconds, no sign-up
          required.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/resumes?new=1">
              Create your resume
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href={siteConfig.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="size-4" />
              Star on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
