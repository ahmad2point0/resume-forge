/** Current time as an ISO string - the canonical timestamp format we persist. */
export const nowIso = (): string => new Date().toISOString();

/**
 * Relative "time ago" label for dashboard cards (e.g. "3 minutes ago").
 * Falls back to an absolute date for anything older than a month.
 */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "unknown";

  const seconds = Math.round((Date.now() - then) / 1000);
  const ranges: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  if (seconds < 30) return "just now";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secondsPerUnit] of ranges) {
    if (seconds >= secondsPerUnit) {
      return rtf.format(-Math.floor(seconds / secondsPerUnit), unit);
    }
  }
  return "just now";
}

/**
 * Format a resume month value (`YYYY-MM`) into a readable label
 * ("Jan 2023"). Empty values render as "Present" when `presentFallback`.
 */
export function formatMonth(
  value: string | undefined,
  presentFallback = false,
): string {
  if (!value) return presentFallback ? "Present" : "";
  const [year, month] = value.split("-");
  if (!year) return value;
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Render a date range for experience/education entries. */
export function formatDateRange(
  start: string | undefined,
  end: string | undefined,
  current = false,
): string {
  const from = formatMonth(start);
  const to = current ? "Present" : formatMonth(end, false);
  if (from && to) return `${from} - ${to}`;
  return from || to || "";
}
