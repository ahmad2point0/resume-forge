import type { KeyValueStore } from "./types";

const DB_NAME = "resumeforge";
const STORE_NAME = "kv";
const DB_VERSION = 1;

/** Lazily-opened singleton connection. */
let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

function tx<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = run(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

/** True when IndexedDB is usable in the current runtime. */
export function isIndexedDbAvailable(): boolean {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
}

export const indexedDbStore: KeyValueStore = {
  async get<T>(key: string): Promise<T | null> {
    const value = await tx<T | undefined>("readonly", (s) => s.get(key));
    return value ?? null;
  },
  async set<T>(key: string, value: T): Promise<void> {
    await tx("readwrite", (s) => s.put(value as unknown as T, key));
  },
  async remove(key: string): Promise<void> {
    await tx("readwrite", (s) => s.delete(key));
  },
  async keys(): Promise<string[]> {
    const result = await tx<IDBValidKey[]>("readonly", (s) => s.getAllKeys());
    return result.map(String);
  },
  async clear(): Promise<void> {
    await tx("readwrite", (s) => s.clear());
  },
};
