"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "../../lib/supabase/admin-auth";
import { MEDIA_BUCKET } from "../../lib/supabase/env";
import { isWindowExpired } from "../../lib/production/format";
import { purgeExpiredVideos } from "../../lib/production/purge";
import { BATCH_STATUSES, type BatchStatus, type MediaType } from "../../lib/production/types";
import { describeDbError, parseBatchForm, type ActionState } from "./validation";

// Every action re-checks the admin allowlist server-side; RLS enforces the
// same rule again in the database, so a forged request gets nowhere.
async function adminClient() {
  const check = await checkAdmin();
  if (check.status !== "ok") return null;
  return check.supabase;
}

const NOT_AUTHORISED: ActionState = {
  error: "Your session has expired or this account isn't an administrator. Sign in again.",
};

function refresh(batchId?: string) {
  revalidatePath("/");
  // Every public batch page and the sitemap (codes, availability and media
  // can all change here).
  revalidatePath("/production/[code]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/production");
  if (batchId) revalidatePath(`/admin/production/${batchId}`);
}

// ---------------------------------------------------------------------------
// Batches
// ---------------------------------------------------------------------------

export async function createBatch(_prev: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const parsed = parseBatchForm(form);
  if (!parsed.ok) return { fieldErrors: parsed.fieldErrors, error: "Check the highlighted fields." };

  // New batches always start as drafts; publishing is a separate, explicit step.
  const { data, error } = await supabase
    .from("production_batches")
    .insert({ ...parsed.data, is_published: false })
    .select("id")
    .single();
  if (error) return describeDbError(error);

  refresh();
  redirect(`/admin/production/${data.id}?created=1`);
}

export async function updateBatch(batchId: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const parsed = parseBatchForm(form);
  if (!parsed.ok) return { fieldErrors: parsed.fieldErrors, error: "Check the highlighted fields." };

  // The code is the batch's public URL. Once buyers may have the link, it
  // must not change underneath them.
  const { data: current, error: currentError } = await supabase
    .from("production_batches")
    .select("batch_code, is_published")
    .eq("id", batchId)
    .single();
  if (currentError) return describeDbError(currentError);
  if (current.is_published && current.batch_code !== parsed.data.batch_code) {
    return {
      error: "Check the highlighted fields.",
      fieldErrors: {
        batch_code: `This batch is published, so its link (/production/${current.batch_code}) may already be shared. Unpublish it first if you really need a new code.`,
      },
    };
  }

  const { error } = await supabase.from("production_batches").update(parsed.data).eq("id", batchId);
  if (error) return describeDbError(error);

  refresh(batchId);
  return { ok: true, message: "Batch saved." };
}

export async function setBatchStatus(batchId: string, status: BatchStatus): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;
  if (!BATCH_STATUSES.includes(status)) return { error: "Unknown status." };

  const { error } = await supabase.from("production_batches").update({ status }).eq("id", batchId);
  if (error) return describeDbError(error);

  refresh(batchId);
  return { ok: true, message: `Status changed to ${status.replace("_", " ")}.` };
}

export async function setBatchPublished(batchId: string, publish: boolean): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  if (publish) {
    const { data: batch, error } = await supabase
      .from("production_batches")
      .select("status, sale_window_end")
      .eq("id", batchId)
      .single();
    if (error) return describeDbError(error);
    if (batch.status === "available" && isWindowExpired(batch.sale_window_end)) {
      return {
        error:
          "This batch's sale window has already ended, so it wouldn't appear on the site. Update the sale window or status first.",
      };
    }
    if (batch.status === "archived" || batch.status === "sold_out") {
      return {
        error: "Only upcoming or available batches are shown publicly. Change the status first.",
      };
    }
  }

  const { error } = await supabase
    .from("production_batches")
    .update({ is_published: publish })
    .eq("id", batchId);
  if (error) return describeDbError(error);

  refresh(batchId);
  return { ok: true, message: publish ? "Published — now visible on the website." : "Unpublished — hidden from the website." };
}

