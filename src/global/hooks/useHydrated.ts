"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns true once running on the client. Implemented with
 * useSyncExternalStore (server snapshot `false`, client snapshot `true`) so it
 * avoids a set-state-in-effect and never triggers a hydration mismatch.
 * Use to gate rendering of values that come from browser-only storage.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
