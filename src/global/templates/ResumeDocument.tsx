import * as React from "react";

import type { Resume } from "@/global/@types";
import { PAGE_DIMENSIONS } from "@/global/constants";

import { getTemplate, templateContactFields } from "./registry";
import { resolveTheme, resolveSections } from "./resolve";

/**
 * Renders a resume's content using its selected template. Pure and frame-free -
 * it fills whatever box it is placed in. Used by the page frame, export, and
 * gallery thumbnails alike so the on-screen preview and PDF are identical.
 */
export function ResumeDocument({
  resume,
  hideEmpty = true,
}: {
  resume: Resume;
  hideEmpty?: boolean;
}) {
  const template = getTemplate(resume.settings.templateId);
  const theme = resolveTheme(resume.settings);
  const sections = resolveSections(resume.data, resume.settings, hideEmpty);
  const contactFields = templateContactFields(resume.settings.templateId);
  const Renderer = template.Renderer;

  return (
    <Renderer
      data={resume.data}
      settings={resume.settings}
      sections={sections}
      theme={theme}
      contactFields={contactFields}
    />
  );
}

/**
 * The canonical white page frame at true A4/Letter pixel dimensions. The on-
 * screen preview scales this with a CSS transform; export rasterizes/prints it
 * at native size for a 1:1 result.
 */
export const ResumePage = React.forwardRef<
  HTMLDivElement,
  {
    resume: Resume;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
  }
>(function ResumePage({ resume, className, style, id }, ref) {
  const dim = PAGE_DIMENSIONS[resume.settings.pageSize];
  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{
        width: dim.width,
        minHeight: dim.height,
        background: "#ffffff",
        color: "#0f172a",
        overflow: "hidden",
        ...style,
      }}
    >
      <ResumeDocument resume={resume} />
    </div>
  );
});