export async function deleteBatch(batchId: string): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  // Remove the batch's files first so nothing is orphaned in storage.
  const { data: files, error: listError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(batchId, { limit: 1000 });
  if (listError) return { error: `Couldn't list this batch's files: ${listError.message}` };
  if (files && files.length > 0) {
    const { error: removeError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(files.map((f) => `${batchId}/${f.name}`));
    if (removeError) return { error: `Couldn't delete this batch's files: ${removeError.message}` };
  }

  const { error } = await supabase.from("production_batches").delete().eq("id", batchId);
  if (error) return describeDbError(error);

  refresh();
  redirect("/admin/production?deleted=1");
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface NewMediaInput {
  mediaType: MediaType;
  storagePath?: string;
  externalUrl?: string;
  caption?: string;
  recordedAt?: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function cleanCaption(caption: string | undefined): string | null | false {
  const c = (caption ?? "").trim();
  if (c.length > 200) return false;
  return c || null;
}

export async function addMedia(batchId: string, input: NewMediaInput): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const caption = cleanCaption(input.caption);
  if (caption === false) return { error: "Keep captions under 200 characters." };
  if (input.recordedAt && !DATE_RE.test(input.recordedAt)) return { error: "Enter a valid recording date." };
  if (input.mediaType !== "video" && input.mediaType !== "image") return { error: "Unknown media type." };

  let external_url: string | null = null;
  let storage_path: string | null = null;
  if (input.externalUrl) {
    try {
      const url = new URL(input.externalUrl.trim());
      if (url.protocol !== "https:") return { error: "External links must start with https://" };
      external_url = url.toString();
    } catch {
      return { error: "That doesn't look like a valid URL." };
    }
  } else if (input.storagePath) {
    if (!input.storagePath.startsWith(`${batchId}/`)) return { error: "Upload path doesn't belong to this batch." };
    storage_path = input.storagePath;
  } else {
    return { error: "Upload a file or paste a video link." };
  }

  // Append to the end, and make the first item of each type primary.
  const { data: existing, error: listError } = await supabase
    .from("production_media")
    .select("media_type, is_primary, display_order")
    .eq("batch_id", batchId);
  if (listError) return describeDbError(listError);

  const nextOrder = Math.max(-1, ...(existing ?? []).map((m) => m.display_order)) + 1;
  const hasPrimary = (existing ?? []).some((m) => m.media_type === input.mediaType && m.is_primary);

  const { data: inserted, error } = await supabase
    .from("production_media")
    .insert({
      batch_id: batchId,
      media_type: input.mediaType,
      storage_path,
      external_url,
      caption,
      recorded_at: input.recordedAt || null,
      display_order: nextOrder,
      is_primary: !hasPrimary,
    })
    .select("id")
    .single();

  if (error) {
    // Don't leave an orphaned upload behind if the row couldn't be saved.
    if (storage_path) await supabase.storage.from(MEDIA_BUCKET).remove([storage_path]);
    return describeDbError(error);
  }

  refresh(batchId);
  return { ok: true, id: inserted.id, message: input.mediaType === "video" ? "Video added." : "Image added." };
}

async function getMedia(supabase: NonNullable<Awaited<ReturnType<typeof adminClient>>>, mediaId: string) {
  return supabase
    .from("production_media")
    .select("id, batch_id, media_type, storage_path, poster_path, is_primary, display_order")
    .eq("id", mediaId)
    .single();
}

export async function updateMediaDetails(
  mediaId: string,
  details: { caption?: string; recordedAt?: string }
): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const caption = cleanCaption(details.caption);
  if (caption === false) return { error: "Keep captions under 200 characters." };
  if (details.recordedAt && !DATE_RE.test(details.recordedAt)) return { error: "Enter a valid recording date." };

  const { data, error } = await supabase
    .from("production_media")
    .update({ caption, recorded_at: details.recordedAt || null })
    .eq("id", mediaId)
    .select("batch_id")
    .single();
  if (error) return describeDbError(error);

  refresh(data.batch_id);
  return { ok: true, message: "Details saved." };
}

export async function setMediaPoster(mediaId: string, posterPath: string | null): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const { data: media, error: getError } = await getMedia(supabase, mediaId);
  if (getError) return describeDbError(getError);
  if (media.media_type !== "video") return { error: "Posters are only for videos." };
  if (posterPath && !posterPath.startsWith(`${media.batch_id}/`)) return { error: "Poster doesn't belong to this batch." };

  const { error } = await supabase.from("production_media").update({ poster_path: posterPath }).eq("id", mediaId);
  if (error) {
    if (posterPath) await supabase.storage.from(MEDIA_BUCKET).remove([posterPath]);
    return describeDbError(error);
  }
  if (media.poster_path && media.poster_path !== posterPath) {
    await supabase.storage.from(MEDIA_BUCKET).remove([media.poster_path]);
  }

  refresh(media.batch_id);
  return { ok: true, message: posterPath ? "Poster updated." : "Poster removed." };
}

export async function setPrimaryMedia(mediaId: string): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const { data: media, error: getError } = await getMedia(supabase, mediaId);
  if (getError) return describeDbError(getError);

  // Clear the current primary of this type first (unique partial index).
  const { error: clearError } = await supabase
    .from("production_media")
    .update({ is_primary: false })
    .eq("batch_id", media.batch_id)
    .eq("media_type", media.media_type)
    .eq("is_primary", true);
  if (clearError) return describeDbError(clearError);

  const { error } = await supabase.from("production_media").update({ is_primary: true }).eq("id", mediaId);
  if (error) return describeDbError(error);

  refresh(media.batch_id);
  return {
    ok: true,
    message: media.media_type === "video" ? "Set as the main video." : "Set as the cover image.",
  };
}

