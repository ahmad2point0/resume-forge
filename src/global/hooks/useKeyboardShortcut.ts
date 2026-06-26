"use client";

import { useEffect } from "react";

export interface ShortcutOptions {
  /** Require Cmd (mac) / Ctrl (win/linux). */
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  /** Fire even when focus is in an input/textarea. Defaults to false. */
  allowInInput?: boolean;
  enabled?: boolean;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

/**
 * Bind a global keyboard shortcut. `key` is matched case-insensitively against
 * `event.key` (e.g. "s", "z", "Enter"). The handler receives the event so it
 * can call preventDefault.
 */
export function useKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {},
): void {
  const {
    meta = false,
    shift = false,
    alt = false,
    allowInInput = false,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      const metaOk = meta ? event.metaKey || event.ctrlKey : true;
      if (meta && !metaOk) return;
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;
      if (!allowInInput && isEditableTarget(event.target)) return;
      handler(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler, meta, shift, alt, allowInInput, enabled]);
}
