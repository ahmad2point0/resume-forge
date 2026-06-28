"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from "@/global/components/ui";
import { TemplateGrid } from "@/features/templates";

interface TemplatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional template to pre-highlight (e.g. opened from a showcase card). */
  highlightId?: string;
}

/**
 * The "Create resume" entry point: pick a template, which immediately creates
 * the resume and opens the builder. There is no blank option by design.
 */
export function TemplatePickerDialog({
  open,
  onOpenChange,
  highlightId,
}: TemplatePickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Pick a starting point. You can switch templates anytime in the
            builder.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]" viewportClassName="pr-3">
          <TemplateGrid highlightId={highlightId} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
