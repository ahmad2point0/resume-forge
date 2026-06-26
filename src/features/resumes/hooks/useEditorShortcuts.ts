"use client";

import { useKeyboardShortcut } from "@/global/hooks";

import { useEditorStore } from "../store/editor.store";

/**
 * Wires global keyboard shortcuts for the builder:
 *  - ⌘/Ctrl + Z      → undo
 *  - ⌘/Ctrl + ⇧ + Z  → redo
 *  - ⌘/Ctrl + S      → save now (prevents the browser "save page" dialog)
 * Undo/redo are allowed while typing in inputs; save is global.
 */
export function useEditorShortcuts() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const save = useEditorStore((s) => s.save);

  useKeyboardShortcut(
    "z",
    (e) => {
      e.preventDefault();
      undo();
    },
    { meta: true, allowInInput: true },
  );

  useKeyboardShortcut(
    "z",
    (e) => {
      e.preventDefault();
      redo();
    },
    { meta: true, shift: true, allowInInput: true },
  );

  useKeyboardShortcut(
    "s",
    (e) => {
      e.preventDefault();
      void save();
    },
    { meta: true, allowInInput: true },
  );
}
