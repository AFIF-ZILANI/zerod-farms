"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicMedia } from "../../lib/production/types";
import { formatDate } from "../../lib/production/format";
import { classifyExternalVideo } from "../../lib/production/video";

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

function PlayGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function describe(item: PublicMedia, batchCode: string, breed: string, index: number) {
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
  const label = describe(current, batchCode, breed, currentIndex);

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
                aria-label={describe(item, batchCode, breed, i)}
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

interface VideoStageProps {
  item: PublicMedia;
  label: string;
  fallbackPoster: string | null;
  playing: boolean;
  onPlay: () => void;
}

// Click-to-play facade: no video bytes (or third-party embeds) load until the
// visitor asks for them, which keeps the homepage light on mobile data.
function VideoStage({ item, label, fallbackPoster, playing, onPlay }: VideoStageProps) {
  const external = item.external ? classifyExternalVideo(item.src) : null;
  const poster =
    item.posterSrc ??
    (external?.kind === "youtube"
      ? `https://i.ytimg.com/vi/${external.id}/hqdefault.jpg`
      : fallbackPoster);

  if (playing) {
    if (external?.kind === "youtube") {
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${external.id}?autoplay=1&rel=0&playsinline=1`}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      );
    }
    return (
      // Playback starts from the visitor's own click, so sound is expected.
      <video
        className="absolute inset-0 h-full w-full object-contain"
        src={item.src}
        poster={poster ?? undefined}
        controls
        autoPlay
        playsInline
        preload="auto"
        aria-label={label}
      >
        Your browser can&rsquo;t play this video.{" "}
        <a href={item.src} className="underline">
          Open it directly
        </a>
        .
      </video>
    );
  }

  const opensElsewhere = external?.kind === "link";
  const facadeContent = (
    <>
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          loading="lazy"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_14px,rgba(247,241,228,0.06)_14px_16px)]"
        />
      )}
      <span className="absolute inset-0 bg-linear-to-t from-ink-black/70 via-ink-black/10 to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-barind-rust text-ivory-shell shadow-[0_8px_24px_-8px_rgba(20,18,15,0.6)] transition-colors group-hover:bg-barind-rust/90">
          <PlayGlyph />
        </span>
      </span>
      <span className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 font-mono text-caption text-ivory-shell/90 uppercase tracking-widest">
        <span>{opensElsewhere ? `Watch on ${external.host}` : "Play farm video"}</span>
        <span className="sr-only">{label}</span>
      </span>
    </>
  );

  const facadeClass =
    "group absolute inset-0 block w-full text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-feed-gold";

  if (opensElsewhere) {
    return (
      <a href={item.src} target="_blank" rel="noopener noreferrer" className={facadeClass}>
        {facadeContent}
      </a>
    );
  }

  return (
    <button type="button" onClick={onPlay} className={facadeClass}>
      {facadeContent}
    </button>
  );
}
