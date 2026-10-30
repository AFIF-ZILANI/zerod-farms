import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicBatch } from "../../lib/production/types";
import { formatTimestamp, todayInDhaka } from "../../lib/production/format";
import { SITE } from "../../lib/constants";
import { BatchSpecs, CallLink, EnquireLink, StatusPill } from "./BatchParts";
import { BatchVideoList } from "./BatchVideoList";
import { ShareBatch } from "./ShareBatch";

interface BatchDetailProps {
  batch: PublicBatch;
  /** Rendered above the page content (used by the admin preview banner). */
  banner?: ReactNode;
}

// The permanent, shareable page for one batch. Shared by the public route and
// the admin preview so what admins check is exactly what buyers get.
export function BatchDetail({ batch, banner }: BatchDetailProps) {
  const today = todayInDhaka();
  const upcoming = batch.status === "upcoming";
  const hasMedia = batch.videos.length + batch.images.length > 0;

  return (
    <article aria-labelledby="batch-title" className="pt-20 md:pt-24 pb-28 md:pb-24 px-6">
      <div className="max-w-content mx-auto">
        {banner}

        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-caption uppercase tracking-widest text-steel-mesh">
            <li>
              <Link href="/" className="hover:text-ink-black transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#production" className="hover:text-ink-black transition-colors">Production</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-black tabular-nums">Batch {batch.batchCode}</li>
          </ol>
        </nav>

        <header className="mb-10 md:mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="h-px w-8 bg-barind-rust" aria-hidden="true" />
              <span className="font-mono text-caption text-steel-mesh uppercase tracking-[0.2em] tabular-nums">
                Batch {batch.batchCode}
              </span>
              <StatusPill status={batch.status} />
            </div>
            <h1 id="batch-title" className="font-display text-display-l md:text-[3rem] font-semibold text-ink-black leading-[1.05] max-w-[22ch]">
              {batch.title}
            </h1>
            <p className="mt-4 font-mono text-caption text-steel-mesh uppercase tracking-widest">
              {batch.breed} · Updated{" "}
              <time dateTime={batch.updatedAt}>{formatTimestamp(batch.updatedAt)}</time>
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end hidden md:block">
            <ShareBatch batchCode={batch.batchCode} breed={batch.breed} status={batch.status} placement="down" />
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            {hasMedia ? (
              <BatchVideoList batchCode={batch.batchCode} breed={batch.breed} videos={batch.videos} images={batch.images} />
            ) : (
              <figure className="m-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-black">
                  <Image
                    src="/images/gallery-1.jpg"
                    alt="Sonali Classic hens at feed inside a ZeroD Farms shed"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover grayscale contrast-110 opacity-80"
                  />
                </div>
                <figcaption className="pt-3 font-mono text-caption text-steel-mesh uppercase tracking-widest">
                  Farm photo · footage of this batch coming soon
                </figcaption>
              </figure>
            )}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4" aria-labelledby="details-title">
            <div className="lg:sticky lg:top-20">
              <div className="rounded-lg border border-steel-mesh/30 bg-paper-white p-5 sm:p-6">
                <div className="flex gap-1.5 mb-5" aria-hidden="true">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="w-0.5 h-2.5 bg-barind-rust" />
                  ))}
                </div>
                <h2 id="details-title" className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-3">
                  Batch record
                </h2>
                <BatchSpecs batch={batch} today={today} />
                {batch.description && (
                  <p className="mt-4 font-body text-body-m text-ink-black/80 whitespace-pre-line">{batch.description}</p>
                )}
                {upcoming && (
                  <p className="mt-4 font-mono text-caption text-steel-mesh">
                    Dates and quantities are estimates and may shift with flock growth. Confirm with the farm.
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <EnquireLink batch={batch} className="w-full" />
                  {/* Side by side where there's room; stacked in the narrow desktop column. */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <CallLink batchCode={batch.batchCode} />
                    <ShareBatch batchCode={batch.batchCode} breed={batch.breed} status={batch.status} block />
                  </div>
                </div>
                <p className="mt-5 pt-4 border-t border-steel-mesh/15 font-mono text-caption text-steel-mesh leading-relaxed">
                  Wholesale only. Prices and terms are agreed directly with the farm — call or WhatsApp{" "}
                  <a href={`tel:${SITE.phone}`} className="text-ink-black underline underline-offset-2 decoration-barind-rust/40 tabular-nums">
                    {SITE.phoneDisplay}
                  </a>
                  .
                </p>
              </div>

              <Link
                href="/#production"
                className="mt-5 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-widest text-steel-mesh hover:text-ink-black transition-colors"
              >
                <span aria-hidden="true">←</span> All current batches
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile action bar — enquiry stays one tap away while watching videos. */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-steel-mesh/20 bg-ivory-shell/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          <EnquireLink batch={batch} className="flex-1 px-3" />
          <ShareBatch batchCode={batch.batchCode} breed={batch.breed} status={batch.status} iconOnly />
        </div>
      </div>
    </article>
  );
}
