"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Plus, Upload } from "lucide-react";

import { Button, Skeleton, toast } from "@/global/components/ui";
import { EmptyState } from "@/global/components/shared";

import { useResumeList } from "../../hooks/useResumeList";
import { ResumeCard } from "./ResumeCard";

export function ResumesDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resumes, loading, create, duplicate, remove, rename } =
    useResumeList();
  const [creating, setCreating] = useState(false);
  const autoCreated = useRef(false);

  // Support /resumes?new=1 - create a blank resume and jump into the builder.
  useEffect(() => {
    if (searchParams.get("new") !== "1" || autoCreated.current) return;
    autoCreated.current = true;
    void (async () => {
      const resume = await create();
      router.replace(`/builder/${resume.id}`);
    })();
  }, [searchParams, create, router]);

  async function handleCreate() {
    setCreating(true);
    const resume = await create();
    router.push(`/builder/${resume.id}`);
  }

  async function handleDuplicate(id: string) {
    await duplicate(id);
    toast.success("Resume duplicated");
  }

  async function handleDelete(id: string) {
    await remove(id);
    toast.success("Resume deleted");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My resumes
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Everything here is saved locally in your browser.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/import">
              <Upload className="size-4" /> Import
            </Link>
          </Button>
          <Button onClick={handleCreate} loading={creating}>
            <Plus className="size-4" /> Create resume
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No resumes yet"
            description="Create your first resume from scratch, or import an existing one as JSON. It only takes a few seconds."
            action={
              <div className="flex gap-2">
                <Button onClick={handleCreate} loading={creating}>
                  <Plus className="size-4" /> Create resume
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/import">Import existing</Link>
                </Button>
              </div>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resumes.map((summary) => (
              <ResumeCard
                key={summary.id}
                summary={summary}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onRename={rename}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
