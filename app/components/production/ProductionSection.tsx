import { AnimateOnScroll } from "../AnimateOnScroll";
import { SectionHeader } from "../SectionHeader";
import { BatchCard } from "./BatchCard";
import { getPublicProduction } from "../../lib/production/queries";
import { whatsappLink } from "../../lib/production/format";
import type { PublicBatch } from "../../lib/production/types";
import { SITE } from "../../lib/constants";
import { videoJsonLd } from "../../lib/production/seo";

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-steel-mesh/40 bg-paper-white/60 px-6 py-10 sm:px-10 text-center">
      <div className="flex justify-center gap-1.5 mb-5" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="w-0.5 h-2.5 bg-steel-mesh/50" />
        ))}
      </div>
      <p className="font-display text-display-m font-semibold text-ink-black">{title}</p>
      <p className="font-body text-body-m text-steel-mesh mt-2 max-w-md mx-auto">{body}</p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={whatsappLink(
            "Hello ZeroD Farms, I am a wholesale buyer. Please let me know when your next batch of birds will be available."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-3 min-h-11 rounded-lg bg-barind-rust text-ivory-shell font-body font-medium text-body-m hover:bg-barind-rust/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust"
        >
          Ask about the next batch
        </a>
        <a
          href={`tel:${SITE.phone}`}
          className="inline-flex items-center justify-center px-5 py-3 min-h-11 rounded-lg border border-ink-black text-ink-black font-body font-medium text-body-m hover:bg-ink-black hover:text-ivory-shell transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-black"
        >
          Call {SITE.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

function SubsectionHeader({ id, eyebrow, title, intro }: { id: string; eyebrow: string; title: string; intro: string }) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-2 md:items-end">
      <div>
        <p className="font-mono text-caption text-barind-rust uppercase tracking-[0.2em] mb-2">{eyebrow}</p>
        <h3 id={id} className="font-display text-display-m md:text-[2rem] font-semibold text-ink-black leading-tight">
          {title}
        </h3>
      </div>
      <p className="font-body text-body-m text-steel-mesh max-w-md md:justify-self-end">{intro}</p>
    </div>
  );
}

function BatchGrid({ batches }: { batches: PublicBatch[] }) {
  if (batches.length === 1) {
    return (
      <AnimateOnScroll>
        <BatchCard batch={batches[0]} wide />
      </AnimateOnScroll>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {batches.map((batch, i) => (
        <AnimateOnScroll key={batch.id} delay={(i % 2) * 60} className="h-full">
          <BatchCard batch={batch} />
        </AnimateOnScroll>
      ))}
    </div>
  );
}

export async function ProductionSection() {
  const { available, upcoming, error } = await getPublicProduction();
  const jsonLd = videoJsonLd([...available, ...upcoming]);
  const loadFailed = error === "unavailable";

  return (
    <section id="production" aria-labelledby="production-title" className="section-padding px-6">
      <div className="max-w-content mx-auto">
        <AnimateOnScroll>
          <div className="mb-14 md:mb-16 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionHeader eyebrow="Wholesale supply" title="Production & Wholesale Availability" titleId="production-title" />
              <p className="font-body text-body-l text-steel-mesh max-w-xl mt-4">
                Explore our current production, watch real farm videos, and see upcoming wholesale
                supply opportunities from ZeroD Farms.
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest border-l-2 border-barind-rust/40 pl-4 max-w-xs">
                Live birds · wholesale only.
                <br />
                Every sale is agreed directly with the farm — no online orders or listed prices.
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Available for sale */}
        <div aria-labelledby="available-title">
          <AnimateOnScroll>
            <SubsectionHeader
              id="available-title"
              eyebrow="Available for sale"
              title="Ready for wholesale now."
              intro="Batches at market weight and open for wholesale buyers. Watch the footage, then contact us for current numbers and terms."
            />
          </AnimateOnScroll>
          {available.length > 0 ? (
            <BatchGrid batches={available} />
          ) : (
            <AnimateOnScroll>
              <EmptyState
                title={loadFailed ? "Live availability is offline right now." : "No batches open for sale right now."}
                body={
                  loadFailed
                    ? "We couldn't load current stock. Call, WhatsApp or Imo the farm for today's availability."
                    : "The current flock is still growing. See upcoming batches below, or ask us when the next one is ready."
                }
              />
            </AnimateOnScroll>
          )}
        </div>

        {/* Upcoming sales */}
        <div id="upcoming" aria-labelledby="upcoming-title" className="mt-20 md:mt-24">
          <AnimateOnScroll>
            <SubsectionHeader
              id="upcoming-title"
              eyebrow="Being raised now"
              title="Upcoming Wholesale Sales"
              intro="Batches currently in our sheds. Dates and quantities are estimates until a batch reaches market weight — talk to us early to plan your supply."
            />
          </AnimateOnScroll>
          {upcoming.length > 0 ? (
            <BatchGrid batches={upcoming} />
          ) : (
            <AnimateOnScroll>
              <EmptyState
                title="No upcoming batches published yet."
                body="New placements are listed here once they're in the sheds. Contact the farm to hear about the next cycle first."
              />
            </AnimateOnScroll>
          )}
        </div>

        {available.length + upcoming.length > 0 && (
          <AnimateOnScroll>
            <p className="mt-12 font-mono text-caption text-steel-mesh text-center">
              Buying for a trading business?{" "}
              <a
                href={whatsappLink(
                  "Hello ZeroD Farms, I am a wholesale buyer. Please share your upcoming batch schedule and purchasing details."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-black underline underline-offset-4 decoration-barind-rust/40 hover:text-barind-rust hover:decoration-barind-rust transition-colors"
              >
                Ask for the full supply schedule
              </a>
              .
            </p>
          </AnimateOnScroll>
        )}

        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
      </div>
    </section>
  );
}
