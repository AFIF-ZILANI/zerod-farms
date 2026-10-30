"use client";

import { useState, useTransition } from "react";
import { purgeExpiredVideosNow } from "../actions";
import type { ActionState } from "../validation";
import { ConfirmButton } from "./ConfirmButton";
import { dangerButtonClass } from "./ui";

export function PurgeButton({ count }: { count: number }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <ConfirmButton
        title="Remove expired videos now?"
        body={`${count} uploaded video${count === 1 ? "" : "s"} (and their posters) will be permanently deleted from storage. Photos and external links are kept.`}
        confirmLabel="Delete videos"
        disabled={pending}
        onConfirm={() => startTransition(async () => setResult(await purgeExpiredVideosNow()))}
        className={`${dangerButtonClass} min-h-9 py-1.5`}
      >
        {pending ? "Removing…" : "Remove now"}
      </ConfirmButton>
      {result?.error && <p role="alert" className="font-body text-caption text-barind-rust">{result.error}</p>}
      {result?.ok && <p role="status" className="font-body text-caption text-ink-black">{result.message}</p>}
    </div>
  );
}
