"use client";

import { useState, useTransition } from "react";
import type { BatchRow, BatchStatus } from "../../../lib/production/types";
import { deleteBatch, setBatchPublished, setBatchStatus } from "../actions";
import type { ActionState } from "../validation";
import { ConfirmButton } from "./ConfirmButton";
import { batchFlags, StatusBadges } from "./StatusBadge";
import { dangerButtonClass, panelClass, primaryButtonClass, secondaryButtonClass } from "./ui";

function visibility(batch: BatchRow): { live: boolean; text: string } {
  if (!batch.is_published) return { live: false, text: "Draft — not visible on the website." };
  if (batch.status === "sold_out") return { live: false, text: "Published, but sold-out batches are hidden from the website." };
  if (batch.status === "archived") return { live: false, text: "Published, but archived batches are hidden from the website." };
  if (batchFlags(batch).includes("expired_window")) {
    return { live: false, text: "Published, but hidden — the sale window has ended. Extend it or mark the batch sold out." };
  }
  return {
    live: true,
    text: batch.status === "available" ? "Live under “Available for Sale”." : "Live under “Upcoming Wholesale Sales”.",
  };
}

export function BatchControls({ batch }: { batch: BatchRow }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);

  const run = (fn: () => Promise<ActionState>) =>
    startTransition(async () => {
      setResult(await fn());
    });

  const changeStatus = (status: BatchStatus) => run(() => setBatchStatus(batch.id, status));
  const vis = visibility(batch);

  return (
    <section className={`${panelClass} p-5`} aria-labelledby="publishing-heading" aria-busy={pending}>
      <h2 id="publishing-heading" className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-3">
        Publishing
      </h2>
      <StatusBadges batch={batch} />
      <p className={`mt-3 font-body text-body-m ${vis.live ? "text-ink-black" : "text-steel-mesh"}`}>
        <span
          className={`inline-block h-2 w-2 rounded-full mr-2 align-middle ${vis.live ? "bg-barind-rust" : "bg-steel-mesh/50"}`}
          aria-hidden="true"
        />
        {vis.text}
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {batch.is_published ? (
          <button type="button" disabled={pending} onClick={() => run(() => setBatchPublished(batch.id, false))} className={secondaryButtonClass}>
            Unpublish
          </button>
        ) : (
          <ConfirmButton
            title="Publish this batch?"
            body={<>Batch <strong className="text-ink-black">{batch.batch_code}</strong> and its media will be visible to everyone on the website.</>}
            confirmLabel="Publish"
            tone="primary"
            disabled={pending}
            onConfirm={() => run(() => setBatchPublished(batch.id, true))}
            className={primaryButtonClass}
          >
            Publish to website
          </ConfirmButton>
        )}

        <div className="grid grid-cols-2 gap-2">
          {batch.status !== "available" && (
            <button type="button" disabled={pending} onClick={() => changeStatus("available")} className={secondaryButtonClass}>
              Mark available
            </button>
          )}
          {batch.status !== "upcoming" && (
            <button type="button" disabled={pending} onClick={() => changeStatus("upcoming")} className={secondaryButtonClass}>
              Mark upcoming
            </button>
          )}
          {batch.status !== "sold_out" && (
            <ConfirmButton
              title="Mark as sold out?"
              body="The batch is removed from the website straight away. You can change the status back later."
              confirmLabel="Mark sold out"
              disabled={pending}
              onConfirm={() => changeStatus("sold_out")}
              className={dangerButtonClass}
            >
              Sold out
            </ConfirmButton>
          )}
          {batch.status !== "archived" && (
            <ConfirmButton
              title="Archive this batch?"
              body="Archived batches are hidden from the website but kept, with their media, for your records."
              confirmLabel="Archive"
              disabled={pending}
              onConfirm={() => changeStatus("archived")}
              className={secondaryButtonClass}
            >
              Archive
            </ConfirmButton>
          )}
        </div>
      </div>

      {result?.error && (
        <p role="alert" className="mt-4 font-body text-caption text-barind-rust">{result.error}</p>
      )}
      {result?.ok && result.message && (
        <p role="status" className="mt-4 font-body text-caption text-ink-black">{result.message}</p>
      )}

      <div className="mt-6 pt-4 border-t border-steel-mesh/15">
        <ConfirmButton
          title={`Delete batch ${batch.batch_code}?`}
          body="This permanently deletes the batch and all of its uploaded videos and photos. This can't be undone — archive it instead if you want to keep a record."
          confirmLabel="Delete permanently"
          disabled={pending}
          onConfirm={() => run(() => deleteBatch(batch.id))}
          className="font-mono text-caption uppercase tracking-wider text-barind-rust hover:underline underline-offset-4 disabled:opacity-50"
        >
          Delete batch…
        </ConfirmButton>
      </div>
    </section>
  );
}
