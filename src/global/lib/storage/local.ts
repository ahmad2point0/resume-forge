import type { KeyValueStore } from "./types";

/**
 * localStorage-backed KeyValueStore. Used for small preference blobs and as a
 * fallback when IndexedDB is unavailable (private mode, old browsers, SSR).
 * All operations are wrapped so a disabled/over-quota storage degrades to a
 * no-op rather than throwing.
 */
export const localStore: KeyValueStore = {
  async get<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded / disabled - ignore */
    }
  },
  async remove(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  async keys(): Promise<string[]> {
    if (typeof window === "undefined") return [];
    try {
      return Object.keys(window.localStorage);
    } catch {
      return [];
    }
  },
  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  },
};
