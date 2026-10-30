"use client";

import { useRef, useState, useTransition, type FormEvent, type Ref } from "react";
import type { MediaRow } from "../../../lib/production/types";
import { formatDate } from "../../../lib/production/format";
import { VIDEO_RETENTION_DAYS_AFTER_WINDOW } from "../../../lib/production/retention";
import { classifyExternalVideo } from "../../../lib/production/video";
import {
  addMedia,
  deleteMedia,
  moveMedia,
  replaceMediaSource,
  setMediaPoster,
  setPrimaryMedia,
  updateMediaDetails,
} from "../actions";
import type { ActionState } from "../validation";
import { ConfirmButton } from "./ConfirmButton";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  VIDEO_TYPES,
  captureVideoFrame,
  formatBytes,
  mediaTypeOf,
  uploadToStorage,
  validateFile,
} from "./upload";
import {
  ghostButtonClass,
  hintClass,
  inputClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./ui";

export interface AdminMedia extends MediaRow {
  /** Short-lived signed URL for previewing a stored file in the panel. */
  previewUrl: string | null;
  posterUrl: string | null;
}

interface UploadJob {
  name: string;
  progress: number;
  status: "uploading" | "saving" | "poster" | "done" | "error";
  error?: string;
  note?: string;
}

/**
 * Makes a poster from the first second of a freshly uploaded video and
 * attaches it. Best-effort: the video is already saved, so a failure here
 * only means the admin adds a poster by hand.
 */
async function attachAutoPoster(batchId: string, mediaId: string, file: File | string, atSeconds?: number): Promise<string | null> {
  try {
    const poster = await captureVideoFrame(file, atSeconds);
    const path = await uploadToStorage(batchId, poster, () => {}, "poster-");
    const res = await setMediaPoster(mediaId, path);
    return res.error ?? null;
  } catch (err) {
    return err instanceof Error ? err.message : "Couldn't make a poster.";
  }
}

export function MediaManager({ batchId, media }: { batchId: string; media: AdminMedia[] }) {
  const videos = media.filter((m) => m.media_type === "video");
  const images = media.filter((m) => m.media_type === "image");

  return (
    <section aria-labelledby="media-heading" className="space-y-6">
      <div>
        <h2 id="media-heading" className="font-display text-display-m font-semibold text-ink-black">
          Videos &amp; photos
        </h2>
        <p className="font-body text-body-m text-steel-mesh mt-1 max-w-2xl">
            Real footage of this batch sells it. Add, replace or reorder videos at any time — on a
          published batch, changes go live on the website and its shared link straight away. A poster
          is made automatically from each uploaded video; replace it with a better frame if you like. Uploaded videos are stored only until {VIDEO_RETENTION_DAYS_AFTER_WINDOW} days after the sale window ends,
          then deleted automatically (photos and external links are kept).
        </p>
      </div>

      <Uploader batchId={batchId} />
      <ExternalVideoForm batchId={batchId} />

      <MediaGroup title="Videos" emptyText="No videos yet. Upload a short clip of the birds in the shed." items={videos} />
      <MediaGroup title="Images" emptyText="No images yet. Optional — add a cover photo or progress shots." items={images} />
    </section>
  );
}

function Uploader({ batchId }: { batchId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [recordedAt, setRecordedAt] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (i: number, patch: Partial<UploadJob>) =>
    setJobs((prev) => prev.map((j, idx) => (idx === i ? { ...j, ...patch } : j)));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const files = Array.from(inputRef.current?.files ?? []);
    if (files.length === 0) {
      setErrors(["Choose at least one file."]);
      return;
    }
    const problems = files.map((f) => validateFile(f, "any")).filter((p): p is string => Boolean(p));
    setErrors(problems);
    if (problems.length > 0) return;

    setBusy(true);
    setJobs(files.map((f) => ({ name: f.name, progress: 0, status: "uploading" })));

    for (const [i, file] of files.entries()) {
      try {
        const path = await uploadToStorage(batchId, file, (p) => update(i, { progress: p }));
        update(i, { progress: 1, status: "saving" });
        const res = await addMedia(batchId, {
          mediaType: mediaTypeOf(file),
          storagePath: path,
          caption,
          recordedAt,
        });
        if (res.error || !res.id) throw new Error(res.error ?? "Couldn't save the upload.");
        if (mediaTypeOf(file) === "video") {
          update(i, { status: "poster" });
          const posterError = await attachAutoPoster(batchId, res.id, file);
          update(i, { status: "done", note: posterError ? `Saved — no automatic poster (${posterError}) Add one below.` : undefined });
        } else {
          update(i, { status: "done" });
        }
      } catch (err) {
        update(i, { status: "error", error: err instanceof Error ? err.message : "Upload failed." });
      }
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    setCaption("");
  }

  return (
    <form onSubmit={onSubmit} className={`${panelClass} p-5 sm:p-6`}>
      <p className="font-display text-body-l font-semibold text-ink-black">Upload files</p>
      <p className={hintClass}>
        Videos: MP4 (H.264), WebM or MOV, up to {formatBytes(MAX_VIDEO_BYTES)} — compress to 720p first. Images: JPG, PNG or WebP, up to{" "}
        {formatBytes(MAX_IMAGE_BYTES)}.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="media-files" className={labelClass}>Files</label>
          <input
            ref={inputRef}
            id="media-files"
            type="file"
            multiple
            accept={[...VIDEO_TYPES, ...IMAGE_TYPES].join(",")}
            disabled={busy}
            className="block w-full font-body text-body-m text-ink-black file:mr-4 file:rounded-md file:border file:border-ink-black file:bg-transparent file:px-4 file:py-2 file:font-body file:text-body-m file:text-ink-black hover:file:bg-ink-black hover:file:text-ivory-shell file:transition-colors file:cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="media-recorded" className={labelClass}>Recorded on</label>
          <input id="media-recorded" type="date" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} disabled={busy} className={inputClass} />
        </div>
        <div>
          <label htmlFor="media-caption" className={labelClass}>Caption</label>
          <input id="media-caption" type="text" maxLength={200} value={caption} onChange={(e) => setCaption(e.target.value)} disabled={busy} className={inputClass} placeholder="Day 52, Shed 3" />
        </div>
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-4 space-y-1 font-body text-caption text-barind-rust">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}

      {jobs.length > 0 && (
        <ul className="mt-4 space-y-3" aria-live="polite">
          {jobs.map((job, i) => (
            <li key={`${job.name}-${i}`}>
              <div className="flex items-baseline justify-between gap-3 font-mono text-caption">
                <span className="truncate text-ink-black">{job.name}</span>
                <span className={job.status === "error" ? "text-barind-rust" : "text-steel-mesh"}>
                  {job.status === "uploading" && `${Math.round(job.progress * 100)}%`}
                  {job.status === "saving" && "Saving…"}
                  {job.status === "poster" && "Making poster…"}
                  {job.status === "done" && "Done"}
                  {job.status === "error" && "Failed"}
                </span>
              </div>
              <div
                className="mt-1 h-1.5 rounded-full bg-steel-mesh/15 overflow-hidden"
                role="progressbar"
                aria-label={`Upload progress for ${job.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(job.progress * 100)}
              >
                <div
                  className={`h-full transition-[width] duration-200 ${job.status === "error" ? "bg-barind-rust/50" : "bg-barind-rust"}`}
                  style={{ width: `${Math.round(job.progress * 100)}%` }}
                />
              </div>
              {job.error && <p className="mt-1 font-body text-caption text-barind-rust">{job.error}</p>}
              {job.note && <p className="mt-1 font-body text-caption text-steel-mesh">{job.note}</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-end">
        <button type="submit" disabled={busy} className={primaryButtonClass}>
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}

function ExternalVideoForm({ batchId }: { batchId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    startTransition(async () => {
      const res = await addMedia(batchId, {
        mediaType: "video",
        externalUrl: String(form.get("url") ?? ""),
        caption: String(form.get("caption") ?? ""),
        recordedAt: String(form.get("recorded_at") ?? ""),
      });
      setResult(res);
      if (res.ok) formEl.reset();
    });
  }

  return (
    <details className={`${panelClass} group`}>
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
        <span className="font-display text-body-l font-semibold text-ink-black">Add an external video link</span>
        <span className="font-mono text-caption text-steel-mesh uppercase tracking-wider group-open:hidden">YouTube · hosted MP4</span>
      </summary>
      <form onSubmit={onSubmit} className="px-5 sm:px-6 pb-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="ext-url" className={labelClass}>Video URL (https)</label>
          <input id="ext-url" name="url" type="url" required placeholder="https://youtu.be/…" className={inputClass} disabled={pending} />
          <p className={hintClass}>YouTube links play in a privacy-friendly embed; direct .mp4 links play inline; other sites open in a new tab.</p>
        </div>
        <div>
          <label htmlFor="ext-recorded" className={labelClass}>Recorded on</label>
          <input id="ext-recorded" name="recorded_at" type="date" className={inputClass} disabled={pending} />
        </div>
        <div>
          <label htmlFor="ext-caption" className={labelClass}>Caption</label>
          <input id="ext-caption" name="caption" type="text" maxLength={200} className={inputClass} disabled={pending} />
        </div>
        {result?.error && <p role="alert" className="sm:col-span-2 font-body text-caption text-barind-rust">{result.error}</p>}
        {result?.ok && <p role="status" className="sm:col-span-2 font-body text-caption text-ink-black">{result.message}</p>}
        <div className="sm:col-span-2 flex justify-end">
          <button type="submit" disabled={pending} className={secondaryButtonClass}>
            {pending ? "Adding…" : "Add link"}
          </button>
        </div>
      </form>
    </details>
  );
}

function MediaGroup({ title, emptyText, items }: { title: string; emptyText: string; items: AdminMedia[] }) {
  return (
    <div>
      <h3 className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-3">
        {title} <span className="tabular-nums">({items.length})</span>
      </h3>
      {items.length === 0 ? (
        <p className={`${panelClass} border-dashed px-5 py-6 font-body text-body-m text-steel-mesh`}>{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <MediaItem key={item.id} item={item} isFirst={i === 0} isLast={i === items.length - 1} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Preview({ item, videoRef }: { item: AdminMedia; videoRef?: Ref<HTMLVideoElement> }) {
  const base = "h-full w-full object-cover bg-ink-black";
  if (item.media_type === "image") {
    return item.previewUrl ? (
      // eslint-disable-next-line @next/next/no-img-element -- signed, short-lived admin preview
      <img src={item.previewUrl} alt={item.caption ?? "Batch image"} className={base} loading="lazy" />
    ) : (
      <span className="flex h-full items-center justify-center bg-steel-mesh/20 font-mono text-caption text-steel-mesh">No preview</span>
    );
  }
  if (item.previewUrl) {
    return (
      <video
        ref={videoRef}
        src={item.previewUrl}
        poster={item.posterUrl ?? undefined}
        crossOrigin="anonymous"
        controls
        preload="metadata"
        playsInline
        className={`${base} object-contain`}
      />
    );
  }
  if (item.external_url) {
    const ext = classifyExternalVideo(item.external_url);
    if (ext.kind === "file") {
      return <video src={item.external_url} poster={item.posterUrl ?? undefined} controls preload="metadata" playsInline className={`${base} object-contain`} />;
    }
    const thumb = item.posterUrl ?? (ext.kind === "youtube" ? `https://i.ytimg.com/vi/${ext.id}/hqdefault.jpg` : null);
    return (
      <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="relative block h-full w-full bg-ink-black">
        {/* eslint-disable-next-line @next/next/no-img-element -- third-party thumbnail preview */}
        {thumb && <img src={thumb} alt="" className="h-full w-full object-cover opacity-80" loading="lazy" />}
        <span className="absolute inset-0 flex items-center justify-center font-mono text-caption uppercase tracking-wider text-ivory-shell">
          Open link ↗
        </span>
      </a>
    );
  }
  return null;
}

function MediaItem({ item, isFirst, isLast }: { item: AdminMedia; isFirst: boolean; isLast: boolean }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  const [caption, setCaption] = useState(item.caption ?? "");
  const [recordedAt, setRecordedAt] = useState(item.recorded_at ?? "");
  const [posterProgress, setPosterProgress] = useState<number | null>(null);
  const [replaceProgress, setReplaceProgress] = useState<number | null>(null);
  const [editingLink, setEditingLink] = useState(false);
  const [link, setLink] = useState(item.external_url ?? "");
  const posterInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const previewVideo = useRef<HTMLVideoElement>(null);

  const dirty = caption !== (item.caption ?? "") || recordedAt !== (item.recorded_at ?? "");
  const isVideo = item.media_type === "video";

  const run = (fn: () => Promise<ActionState>) =>
    startTransition(async () => {
      setResult(await fn());
    });

  async function onPosterChosen(file: File | undefined) {
    if (!file) return;
    const problem = validateFile(file, "image");
    if (problem) {
      setResult({ error: problem });
      return;
    }
    try {
      setPosterProgress(0);
      const path = await uploadToStorage(item.batch_id, file, setPosterProgress, "poster-");
      setPosterProgress(null);
      run(() => setMediaPoster(item.id, path));
    } catch (err) {
      setPosterProgress(null);
      setResult({ error: err instanceof Error ? err.message : "Poster upload failed." });
    } finally {
      if (posterInput.current) posterInput.current.value = "";
    }
  }

  // Replace the file behind this item; caption, date, order and main/cover
  // status stay as they are. A new video also gets a fresh poster, since the
  // old one shows different footage.
  async function onReplaceChosen(file: File | undefined) {
    if (!file) return;
    const problem = validateFile(file, isVideo ? "video" : "image");
    if (problem) {
      setResult({ error: problem });
      return;
    }
    try {
      setReplaceProgress(0);
      const path = await uploadToStorage(item.batch_id, file, setReplaceProgress);
      const res = await replaceMediaSource(item.id, { storagePath: path });
      if (res.error) throw new Error(res.error);
      if (isVideo) {
        const posterError = await attachAutoPoster(item.batch_id, item.id, file);
        setResult(posterError ? { ok: true, message: `File replaced. No automatic poster (${posterError}) — add one.` } : res);
      } else {
        setResult(res);
      }
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Replace failed." });
    } finally {
      setReplaceProgress(null);
      if (replaceInput.current) replaceInput.current.value = "";
    }
  }

  async function captureCurrentFrame() {
    if (!item.previewUrl) return;
    const at = previewVideo.current?.currentTime;
    setPosterProgress(0);
    const posterError = await attachAutoPoster(item.batch_id, item.id, item.previewUrl, at && at > 0 ? at : undefined);
    setPosterProgress(null);
    setResult(posterError ? { error: `Couldn't capture the frame: ${posterError}` } : { ok: true, message: "Poster set from the video." });
  }

  const busy = pending || posterProgress !== null || replaceProgress !== null;

  return (
    <li className={`${panelClass} p-3 sm:p-4 ${busy ? "opacity-80" : ""}`} aria-busy={busy}>
      <div className="grid gap-4 sm:grid-cols-[13rem_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-md">
          <Preview item={item} videoRef={previewVideo} />
          {item.is_primary && (
            <span className="pointer-events-none absolute top-2 left-2 rounded-sm bg-barind-rust px-2 py-0.5 font-mono text-caption uppercase tracking-wider text-ivory-shell">
              {isVideo ? "Main video" : "Cover"}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-mono text-caption text-steel-mesh truncate">
            {item.external_url ? `Link · ${item.external_url}` : "Uploaded file"}
            {item.recorded_at && ` · recorded ${formatDate(item.recorded_at)}`}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_11rem]">
            <div>
              <label htmlFor={`cap-${item.id}`} className="sr-only">Caption</label>
              <input id={`cap-${item.id}`} type="text" maxLength={200} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className={inputClass} disabled={busy} />
            </div>
            <div>
              <label htmlFor={`rec-${item.id}`} className="sr-only">Recorded on</label>
              <input id={`rec-${item.id}`} type="date" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} className={inputClass} disabled={busy} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1">
            {dirty && (
              <button type="button" disabled={busy} onClick={() => run(() => updateMediaDetails(item.id, { caption, recordedAt }))} className={`${secondaryButtonClass} min-h-9 py-1.5`}>
                Save details
              </button>
            )}
            {!item.is_primary && (
              <button type="button" disabled={busy} onClick={() => run(() => setPrimaryMedia(item.id))} className={ghostButtonClass}>
                ★ {isVideo ? "Make main video" : "Make cover"}
              </button>
            )}
            <button type="button" disabled={busy || isFirst} onClick={() => run(() => moveMedia(item.id, "up"))} className={ghostButtonClass} aria-label="Move up">
              ↑ Up
            </button>
            <button type="button" disabled={busy || isLast} onClick={() => run(() => moveMedia(item.id, "down"))} className={ghostButtonClass} aria-label="Move down">
              ↓ Down
            </button>
            {isVideo && (
              <>
                <input
                  ref={posterInput}
                  type="file"
                  accept={IMAGE_TYPES.join(",")}
                  className="sr-only"
                  id={`poster-${item.id}`}
                  onChange={(e) => onPosterChosen(e.target.files?.[0])}
                  disabled={busy}
                />
                <label htmlFor={`poster-${item.id}`} className={`${ghostButtonClass} cursor-pointer`}>
                  {posterProgress !== null ? `Poster ${Math.round(posterProgress * 100)}%` : item.poster_path ? "Replace poster" : "Add poster"}
                </label>
                {item.poster_path && (
                  <button type="button" disabled={busy} onClick={() => run(() => setMediaPoster(item.id, null))} className={ghostButtonClass}>
                    Remove poster
                  </button>
                )}
              </>
            )}
            <ConfirmButton
              title={isVideo ? "Remove this video?" : "Remove this image?"}
              body={item.storage_path ? "The file is deleted from storage and disappears from the website." : "The link is removed from this batch."}
              confirmLabel="Remove"
              disabled={busy}
              onConfirm={() => run(() => deleteMedia(item.id))}
              className={`${ghostButtonClass} text-barind-rust hover:text-barind-rust hover:bg-barind-rust/10`}
            >
              Remove
            </ConfirmButton>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-1 border-t border-steel-mesh/10 pt-1">
            <input
              ref={replaceInput}
              type="file"
              accept={(isVideo ? VIDEO_TYPES : IMAGE_TYPES).join(",")}
              className="sr-only"
              id={`replace-${item.id}`}
              onChange={(e) => onReplaceChosen(e.target.files?.[0])}
              disabled={busy}
            />
            <label htmlFor={`replace-${item.id}`} className={`${ghostButtonClass} cursor-pointer`}>
              {replaceProgress !== null ? `Uploading ${Math.round(replaceProgress * 100)}%` : item.external_url ? "Replace with upload" : "Replace file"}
            </label>
            {item.external_url && (
              <button type="button" disabled={busy} onClick={() => setEditingLink((v) => !v)} className={ghostButtonClass} aria-expanded={editingLink}>
                Edit link
              </button>
            )}
            {isVideo && item.previewUrl && (
              <button
                type="button"
                disabled={busy}
                onClick={captureCurrentFrame}
                className={ghostButtonClass}
                title="Pause the preview on the frame you want, then click"
              >
                Use current frame as poster
              </button>
            )}
          </div>

          {editingLink && (
            <form
              className="mt-2 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                run(async () => {
                  const res = await replaceMediaSource(item.id, { externalUrl: link });
                  if (res.ok) setEditingLink(false);
                  return res;
                });
              }}
            >
              <label htmlFor={`link-${item.id}`} className="sr-only">Video URL</label>
              <input id={`link-${item.id}`} type="url" required value={link} onChange={(e) => setLink(e.target.value)} className={inputClass} disabled={busy} />
              <button type="submit" disabled={busy} className={`${secondaryButtonClass} shrink-0`}>
                Save link
              </button>
            </form>
          )}

          {result?.error && <p role="alert" className="mt-2 font-body text-caption text-barind-rust">{result.error}</p>}
          {result?.ok && result.message && <p role="status" className="mt-2 font-body text-caption text-steel-mesh">{result.message}</p>}
        </div>
      </div>
    </li>
  );
}
