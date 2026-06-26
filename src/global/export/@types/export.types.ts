/** Page size choices supported by the PDF export pipeline. */
export type ExportPageSize = "a4" | "letter";

/** Options consumed by the rasterized PDF export service. */
export interface ExportOptions {
  /** File name (without extension) for the downloaded PDF. */
  fileName: string;
  /** Target page size; controls the jsPDF page format. */
  pageSize: ExportPageSize;
}
