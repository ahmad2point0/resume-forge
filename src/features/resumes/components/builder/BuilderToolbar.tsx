"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  LayoutTemplate,
  Loader2,
  Redo2,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";

import { ExportMenu } from "@/global/export";
import { resumeRepository } from "@/global/lib/resume";
import { toFileSlug, downloadFile } from "@/global/utils/download";
import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@/global/components/ui";
import { ThemeToggle } from "@/global/components/shared";

import { useEditorStore } from "../../store/editor.store";
import { DesignDialog, type DesignTab } from "./DesignDialog";

function SaveStatus() {
  const status = useEditorStore((s) => s.status);
  const dirty = useEditorStore((s) => s.dirty);

  if (status === "saving") {
    return (
      <span className="hidden items-center gap-1 text-[11.5px] text-muted-foreground sm:flex">
        <Loader2 className="size-3 animate-spin" /> Saving…
      </span>
    );
  }
  return (
    <span className="hidden items-center gap-1 text-[11.5px] text-muted-foreground sm:flex">
      {dirty ? (
        "Unsaved changes"
      ) : (
        <>
          <Check className="size-3 text-success" /> Saved locally
        </>
      )}
    </span>
  );
}

export function BuilderToolbar({
  pageRef,
}: {
  pageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const resume = useEditorStore((s) => s.resume);
  const setTitle = useEditorStore((s) => s.setTitle);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);
  const [designOpen, setDesignOpen] = useState(false);
  const [designTab, setDesignTab] = useState<DesignTab>("template");

  function openDesign(tab: DesignTab) {
    setDesignTab(tab);
    setDesignOpen(true);
  }

  if (!resume) return null;

  function handleDownloadJson() {
    if (!resume) return;
    downloadFile(
      `${toFileSlug(resume.title)}.json`,
      resumeRepository.exportJson(resume),
    );
    toast.success("Downloaded resume.json");
  }

  return (
    <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/resumes">
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">My resumes</span>
        </Link>
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Input
        value={resume.title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Resume title"
        className="h-8 max-w-[220px] border-transparent bg-transparent px-2 font-medium shadow-none hover:bg-secondary focus-visible:bg-background"
      />
      <SaveStatus />

      <div className="ml-auto flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo"
            >
              <Undo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (⌘Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo"
            >
              <Redo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
        </Tooltip>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => openDesign("template")}
        >
          <LayoutTemplate className="size-4" />
          <span className="hidden sm:inline">Template</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => openDesign("design")}
        >
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Design</span>
        </Button>

        <ExportMenu
          targetRef={pageRef}
          fileName={toFileSlug(resume.title)}
          pageSize={resume.settings.pageSize}
          onDownloadJson={handleDownloadJson}
        />

        <ThemeToggle />
      </div>

      <DesignDialog
        open={designOpen}
        onOpenChange={setDesignOpen}
        tab={designTab}
        onTabChange={setDesignTab}
      />
    </header>
  );
}
