import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { BatchDetail } from "../../components/production/BatchDetail";
import { getPublicBatch, listPublicBatchCodes } from "../../lib/production/queries";
import { availabilityLabel, batchPath, formatWeightRange } from "../../lib/production/format";
import { videoJsonLd } from "../../lib/production/seo";
import { SITE, SITE_URL } from "../../lib/constants";

// Same freshness as the homepage; admin changes also revalidate on demand.
export const revalidate = 60;

// Pre-render the batches that exist at build time; newer ones render on first
// visit and are cached the same way.
export async function generateStaticParams() {
  const batches = await listPublicBatchCodes();
  return batches.map((b) => ({ code: b.batchCode }));
}

// Deduped between generateMetadata and the page within one render.
const loadBatch = cache(async (code: string) => {
  const result = await getPublicBatch(code);
  // Let a transient database error surface (keeping the last good cached page
  // during revalidation) rather than caching a false "not found".
  if (result.status === "unavailable") throw new Error("Production data is temporarily unavailable.");
  return result.status === "found" ? result.batch : null;
});

export async function generateMetadata({ params }: PageProps<"/production/[code]">): Promise<Metadata> {
  const { code } = await params;
  const batch = await loadBatch(decodeURIComponent(code));
  if (!batch) {
    return { title: "Batch not listed — ZeroD Farms", robots: { index: false } };
  }

  const title = `Batch ${batch.batchCode} — ${batch.title} | ${SITE.name}`;
  const weight = formatWeightRange(batch.weightMinKg, batch.weightMaxKg);
  const description = [
    `${availabilityLabel(batch.status)}: ${batch.breed} live birds, batch ${batch.batchCode}, from ${SITE.name}, ${SITE.locality}.`,
    weight ? `Average live weight ${weight}.` : null,
    batch.videos.length > 0 ? `Watch ${batch.videos.length} real farm video${batch.videos.length > 1 ? "s" : ""}.` : null,
    "Wholesale enquiries by phone, WhatsApp or Imo.",
  ]
    .filter(Boolean)
    .join(" ");

  // Prefer the batch's own footage for link previews (WhatsApp, Facebook…).
  const preview =
    batch.videos.find((v) => v.posterSrc && !v.external)?.posterSrc ??
    batch.images.find((i) => !i.external)?.src ??
    "/images/hero.webp";

  const path = batchPath(batch.batchCode);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `Batch ${batch.batchCode} — ${availabilityLabel(batch.status)}`,
      description,
      siteName: SITE.name,
      images: [{ url: preview, alt: `${batch.breed} birds in batch ${batch.batchCode} at ${SITE.name}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [preview] },
  };
}

export default async function BatchPage({ params }: PageProps<"/production/[code]">) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw);
  // One canonical URL per batch: /production/ZD-2026-11, never lowercase variants.
  if (code !== code.toUpperCase()) permanentRedirect(batchPath(code));

  const batch = await loadBatch(code);
  if (!batch) notFound();

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Production", item: `${SITE_URL}/#production` },
      { "@type": "ListItem", position: 3, name: `Batch ${batch.batchCode}`, item: `${SITE_URL}${batchPath(batch.batchCode)}` },
    ],
  };
  const videos = videoJsonLd([batch]);

  return (
    <>
      <Nav solid />
      <main id="main" className="flex-1">
        <BatchDetail batch={batch} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {videos && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videos) }} />}
    </>
  );
}
