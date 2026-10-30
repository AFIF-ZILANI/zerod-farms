import { SITE, SITE_URL } from "../constants";
import { batchPath } from "./format";
import type { PublicBatch } from "./types";

// VideoObject markup only where it's honest and complete: our own footage
// with a real thumbnail and a known recording date.
export function videoJsonLd(batches: PublicBatch[]) {
  const videos = batches.flatMap((b) =>
    b.videos
      .filter((v) => !v.external && v.posterSrc && v.recordedAt)
      .map((v) => ({
        "@type": "VideoObject",
        name: `Batch ${b.batchCode} — ${b.title}`,
        url: `${SITE_URL}${batchPath(b.batchCode)}`,
        description:
          v.caption ?? `Farm video of ${b.breed} birds in batch ${b.batchCode} at ${SITE.name}, ${SITE.locality}.`,
        thumbnailUrl: `${SITE_URL}${v.posterSrc}`,
        contentUrl: `${SITE_URL}${v.src}`,
        uploadDate: v.recordedAt,
        publisher: { "@id": `${SITE_URL}/#business` },
      }))
  );
  return videos.length ? { "@context": "https://schema.org", "@graph": videos } : null;
}
