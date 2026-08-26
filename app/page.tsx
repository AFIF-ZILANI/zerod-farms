import Image from "next/image";
import type { ReactNode } from "react";
import { SectionDivider } from "./components/SectionDivider";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { SectionHeader } from "./components/SectionHeader";
import { Nav } from "./components/Nav";
import { AnimateOnScroll } from "./components/AnimateOnScroll";
import {
  SITE,
  NAV_LINKS,
  PRODUCTION_CARDS,
  STATS,
  FARM_LEAD,
  FARM_MISSION,
  FARM_FACTS,
  FARM_TOOLS,
  TIMELINE,
  DATASET_COPY,
  CONTACT_LINKS,
} from "./lib/constants";

function PhoneIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-barind-rust"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShedIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M3 21h18" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 3 3 5-6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

const ICONS: Record<string, ReactNode> = {
  phone: <PhoneIcon />,
  whatsapp: <WhatsAppIcon />,
  email: <EmailIcon />,
};

const PRODUCTION_ICONS: Record<string, ReactNode> = {
  shed: <ShedIcon />,
  chart: <ChartIcon />,
  truck: <TruckIcon />,
};

const GALLERY_IMAGES = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Brown Pakistani Sonali Classic chickens feeding inside a shed at ZeroD Farms",
    caption: "Sonali Classic hens at feed",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Close-up of healthy poultry birds in natural light",
    caption: "Under natural light",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Colorful rooster on the farm premises",
    caption: "On the farm premises",
  },
] as const;

