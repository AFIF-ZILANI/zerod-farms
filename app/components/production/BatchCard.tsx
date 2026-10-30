import Link from "next/link";
import type { PublicBatch } from "../../lib/production/types";
import { batchPath, formatTimestamp, todayInDhaka } from "../../lib/production/format";
import { BatchMedia } from "./BatchMedia";
import { BatchSpecs, CallLink, EnquireLink, StatusPill } from "./BatchParts";
import { ShareBatch } from "./ShareBatch";

// `wide` lays media and details side by side — used when a list has a single
// batch, so it doesn't sit in half the grid with an empty column beside it.
export function BatchCard({ batch, wide = false }: { batch: PublicBatch; wide?: boolean }) {
  const upcoming = batch.status === "upcoming";
  const today = todayInDhaka();
  const href = batchPath(batch.batchCode);
  const headingId = `batch-${batch.batchCode}-title`;

  return (
    <article
      id={`batch-${batch.batchCode}`}
      aria-labelledby={headingId}
      className={`flex flex-col h-full rounded-lg border bg-paper-white transition-colors overflow-hidden ${
        wide ? "md:grid md:grid-cols-[1.15fr_1fr]" : ""
      } ${
        upcoming
          ? "border-dashed border-steel-mesh/40 hover:border-steel-mesh/70"
          : "border-steel-mesh/30 hover:border-barind-rust/40"
      }`}
    >
      <BatchMedia
        batchCode={batch.batchCode}
        breed={batch.breed}
        videos={batch.videos}
        images={batch.images}
        wide={wide}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="font-mono text-caption text-steel-mesh uppercase tracking-widest tabular-nums">
            Batch {batch.batchCode}
          </span>
          <StatusPill status={batch.status} />
        </div>

        <h4 id={headingId} className="font-display text-display-m font-semibold text-ink-black leading-tight">
          <Link
            href={href}
            className="hover:text-barind-rust transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust rounded-sm"
          >
            {batch.title}
          </Link>
        </h4>

        {batch.description && (
          <p className="font-body text-body-m text-steel-mesh mt-2 whitespace-pre-line">
            {batch.description}
          </p>
        )}

        <div className="mt-5">
          <BatchSpecs batch={batch} today={today} />
        </div>

        <p className="mt-3 font-mono text-caption text-steel-mesh">
          Updated{" "}
          <time dateTime={batch.updatedAt}>{formatTimestamp(batch.updatedAt)}</time>
          {upcoming && " · dates are estimates and may shift with flock growth"}
        </p>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <EnquireLink batch={batch} className="w-full" />
          <div className="grid grid-cols-2 gap-3">
            <CallLink batchCode={batch.batchCode} />
            <ShareBatch batchCode={batch.batchCode} breed={batch.breed} status={batch.status} block />
          </div>
          <Link
            href={href}
            className="group inline-flex items-center justify-center gap-2 py-2 font-mono text-caption uppercase tracking-widest text-steel-mesh hover:text-ink-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust rounded-sm"
          >
            {batch.videos.length > 1 ? `All ${batch.videos.length} videos & batch details` : "Full batch details"}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
