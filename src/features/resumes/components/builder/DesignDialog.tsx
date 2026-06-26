"use client";

import { Check } from "lucide-react";

import type { FontPreset, PageSize, SpacingPreset } from "@/global/@types";
import {
  ACCENT_COLORS,
  FONT_PRESETS,
  SPACING_PRESETS,
} from "@/global/constants";
import {
  applyTemplate,
  listTemplateMeta,
  ResumeThumbnail,
} from "@/global/templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

import { useEditorStore } from "../../store/editor.store";

export type DesignTab = "template" | "design";

export function DesignDialog({
  open,
  onOpenChange,
  tab = "template",
  onTabChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which tab is active (controlled). Defaults to the Template tab. */
  tab?: DesignTab;
  onTabChange?: (tab: DesignTab) => void;
}) {
  const resume = useEditorStore((s) => s.resume);
  const updateSettings = useEditorStore((s) => s.updateSettings);
  const templates = listTemplateMeta();

  if (!resume) return null;
  const { settings } = resume;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Template &amp; design</DialogTitle>
          <DialogDescription>
            Switch templates and fine-tune the look. Your content stays exactly
            as it is.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => onTabChange?.(v as DesignTab)}
          className="flex min-h-0 flex-col"
        >
          <TabsList className="self-start">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent
            value="template"
            className="scrollarea grid max-h-[55vh] grid-cols-2 gap-3 overflow-auto p-1 sm:grid-cols-3"
          >
            {templates.map((t) => {
              const selected = t.id === settings.templateId;
              const preview = {
                ...resume,
                settings: applyTemplate(settings, t.id),
              };
              return (
                <button
                  key={t.id}
                  onClick={() =>
                    updateSettings(applyTemplate(settings, t.id))
                  }
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-lg border bg-card text-left transition-all hover:shadow-md",
                    selected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border",
                  )}
                >
                  <div className="relative flex justify-center overflow-hidden bg-surface-2 p-2">
                    <div className="overflow-hidden rounded shadow-sm ring-1 ring-black/5">
                      <ResumeThumbnail
                        resume={preview}
                        width={150}
                        maxHeight={190}
                      />
                    </div>
                    {t.badge && (
                      <span className="absolute left-2 top-2 rounded-full bg-primary px-1.5 py-0.5 text-[9.5px] font-semibold text-primary-foreground shadow-sm">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 px-2.5 py-2">
                    <span className="truncate text-[12px] font-medium">
                      {t.name}
                    </span>
                    {selected && (
                      <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </TabsContent>

          <TabsContent value="design" className="space-y-5 p-1">
            <div className="space-y-2">
              <Label>Accent color</Label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    aria-label={c.name}
                    onClick={() => updateSettings({ accentColor: c.value })}
                    className={cn(
                      "size-7 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-110",
                      settings.accentColor === c.value
                        ? "ring-foreground"
                        : "ring-transparent",
                    )}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Font</Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(v) =>
                    updateSettings({ fontFamily: v as FontPreset })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FONT_PRESETS).map(([key, f]) => (
                      <SelectItem key={key} value={key}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Spacing</Label>
                <Select
                  value={settings.spacing}
                  onValueChange={(v) =>
                    updateSettings({ spacing: v as SpacingPreset })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SPACING_PRESETS).map(([key, s]) => (
                      <SelectItem key={key} value={key}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Page size</Label>
                <Select
                  value={settings.pageSize}
                  onValueChange={(v) =>
                    updateSettings({ pageSize: v as PageSize })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Font size - {Math.round(settings.fontScale * 100)}%
                </Label>
                <input
                  type="range"
                  min={0.85}
                  max={1.15}
                  step={0.05}
                  value={settings.fontScale}
                  onChange={(e) =>
                    updateSettings({ fontScale: Number(e.target.value) })
                  }
                  className="h-9 w-full accent-[var(--primary)]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
