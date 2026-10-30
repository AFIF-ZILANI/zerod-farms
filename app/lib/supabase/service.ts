import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

// Privileged client, used ONLY by the scheduled media clean-up job. It
// bypasses RLS, so the key must be a server-side env var (never prefixed
// NEXT_PUBLIC_) and this module must never be imported by client code —
// the "server-only" import above makes that a build error.
export function getServiceClient(): SupabaseClient | null {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
