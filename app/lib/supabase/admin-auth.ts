import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server";
import { isSupabaseConfigured } from "./env";

export type AdminCheck =
  | { status: "not_configured" }
  | { status: "signed_out" }
  | { status: "forbidden"; user: User }
  | { status: "ok"; user: User; supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> };

// getUser() re-validates the session with Supabase Auth on every call (unlike
// getSession(), which trusts the cookie). Admin status comes from the
// allowlist table, which RLS only lets a user read for themselves.
export async function checkAdmin(): Promise<AdminCheck> {
  if (!isSupabaseConfigured) return { status: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "signed_out" };

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return { status: "forbidden", user };
  return { status: "ok", user, supabase };
}

/** For admin pages: returns an authorised client or redirects to sign-in. */
export async function requireAdmin() {
  const check = await checkAdmin();
  if (check.status !== "ok") redirect("/admin/login");
  return check;
}
