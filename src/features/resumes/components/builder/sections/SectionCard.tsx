"use client";

import * as React from "react";
import { useState } from "react";
import {
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  type LucideIcon,
} from "lucide-react";
import type { useSortable } from "@dnd-kit/sortable";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

/** The drag-handle bindings produced by dnd-kit's useSortable. */
type SortableHandle = Pick<
  ReturnType<typeof useSortable>,
  "attributes" | "listeners"
>;

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  count?: number;
  /** Drag handle props (from useSortable). Omit for non-reorderable sections. */
  dragHandle?: SortableHandle;
  hidden?: boolean;
  onToggleHidden?: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/** Collapsible container for one editor section, with optional drag handle. */
export function SectionCard({
  icon: Icon,
  title,
  count,
  dragHandle,
  hidden,
  onToggleHidden,
  children,
  defaultOpen = true,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm transition-opacity",
        hidden && "opacity-60",
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-2">
        {dragHandle && (
          <button
            type="button"
            aria-label="Reorder section"
            className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground active:cursor-grabbing"
            {...dragHandle.attributes}
            {...dragHandle.listeners}
          >
            <GripVertical className="size-4" />
          </button>
        )}
        <Icon className="size-4 text-primary" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-1.5 py-1 text-left text-[13px] font-semibold"
        >
          {title}
          {typeof count === "number" && (
            <span className="rounded-full bg-secondary px-1.5 text-[11px] font-medium text-muted-foreground">
              {count}
            </span>
          )}
        </button>

        {onToggleHidden && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggleHidden}
                aria-label={hidden ? "Show on resume" : "Hide from resume"}
              >
                {hidden ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hidden ? "Hidden from resume" : "Shown on resume"}
            </TooltipContent>
          </Tooltip>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Collapse" : "Expand"}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              !open && "-rotate-90",
            )}
          />
        </Button>
      </div>

      {open && <div className="p-3.5">{children}</div>}
    </div>
  );
}