export default function Home() {
  return (
    <>
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-barind-rust focus:text-ivory-shell focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" className="flex-1">
        {/* Hero */}
        <section id="hero" className="relative h-screen min-h-140 max-h-220">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/hero.webp"
              alt="Interior of a modern poultry farm shed with feeding systems"
              fill
              className="object-cover contrast-110 brightness-[0.55]"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-r from-ink-black/90 via-ink-black/55 to-ink-black/20" />
            <div className="absolute inset-0 bg-linear-to-t from-ink-black/80 via-ink-black/10 to-transparent" />
          </div>

          <div className="relative h-full max-w-content mx-auto px-6 flex flex-col justify-end pb-20 md:pb-28">
            <AnimateOnScroll>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-feed-gold" aria-hidden="true" />
                <span className="font-mono text-caption text-ivory-shell/75 uppercase tracking-[0.2em]">
                  Est. 2019 — Naogaon, Bangladesh
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-bold text-ivory-shell tracking-tight leading-[1.02] text-display-l sm:text-display-xl md:text-[4.25rem] lg:text-[4.75rem] max-w-[17ch] mb-6">
                Poultry raised right,{" "}
                <span className="text-feed-gold">
                  tracked to the last bird.
                </span>
              </h1>

              {/* Subhead */}
              <p className="font-body text-body-l text-ivory-shell/80 leading-relaxed max-w-xl mb-8">
                A family-run poultry farm in Mahadebpur, Naogaon, raising
                Pakistani Sonali Classic birds — five sheds, 10,000-bird
                capacity, every batch logged from day-old chick to market
                weight.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Button href={`tel:${SITE.phone}`} variant="primary">
                  Call the farm
                </Button>
                <a
                  href="#production"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 min-h-11 rounded-lg border border-ivory-shell/30 text-ivory-shell font-body text-body-m hover:bg-ivory-shell hover:text-ink-black hover:border-ivory-shell transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory-shell"
                >
                  See how we work
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-y-0.5"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Stats — the farm at a glance, in the site's data voice */}
        <section
          aria-label="Farm at a glance"
          className="bg-paper-white border-y border-steel-mesh/20"
        >
          <div className="max-w-content mx-auto px-6 py-10 md:py-14">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse items-center gap-2 text-center md:border-l md:border-steel-mesh/15 md:first:border-l-0"
                >
                  <dt className="font-mono text-caption text-steel-mesh uppercase tracking-widest">
                    {stat.label}
                  </dt>
                  <dd className="font-mono text-display-m md:text-display-l text-ink-black tabular-nums leading-none">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Production */}
        <section id="production" className="section-padding px-6">
          <div className="max-w-content mx-auto">
            <AnimateOnScroll>
              <SectionHeader
                eyebrow="What we do"
                title="Poultry, raised and recorded."
                className="mb-4"
              />
              <p className="font-body text-body-l text-steel-mesh max-w-xl mb-12">
                One flock, three jobs done well — reared in controlled sheds,
                measured every day, and delivered straight to local buyers.
              </p>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {PRODUCTION_CARDS.map((card, i) => (
                <AnimateOnScroll
                  key={card.title}
                  delay={i * 60}
                  className="h-full"
                >
                  <Card
                    title={card.title}
                    description={card.description}
                    icon={PRODUCTION_ICONS[card.icon]}
                    spec={card.spec}
                    className="h-full"
                  />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Gallery */}
        <section id="gallery" className="section-padding px-6">
          <div className="max-w-content mx-auto">
            <AnimateOnScroll>
              <SectionHeader
                eyebrow="From the farm"
                title="Inside the sheds."
                className="mb-12"
              />
            </AnimateOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {GALLERY_IMAGES.map((img, i) => (
                <AnimateOnScroll key={img.src} delay={i * 60}>
                  <figure>
                    <div
                      className="relative overflow-hidden rounded-lg"
                      style={{ aspectRatio: "4/5" }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover grayscale contrast-110 hover:grayscale-0 hover:contrast-100 transition-all duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="mt-3 flex items-center gap-2 font-mono text-caption text-steel-mesh uppercase tracking-widest">
                      <span
                        className="h-px w-4 bg-barind-rust"
                        aria-hidden="true"
                      />
                      {img.caption}
                    </figcaption>
                  </figure>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Our Farm */}
        <section id="farm" className="section-padding px-6">
          <div className="max-w-content mx-auto">
            <AnimateOnScroll>
              <SectionHeader
                eyebrow="About us"
                title="A family farm, run like a system."
                className="mb-12"
              />
            </AnimateOnScroll>

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Story + what we're building */}
              <div className="lg:col-span-7">
                <AnimateOnScroll>
                  <p className="font-body text-body-l text-ink-black leading-relaxed">
                    {FARM_LEAD}
                  </p>
                  <p className="font-body text-body-m text-steel-mesh leading-relaxed mt-5 max-w-prose">
                    {FARM_MISSION}
                  </p>
                </AnimateOnScroll>

                <AnimateOnScroll delay={80}>
                  <div className="mt-10">
                    <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-5">
                      Building in-house
                    </p>
                    <ul className="grid gap-6 sm:grid-cols-3">
                      {FARM_TOOLS.map((tool) => (
                        <li
                          key={tool.name}
                          className="border-t-2 border-barind-rust/40 pt-4"
                        >
                          <span className="block font-body font-medium text-body-m text-ink-black">
                            {tool.name}
                          </span>
                          <span className="block font-body text-body-m text-steel-mesh mt-1">
                            {tool.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Field record — the farm as a spec sheet */}
              <div className="lg:col-span-5">
                <AnimateOnScroll delay={120}>
                  <div className="rounded-lg border border-steel-mesh/25 bg-paper-white p-6 sm:p-8">
                    <div className="flex gap-1.5 mb-6" aria-hidden="true">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i} className="w-0.5 h-2.5 bg-barind-rust" />
                      ))}
                    </div>
                    <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-4">
                      Field record
                    </p>
                    <dl className="divide-y divide-steel-mesh/15">
                      {FARM_FACTS.map((fact) => (
                        <div
                          key={fact.label}
                          className="flex items-baseline justify-between gap-4 py-3"
                        >
                          <dt className="font-mono text-caption text-steel-mesh uppercase tracking-wider">
                            {fact.label}
                          </dt>
                          <dd className="font-mono text-body-m text-ink-black tabular-nums text-right">
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Timeline */}
        <section id="timeline" className="section-padding px-6">
          <div className="max-w-content mx-auto">
            <AnimateOnScroll>
              <SectionHeader
                eyebrow="Our journey"
                title="From one shed to five."
                className="mb-12"
              />
            </AnimateOnScroll>
            <div className="relative border-l-2 border-barind-rust/30 ml-2 space-y-12">
              {TIMELINE.map((item, i) => (
                <AnimateOnScroll key={item.year} delay={i * 60}>
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-barind-rust rounded-full -translate-x-1.75 ring-4 ring-ivory-shell" />
                    <span className="font-mono text-display-m text-barind-rust tabular-nums leading-none">
                      {item.year}
                    </span>
                    <p className="font-body text-body-l text-ink-black/80 mt-3 max-w-md">
                      {item.event}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Vision */}
        <section id="vision" className="section-padding px-6">
          <div className="max-w-content mx-auto text-center">
            <AnimateOnScroll>
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="h-px w-8 bg-barind-rust" aria-hidden="true" />
                <span className="font-mono text-caption text-steel-mesh uppercase tracking-[0.2em]">
                  Our vision
                </span>
                <span className="h-px w-8 bg-barind-rust" aria-hidden="true" />
              </div>
              <blockquote className="font-display font-semibold italic text-ink-black leading-[1.1] text-display-l sm:text-display-xl max-w-[16ch] mx-auto text-balance">
                &ldquo;{SITE.tagline}&rdquo;
              </blockquote>
              <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mt-8">
                The goal since day one — 31 December 2019
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        <SectionDivider />

        {/* Dataset */}
        <section
          id="dataset"
          className="section-padding px-6 bg-paper-white border-y border-steel-mesh/20"
        >
          <div className="max-w-content mx-auto text-center">
            <AnimateOnScroll>
              <p className="font-mono text-caption text-feed-gold uppercase tracking-widest mb-4">
                Beyond the farm
              </p>
              <h2 className="font-display text-display-l font-semibold text-ink-black mb-6">
                Global Poultry Dataset
              </h2>
              <p className="font-body text-body-m text-steel-mesh max-w-150 mx-auto mb-8">
                {DATASET_COPY}
              </p>
              <span className="inline-flex items-center px-6 py-3 border border-feed-gold text-feed-gold rounded-lg font-mono text-caption uppercase tracking-widest">
                Coming soon
              </span>
            </AnimateOnScroll>
          </div>
        </section>

        <SectionDivider />

        {/* Contact */}
        <section id="contact" className="bg-ink-black text-ivory-shell">
          <div className="section-padding px-6">
            <div className="max-w-content mx-auto">
              {/* Header */}
              <AnimateOnScroll>
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-8 bg-feed-gold" aria-hidden="true" />
                  <span className="font-mono text-caption text-feed-gold uppercase tracking-[0.2em]">
                    Get in touch
                  </span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 md:items-end mb-14 md:mb-20">
                  <h2 className="font-display text-display-l md:text-[3rem] font-bold text-ivory-shell leading-[1.05] max-w-[13ch]">
                    Reach the farm directly.
                  </h2>
                  <p className="font-body text-body-m text-ivory-shell/70 leading-relaxed max-w-md md:justify-self-end">
                    Orders, wholesale, or a visit to the sheds — you&rsquo;ll be
                    talking to the family who runs ZeroD Farms, not a call
                    center.
                  </p>
                </div>
              </AnimateOnScroll>

              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Direct lines — a dispatch register */}
                <div className="lg:col-span-7">
                  <AnimateOnScroll>
                    <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-2">
                      Direct lines
                    </p>
                  </AnimateOnScroll>
                  <div className="border-t border-steel-mesh/20">
                    {CONTACT_LINKS.map((link, i) => (
                      <AnimateOnScroll key={link.label} delay={i * 60}>
                        <a
                          href={link.href}
                          {...(link.icon !== "phone"
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="group flex items-center gap-4 sm:gap-6 border-b border-steel-mesh/20 py-5 sm:py-6 -mx-3 px-3 rounded-md hover:bg-ivory-shell/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-feed-gold"
                        >
                          <span className="text-barind-rust group-hover:text-feed-gold transition-colors [&_svg]:h-5 [&_svg]:w-5">
                            {ICONS[link.icon]}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-mono text-caption uppercase tracking-widest text-steel-mesh group-hover:text-ivory-shell transition-colors mb-1">
                              {link.label}
                            </span>
                            <span className="block font-mono text-body-l text-ivory-shell tabular-nums truncate">
                              {link.value}
                            </span>
                          </span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="shrink-0 text-steel-mesh group-hover:text-feed-gold transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          >
                            <path d="M7 17 17 7M7 7h10v10" />
                          </svg>
                        </a>
                      </AnimateOnScroll>
                    ))}
                  </div>
                </div>

                {/* Location plate */}
                <div className="lg:col-span-5">
                  <AnimateOnScroll>
                    <div className="rounded-lg border border-steel-mesh/25 bg-ivory-shell/[0.02] p-8">
                      <div className="flex gap-1.5 mb-6" aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <span
                            key={i}
                            className="w-0.5 h-2.5 bg-feed-gold/80"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPinIcon />
                        <span className="font-mono text-caption text-feed-gold uppercase tracking-widest">
                          Visit the farm
                        </span>
                      </div>
                      <address className="not-italic font-body text-body-l text-ivory-shell/90 leading-relaxed">
                        {SITE.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                      <p className="font-mono text-caption text-steel-mesh leading-relaxed mt-5 pt-5 border-t border-steel-mesh/20">
                        Call ahead so we can meet you at the gate.
                      </p>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll delay={80}>
                    <dl className="grid grid-cols-2 gap-6 mt-6">
                      <div>
                        <dt className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-1">
                          Proprietor
                        </dt>
                        <dd className="font-display text-body-l text-ivory-shell">
                          {SITE.founder}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-1">
                          Established
                        </dt>
                        <dd className="font-display text-body-l text-ivory-shell tabular-nums">
                          {SITE.established}
                        </dd>
                      </div>
                    </dl>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </>
  );
}
