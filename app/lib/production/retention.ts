import { todayInDhaka } from "./format";

// Uploaded videos are only stored for the sale window plus a short grace
// period. Days are Bangladesh calendar days.
export const VIDEO_RETENTION_DAYS_AFTER_WINDOW = 2;

/** Adds whole days to a YYYY-MM-DD calendar date. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

/** Last day a batch's uploaded videos are kept, or null if there's no sale window end. */
export function videosKeptUntil(saleWindowEnd: string | null): string | null {
  return saleWindowEnd ? addDays(saleWindowEnd, VIDEO_RETENTION_DAYS_AFTER_WINDOW) : null;
}

/**
 * Batches whose sale window ended *before* this date are past retention.
 * E.g. window ends 10 Nov → videos kept through 12 Nov → removed from 13 Nov.
 */
export function retentionCutoff(today: string = todayInDhaka()): string {
  return addDays(today, -VIDEO_RETENTION_DAYS_AFTER_WINDOW);
}

export function isPastRetention(saleWindowEnd: string | null, today: string = todayInDhaka()): boolean {
  return saleWindowEnd != null && saleWindowEnd < retentionCutoff(today);
}
