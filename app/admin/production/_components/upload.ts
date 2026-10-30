import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";
import { MEDIA_BUCKET, SUPABASE_ANON_KEY, SUPABASE_URL } from "../../../lib/supabase/env";

export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

// Matches the bucket's limit in the migration (50 MB, the Supabase free-tier
// per-file cap). Images get a tighter cap — they should never be that big.
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateFile(file: File, allowed: "video" | "image" | "any"): string | null {
  const isVideo = (VIDEO_TYPES as readonly string[]).includes(file.type);
  const isImage = (IMAGE_TYPES as readonly string[]).includes(file.type);
  if (allowed === "video" && !isVideo) return `${file.name}: use an MP4, WebM or MOV video.`;
  if (allowed === "image" && !isImage) return `${file.name}: use a JPG, PNG or WebP image.`;
  if (!isVideo && !isImage) return `${file.name}: unsupported file type (${file.type || "unknown"}). Use MP4/WebM/MOV video or JPG/PNG/WebP images.`;
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return `${file.name} is ${formatBytes(file.size)}. Videos must be under ${formatBytes(MAX_VIDEO_BYTES)} — compress to 720p H.264 MP4 first.`;
  }
  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return `${file.name} is ${formatBytes(file.size)}. Images must be under ${formatBytes(MAX_IMAGE_BYTES)}.`;
  }
  if (file.size === 0) return `${file.name} is empty.`;
  return null;
}

export function mediaTypeOf(file: File): "video" | "image" {
  return file.type.startsWith("video/") ? "video" : "image";
}

/**
 * Uploads straight from the browser to Supabase Storage as the signed-in
 * admin (storage RLS checks the allowlist), reporting progress. Going direct
 * keeps large videos off the Next.js server and its request-size limits.
 */
export async function uploadToStorage(
  batchId: string,
  file: File,
  onProgress: (fraction: number) => void,
  prefix = ""
): Promise<string> {
  const supabase = createSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Your session has expired. Sign in again.");

  const ext = EXTENSIONS[file.type] ?? "bin";
  const path = `${batchId}/${prefix}${crypto.randomUUID()}.${ext}`;
  const url = `${SUPABASE_URL}/storage/v1/object/${MEDIA_BUCKET}/${path}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("Content-Type", file.type);
    // Paths are unique per upload, so browsers/CDNs may cache them for long.
    xhr.setRequestHeader("Cache-Control", "max-age=31536000");
    xhr.setRequestHeader("x-upsert", "false");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let message = `Upload failed (HTTP ${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText);
        if (body?.message) message = `Upload failed: ${body.message}`;
      } catch {
        // keep the generic message
      }
      if (xhr.status === 413) message = "The file is larger than the storage limit allows.";
      if (xhr.status === 403) message = "Storage refused the upload — your account may not be an administrator.";
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error("Network error during upload. Check your connection and try again."));
    xhr.send(file);
  });

  return path;
}
