import { indexedDbStore, isIndexedDbAvailable } from "./indexeddb";
import { localStore } from "./local";
import type { KeyValueStore } from "./types";

/**
 * The app-wide storage engine.
 *
 * Resume documents can grow large and numerous, so IndexedDB is preferred.
 * When it is unavailable we transparently fall back to localStorage. Both
 * implementations satisfy the same {@link KeyValueStore} contract, so callers
 * never branch on the backend.
 *
 * NOTE: on the server this resolves to the localStore, whose methods are all
 * SSR-safe no-ops - real reads/writes only happen in the browser.
 */
export const storage: KeyValueStore =
  typeof window !== "undefined" && isIndexedDbAvailable()
    ? indexedDbStore
    : localStore;

/** Preferences are tiny and read on first paint, so they live in localStorage. */
export const prefsStore: KeyValueStore = localStore;

export { STORAGE_KEYS } from "./types";
export type { KeyValueStore } from "./types";
export { isIndexedDbAvailable } from "./indexeddb";
