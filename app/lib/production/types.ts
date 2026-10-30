export const BATCH_STATUSES = ["upcoming", "available", "sold_out", "archived"] as const;
export type BatchStatus = (typeof BATCH_STATUSES)[number];

export type MediaType = "video" | "image";

// Row shapes as stored (admin side).
export interface BatchRow {
  id: string;
  batch_code: string;
  title: string;
  breed: string;
  status: BatchStatus;
  description: string | null;
  total_birds: number | null;
  available_birds: number | null;
  show_quantity: boolean;
  minimum_order_quantity: number | null;
  average_weight_min_kg: number | null;
  average_weight_max_kg: number | null;
  estimated_available_date: string | null;
  sale_window_start: string | null;
  sale_window_end: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  batch_id: string;
  media_type: MediaType;
  storage_path: string | null;
  external_url: string | null;
  poster_path: string | null;
  caption: string | null;
  recorded_at: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

// Public shapes, as exposed by the public_* views.
export interface PublicMedia {
  id: string;
  type: MediaType;
  /** Playable/viewable URL — a same-origin signed redirect or an external URL. */
  src: string;
  posterSrc: string | null;
  external: boolean;
  caption: string | null;
  recordedAt: string | null;
}

export interface PublicBatch {
  id: string;
  batchCode: string;
  title: string;
  breed: string;
  status: "upcoming" | "available";
  description: string | null;
  availableBirds: number | null;
  minimumOrderQuantity: number | null;
  weightMinKg: number | null;
  weightMaxKg: number | null;
  estimatedAvailableDate: string | null;
  saleWindowStart: string | null;
  saleWindowEnd: string | null;
  updatedAt: string;
  videos: PublicMedia[];
  images: PublicMedia[];
}
