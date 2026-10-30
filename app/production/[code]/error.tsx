"use client";

import Link from "next/link";
import { SITE } from "../../lib/constants";

export default function BatchError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="flex-1 px-6 pt-28 pb-24">
      <div className="max-w-xl mx-auto">
        <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-3">Temporarily unavailable</p>
        <h1 className="font-display text-display-l font-semibold text-ink-black leading-tight">
          We couldn&rsquo;t load this batch right now.
        </h1>
        <p className="font-body text-body-l text-steel-mesh mt-4">
          Please try again in a moment, or call the farm on{" "}
          <a href={`tel:${SITE.phone}`} className="text-ink-black underline underline-offset-4 tabular-nums">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-3 min-h-11 rounded-lg bg-barind-rust text-ivory-shell font-body font-medium text-body-m hover:bg-barind-rust/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 min-h-11 rounded-lg border border-ink-black text-ink-black font-body font-medium text-body-m hover:bg-ink-black hover:text-ivory-shell transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
