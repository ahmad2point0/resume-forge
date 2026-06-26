import * as React from "react";

import type { Resume } from "@/global/@types";
import { PAGE_DIMENSIONS } from "@/global/constants";

import { ResumeDocument } from "../ResumeDocument";

/**
 * A non-interactive, scaled-down rendering of a resume page. Renders the page
 * at its true pixel width and shrinks it with a CSS transform so the thumbnail
 * is pixel-faithful to the full preview. Used by the gallery and dashboard.
 */
export function ResumeThumbnail({
  resume,
  width = 320,
  /** Clip the page to this height (px). Defaults to the full page height. */
  maxHeight,
  className,
}: {
  resume: Resume;
  width?: number;
  maxHeight?: number;
  className?: string;
}) {
  const dim = PAGE_DIMENSIONS[resume.settings.pageSize];
  const scale = width / dim.width;
  const fullHeight = dim.height * scale;
  const height = maxHeight ? Math.min(maxHeight, fullHeight) : fullHeight;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width,
        height,
        overflow: "hidden",
        background: "#ffffff",
        position: "relative",
      }}
    >
      <div
        style={{
          width: dim.width,
          height: dim.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ResumeDocument resume={resume} />
      </div>
    </div>
  );
}
