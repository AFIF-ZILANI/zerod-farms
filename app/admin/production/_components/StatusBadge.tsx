import type { BatchRow } from "../../../lib/production/types";
import { isWindowExpired, todayInDhaka } from "../../../lib/production/format";

export type BatchFlag = "expired_window" | "stale_estimate";

/** Things an admin should look at: closed sale windows and past estimates. */
export function batchFlags(batch: BatchRow, today = todayInDhaka()): BatchFlag[] {
  const flags: BatchFlag[] = [];
  if (batch.status === "available" && isWindowExpired(batch.sale_window_end, today)) {
    flags.push("expired_window");
  }
  if (
    batch.status === "upcoming" &&
    batch.estimated_available_date != null &&
    batch.estimated_available_date < today
  ) {
    flags.push("stale_estimate");
  }
  return flags;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "border border-steel-mesh/50 text-steel-mesh bg-transparent" },
  upcoming: { label: "Upcoming", className: "border border-ink-black/40 text-ink-black bg-feed-gold/15" },
  available: { label: "Available", className: "bg-barind-rust text-ivory-shell" },
  sold_out: { label: "Sold out", className: "bg-ink-black text-ivory-shell" },
  archived: { label: "Archived", className: "bg-steel-mesh/15 text-steel-mesh" },
};

function Pill({ kind }: { kind: keyof typeof STATUS_STYLES }) {
  const s = STATUS_STYLES[kind];
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-caption uppercase tracking-wider whitespace-nowrap ${s.className}`}>
      {s.label}
    </span>
  );
}

export function StatusBadges({ batch }: { batch: BatchRow }) {
  const flags = batchFlags(batch);
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {!batch.is_published && <Pill kind="draft" />}
      <Pill kind={batch.status} />
      {flags.includes("expired_window") && (
        <span className="inline-flex items-center rounded-sm border border-barind-rust px-2 py-0.5 font-mono text-caption uppercase tracking-wider text-barind-rust whitespace-nowrap">
          ⚠ Window ended
        </span>
      )}
      {flags.includes("stale_estimate") && (
        <span className="inline-flex items-center rounded-sm border border-feed-gold px-2 py-0.5 font-mono text-caption uppercase tracking-wider text-ink-black whitespace-nowrap">
          ⚠ Estimate passed
        </span>
      )}
    </span>
  );
}
