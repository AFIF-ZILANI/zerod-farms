import Link from "next/link";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { SITE } from "../../lib/constants";
import { whatsappLink } from "../../lib/production/format";

// Shared links outlive batches: when one sells out or is withdrawn, point the
// buyer to what's available now instead of a dead end.
export default function BatchNotFound() {
  return (
    <>
      <Nav solid />
      <main id="main" className="flex-1 px-6 pt-28 pb-24">
        <div className="max-w-content mx-auto">
          <div className="max-w-xl">
            <div className="flex gap-1.5 mb-6" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="w-0.5 h-2.5 bg-barind-rust" />
              ))}
            </div>
            <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-3">Batch not listed</p>
            <h1 className="font-display text-display-l font-semibold text-ink-black leading-tight">
              This batch is no longer listed.
            </h1>
            <p className="font-body text-body-l text-steel-mesh mt-4">
              It may have sold out or been withdrawn. See what&rsquo;s available now, or ask the farm about the
              next batch.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/#production"
                className="inline-flex items-center justify-center px-5 py-3 min-h-11 rounded-lg bg-barind-rust text-ivory-shell font-body font-medium text-body-m hover:bg-barind-rust/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust"
              >
                See current availability
              </Link>
              <a
                href={whatsappLink("Hello ZeroD Farms, I am a wholesale buyer. Please let me know which batches are currently available.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 min-h-11 rounded-lg border border-ink-black text-ink-black font-body font-medium text-body-m hover:bg-ink-black hover:text-ivory-shell transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-black"
              >
                WhatsApp {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
