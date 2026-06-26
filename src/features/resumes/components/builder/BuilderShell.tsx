"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileX2, GripVertical, Loader2 } from "lucide-react";

import { ResumePage } from "@/global/templates";
import { Button } from "@/global/components/ui";
import { useIsDesktop } from "@/global/hooks";
import { cn } from "@/global/utils/cn";

import { useEditorStore } from "../../store/editor.store";
import { useAutosave } from "../../hooks/useAutosave";
import { useEditorShortcuts } from "../../hooks/useEditorShortcuts";
import { BuilderToolbar } from "./BuilderToolbar";
import { EditorPanel } from "./EditorPanel";
import { PreviewPanel } from "./PreviewPanel";

type MobileTab = "editor" | "preview";

const EDITOR_WIDTH_KEY = "rf:editor-width";
const MIN_WIDTH = 360;
const MAX_WIDTH = 820;
const DEFAULT_WIDTH = 460;

export function BuilderShell({ resumeId }: { resumeId: string }) {
  const load = useEditorStore((s) => s.load);
  const clear = useEditorStore((s) => s.clear);
  const resume = useEditorStore((s) => s.resume);
  const pageRef = useRef<HTMLDivElement>(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<MobileTab>("editor");
  const [editorWidth, setEditorWidth] = useState(DEFAULT_WIDTH);
  const isDesktop = useIsDesktop();

  useAutosave();
  useEditorShortcuts();

  useEffect(() => {
    let active = true;
    setNotFound(false);
    load(resumeId).then((r) => {
      if (active && !r) setNotFound(true);
    });
    return () => {
      active = false;
      clear();
    };
  }, [resumeId, load, clear]);

  // Restore a previously chosen editor width.
  useEffect(() => {
    const saved = Number(window.localStorage.getItem(EDITOR_WIDTH_KEY));
    if (saved >= MIN_WIDTH && saved <= MAX_WIDTH) setEditorWidth(saved);
  }, []);

  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = editorWidth;

      const onMove = (ev: PointerEvent) => {
        const next = Math.min(
          MAX_WIDTH,
          Math.max(MIN_WIDTH, startWidth + (ev.clientX - startX)),
        );
        setEditorWidth(next);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        setEditorWidth((w) => {
          window.localStorage.setItem(EDITOR_WIDTH_KEY, String(w));
          return w;
        });
      };
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [editorWidth],
  );

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-secondary">
          <FileX2 className="size-7 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold">Resume not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This resume doesn’t exist in this browser. It may have been deleted or
          created on another device.
        </p>
        <Button asChild className="mt-2">
          <Link href="/resumes">Back to my resumes</Link>
        </Button>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <BuilderToolbar pageRef={pageRef} />

      {/* Mobile editor/preview switch */}
      <div className="no-print grid grid-cols-2 border-b border-border lg:hidden">
        {(["editor", "preview"] as MobileTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "py-2.5 text-[13px] font-medium capitalize transition-colors",
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="no-print flex min-h-0 flex-1">
        <div
          style={isDesktop ? { width: editorWidth } : undefined}
          className={cn(
            "scrollarea w-full overflow-auto p-4 lg:shrink-0 lg:p-5",
            tab !== "editor" && "hidden lg:block",
          )}
        >
          <EditorPanel />
        </div>

        {/* Resizable divider (desktop only) */}
        <div
          onPointerDown={startResize}
          className="no-print group hidden w-1.5 shrink-0 cursor-col-resize items-center justify-center border-x border-border bg-secondary/40 hover:bg-primary/20 lg:flex"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize editor panel"
        >
          <GripVertical className="size-3.5 text-muted-foreground/60 group-hover:text-primary" />
        </div>

        <div
          className={cn(
            "min-w-0 flex-1",
            tab !== "preview" && "hidden lg:block",
          )}
        >
          <PreviewPanel />
        </div>
      </div>

      {/*
        Always-mounted, off-screen, native-size copy of the resume. This is the
        single source of truth for print and PDF export, so export works
        regardless of the active mobile tab or the on-screen preview scaling.
      */}
      <div
        aria-hidden
        className="export-host pointer-events-none fixed top-0"
        style={{ left: -10000 }}
      >
        <ResumePage ref={pageRef} resume={resume} className="resume-print-root" />
      </div>
    </div>
  );
}
