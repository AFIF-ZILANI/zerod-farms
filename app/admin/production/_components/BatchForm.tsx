"use client";

import { startTransition, useActionState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import type { BatchRow } from "../../../lib/production/types";
import type { ActionState } from "../validation";
import { SITE } from "../../../lib/constants";
import {
  errorTextClass,
  hintClass,
  inputClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./ui";

interface BatchFormProps {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  batch?: BatchRow;
  submitLabel: string;
}

function Field({
  name,
  label,
  hint,
  error,
  children,
  className = "",
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className={errorTextClass}>
          {error}
        </p>
      ) : (
        hint && <p className={hintClass}>{hint}</p>
      )}
    </div>
  );
}

function Fieldset({ legend, description, children }: { legend: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className={`${panelClass} p-5 sm:p-6`}>
      <legend className="sr-only">{legend}</legend>
      <p className="font-display text-body-l font-semibold text-ink-black" aria-hidden="true">
        {legend}
      </p>
      {description && <p className="font-body text-caption text-steel-mesh mt-1">{description}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function BatchForm({ action, batch, submitLabel }: BatchFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const fe = state.fieldErrors ?? {};

  const props = (name: keyof BatchRow) => ({
    id: name,
    name,
    "aria-invalid": fe[name] ? true : undefined,
    "aria-describedby": fe[name] ? `${name}-error` : undefined,
    disabled: pending,
  });

  const val = (v: string | number | null | undefined) => (v == null ? "" : String(v));

  // Submit manually rather than via the form `action` prop: React resets
  // uncontrolled fields after an action, which would wipe the admin's input
  // whenever validation fails.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {state.error && (
        <p role="alert" className="rounded-md border border-barind-rust/50 bg-barind-rust/5 px-4 py-3 font-body text-body-m text-ink-black">
          {state.error}
        </p>
      )}
      {state.ok && state.message && (
        <p role="status" className="rounded-md border border-feed-gold/70 bg-feed-gold/10 px-4 py-3 font-body text-body-m text-ink-black">
          {state.message}
        </p>
      )}

      <Fieldset legend="Batch details" description="What buyers see first on the card.">
        <Field name="batch_code" label="Batch code" hint="Unique, e.g. ZD-2026-11. It becomes the batch link (/production/ZD-2026-11) and is locked while published." error={fe.batch_code}>
          <input {...props("batch_code")} defaultValue={val(batch?.batch_code)} required maxLength={32} className={`${inputClass} font-mono uppercase`} placeholder="ZD-2026-11" />
        </Field>
        <Field name="status" label="Status" error={fe.status} hint="Upcoming = still being raised. Available = ready to sell.">
          <select {...props("status")} defaultValue={batch?.status ?? "upcoming"} className={inputClass}>
            <option value="upcoming">Upcoming</option>
            <option value="available">Available</option>
            <option value="sold_out">Sold out</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field name="title" label="Title" error={fe.title} className="sm:col-span-2">
          <input {...props("title")} defaultValue={val(batch?.title)} required maxLength={120} className={inputClass} placeholder="Shed 3 — November batch" />
        </Field>
        <Field name="breed" label="Breed" error={fe.breed}>
          <input {...props("breed")} defaultValue={batch?.breed ?? SITE.breed} required maxLength={80} className={inputClass} />
        </Field>
        <Field name="display_order" label="Display order" hint="Lower numbers appear first." error={fe.display_order}>
          <input {...props("display_order")} type="number" step={1} defaultValue={val(batch?.display_order ?? 0)} className={inputClass} />
        </Field>
        <Field name="description" label="Short description" hint="Optional. Plain facts — condition, shed, feed." error={fe.description} className="sm:col-span-2">
          <textarea {...props("description")} defaultValue={val(batch?.description)} rows={4} maxLength={2000} className={`${inputClass} min-h-28`} />
        </Field>
      </Fieldset>

      <Fieldset legend="Quantity & weight" description="Leave anything you're not sure of blank — blank fields are hidden on the site.">
        <Field name="total_birds" label="Total birds in batch" hint="Internal only — never shown publicly." error={fe.total_birds}>
          <input {...props("total_birds")} type="number" min={0} step={1} inputMode="numeric" defaultValue={val(batch?.total_birds)} className={inputClass} />
        </Field>
        <Field name="available_birds" label="Available / est. available birds" error={fe.available_birds}>
          <input {...props("available_birds")} type="number" min={0} step={1} inputMode="numeric" defaultValue={val(batch?.available_birds)} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="show_quantity"
              defaultChecked={batch?.show_quantity ?? false}
              disabled={pending}
              className="mt-1 h-5 w-5 accent-barind-rust"
            />
            <span>
              <span className="block font-body text-body-m text-ink-black">Show available quantity on the website</span>
              <span className="block font-body text-caption text-steel-mesh">
                Off by default. When off, the number stays private — even through the public API.
              </span>
            </span>
          </label>
        </div>
        <Field name="minimum_order_quantity" label="Minimum order (birds)" hint="Optional. Shown to buyers when set." error={fe.minimum_order_quantity}>
          <input {...props("minimum_order_quantity")} type="number" min={1} step={1} inputMode="numeric" defaultValue={val(batch?.minimum_order_quantity)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field name="average_weight_min_kg" label="Avg. weight min (kg)" error={fe.average_weight_min_kg}>
            <input {...props("average_weight_min_kg")} type="number" min={0} step={0.01} inputMode="decimal" defaultValue={val(batch?.average_weight_min_kg)} className={inputClass} />
          </Field>
          <Field name="average_weight_max_kg" label="Avg. weight max (kg)" error={fe.average_weight_max_kg}>
            <input {...props("average_weight_max_kg")} type="number" min={0} step={0.01} inputMode="decimal" defaultValue={val(batch?.average_weight_max_kg)} className={inputClass} />
          </Field>
        </div>
      </Fieldset>

      <Fieldset
        legend="Dates"
        description="Bangladesh calendar dates. For upcoming batches these are shown as estimates. An available batch disappears from the site once its sale window ends."
      >
        <Field name="estimated_available_date" label="Estimated available date" hint="For upcoming batches." error={fe.estimated_available_date} className="sm:col-span-2">
          <input {...props("estimated_available_date")} type="date" defaultValue={val(batch?.estimated_available_date)} className={inputClass} />
        </Field>
        <Field name="sale_window_start" label="Sale window start" error={fe.sale_window_start}>
          <input {...props("sale_window_start")} type="date" defaultValue={val(batch?.sale_window_start)} className={inputClass} />
        </Field>
        <Field name="sale_window_end" label="Sale window end" error={fe.sale_window_end}>
          <input {...props("sale_window_end")} type="date" defaultValue={val(batch?.sale_window_end)} className={inputClass} />
        </Field>
      </Fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/admin/production" className={secondaryButtonClass}>
          Cancel
        </Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
