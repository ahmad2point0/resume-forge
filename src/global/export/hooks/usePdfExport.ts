"use client";

import { useCallback, useState } from "react";
import { toast } from "@/global/components/ui";

import type { ExportOptions } from "@/global/export/@types/export.types";
import { exportElementToPdf } from "@/global/export/services/pdf.service";

/**
 * SECONDARY export path: rasterize an element to a downloadable PDF, managing
 * a loading flag and surfacing success/error toasts.
 */
export function usePdfExport() {
  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(
    async (element: HTMLElement | null, opts: ExportOptions) => {
      if (!element) {
        toast.error("Nothing to export yet");
        return;
      }

      setExporting(true);
      try {
        await exportElementToPdf(element, opts);
        toast.success("PDF downloaded");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to export PDF";
        toast.error(message);
      } finally {
        setExporting(false);
      }
    },
    [],
  );

  return { exportPdf, exporting };
}
