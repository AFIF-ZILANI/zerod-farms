import "server-only";
import { getPublicClient } from "../supabase/public";
import { isWindowExpired, todayInDhaka } from "./format";
import type { PublicBatch, PublicMedia } from "./types";

interface PublicBatchRecord {
  id: string;
  batch_code: string;
  title: string;
  breed: string;
  status: "upcoming" | "available";
  description: string | null;
  available_birds: number | null;
  minimum_order_quantity: number | null;
  average_weight_min_kg: number | null;
  average_weight_max_kg: number | null;
  estimated_available_date: string | null;
  sale_window_start: string | null;
  sale_window_end: string | null;
  display_order: number;
  updated_at: string;
}

interface PublicMediaRecord {
  id: string;
  batch_id: string;
  media_type: "video" | "image";
  external_url: string | null;
  is_stored: boolean;
  has_poster: boolean;
  caption: string | null;
  recorded_at: string | null;
  is_primary: boolean;
  display_order: number;
}

export interface PublicProduction {
  available: PublicBatch[];
  upcoming: PublicBatch[];
  /** Set when the data couldn't be loaded; the section degrades to empty states. */
  error: "not_configured" | "unavailable" | null;
}

function toMedia(m: PublicMediaRecord): PublicMedia {
  return {
    id: m.id,
    type: m.media_type,
    // Stored files go through /media/[id], which re-checks publication and
    // redirects to a short-lived signed URL. Nothing is fetched until the
    // visitor actually plays or scrolls to it.
    src: m.is_stored ? `/media/${m.id}` : (m.external_url ?? ""),
    posterSrc: m.has_poster ? `/media/${m.id}?poster=1` : null,
    external: !m.is_stored,
    caption: m.caption,
    recordedAt: m.recorded_at,
  };
}

const byPrimaryThenOrder = (a: PublicMediaRecord, b: PublicMediaRecord) =>
  Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order;

export async function getPublicProduction(): Promise<PublicProduction> {
  const supabase = getPublicClient();
  if (!supabase) return { available: [], upcoming: [], error: "not_configured" };

  const [batchesRes, mediaRes] = await Promise.all([
    supabase
      .from("public_production_batches")
      .select("*")
      .order("display_order", { ascending: true })
      .order("updated_at", { ascending: false }),
    supabase.from("public_production_media").select("*"),
  ]);

  if (batchesRes.error || mediaRes.error) {
    console.error("[production] failed to load public batches", batchesRes.error ?? mediaRes.error);
    return { available: [], upcoming: [], error: "unavailable" };
  }

  const mediaByBatch = new Map<string, PublicMediaRecord[]>();
  for (const m of (mediaRes.data ?? []) as PublicMediaRecord[]) {
    const list = mediaByBatch.get(m.batch_id) ?? [];
    list.push(m);
    mediaByBatch.set(m.batch_id, list);
  }

  const today = todayInDhaka();
  const available: PublicBatch[] = [];
  const upcoming: PublicBatch[] = [];

  for (const b of (batchesRes.data ?? []) as PublicBatchRecord[]) {
    // A batch whose sale window has closed is never shown as stock, even if
    // the admin hasn't updated its status yet — the panel flags it for review.
    if (b.status === "available" && isWindowExpired(b.sale_window_end, today)) continue;

    const media = (mediaByBatch.get(b.id) ?? []).sort(byPrimaryThenOrder);
    const batch: PublicBatch = {
      id: b.id,
      batchCode: b.batch_code,
      title: b.title,
      breed: b.breed,
      status: b.status,
      description: b.description,
      availableBirds: b.available_birds,
      minimumOrderQuantity: b.minimum_order_quantity,
      weightMinKg: b.average_weight_min_kg != null ? Number(b.average_weight_min_kg) : null,
      weightMaxKg: b.average_weight_max_kg != null ? Number(b.average_weight_max_kg) : null,
      estimatedAvailableDate: b.estimated_available_date,
      saleWindowStart: b.sale_window_start,
      saleWindowEnd: b.sale_window_end,
      updatedAt: b.updated_at,
      videos: media.filter((m) => m.media_type === "video").map(toMedia),
      images: media.filter((m) => m.media_type === "image").map(toMedia),
    };

    (b.status === "available" ? available : upcoming).push(batch);
  }

  return { available, upcoming, error: null };
}
