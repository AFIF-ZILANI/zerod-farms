"use client";

import Image from "next/image";
import type { PublicMedia } from "../../lib/production/types";
import { classifyExternalVideo } from "../../lib/production/video";

export function PlayGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
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
export function VideoStage({ item, label, fallbackPoster, playing, onPlay }: VideoStageProps) {
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
