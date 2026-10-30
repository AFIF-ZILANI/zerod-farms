import { BATCH_STATUSES, type BatchStatus } from "../../lib/production/types";

export interface ActionState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
  /** Id of a row the action created (e.g. new media), for follow-up steps. */
  id?: string;
}

export interface BatchInput {
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
  display_order: number;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const BATCH_CODE_RE = /^[A-Za-z0-9][A-Za-z0-9-]{1,31}$/;

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

export function parseBatchForm(form: FormData):
  | { ok: true; data: BatchInput }
  | { ok: false; fieldErrors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const int = (key: string, { min = 0 } = {}): number | null => {
    const raw = text(form, key);
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < min) {
      errors[key] = min > 0 ? `Enter a whole number of at least ${min}.` : "Enter a whole number (0 or more).";
      return null;
    }
    return n;
  };

  const kg = (key: string): number | null => {
    const raw = text(form, key);
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0 || n >= 1000) {
      errors[key] = "Enter a weight in kg, e.g. 1.2";
      return null;
    }
    return Math.round(n * 100) / 100;
  };

  const date = (key: string): string | null => {
    const raw = text(form, key);
    if (!raw) return null;
    if (!DATE_RE.test(raw) || Number.isNaN(Date.parse(raw))) {
      errors[key] = "Enter a valid date.";
      return null;
    }
    return raw;
  };

  const batch_code = text(form, "batch_code").toUpperCase();
  if (!BATCH_CODE_RE.test(batch_code)) {
    errors.batch_code = "2–32 characters: letters, numbers and dashes (e.g. ZD-2026-11).";
  }

  const title = text(form, "title");
  if (!title) errors.title = "Give the batch a short title.";
  else if (title.length > 120) errors.title = "Keep the title under 120 characters.";

  const breed = text(form, "breed");
  if (!breed) errors.breed = "Breed is required.";
  else if (breed.length > 80) errors.breed = "Keep the breed under 80 characters.";

  const statusRaw = text(form, "status");
  const status = (BATCH_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as BatchStatus)
    : null;
  if (!status) errors.status = "Choose a status.";

  const description = text(form, "description");
  if (description.length > 2000) errors.description = "Keep the description under 2,000 characters.";

  const total_birds = int("total_birds");
  const available_birds = int("available_birds");
  const minimum_order_quantity = int("minimum_order_quantity", { min: 1 });
  const average_weight_min_kg = kg("average_weight_min_kg");
  const average_weight_max_kg = kg("average_weight_max_kg");
  const estimated_available_date = date("estimated_available_date");
  const sale_window_start = date("sale_window_start");
  const sale_window_end = date("sale_window_end");

  const orderRaw = text(form, "display_order");
  const display_order = orderRaw ? Number(orderRaw) : 0;
  if (!Number.isInteger(display_order)) errors.display_order = "Enter a whole number.";

  if (total_birds != null && available_birds != null && available_birds > total_birds) {
    errors.available_birds = "Can't be more than the total birds in the batch.";
  }
  if (average_weight_min_kg != null && average_weight_max_kg != null && average_weight_min_kg > average_weight_max_kg) {
    errors.average_weight_max_kg = "Maximum must be at least the minimum.";
  }
  if (sale_window_start && sale_window_end && sale_window_start > sale_window_end) {
    errors.sale_window_end = "End date must be on or after the start date.";
  }

  const show_quantity = form.get("show_quantity") === "on";
  if (show_quantity && available_birds == null) {
    errors.available_birds = "Enter a quantity, or turn off public quantity.";
  }

  if (Object.keys(errors).length > 0 || !status) return { ok: false, fieldErrors: errors };

  return {
    ok: true,
    data: {
      batch_code,
      title,
      breed,
      status,
      description: description || null,
      total_birds,
      available_birds,
      show_quantity,
      minimum_order_quantity,
      average_weight_min_kg,
      average_weight_max_kg,
      estimated_available_date,
      sale_window_start,
      sale_window_end,
      display_order,
    },
  };
}

// Turns Postgres/PostgREST errors into something an admin can act on.
export function describeDbError(error: { code?: string; message: string }): ActionState {
  if (error.code === "23505" && error.message.includes("batch_code")) {
    return { fieldErrors: { batch_code: "Another batch already uses this code." } };
  }
  if (error.code === "23505" && error.message.includes("one_primary")) {
    return { error: "This batch already has a primary item of that type." };
  }
  if (error.code === "23514") {
    return { error: `The database rejected these values (${error.message}).` };
  }
  if (error.code === "42501" || error.code === "PGRST301") {
    return { error: "You don't have permission to do that. Sign in again as an administrator." };
  }
  return { error: `Something went wrong: ${error.message}` };
}
