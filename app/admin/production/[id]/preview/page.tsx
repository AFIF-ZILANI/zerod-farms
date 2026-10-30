import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/supabase/admin-auth";
import { MEDIA_BUCKET } from "../../../../lib/supabase/env";
import { toPublicBatch, type PublicBatchRecord, type PublicMediaRecord } from "../../../../lib/production/queries";
import { batchPath, isWindowExpired } from "../../../../lib/production/format";
import type { BatchRow, MediaRow } from "../../../../lib/production/types";
import { BatchDetail } from "../../../../components/production/BatchDetail";
import { Nav } from "../../../../components/Nav";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Renders the batch exactly as its public page will look, from the admin's
// own (RLS-checked) data, so drafts and new videos can be reviewed before
// anything is published. Media comes through short-lived signed URLs.
export default async function BatchPreviewPage({ params }: PageProps<"/admin/production/[id]/preview">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const [batchRes, mediaRes] = await Promise.all([
    supabase.from("production_batches").select("*").eq("id", id).maybeSingle(),
    supabase.from("production_media").select("*").eq("batch_id", id),
  ]);
  if (!batchRes.data) notFound();

  const b = batchRes.data as BatchRow;
  const rows = (mediaRes.data ?? []) as MediaRow[];

  const paths = rows.flatMap((m) => [m.storage_path, m.poster_path]).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrls(paths, 60 * 60);
    for (const s of data ?? []) if (s.path && s.signedUrl) signed.set(s.path, s.signedUrl);
  }

  // Apply the same public rules the views apply (quantity visibility, no
  // internal fields) so the preview never shows more than buyers will see.
  const record: PublicBatchRecord = {
    id: b.id,
    batch_code: b.batch_code,
    title: b.title,
    breed: b.breed,
    status: b.status === "upcoming" ? "upcoming" : "available",
    description: b.description,
    available_birds: b.show_quantity ? b.available_birds : null,
    minimum_order_quantity: b.minimum_order_quantity,
    average_weight_min_kg: b.average_weight_min_kg,
    average_weight_max_kg: b.average_weight_max_kg,
    estimated_available_date: b.estimated_available_date,
    sale_window_start: b.sale_window_start,
    sale_window_end: b.sale_window_end,
    display_order: b.display_order,
    updated_at: b.updated_at,
  };
  const mediaRecords: PublicMediaRecord[] = rows.map((m) => ({
    id: m.id,
    batch_id: m.batch_id,
    media_type: m.media_type,
    external_url: m.external_url,
    is_stored: m.storage_path != null,
    has_poster: m.poster_path != null,
    caption: m.caption,
    recorded_at: m.recorded_at,
    is_primary: m.is_primary,
    display_order: m.display_order,
  }));
  const byId = new Map(rows.map((m) => [m.id, m]));
  const batch = toPublicBatch(record, mediaRecords, (m) => {
    const row = byId.get(m.id)!;
    return {
      id: m.id,
      type: m.media_type,
      src: row.storage_path ? (signed.get(row.storage_path) ?? "") : (row.external_url ?? ""),
      posterSrc: row.poster_path ? (signed.get(row.poster_path) ?? null) : null,
      external: !row.storage_path,
      caption: m.caption,
      recordedAt: m.recorded_at,
    };
  });

  const reasons: string[] = [];
  if (!b.is_published) reasons.push("it's a draft");
  if (b.status === "sold_out" || b.status === "archived") reasons.push(`its status is ${b.status.replace("_", " ")}`);
  if (b.status === "available" && isWindowExpired(b.sale_window_end)) reasons.push("its sale window has ended");
  const isLive = reasons.length === 0;

  const banner = (
    <div role="status" className="mb-8 rounded-lg border border-feed-gold/70 bg-feed-gold/10 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-body text-body-m text-ink-black">
        <strong className="font-medium">Admin preview.</strong>{" "}
        {isLive ? (
          <>This page is live at <span className="font-mono text-caption">{batchPath(b.batch_code)}</span>.</>
        ) : (
          <>Not public yet: {reasons.join(", ")}. Buyers opening the link see &ldquo;batch not listed&rdquo;.</>
        )}
      </p>
      <Link
        href={`/admin/production/${b.id}`}
        className="shrink-0 font-mono text-caption uppercase tracking-wider text-barind-rust underline underline-offset-4"
      >
        ← Back to editing
      </Link>
    </div>
  );

  return (
    <>
      <Nav solid />
      <main id="main" className="flex-1">
        <BatchDetail batch={batch} banner={banner} />
      </main>
    </>
  );
}
