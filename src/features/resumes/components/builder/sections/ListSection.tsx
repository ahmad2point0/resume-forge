"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";

import { Button } from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

import type { ListSectionKey } from "../../../store/editor.store";
import { useEditorStore } from "../../../store/editor.store";

function SortableEntryItem({
  id,
  label,
  onDuplicate,
  onRemove,
  children,
}: {
  id: string;
  label: string;
  onDuplicate: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "rounded-lg border border-border bg-surface",
        isDragging && "z-10 shadow-lg",
      )}
    >
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <button
          type="button"
          aria-label="Reorder entry"
          className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <span className="flex-1 truncate text-[12px] font-medium text-muted-foreground">
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDuplicate}
          aria-label="Duplicate entry"
        >
          <Copy className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Remove entry"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

interface ListSectionProps<T extends { id: string }> {
  sectionKey: ListSectionKey;
  entries: T[];
  singular: string;
  renderEntry: (entry: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  entryLabel: (entry: T, index: number) => string;
}

/** Generic editor for any list-backed section: add, reorder (dnd), duplicate, remove. */
export function ListSection<T extends { id: string }>({
  sectionKey,
  entries,
  singular,
  renderEntry,
  entryLabel,
}: ListSectionProps<T>) {
  const addEntry = useEditorStore((s) => s.addEntry);
  const updateEntry = useEditorStore((s) => s.updateEntry);
  const removeEntry = useEditorStore((s) => s.removeEntry);
  const duplicateEntry = useEditorStore((s) => s.duplicateEntry);
  const reorderEntries = useEditorStore((s) => s.reorderEntries);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = entries.findIndex((e) => e.id === active.id);
    const to = entries.findIndex((e) => e.id === over.id);
    if (from !== -1 && to !== -1) reorderEntries(sectionKey, from, to);
  }

  return (
    <div className="space-y-3">
      {entries.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={entries.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <SortableEntryItem
                  key={entry.id}
                  id={entry.id}
                  label={entryLabel(entry, index)}
                  onDuplicate={() => duplicateEntry(sectionKey, entry.id)}
                  onRemove={() => removeEntry(sectionKey, entry.id)}
                >
                  {renderEntry(entry, (patch) =>
                    updateEntry(sectionKey, entry.id, patch),
                  )}
                </SortableEntryItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => addEntry(sectionKey)}
      >
        <Plus className="size-4" /> Add {singular.toLowerCase()}
      </Button>
    </div>
  );
}
