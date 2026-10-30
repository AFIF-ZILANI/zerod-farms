"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicMedia } from "../../lib/production/types";
import { formatDate } from "../../lib/production/format";
import { describeMedia } from "./BatchMedia";
import { VideoStage } from "./VideoFacade";

interface BatchVideoListProps {
  batchCode: string;
  breed: string;
  videos: PublicMedia[];
  images: PublicMedia[];
}

// Every published video of a batch, one after another. Each starts as a
// poster facade; only the one the buyer taps mounts a <video>, and starting
// another unmounts the previous — so at most one video streams at a time.
export function BatchVideoList({ batchCode, breed, videos, images }: BatchVideoListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const cover = images[0]?.src ?? null;

  return (
    <div className="space-y-10">
      {videos.length > 0 && (
        <section aria-labelledby="videos-heading">
          <h2 id="videos-heading" className="flex items-baseline justify-between gap-4 mb-4">
            <span className="font-display text-display-m font-semibold text-ink-black">Farm videos</span>
            <span className="font-mono text-caption text-steel-mesh uppercase tracking-widest tabular-nums">
              {videos.length} {videos.length === 1 ? "recording" : "recordings"}
            </span>
          </h2>
          <ol className="space-y-8">
            {videos.map((video, i) => {
              const label = describeMedia(video, batchCode, breed, i);
              return (
                <li key={video.id}>
                  <figure className="m-0">
                    <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden rounded-lg bg-ink-black">
                      <VideoStage
                        item={video}
                        label={label}
                        fallbackPoster={cover}
                        playing={activeId === video.id}
                        onPlay={() => setActiveId(video.id)}
                      />
                      {videos.length > 1 && (
                        <span className="pointer-events-none absolute top-3 left-3 rounded-sm bg-ink-black/70 px-2 py-1 font-mono text-caption text-ivory-shell tabular-nums">
                          Video {i + 1} / {videos.length}
                        </span>
                      )}
                    </div>
                    {(video.caption || video.recordedAt) && (
                      <figcaption className="pt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        {video.recordedAt && (
                          <span className="font-mono text-caption text-steel-mesh uppercase tracking-widest">
                            <span className="text-barind-rust" aria-hidden="true">/ </span>
                            Recorded{" "}
                            <time dateTime={video.recordedAt}>{formatDate(video.recordedAt)}</time>
                          </span>
                        )}
                        {video.caption && (
                          <span className="font-body text-body-m text-ink-black/80">{video.caption}</span>
                        )}
                      </figcaption>
                    )}
                  </figure>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {images.length > 0 && (
        <section aria-labelledby="photos-heading">
          <h2 id="photos-heading" className="font-display text-display-m font-semibold text-ink-black mb-4">
            {videos.length > 0 ? "Photos" : "Farm photos"}
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <li key={img.id}>
                <figure className="m-0">
                  <a
                    href={img.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-square overflow-hidden rounded-md bg-ink-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust"
                  >
                    <Image
                      src={img.src}
                      alt={describeMedia(img, batchCode, breed, i)}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </a>
                  {(img.caption || img.recordedAt) && (
                    <figcaption className="mt-2 font-mono text-caption text-steel-mesh">
                      {img.recordedAt && formatDate(img.recordedAt)}
                      {img.recordedAt && img.caption && " · "}
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
