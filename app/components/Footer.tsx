import { NAV_LINKS, SITE } from "../lib/constants";

// Site footer — shared by the homepage and the batch pages.
export function Footer() {
  return (
    <footer className="bg-ink-black border-t border-steel-mesh/15 text-ivory-shell">
      <div className="max-w-content mx-auto px-6 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Identity */}
          <div className="md:col-span-5">
            <span className="font-display text-display-m font-bold text-ivory-shell">
              {SITE.name}
            </span>
            <p className="font-body text-body-m text-ivory-shell/60 leading-relaxed mt-3 max-w-xs">
              {SITE.tagline} A family-run poultry farm in {SITE.locality},
              raising {SITE.breed} birds.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="h-px w-8 bg-feed-gold" aria-hidden="true" />
              <span className="font-mono text-caption text-steel-mesh uppercase tracking-[0.2em]">
                Est. {SITE.established} — Naogaon, Bangladesh
              </span>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="md:col-span-3">
            <h3 className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-body-m text-ivory-shell/80 hover:text-feed-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Reach */}
          <div className="md:col-span-4">
            <h3 className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-4">
              Reach
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${SITE.phone}`}
                  className="font-mono text-body-m text-ivory-shell/80 hover:text-feed-gold transition-colors tabular-nums"
                >
                  {SITE.phoneDisplay}
                </a>
                <span className="block font-mono text-caption text-steel-mesh mt-1">
                  Call · {SITE.messagingApps}
                </span>
                <span className="block font-mono text-caption text-steel-mesh mt-1">
                  Imo ID · <span className="text-ivory-shell/80 select-all">{SITE.imoId}</span>
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-mono text-body-m text-ivory-shell/80 hover:text-feed-gold transition-colors break-all"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="font-body text-body-m text-ivory-shell/60">
                {SITE.locality}
              </li>
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-12 pt-6 border-t border-steel-mesh/15 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-caption text-steel-mesh/70">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights
            reserved.
          </p>
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3 font-mono text-caption text-steel-mesh/70">
            <span>
              Proprietor &middot; {SITE.founder}
            </span>
            <span className="hidden sm:inline text-steel-mesh/30" aria-hidden="true">
              &middot;
            </span>
            <span>
              Part of{" "}
              <a
                href={SITE.parentUrl}
                className="text-ivory-shell/80 hover:text-feed-gold transition-colors underline underline-offset-2 decoration-steel-mesh/30 hover:decoration-feed-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE.parentBrand}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
