"use client";

import { useEffect, useRef, useState } from "react";

import { PAGE_DIMENSIONS } from "@/global/constants";
import { ResumePage } from "@/global/templates";

import { useEditorStore } from "../../store/editor.store";

/**
 * The on-screen live preview. Renders the real `ResumePage` at native A4/Letter
 * size and scales it with a CSS transform to fit the available width, so what
 * you see matches the export. This is purely visual - the print/PDF export
 * targets a separate, always-mounted off-screen page in BuilderShell.
 */
export function PreviewPanel() {
  const resume = useEditorStore((s) => s.resume);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);

  const dim = resume
    ? PAGE_DIMENSIONS[resume.settings.pageSize]
    : PAGE_DIMENSIONS.a4;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const available = container.clientWidth - 48;
      const next = Math.min(1, Math.max(0.2, available / dim.width));
      setScale(next);
      setPageHeight(pageRef.current?.offsetHeight ?? dim.height);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    if (pageRef.current) ro.observe(pageRef.current);
    return () => ro.disconnect();
  }, [dim.width, dim.height, resume]);

  if (!resume) return null;

  const effectiveHeight = (pageHeight || dim.height) * scale;

  return (
    <div
      ref={containerRef}
      className="scrollarea h-full overflow-auto bg-surface-2 px-6 py-6"
    >
      <div
        className="mx-auto"
        style={{ width: dim.width * scale, height: effectiveHeight }}
      >
        <div
          style={{
            width: dim.width,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <ResumePage
            ref={pageRef}
            resume={resume}
            className="shadow-xl ring-1 ring-black/5"
          />
        </div>
      </div>
    </div>
  );
}
