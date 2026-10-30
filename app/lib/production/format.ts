import { SITE, SITE_URL } from "../constants";

export const FARM_TIME_ZONE = "Asia/Dhaka";

/** Today's calendar date at the farm, as YYYY-MM-DD. */
export function todayInDhaka(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FARM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// `date` columns are plain calendar dates — format them without any timezone
// shift so 5 Nov stays 5 Nov everywhere.
export function formatDate(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** A timestamp (e.g. updated_at) shown in farm time. */
export function formatTimestamp(value: string, withTime = false): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: FARM_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
  }).format(new Date(value));
}

export function formatDateRange(start: string | null, end: string | null): string | null {
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  if (start) return `From ${formatDate(start)}`;
  if (end) return `Until ${formatDate(end)}`;
  return null;
}

export function formatWeightRange(min: number | null, max: number | null): string | null {
  const kg = (n: number) => `${Number(n).toFixed(2).replace(/\.?0+$/, "")} kg`;
  if (min != null && max != null) {
    return min === max ? kg(min) : `${kg(min).replace(" kg", "")}–${kg(max)}`;
  }
  if (min != null) return `From ${kg(min)}`;
  if (max != null) return `Up to ${kg(max)}`;
  return null;
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** True once a sale window's last day has passed in farm time. */
export function isWindowExpired(end: string | null, today = todayInDhaka()): boolean {
  return end != null && end < today;
}

export function batchEnquiryMessage(batchCode: string, title?: string): string {
  const label = title ? `Batch ${batchCode} (${title})` : `Batch ${batchCode}`;
  return `Hello ZeroD Farms, I am interested in the wholesale availability of ${label}. Please share the current availability and purchasing details.`;
}

/** wa.me link with a pre-filled message — works in the app on mobile and WhatsApp Web on desktop. */
export function whatsappLink(message: string): string {
  return `${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Permanent, shareable path of a batch page. Codes are stored uppercase. */
export function batchPath(batchCode: string): string {
  return `/production/${encodeURIComponent(batchCode.toUpperCase())}`;
}

export function batchUrl(batchCode: string): string {
  return `${SITE_URL}${batchPath(batchCode)}`;
}

export function availabilityLabel(status: "upcoming" | "available"): string {
  return status === "available" ? "Available for Sale" : "Upcoming Wholesale Sale (estimated)";
}

/** The message buyers receive when a batch is shared (WhatsApp / native share). */
export function batchShareMessage(batch: {
  batchCode: string;
  breed: string;
  status: "upcoming" | "available";
}): string {
  return [
    "ZeroD Farms – Wholesale Production Update",
    `Batch: ${batch.batchCode}`,
    `Breed: ${batch.breed}`,
    `Availability: ${availabilityLabel(batch.status)}`,
    "",
    "Watch our actual farm production videos and view batch details:",
    batchUrl(batch.batchCode),
    "",
    "For wholesale purchasing enquiries, contact ZeroD Farms directly.",
  ].join("\n");
}

/** WhatsApp share without a fixed recipient — the sender picks the chat. */
export function whatsappShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
