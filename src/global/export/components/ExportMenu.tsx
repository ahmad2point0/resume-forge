"use client";

import * as React from "react";
import { Download, FileDown, FileImage, FileJson } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

import type { ExportPageSize } from "@/global/export/@types/export.types";
import { usePdfExport } from "@/global/export/hooks/usePdfExport";
import { usePrint } from "@/global/export/hooks/usePrint";

export interface ExportMenuProps {
  /** Element to export; typically the node carrying `resume-print-root`. */
  targetRef: React.RefObject<HTMLElement | null>;
  /** File name (without extension) for the downloaded PDF. */
  fileName: string;
  /** Page size for the rasterized PDF export. */
  pageSize: ExportPageSize;
  /** Optional JSON export handler; the item is hidden when omitted. */
  onDownloadJson?: () => void;
  className?: string;
}

/**
 * Export entry point. The primary "Download PDF" uses the browser's print
 * pipeline, which renders the resume DOM as true vector text - pixel-identical
 * to the preview, selectable, ATS-parseable, and a tiny file. The image-based
 * download (html2canvas) is a fallback for when the print dialog is unwanted;
 * it rasterizes, so spacing can drift slightly from the preview.
 */
export function ExportMenu({
  targetRef,
  fileName,
  pageSize,
  onDownloadJson,
  className,
}: ExportMenuProps) {
  const { print } = usePrint();
  const { exportPdf, exporting } = usePdfExport();

  const handleDownloadImage = () => {
    const element = targetRef.current;
    if (!element) {
      toast.error("Nothing to export yet");
      return;
    }
    void exportPdf(element, { fileName, pageSize });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className={cn(className)}>
          <Download />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem
          className="flex-col items-start gap-0.5"
          onSelect={() => print()}
        >
          <span className="flex items-center gap-2 font-medium">
            <FileDown className="size-4" />
            Download PDF
          </span>
          <span className="pl-6 text-[11px] text-muted-foreground">
            Best quality - matches the preview exactly. Choose &ldquo;Save as
            PDF&rdquo; in the dialog.
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex-col items-start gap-0.5"
          disabled={exporting}
          onSelect={(event) => {
            // Keep the menu logic from firing twice; handle the export inline.
            event.preventDefault();
            handleDownloadImage();
          }}
        >
          <span className="flex items-center gap-2 font-medium">
            <FileImage className="size-4" />
            {exporting ? "Preparing image…" : "Download as image (PDF)"}
          </span>
          <span className="pl-6 text-[11px] text-muted-foreground">
            Instant download, no dialog. Lower fidelity (rasterized).
          </span>
        </DropdownMenuItem>
        {onDownloadJson ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onDownloadJson()}>
              <FileJson className="size-4" />
              Download JSON
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
