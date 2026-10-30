import Link from "next/link";
import { requireAdmin } from "../../../lib/supabase/admin-auth";
import { AdminShell } from "../_components/AdminShell";
import { BatchForm } from "../_components/BatchForm";
import { createBatch } from "../actions";

export default async function NewBatchPage() {
  const { user } = await requireAdmin();

  return (
    <AdminShell email={user.email}>
      <Link href="/admin/production" className="font-mono text-caption uppercase tracking-wider text-steel-mesh hover:text-ink-black">
        ← All batches
      </Link>
      <div className="mt-3 mb-8">
        <h1 className="font-display text-display-l font-semibold text-ink-black leading-tight">New batch</h1>
        <p className="font-body text-body-m text-steel-mesh mt-2 max-w-xl">
          New batches are saved as drafts. Add videos and photos on the next screen, then publish when
          you&rsquo;re ready for buyers to see it.
        </p>
      </div>
      <div className="max-w-3xl">
        <BatchForm action={createBatch} submitLabel="Create draft" />
      </div>
    </AdminShell>
  );
}
