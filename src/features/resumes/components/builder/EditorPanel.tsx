"use client";

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
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { SectionKey } from "@/global/@types";
import { SECTION_REGISTRY } from "@/global/constants";

import { useEditorStore } from "../../store/editor.store";
import { CompletenessPanel } from "./panels/CompletenessPanel";
import { SectionCard } from "./sections/SectionCard";
import { SectionContent, PersonalInfoSection } from "./sections/SectionContent";
import { sectionIcon } from "./sections/sectionIcons";

const EMPTY: never[] = [];

function useSectionCount(key: SectionKey): number | undefined {
  return useEditorStore((s) => {
    if (!s.resume || key === "summary") return undefined;
    return (s.resume.data[key] as unknown as unknown[]).length;
  });
}

function SortableSection({ sectionKey }: { sectionKey: SectionKey }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionKey });

  const meta = SECTION_REGISTRY[sectionKey];
  const count = useSectionCount(sectionKey);
  const hidden = useEditorStore(
    (s) => s.resume?.settings.hiddenSections.includes(sectionKey) ?? false,
  );
  const toggleHidden = useEditorStore((s) => s.toggleSectionVisibility);

  return (
    <div
      ref={setNodeRef}
      id={`section-${sectionKey}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10" : undefined}
    >
      <SectionCard
        icon={sectionIcon(meta.icon)}
        title={meta.label}
        count={count}
        hidden={hidden}
        onToggleHidden={() => toggleHidden(sectionKey)}
        dragHandle={{ attributes, listeners }}
        defaultOpen={sectionKey === "summary" || sectionKey === "work"}
      >
        <SectionContent sectionKey={sectionKey} />
      </SectionCard>
    </div>
  );
}

/** The scrollable editor column: completeness panel, basics, then reorderable sections. */
export function EditorPanel() {
  const sectionOrder = useEditorStore(
    (s) => s.resume?.settings.sectionOrder ?? EMPTY,
  );
  const reorderSections = useEditorStore((s) => s.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = sectionOrder.indexOf(active.id as SectionKey);
    const to = sectionOrder.indexOf(over.id as SectionKey);
    if (from !== -1 && to !== -1) {
      reorderSections(arrayMove(sectionOrder, from, to));
    }
  }

  return (
    <div className="space-y-3.5">
      <CompletenessPanel />

      <div id="section-basics">
        <SectionCard icon={sectionIcon("User")} title="Personal information">
          <PersonalInfoSection />
        </SectionCard>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3.5">
            {sectionOrder.map((key) => (
              <SortableSection key={key} sectionKey={key} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
