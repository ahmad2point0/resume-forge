/** Result of validating/parsing imported data. */
export interface ParseResult<T> {
  ok: boolean;
  data?: T;
  errors: string[];
  warnings: string[];
}

/** Generic async operation status for UI states. */
export type AsyncStatus = "idle" | "loading" | "success" | "error";

/** A keyboard shortcut descriptor for the shortcuts dialog. */
export interface ShortcutDescriptor {
  keys: string[];
  label: string;
}
