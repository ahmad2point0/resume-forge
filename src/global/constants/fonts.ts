import type { FontPreset, SpacingPreset } from "@/global/@types";

/** Font presets mapped to real CSS font stacks usable in templates. */
export const FONT_PRESETS: Record<
  FontPreset,
  { label: string; stack: string; kind: "sans" | "serif" | "mono" }
> = {
  geist: {
    label: "Geist",
    stack: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    kind: "sans",
  },
  inter: {
    label: "Inter",
    stack: "'Inter', ui-sans-serif, system-ui, sans-serif",
    kind: "sans",
  },
  georgia: {
    label: "Georgia",
    stack: "Georgia, 'Times New Roman', serif",
    kind: "serif",
  },
  times: {
    label: "Times",
    stack: "'Times New Roman', Times, serif",
    kind: "serif",
  },
  garamond: {
    label: "Garamond",
    stack: "'EB Garamond', Garamond, Georgia, serif",
    kind: "serif",
  },
  mono: {
    label: "Mono",
    stack: "var(--font-geist-mono), ui-monospace, monospace",
    kind: "mono",
  },
};

/** Spacing presets → vertical rhythm multipliers used by the renderer. */
export const SPACING_PRESETS: Record<
  SpacingPreset,
  { label: string; sectionGap: number; entryGap: number; lineHeight: number }
> = {
  compact: { label: "Compact", sectionGap: 12, entryGap: 8, lineHeight: 1.35 },
  cozy: { label: "Cozy", sectionGap: 18, entryGap: 12, lineHeight: 1.45 },
  relaxed: { label: "Relaxed", sectionGap: 26, entryGap: 16, lineHeight: 1.55 },
};

/** Accent color swatches offered in the editor (matches the design palette). */
export const ACCENT_COLORS: { name: string; value: string }[] = [
  { name: "Blue", value: "#2563eb" },
  { name: "Slate", value: "#0f172a" },
  { name: "Teal", value: "#0d9488" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Emerald", value: "#16a34a" },
  { name: "Rose", value: "#e11d48" },
  { name: "Amber", value: "#b45309" },
  { name: "Cyan", value: "#0891b2" },
];

export const PAGE_DIMENSIONS = {
  a4: { width: 794, height: 1123, label: "A4" }, // px @96dpi
  letter: { width: 816, height: 1056, label: "Letter" },
} as const;
