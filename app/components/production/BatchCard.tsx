import type { PublicBatch } from "../../lib/production/types";
import {
  batchEnquiryMessage,
  formatCount,
  formatDate,
  formatDateRange,
  formatTimestamp,
  formatWeightRange,
  todayInDhaka,
  whatsappLink,
} from "../../lib/production/format";
import { SITE } from "../../lib/constants";
import { BatchMedia } from "./BatchMedia";

function WhatsAppGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

interface Spec {
  label: string;
  value: string;
  note?: string;
}

function buildSpecs(batch: PublicBatch, today: string): Spec[] {
  const upcoming = batch.status === "upcoming";
  const specs: Spec[] = [{ label: "Breed", value: batch.breed }];

  if (batch.availableBirds != null) {
    specs.push({
      label: upcoming ? "Est. birds" : "Available",
      value: `${formatCount(batch.availableBirds)} birds`,
    });
  }

  const weight = formatWeightRange(batch.weightMinKg, batch.weightMaxKg);
  if (weight) specs.push({ label: upcoming ? "Expected weight" : "Avg. live weight", value: weight });

  if (batch.minimumOrderQuantity != null) {
    specs.push({ label: "Minimum order", value: `${formatCount(batch.minimumOrderQuantity)} birds` });
  }

  if (upcoming) {
    if (batch.estimatedAvailableDate) {
      // A past estimate is stale, not a promise — ask buyers to check instead.
      specs.push(
        batch.estimatedAvailableDate >= today
          ? { label: "Est. ready", value: formatDate(batch.estimatedAvailableDate), note: "Estimate" }
          : { label: "Est. ready", value: "Timing being confirmed" }
      );
    }
    const window = formatDateRange(batch.saleWindowStart, batch.saleWindowEnd);
    if (window) specs.push({ label: "Est. sale window", value: window, note: "Estimate" });
  } else {
    const opensLater = batch.saleWindowStart != null && batch.saleWindowStart > today;
    const window = formatDateRange(batch.saleWindowStart, batch.saleWindowEnd);
    if (window) specs.push({ label: opensLater ? "Sale opens" : "Sale window", value: window });
  }

  return specs;
}

// `wide` lays media and details side by side — used when a list has a single
// batch, so it doesn't sit in half the grid with an empty column beside it.
export function BatchCard({ batch, wide = false }: { batch: PublicBatch; wide?: boolean }) {
  const upcoming = batch.status === "upcoming";
  const today = todayInDhaka();
  const specs = buildSpecs(batch, today);
  const enquiry = whatsappLink(batchEnquiryMessage(batch.batchCode, batch.title));
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
          {upcoming ? (
            <span className="inline-flex items-center gap-2 rounded-sm border border-steel-mesh/40 px-2 py-0.5 font-mono text-caption text-steel-mesh uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full border border-steel-mesh" aria-hidden="true" />
              Upcoming · estimated
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-sm bg-barind-rust px-2 py-0.5 font-mono text-caption text-ivory-shell uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-feed-gold" aria-hidden="true" />
              Available now
            </span>
          )}
        </div>

        <h4 id={headingId} className="font-display text-display-m font-semibold text-ink-black leading-tight">
          {batch.title}
        </h4>

        {batch.description && (
          <p className="font-body text-body-m text-steel-mesh mt-2 whitespace-pre-line">
            {batch.description}
          </p>
        )}

        <dl className="mt-5 divide-y divide-steel-mesh/15 border-y border-steel-mesh/15">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="font-mono text-caption text-steel-mesh uppercase tracking-wider">
                {spec.label}
              </dt>
              <dd className="font-mono text-body-m text-ink-black tabular-nums text-right">
                {spec.value}
                {spec.note && (
                  <span className="ml-2 font-mono text-caption text-steel-mesh uppercase tracking-wider">
                    ({spec.note})
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 font-mono text-caption text-steel-mesh">
          Updated{" "}
          <time dateTime={batch.updatedAt}>{formatTimestamp(batch.updatedAt)}</time>
          {upcoming && " · dates are estimates and may shift with flock growth"}
        </p>

        <div className="mt-auto pt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 px-5 py-3 min-h-11 rounded-lg bg-barind-rust text-ivory-shell font-body font-medium text-body-m hover:bg-barind-rust/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust"
          >
            <WhatsAppGlyph />
            Enquire About This Batch
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-11 rounded-lg border border-ink-black text-ink-black font-body font-medium text-body-m hover:bg-ink-black hover:text-ivory-shell transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-black"
            aria-label={`Call the farm about batch ${batch.batchCode}`}
          >
            <PhoneGlyph />
            Call the Farm
          </a>
        </div>
      </div>
    </article>
  );
}
