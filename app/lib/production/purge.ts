import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "../supabase/env";
import { retentionCutoff } from "./retention";

export interface PurgeResult {
  batches: number;
  videosRemoved: number;
  filesRemoved: number;
  errors: string[];
}

/**
 * Deletes uploaded videos (and their posters) of every batch whose sale
 * window ended more than VIDEO_RETENTION_DAYS_AFTER_WINDOW days ago.
 *
 * - Only files stored in our bucket are removed; external links (YouTube…)
 *   cost nothing to keep and are left alone, as are photos.
 * - Batches without a sale window end are never touched.
 * - Files are deleted before rows, so a failed storage call leaves the row in
 *   place and the next run retries it; nothing is orphaned silently.
 *
 * Works with any client allowed to delete production media: the service-role
 * client used by the scheduled job, or a signed-in admin (RLS permits it).
 */
export async function purgeExpiredVideos(supabase: SupabaseClient, today?: string): Promise<PurgeResult> {
  const result: PurgeResult = { batches: 0, videosRemoved: 0, filesRemoved: 0, errors: [] };

  const { data: batches, error: batchError } = await supabase
    .from("production_batches")
    .select("id, batch_code")
    .not("sale_window_end", "is", null)
    .lt("sale_window_end", retentionCutoff(today));
  if (batchError) {
    result.errors.push(`Couldn't list expired batches: ${batchError.message}`);
    return result;
  }
  if (!batches?.length) return result;

  const { data: videos, error: mediaError } = await supabase
    .from("production_media")
    .select("id, batch_id, storage_path, poster_path")
    .in("batch_id", batches.map((b) => b.id))
    .eq("media_type", "video")
    .not("storage_path", "is", null);
  if (mediaError) {
    result.errors.push(`Couldn't list expired videos: ${mediaError.message}`);
    return result;
  }
  if (!videos?.length) return result;

  // Storage accepts batches of paths; keep each call modest.
  const CHUNK = 100;
  for (let i = 0; i < videos.length; i += CHUNK) {
    const chunk = videos.slice(i, i + CHUNK);
    const paths = chunk.flatMap((v) => [v.storage_path, v.poster_path]).filter((p): p is string => Boolean(p));

    const { error: removeError } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
    if (removeError) {
      result.errors.push(`Couldn't delete files: ${removeError.message}`);
      continue;
    }
    result.filesRemoved += paths.length;

    const { error: deleteError } = await supabase
      .from("production_media")
      .delete()
      .in("id", chunk.map((v) => v.id));
    if (deleteError) {
      result.errors.push(`Files deleted but rows remain (will retry): ${deleteError.message}`);
      continue;
    }
    result.videosRemoved += chunk.length;
  }

  result.batches = new Set(videos.map((v) => v.batch_id)).size;
  return result;
}
