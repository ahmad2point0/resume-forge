"use client";

import { useCallback } from "react";

/**
 * PRIMARY export path: trigger the browser print dialog. The global print
 * stylesheet isolates the `resume-print-root` element so the output is real,
 * selectable, ATS-parseable text ("Save as PDF" in the dialog).
 */
export function usePrint() {
  const print = useCallback(() => {
    window.print();
  }, []);

  return { print };
}
