"use client";

import { useState } from "react";
import { SectionDivider } from "./components/SectionDivider";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { PlaceholderBlock } from "./components/PlaceholderBlock";
import { AnimateOnScroll } from "./components/AnimateOnScroll";
import {
  SITE,
  NAV_LINKS,
  PRODUCTION_CARDS,
  FARM_ABOUT,
  TIMELINE,
  TEAM,
  DATASET_COPY,
  CONTACT_LINKS,
} from "./lib/constants";

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  phone: <PhoneIcon />,
  whatsapp: <WhatsAppIcon />,
  email: <EmailIcon />,
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-ivory-shell/95 backdrop-blur-sm border-b border-steel-mesh/20">
        <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-display text-lg font-bold text-ink-black tracking-tight">
            {SITE.name}
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-data text-caption text-steel-mesh hover:text-ink-black transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 min-w-[44px] min-h-[44px] items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`block w-5 h-0.5 bg-ink-black transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-ink-black transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-ink-black transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-steel-mesh/20 bg-ivory-shell">
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-data text-body-m text-steel-mesh hover:text-ink-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <PlaceholderBlock aspectRatio="16/9" label="PHOTO — 16:9" className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-black/75 to-ink-black/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="font-display text-display-xl font-bold text-ivory-shell mb-4 max-w-2xl">
                {SITE.name}
              </h1>
              <p className="font-body text-body-l text-ivory-shell/90 mb-8">
                Poultry farm in Naogaon, Bangladesh
              </p>
              <Button href={`tel:${SITE.phone}`} variant="primary">
                Call now
              </Button>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Production */}
        <section id="production" className="py-24 px-6 max-w-[1120px] mx-auto">
          <AnimateOnScroll>
            <h2 className="font-display text-display-l font-semibold text-ink-black mb-4">
              Our Production
            </h2>
            <p className="font-data text-caption text-steel-mesh mb-12 uppercase tracking-widest">
              What we do
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTION_CARDS.map((card, i) => (
              <AnimateOnScroll key={card.title} delay={i * 60}>
                <Card title={card.title} description={card.description} />
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Gallery */}
        <section id="gallery" className="py-24 px-6 max-w-[1120px] mx-auto">
          <AnimateOnScroll>
            <h2 className="font-display text-display-l font-semibold text-ink-black mb-4">
              Gallery
            </h2>
            <p className="font-data text-caption text-steel-mesh mb-12 uppercase tracking-widest">
              From the farm
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <PlaceholderBlock aspectRatio="4/5" label={`PHOTO — 4:5`} />
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Our Farm */}
        <section id="farm" className="py-24 px-6 max-w-[1120px] mx-auto">
          <AnimateOnScroll>
            <h2 className="font-display text-display-l font-semibold text-ink-black mb-4">
              Our Farm
            </h2>
            <p className="font-data text-caption text-steel-mesh mb-12 uppercase tracking-widest">
              About us
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="font-body text-body-l text-ink-black leading-relaxed max-w-[480px]">
              {FARM_ABOUT}
            </p>
          </AnimateOnScroll>
        </section>

        <SectionDivider />

        {/* Timeline */}
        <section className="py-24 px-6 max-w-[1120px] mx-auto">
          <AnimateOnScroll>
            <h2 className="font-display text-display-l font-semibold text-ink-black mb-4">
              Timeline
            </h2>
            <p className="font-data text-caption text-steel-mesh mb-12 uppercase tracking-widest">
              Our journey
            </p>
          </AnimateOnScroll>
          <div className="relative border-l-2 border-barind-rust/30 ml-4 space-y-12">
            {TIMELINE.map((item, i) => (
              <AnimateOnScroll key={item.year} delay={i * 60}>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-3 h-3 bg-barind-rust rounded-full -translate-x-[7px]" />
                  <span className="font-data text-caption text-barind-rust uppercase tracking-widest">
                    {item.year}
                  </span>
                  <p className="font-body text-body-m text-ink-black mt-1">
                    {item.event}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Team */}
        <section className="py-24 px-6 max-w-[1120px] mx-auto">
          <AnimateOnScroll>
            <h2 className="font-display text-display-l font-semibold text-ink-black mb-4">
              Our Team
            </h2>
            <p className="font-data text-caption text-steel-mesh mb-12 uppercase tracking-widest">
              The people
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <AnimateOnScroll key={member.name}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-steel-mesh/20 border border-steel-mesh/30 flex items-center justify-center mb-4">
                    <span className="font-display text-display-m text-steel-mesh">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-display text-body-m font-semibold text-ink-black">
                    {member.name}
                  </h3>
                  <p className="font-data text-caption text-steel-mesh">
                    {member.role}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
            {/* Placeholder slots */}
            {[1, 2].map((i) => (
              <AnimateOnScroll key={i} delay={i * 60}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-steel-mesh/10 border border-dashed border-steel-mesh/30 flex items-center justify-center mb-4">
                    <span className="font-data text-xs text-steel-mesh/50">
                      Pending
                    </span>
                  </div>
                  <p className="font-data text-caption text-steel-mesh/50">
                    More team members coming soon
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Vision */}
        <section className="py-24 px-6 max-w-[1120px] mx-auto text-center">
          <AnimateOnScroll>
            <blockquote className="font-display text-display-xl italic text-ink-black">
              &ldquo;{SITE.tagline}&rdquo;
            </blockquote>
          </AnimateOnScroll>
        </section>

        <SectionDivider />

        {/* Dataset */}
        <section className="py-24 px-6 bg-paper-white border-y border-steel-mesh/20">
          <div className="max-w-[1120px] mx-auto text-center">
            <AnimateOnScroll>
              <p className="font-data text-caption text-feed-gold uppercase tracking-widest mb-4">
                Beyond the farm
              </p>
              <h2 className="font-display text-display-l font-semibold text-ink-black mb-6">
                Global Poultry Dataset
              </h2>
              <p className="font-body text-body-m text-steel-mesh max-w-[600px] mx-auto mb-8">
                {DATASET_COPY}
              </p>
              <span className="inline-flex items-center px-6 py-3 border border-feed-gold text-feed-gold rounded-lg font-data text-caption uppercase tracking-widest">
                Coming soon
              </span>
            </AnimateOnScroll>
          </div>
        </section>

        <SectionDivider />

        {/* Contact */}
        <section id="contact" className="relative bg-ink-black text-ivory-shell">
          <div className="py-24 px-6 max-w-[1120px] mx-auto">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <p className="font-data text-caption text-barind-rust uppercase tracking-widest mb-4">
                  Get in touch
                </p>
                <h2 className="font-display text-display-l font-semibold text-ivory-shell">
                  Contact
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {CONTACT_LINKS.map((link, i) => (
                <AnimateOnScroll key={link.label} delay={i * 60}>
                  <a
                    href={link.href}
                    className="group flex flex-col items-center text-center p-8 rounded-lg border border-steel-mesh/20 hover:border-barind-rust/60 transition-all duration-300 min-h-[44px] min-w-[44px]"
                  >
                    <div className="w-14 h-14 rounded-full bg-barind-rust/10 flex items-center justify-center mb-5 group-hover:bg-barind-rust/20 transition-colors">
                      <span className="text-barind-rust">
                        {ICONS[link.icon]}
                      </span>
                    </div>
                    <span className="font-display text-body-l font-semibold text-ivory-shell mb-1">
                      {link.label}
                    </span>
                    <span className="font-data text-caption text-steel-mesh">
                      {link.icon === "phone" && SITE.phone}
                      {link.icon === "whatsapp" && "Chat on WhatsApp"}
                      {link.icon === "email" && SITE.email}
                    </span>
                  </a>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-barind-rust">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="font-data text-caption text-steel-mesh uppercase tracking-widest">
                    Visit us
                  </span>
                </div>
                <address className="not-italic font-body text-body-m text-ivory-shell/80 leading-relaxed max-w-md">
                  {SITE.address}
                </address>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-ink-black border-t border-steel-mesh/10">
        <div className="max-w-[1120px] mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-body-m font-semibold text-ivory-shell">
                {SITE.name}
              </span>
              <span className="text-steel-mesh/40">·</span>
              <span className="font-data text-caption text-steel-mesh">
                Part of{" "}
                <a
                  href={SITE.parentUrl}
                  className="text-ivory-shell/80 hover:text-barind-rust transition-colors underline underline-offset-2 decoration-steel-mesh/30 hover:decoration-barind-rust"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.parentBrand}
                </a>
              </span>
            </div>
            <p className="font-data text-caption text-steel-mesh/60">
              &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
