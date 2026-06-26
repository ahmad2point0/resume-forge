"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Download,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Resume, ResumeSummary } from "@/global/@types";
import { resumeRepository } from "@/global/lib/resume";
import { getTemplate, ResumeThumbnail } from "@/global/templates";
import { timeAgo } from "@/global/utils/date";
import { downloadFile, toFileSlug } from "@/global/utils/download";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Progress,
  Skeleton,
  toast,
} from "@/global/components/ui";
import { ConfirmDialog } from "@/global/components/shared";

import { RenameDialog } from "./RenameDialog";

interface ResumeCardProps {
  summary: ResumeSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function ResumeCard({
  summary,
  onDuplicate,
  onDelete,
  onRename,
}: ResumeCardProps) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);

  useEffect(() => {
    let active = true;
    resumeRepository.get(summary.id).then((r) => {
      if (active) setResume(r);
    });
    return () => {
      active = false;
    };
  }, [summary.id, summary.updatedAt]);

  const template = getTemplate(summary.templateId);

  function handleDownloadJson() {
    if (!resume) return;
    downloadFile(
      `${toFileSlug(resume.title)}.json`,
      resumeRepository.exportJson(resume),
    );
    toast.success("Downloaded resume.json");
  }

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <Link
          href={`/builder/${summary.id}`}
          className="relative flex h-44 justify-center overflow-hidden border-b border-border bg-surface-2 pt-4"
          aria-label={`Open ${summary.title}`}
        >
          {resume ? (
            <div className="overflow-hidden rounded-t-md shadow-sm ring-1 ring-black/5">
              <ResumeThumbnail resume={resume} width={200} maxHeight={170} />
            </div>
          ) : (
            <Skeleton className="h-40 w-[200px] rounded-t-md" />
          )}
        </Link>

        <div className="flex flex-col gap-2 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/builder/${summary.id}`}
                className="block truncate text-sm font-semibold hover:text-primary"
              >
                {summary.title}
              </Link>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {template.name} · saved {timeAgo(summary.updatedAt)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Resume actions">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                  <Pencil /> Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(summary.id)}>
                  <Copy /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadJson}>
                  <Download /> Download JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Progress value={summary.completeness} className="h-1.5" />
            <Badge
              variant={summary.completeness >= 80 ? "success" : "outline"}
              className="shrink-0"
            >
              {summary.completeness}%
            </Badge>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete "${summary.title}"?`}
        description="This permanently removes the resume from this browser. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => onDelete(summary.id)}
      />
      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        initialTitle={summary.title}
        onSubmit={(title) => onRename(summary.id, title)}
      />
    </>
  );
}
