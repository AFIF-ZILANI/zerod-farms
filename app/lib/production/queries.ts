import "server-only";
import { getPublicClient } from "../supabase/public";
import { isWindowExpired, todayInDhaka } from "./format";
import type { PublicBatch, PublicMedia } from "./types";

export interface PublicBatchRecord {
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

export interface PublicMediaRecord {
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

// Media URLs carry the batch's updated_at as a version. Any media change
// (new upload, replaced file, new poster) bumps it via a trigger, so cached
// /media redirects never point at a file that has since been replaced.
function toMedia(m: PublicMediaRecord, version: string): PublicMedia {
  return {
    id: m.id,
    type: m.media_type,
    // Stored files go through /media/[id], which re-checks publication and
    // redirects to a short-lived signed URL. Nothing is fetched until the
    // visitor actually plays or scrolls to it.
    src: m.is_stored ? `/media/${m.id}?v=${version}` : (m.external_url ?? ""),
    posterSrc: m.has_poster ? `/media/${m.id}?poster=1&v=${version}` : null,
    external: !m.is_stored,
    caption: m.caption,
    recordedAt: m.recorded_at,
  };
}

const byPrimaryThenOrder = (a: PublicMediaRecord, b: PublicMediaRecord) =>
  Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order;

/** Maps public-view rows to the shape the site renders. Also used by the admin preview. */
export function toPublicBatch(
  b: PublicBatchRecord,
  media: PublicMediaRecord[],
  mediaUrl: (m: PublicMediaRecord, version: string) => PublicMedia = toMedia
): PublicBatch {
  const version = String(Date.parse(b.updated_at) || 0);
  const sorted = [...media].sort(byPrimaryThenOrder);
  return {
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
    videos: sorted.filter((m) => m.media_type === "video").map((m) => mediaUrl(m, version)),
    images: sorted.filter((m) => m.media_type === "image").map((m) => mediaUrl(m, version)),
  };
}

/** A batch is public stock only while its sale window hasn't closed. */
function isListable(b: { status: string; sale_window_end: string | null }, today: string) {
  return !(b.status === "available" && isWindowExpired(b.sale_window_end, today));
}

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
    if (!isListable(b, today)) continue;
    const batch = toPublicBatch(b, mediaByBatch.get(b.id) ?? []);
    (b.status === "available" ? available : upcoming).push(batch);
  }

  return { available, upcoming, error: null };
}

export type PublicBatchResult =
  | { status: "found"; batch: PublicBatch }
  | { status: "not_found" }
  | { status: "unavailable" };

/** One published, listable batch by its code (case-insensitive). */
export async function getPublicBatch(batchCode: string): Promise<PublicBatchResult> {
  const supabase = getPublicClient();
  if (!supabase) return { status: "unavailable" };

  const { data: b, error } = await supabase
    .from("public_production_batches")
    .select("*")
    .eq("batch_code", batchCode.toUpperCase())
    .maybeSingle<PublicBatchRecord>();
  if (error) {
    console.error("[production] failed to load batch", batchCode, error);
    return { status: "unavailable" };
  }
  if (!b || !isListable(b, todayInDhaka())) return { status: "not_found" };

  const { data: media, error: mediaError } = await supabase
    .from("public_production_media")
    .select("*")
    .eq("batch_id", b.id);
  if (mediaError) {
    console.error("[production] failed to load batch media", batchCode, mediaError);
    return { status: "unavailable" };
  }

  return { status: "found", batch: toPublicBatch(b, (media ?? []) as PublicMediaRecord[]) };
}

/** Codes of every public batch page, for the sitemap. */
export async function listPublicBatchCodes(): Promise<{ batchCode: string; updatedAt: string }[]> {
  const supabase = getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("public_production_batches")
    .select("batch_code, status, sale_window_end, updated_at");
  if (error) return [];
  const today = todayInDhaka();
  return (data ?? [])
    .filter((b) => isListable(b, today))
    .map((b) => ({ batchCode: b.batch_code as string, updatedAt: b.updated_at as string }));
}
