import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/constants";
import { listPublicBatchCodes } from "./lib/production/queries";
import { batchPath } from "./lib/production/format";

// Admin changes revalidate this on demand, so newly published batch pages are
// discoverable without a redeploy; the hourly interval is a safety net.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const batches = await listPublicBatchCodes();
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...batches.map((b) => ({
      url: `${SITE_URL}${batchPath(b.batchCode)}`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
