import Link from "next/link";
import { requireAdmin } from "../../lib/supabase/admin-auth";
import type { BatchRow } from "../../lib/production/types";
import { formatCount, formatDate, formatDateRange, formatTimestamp, todayInDhaka } from "../../lib/production/format";
import { AdminShell } from "./_components/AdminShell";
import { StatusBadges, batchFlags } from "./_components/StatusBadge";
import { Notice } from "./_components/Notice";
import { panelClass, primaryButtonClass } from "./_components/ui";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live on site" },
  { key: "draft", label: "Drafts" },
  { key: "available", label: "Available" },
  { key: "upcoming", label: "Upcoming" },
  { key: "sold_out", label: "Sold out" },
  { key: "archived", label: "Archived" },
  { key: "review", label: "Needs review" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function applyFilter(batches: BatchRow[], filter: FilterKey, today: string): BatchRow[] {
  switch (filter) {
    case "live":
      return batches.filter(
        (b) => b.is_published && (b.status === "upcoming" || b.status === "available") && !batchFlags(b, today).includes("expired_window")
      );
    case "draft":
      return batches.filter((b) => !b.is_published);
    case "review":
      return batches.filter((b) => batchFlags(b, today).length > 0);
    case "available":
    case "upcoming":
    case "sold_out":
    case "archived":
      return batches.filter((b) => b.status === filter);
    default:
      return batches;
  }
}

export default async function ProductionDashboard({ searchParams }: PageProps<"/admin/production">) {
  const { supabase, user } = await requireAdmin();
  const params = await searchParams;
  const filter = (FILTERS.find((f) => f.key === params.filter)?.key ?? "all") as FilterKey;

  const { data, error } = await supabase
    .from("production_batches")
    .select("*")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });

  const batches = (data ?? []) as BatchRow[];
  const today = todayInDhaka();

  const count = (pred: (b: BatchRow) => boolean) => batches.filter(pred).length;
  const stats = [
    { label: "Available (live)", value: count((b) => b.is_published && b.status === "available" && !batchFlags(b, today).includes("expired_window")), filter: "available" },
    { label: "Upcoming", value: count((b) => b.status === "upcoming"), filter: "upcoming" },
    { label: "Sold out", value: count((b) => b.status === "sold_out"), filter: "sold_out" },
    { label: "Drafts", value: count((b) => !b.is_published), filter: "draft" },
    { label: "Needs review", value: count((b) => batchFlags(b, today).length > 0), filter: "review" },
  ];

  const recent = [...batches].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 5);
  const visible = applyFilter(batches, filter, today);

  return (
    <AdminShell email={user.email}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="font-display text-display-l font-semibold text-ink-black leading-tight">Production batches</h1>
        </div>
        <Link href="/admin/production/new" className={primaryButtonClass}>
          + New batch
        </Link>
      </div>

      {params.deleted && <Notice tone="success">Batch deleted.</Notice>}
      {error && (
        <Notice tone="error">
          Couldn&rsquo;t load batches: {error.message}. Check the Supabase connection and try again.
        </Notice>
      )}

      {/* Overview */}
      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={`/admin/production?filter=${s.filter}`}
            className={`${panelClass} p-4 hover:border-barind-rust/40 transition-colors ${
              s.filter === "review" && s.value > 0 ? "border-barind-rust/60" : ""
            }`}
          >
            <dt className="font-mono text-caption text-steel-mesh uppercase tracking-wider">{s.label}</dt>
            <dd className={`font-mono text-display-m tabular-nums leading-none mt-2 ${s.filter === "review" && s.value > 0 ? "text-barind-rust" : "text-ink-black"}`}>
              {s.value}
            </dd>
          </Link>
        ))}
      </dl>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Batch list */}
        <section className="lg:col-span-8" aria-labelledby="batches-heading">
          <h2 id="batches-heading" className="sr-only">All batches</h2>
          <nav aria-label="Filter batches" className="flex gap-1 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={f.key === "all" ? "/admin/production" : `/admin/production?filter=${f.key}`}
                aria-current={filter === f.key ? "page" : undefined}
                className={`shrink-0 rounded-md px-3 py-1.5 font-mono text-caption uppercase tracking-wider transition-colors ${
                  filter === f.key ? "bg-ink-black text-ivory-shell" : "text-steel-mesh hover:text-ink-black hover:bg-ink-black/5"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </nav>

          {visible.length === 0 ? (
            <div className={`${panelClass} border-dashed px-6 py-12 text-center`}>
              <p className="font-display text-display-m font-semibold text-ink-black">
                {batches.length === 0 ? "No batches yet." : "Nothing matches this filter."}
              </p>
              <p className="font-body text-body-m text-steel-mesh mt-2">
                {batches.length === 0
                  ? "Create your first batch. It stays a draft until you publish it."
                  : "Try another filter."}
              </p>
              {batches.length === 0 && (
                <Link href="/admin/production/new" className={`${primaryButtonClass} mt-6`}>
                  + New batch
                </Link>
              )}
            </div>
          ) : (
            <ul className={`${panelClass} divide-y divide-steel-mesh/15`}>
              {visible.map((b) => {
                const flags = batchFlags(b, today);
                const window = formatDateRange(b.sale_window_start, b.sale_window_end);
                return (
                  <li key={b.id}>
                    <Link
                      href={`/admin/production/${b.id}`}
                      className="block px-4 py-4 sm:px-5 hover:bg-ivory-shell/60 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-barind-rust"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-caption text-steel-mesh uppercase tracking-widest tabular-nums">
                          {b.batch_code} · #{b.display_order}
                        </span>
                        <StatusBadges batch={b} />
                      </div>
                      <p className="font-display text-body-l font-semibold text-ink-black mt-1">{b.title}</p>
                      <p className="font-mono text-caption text-steel-mesh mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        {b.available_birds != null && (
                          <span>
                            {formatCount(b.available_birds)} birds {b.show_quantity ? "(public)" : "(hidden)"}
                          </span>
                        )}
                        {b.status === "upcoming" && b.estimated_available_date && (
                          <span>Est. {formatDate(b.estimated_available_date)}</span>
                        )}
                        {window && <span>Window {window}</span>}
                        <span>Updated {formatTimestamp(b.updated_at, true)}</span>
                      </p>
                      {flags.includes("expired_window") && (
                        <p className="mt-2 font-body text-caption text-barind-rust">
                          Sale window ended — hidden from the site. Mark it sold out or extend the window.
                        </p>
                      )}
                      {flags.includes("stale_estimate") && (
                        <p className="mt-2 font-body text-caption text-ink-black">
                          Estimated date has passed — the site shows &ldquo;timing being confirmed&rdquo;. Update the estimate or status.
                        </p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Recently updated */}
        <aside className="lg:col-span-4" aria-labelledby="recent-heading">
          <div className={`${panelClass} p-5`}>
            <h2 id="recent-heading" className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-4">
              Recently updated
            </h2>
            {recent.length === 0 ? (
              <p className="font-body text-body-m text-steel-mesh">No activity yet.</p>
            ) : (
              <ol className="space-y-3">
                {recent.map((b) => (
                  <li key={b.id} className="border-l-2 border-barind-rust/40 pl-3">
                    <Link href={`/admin/production/${b.id}`} className="block hover:text-barind-rust transition-colors">
                      <span className="block font-body text-body-m text-ink-black">{b.title}</span>
                      <span className="block font-mono text-caption text-steel-mesh">
                        {b.batch_code} · {formatTimestamp(b.updated_at, true)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-5 pt-4 border-t border-steel-mesh/15 font-mono text-caption text-steel-mesh">
              Times shown in Bangladesh time (Asia/Dhaka).
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
