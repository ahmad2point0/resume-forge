/**
 * Minimal async key/value contract. The app never talks to IndexedDB or
 * localStorage directly - it goes through this interface, so the backing
 * engine can change (or be mocked in tests) without touching callers.
 */
export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  keys(): Promise<string[]>;
  clear(): Promise<void>;
}

export const STORAGE_KEYS = {
  /** Index of resume ids, most-recent first. */
  resumeIndex: "rf:resume-index",
  /** A single resume document, keyed by id. */
  resume: (id: string) => `rf:resume:${id}`,
  /** Global user preferences (theme handled separately by next-themes). */
  preferences: "rf:preferences",
  /** AI provider settings (bring-your-own-key). Stored locally only. */
  aiSettings: "rf:ai-settings",
  /** Per-resume undo/redo is in-memory; last opened resume id is persisted. */
  lastOpened: "rf:last-opened",
} as const;
