"use client";

import * as React from "react";
import { Download, FileDown, FileJson, Printer } from "lucide-react";

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
 * Export entry point.
 *
 * - "Download PDF" renders the file ourselves: proper per-page margins and a
 *   page-number-only footer (no browser header/footer), small file size. This
 *   is the default because it is fully under our control.
 * - "Print / Save as PDF" uses the browser print pipeline for the crispest
 *   vector text; its header/footer is governed by the print dialog.
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

  const handleDownloadPdf = () => {
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
          disabled={exporting}
          onSelect={(event) => {
            // Keep the menu logic from firing twice; handle the export inline.
            event.preventDefault();
            handleDownloadPdf();
          }}
        >
          <span className="flex items-center gap-2 font-medium">
            <FileDown className="size-4" />
            {exporting ? "Preparing PDF…" : "Download PDF"}
          </span>
          <span className="pl-6 text-[11px] text-muted-foreground">
            Page margins and a page-number footer. No header/footer text.
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex-col items-start gap-0.5"
          onSelect={() => print()}
        >
          <span className="flex items-center gap-2 font-medium">
            <Printer className="size-4" />
            Print / Save as PDF
          </span>
          <span className="pl-6 text-[11px] text-muted-foreground">
            Sharpest, selectable text. Footer is set in the print dialog.
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
