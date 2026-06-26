"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import type { ExportOptions } from "@/global/export/@types/export.types";

/** Page sizes in millimeters (portrait). */
const PAGE_SIZES_MM = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
} as const;

/** Fraction of a row's sampled pixels that must be near-white to count as a gap. */
const BLANK_THRESHOLD = 0.992;

/** How near-white (0-255 per channel) a pixel must be to read as background. */
const WHITE_CUTOFF = 248;

/** True-ish ratio of background pixels in a single canvas row (sampled). */
function rowBlankRatio(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
): number {
  const { data } = ctx.getImageData(0, y, width, 1);
  let blank = 0;
  let sampled = 0;
  // Sample every 3rd pixel - plenty accurate for finding line gaps, much faster.
  for (let i = 0; i < data.length; i += 4 * 3) {
    sampled++;
    if (
      data[i] >= WHITE_CUTOFF &&
      data[i + 1] >= WHITE_CUTOFF &&
      data[i + 2] >= WHITE_CUTOFF
    ) {
      blank++;
    }
  }
  return sampled ? blank / sampled : 1;
}

/**
 * Choose where to cut a page so the break lands in whitespace (between lines /
 * entries) instead of slicing through a line of text. Searches upward from the
 * ideal page boundary for the first near-blank row; falls back to the ideal
 * boundary when the layout (e.g. a dense two-column row) offers no clean gap.
 */
function findCleanBreak(
  ctx: CanvasRenderingContext2D,
  width: number,
  sourceY: number,
  idealEnd: number,
  minEnd: number,
): number {
  for (let y = idealEnd; y > minEnd; y--) {
    if (rowBlankRatio(ctx, width, y) >= BLANK_THRESHOLD) return y;
  }
  return idealEnd;
}

/**
 * Rasterize an element with html2canvas-pro and emit a multi-page PDF that
 * preserves the on-screen aspect ratio. Used as the SECONDARY export path
 * (the PRIMARY path is browser print of the `resume-print-root` element).
 *
 * The element is scaled to fit the page width; any overflow is sliced into
 * additional full-height pages so nothing is cut off.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  opts: ExportOptions,
): Promise<void> {
  try {
    // Capture at the element's true layout width (it is rendered off-screen at
    // native A4/Letter size, never the CSS-scaled on-screen preview), so the
    // canvas is full-resolution and never blank.
    const width = element.offsetWidth || 794;
    const height = element.offsetHeight || 1123;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      width,
      height,
      windowWidth: width,
      onclone: (_doc, node) => {
        // Strip any preview-only shadow/ring/transform from the clone.
        node.style.boxShadow = "none";
        node.style.transform = "none";
        node.style.margin = "0";
      },
    });

    if (!canvas.width || !canvas.height) {
      throw new Error("Nothing was captured from the resume.");
    }

    const page = PAGE_SIZES_MM[opts.pageSize];
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      // jsPDF accepts the "a4" preset string or an explicit [w, h] array.
      format: opts.pageSize === "letter" ? [page.width, page.height] : "a4",
      compress: true,
    });

    const imgWidthMm = page.width;
    // millimetres-per-pixel for this capture, so we can map page heights back
    // into source-canvas pixels.
    const mmPerPx = imgWidthMm / canvas.width;
    const fullHeightMm = canvas.height * mmPerPx;

    // JPEG (not PNG) keeps the file small. A full-resolution PNG of a tall,
    // multi-page resume can balloon past 30MB; JPEG at high quality lands in
    // the low single-digit MB range with no visible loss on text.
    const JPEG_QUALITY = 0.9;

    if (fullHeightMm <= page.height + 1) {
      // Single page: encode the whole canvas once.
      const imgData = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      doc.addImage(imgData, "JPEG", 0, 0, imgWidthMm, fullHeightMm, undefined, "FAST");
    } else {
      // Taller than one page: cut the canvas into page-height slices and encode
      // each slice separately. This avoids embedding one giant image N times
      // (the old approach), which was the real cause of huge files - and lets
      // us nudge each cut into whitespace so no line of text is sliced in half.
      //
      // Each interior page also gets a top + bottom margin so content never sits
      // flush against the page edge. Page 1's top is left alone because the
      // resume already carries its own top padding there.
      const MARGIN_MM = 10;

      const srcCtx = canvas.getContext("2d", { willReadFrequently: true });
      const slice = document.createElement("canvas");
      const ctx = slice.getContext("2d");
      if (!ctx) throw new Error("Could not create the export canvas.");

      let sourceY = 0;
      let pageIndex = 0;
      while (sourceY < canvas.height) {
        const topMarginMm = pageIndex === 0 ? 0 : MARGIN_MM;
        // Usable content height for this page, with its margins removed.
        const usableMm = page.height - topMarginMm - MARGIN_MM;
        const usablePx = Math.floor(usableMm / mmPerPx);
        const minSlicePx = Math.floor(usablePx * 0.82);

        const remaining = canvas.height - sourceY;
        let sliceHeightPx = Math.min(usablePx, remaining);

        // Seek a whitespace break only when real content follows this page.
        if (srcCtx && sliceHeightPx < remaining) {
          const idealEnd = sourceY + sliceHeightPx;
          const cut = findCleanBreak(
            srcCtx,
            canvas.width,
            sourceY,
            idealEnd,
            sourceY + minSlicePx,
          );
          sliceHeightPx = cut - sourceY;
        }

        slice.width = canvas.width;
        slice.height = sliceHeightPx;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx,
        );

        const imgData = slice.toDataURL("image/jpeg", JPEG_QUALITY);
        if (pageIndex > 0) doc.addPage();
        doc.addImage(
          imgData,
          "JPEG",
          0,
          topMarginMm,
          imgWidthMm,
          sliceHeightPx * mmPerPx,
          undefined,
          "FAST",
        );

        sourceY += sliceHeightPx;
        pageIndex++;
      }
    }

    doc.save(`${opts.fileName}.pdf`);
  } catch (error) {
    // Rethrow with a clear, caller-friendly message.
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to export PDF: ${message}`);
  }
}
