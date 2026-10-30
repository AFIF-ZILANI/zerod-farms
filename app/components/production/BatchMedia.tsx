"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicMedia } from "../../lib/production/types";
import { formatDate } from "../../lib/production/format";
import { PlayGlyph, VideoStage } from "./VideoFacade";

interface BatchMediaProps {
  batchCode: string;
  breed: string;
  videos: PublicMedia[];
  images: PublicMedia[];
  wide?: boolean;
}

// Shown only when a batch has no media of its own — clearly labelled so it
// never passes as footage of the batch.
const FARM_FALLBACK = {
  src: "/images/gallery-1.jpg",
  alt: "Sonali Classic hens at feed inside a ZeroD Farms shed",
};

export function describeMedia(item: PublicMedia, batchCode: string, breed: string, index: number) {
  const what = item.type === "video" ? "Farm video" : "Farm photo";
  const parts = [`${what} ${index + 1} of batch ${batchCode}`, breed];
  if (item.caption) parts.push(item.caption);
  if (item.recordedAt) parts.push(`recorded ${formatDate(item.recordedAt)}`);
  return parts.join(" — ");
}

export function BatchMedia({ batchCode, breed, videos, images, wide = false }: BatchMediaProps) {
  const items = [...videos, ...images];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const cover = images[0]?.src ?? null;

  if (items.length === 0) {
    return (
      <figure className={`m-0 ${wide ? "md:pb-5" : ""}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-black">
          <Image
            src={FARM_FALLBACK.src}
            alt={FARM_FALLBACK.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale contrast-110 opacity-80"
            loading="lazy"
          />
        </div>
        <figcaption className="px-5 pt-3 font-mono text-caption text-steel-mesh uppercase tracking-widest">
          Farm photo · batch footage coming soon
        </figcaption>
      </figure>
    );
  }

  const current = items[Math.min(index, items.length - 1)];
  const currentIndex = items.indexOf(current);
  const label = describeMedia(current, batchCode, breed, currentIndex);

  const select = (i: number) => {
    setIndex(i);
    setPlaying(false);
  };

  return (
    <figure className={`m-0 ${wide ? "md:pb-5" : ""}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-black">
        {current.type === "image" ? (
          <Image
            src={current.src}
            alt={label}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <VideoStage
            key={current.id}
            item={current}
            label={label}
            fallbackPoster={cover}
            playing={playing}
            onPlay={() => setPlaying(true)}
          />
        )}

        {current.type === "video" && videos.length > 1 && (
          <span className="pointer-events-none absolute top-3 left-3 rounded-sm bg-ink-black/70 px-2 py-1 font-mono text-caption text-ivory-shell tabular-nums">
            Video {currentIndex + 1} / {videos.length}
          </span>
        )}
      </div>

      {(current.caption || current.recordedAt) && (
        <figcaption className="px-5 pt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {current.recordedAt && (
            <span className="font-mono text-caption text-steel-mesh uppercase tracking-widest">
              <span className="text-barind-rust" aria-hidden="true">/ </span>
              Recorded {formatDate(current.recordedAt)}
            </span>
          )}
          {current.caption && (
            <span className="font-body text-body-m text-ink-black/80">{current.caption}</span>
          )}
        </figcaption>
      )}

      {items.length > 1 && (
        <div
          className="px-5 pt-3 flex gap-2 overflow-x-auto [scrollbar-width:thin]"
          role="group"
          aria-label={`Media for batch ${batchCode}`}
        >
          {items.map((item, i) => {
            const active = i === currentIndex;
            const thumb = item.type === "image" ? item.src : item.posterSrc;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => select(i)}
                aria-pressed={active}
                aria-label={describeMedia(item, batchCode, breed, i)}
                className={`relative shrink-0 h-14 w-20 overflow-hidden rounded-md bg-ink-black transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust ${
                  active ? "ring-2 ring-barind-rust" : "opacity-70 hover:opacity-100"
                }`}
              >
                {thumb && (
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                    loading="lazy"
                  />
                )}
                {item.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center text-ivory-shell">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-black/60">
                      <PlayGlyph size={12} />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </figure>
  );
}