export async function moveMedia(mediaId: string, direction: "up" | "down"): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const { data: media, error: getError } = await getMedia(supabase, mediaId);
  if (getError) return describeDbError(getError);

  const { data: siblings, error: listError } = await supabase
    .from("production_media")
    .select("id, display_order, created_at")
    .eq("batch_id", media.batch_id)
    .eq("media_type", media.media_type)
    .order("display_order")
    .order("created_at");
  if (listError) return describeDbError(listError);

  const ids = siblings.map((s) => s.id);
  const from = ids.indexOf(mediaId);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= ids.length) return { ok: true };
  [ids[from], ids[to]] = [ids[to], ids[from]];

  // Rewrite a clean 0..n sequence so ordering never drifts.
  const results = await Promise.all(
    ids.map((id, i) => supabase.from("production_media").update({ display_order: i }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return describeDbError(failed.error);

  refresh(media.batch_id);
  return { ok: true };
}

// Swaps the file (or link) behind an existing media item, keeping its
// caption, recording date, position and main/cover status. The public URL
// carries a version that changes with every media edit, so buyers get the new
// file straight away rather than a cached redirect to the old one.
export async function replaceMediaSource(
  mediaId: string,
  source: { storagePath: string } | { externalUrl: string }
): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const { data: media, error: getError } = await getMedia(supabase, mediaId);
  if (getError) return describeDbError(getError);

  let patch: { storage_path: string | null; external_url: string | null };
  if ("storagePath" in source) {
    if (!source.storagePath.startsWith(`${media.batch_id}/`)) return { error: "Upload path doesn't belong to this batch." };
    patch = { storage_path: source.storagePath, external_url: null };
  } else {
    if (media.media_type !== "video") return { error: "Only videos can use an external link." };
    try {
      const url = new URL(source.externalUrl.trim());
      if (url.protocol !== "https:") return { error: "External links must start with https://" };
      patch = { storage_path: null, external_url: url.toString() };
    } catch {
      return { error: "That doesn't look like a valid URL." };
    }
  }

  const { error } = await supabase.from("production_media").update(patch).eq("id", mediaId);
  if (error) {
    if (patch.storage_path) await supabase.storage.from(MEDIA_BUCKET).remove([patch.storage_path]);
    return describeDbError(error);
  }
  if (media.storage_path && media.storage_path !== patch.storage_path) {
    const { error: removeError } = await supabase.storage.from(MEDIA_BUCKET).remove([media.storage_path]);
    if (removeError) console.error("[production] replaced media but old file removal failed", removeError);
  }

  refresh(media.batch_id);
  return { ok: true, message: "storagePath" in source ? "File replaced." : "Link updated." };
}

export async function deleteMedia(mediaId: string): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const { data: media, error: getError } = await getMedia(supabase, mediaId);
  if (getError) return describeDbError(getError);

  const { error } = await supabase.from("production_media").delete().eq("id", mediaId);
  if (error) return describeDbError(error);

  const paths = [media.storage_path, media.poster_path].filter((p): p is string => Boolean(p));
  if (paths.length > 0) {
    const { error: removeError } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
    if (removeError) console.error("[production] media row deleted but file removal failed", removeError);
  }

  // Promote the next item so the batch keeps a primary video/cover.
  if (media.is_primary) {
    const { data: next } = await supabase
      .from("production_media")
      .select("id")
      .eq("batch_id", media.batch_id)
      .eq("media_type", media.media_type)
      .order("display_order")
      .limit(1)
      .maybeSingle();
    if (next) await supabase.from("production_media").update({ is_primary: true }).eq("id", next.id);
  }

  refresh(media.batch_id);
  return { ok: true, message: "Removed." };
}

// Same clean-up the daily job runs, triggered by an admin (e.g. before the
// job has been configured, or to free space straight away).
export async function purgeExpiredVideosNow(): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_AUTHORISED;

  const result = await purgeExpiredVideos(supabase);
  refresh();
  if (result.errors.length) return { error: result.errors.join(" ") };
  return {
    ok: true,
    message:
      result.videosRemoved === 0
        ? "No videos were past their retention period."
        : `Removed ${result.videosRemoved} video${result.videosRemoved === 1 ? "" : "s"} from ${result.batches} batch${result.batches === 1 ? "" : "es"}.`,
  };
}
