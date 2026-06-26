"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileX2 } from "lucide-react";

import { Button } from "@/global/components/ui";

import { BuilderShell } from "./BuilderShell";

/**
 * Reads the resume id from the `?id=` query string instead of a path segment.
 * This keeps the route fully static (one `/builder` page) so the app can be
 * exported and served from static hosting like GitHub Pages, while still
 * resolving the id on the client where the resume actually lives (IndexedDB).
 */
export function BuilderRoute() {
  const id = useSearchParams().get("id");

  if (!id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-secondary">
          <FileX2 className="size-7 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold">No resume selected</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Open a resume from your dashboard to start editing.
        </p>
        <Button asChild className="mt-2">
          <Link href="/resumes">Go to my resumes</Link>
        </Button>
      </div>
    );
  }

  return <BuilderShell resumeId={id} />;
}
