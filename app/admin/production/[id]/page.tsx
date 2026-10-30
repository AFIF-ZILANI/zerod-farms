import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/supabase/admin-auth";
import { MEDIA_BUCKET } from "../../../lib/supabase/env";
import { formatTimestamp } from "../../../lib/production/format";
import type { BatchRow, MediaRow } from "../../../lib/production/types";
import { AdminShell } from "../_components/AdminShell";
import { BatchForm } from "../_components/BatchForm";
import { BatchControls } from "../_components/BatchControls";
import { MediaManager, type AdminMedia } from "../_components/MediaManager";
import { Notice } from "../_components/Notice";
import { updateBatch } from "../actions";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditBatchPage({ params, searchParams }: PageProps<"/admin/production/[id]">) {
  const { supabase, user } = await requireAdmin();
  const { id } = await params;
  const { created } = await searchParams;
  if (!UUID_RE.test(id)) notFound();

  const [batchRes, mediaRes] = await Promise.all([
    supabase.from("production_batches").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("production_media")
      .select("*")
      .eq("batch_id", id)
      .order("display_order")
      .order("created_at"),
  ]);

  if (batchRes.error) {
    return (
      <AdminShell email={user.email}>
        <Notice tone="error">Couldn&rsquo;t load this batch: {batchRes.error.message}</Notice>
      </AdminShell>
    );
  }
  if (!batchRes.data) notFound();

  const batch = batchRes.data as BatchRow;
  const rows = (mediaRes.data ?? []) as MediaRow[];

  // Signed preview URLs for stored files (admins can read unpublished media).
  const paths = rows.flatMap((m) => [m.storage_path, m.poster_path]).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrls(paths, 60 * 60);
    for (const s of data ?? []) if (s.path && s.signedUrl) signed.set(s.path, s.signedUrl);
  }

  const media: AdminMedia[] = rows.map((m) => ({
    ...m,
    previewUrl: m.storage_path ? (signed.get(m.storage_path) ?? null) : null,
    posterUrl: m.poster_path ? (signed.get(m.poster_path) ?? null) : null,
  }));

  return (
    <AdminShell email={user.email}>
      <Link href="/admin/production" className="font-mono text-caption uppercase tracking-wider text-steel-mesh hover:text-ink-black">
        ← All batches
      </Link>
      <div className="mt-3 mb-8">
        <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest tabular-nums">
          Batch {batch.batch_code} · updated {formatTimestamp(batch.updated_at, true)}
        </p>
        <h1 className="font-display text-display-l font-semibold text-ink-black leading-tight mt-1">{batch.title}</h1>
      </div>

      {created && (
        <Notice tone="success">
          Draft created. Add videos and photos below, then publish it when it&rsquo;s ready.
        </Notice>
      )}
      {mediaRes.error && <Notice tone="error">Couldn&rsquo;t load media: {mediaRes.error.message}</Notice>}

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-12 order-2 lg:order-1">
          <MediaManager batchId={batch.id} media={media} />
          <section aria-labelledby="details-heading">
            <h2 id="details-heading" className="font-display text-display-m font-semibold text-ink-black mb-4">
              Batch details
            </h2>
            {/* Remount when status changes elsewhere (e.g. "Sold out" button) so the
                select never saves a stale value back. */}
            <BatchForm key={batch.status} action={updateBatch.bind(null, batch.id)} batch={batch} submitLabel="Save changes" />
          </section>
        </div>
        <aside className="lg:col-span-4 order-1 lg:order-2">
          <div className="lg:sticky lg:top-20">
            <BatchControls batch={batch} />
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
