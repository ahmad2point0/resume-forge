/**
 * Stable, collision-resistant id generation that works in every browser and
 * during SSR. Prefers the native crypto API and falls back to a time + random
 * combination for older environments.
 */
export function createId(prefix = ""): string {
  let core: string;
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    core = crypto.randomUUID();
  } else {
    core = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return prefix ? `${prefix}_${core}` : core;
}

/** Short, human-skimmable id useful for nested resume entries. */
export function createShortId(): string {
  return Math.random().toString(36).slice(2, 9);
}
