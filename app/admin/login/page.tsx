import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { checkAdmin } from "../../lib/supabase/admin-auth";
import { signOut } from "../actions";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  const check = await checkAdmin();
  if (check.status === "ok") redirect("/admin/production");

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex mb-10" aria-label="ZeroD Farms — home">
          <Image src="/zerod-farms-logo.svg" alt="ZeroD Farms" width={130} height={36} />
        </Link>

        <div className="rounded-lg border border-steel-mesh/25 bg-paper-white p-6 sm:p-8">
          <div className="flex gap-1.5 mb-6" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="w-0.5 h-2.5 bg-barind-rust" />
            ))}
          </div>
          <p className="font-mono text-caption text-steel-mesh uppercase tracking-widest mb-2">
            Production admin
          </p>
          <h1 className="font-display text-display-m font-semibold text-ink-black mb-6">Sign in</h1>

          {check.status === "not_configured" && (
            <p role="alert" className="rounded-md border border-barind-rust/40 bg-barind-rust/5 p-3 font-body text-body-m text-ink-black">
              Supabase isn&rsquo;t configured. Set <code className="font-mono text-caption">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono text-caption">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>.
            </p>
          )}

          {check.status === "forbidden" && (
            <div role="alert" className="mb-6 rounded-md border border-barind-rust/40 bg-barind-rust/5 p-3">
              <p className="font-body text-body-m text-ink-black">
                <strong className="font-medium">{check.user.email}</strong> is not an authorised
                administrator.
              </p>
              <form action={signOut} className="mt-3">
                <button type="submit" className="font-mono text-caption uppercase tracking-widest text-barind-rust underline underline-offset-4">
                  Sign out
                </button>
              </form>
            </div>
          )}

          {check.status === "signed_out" && <LoginForm />}
        </div>

        <p className="mt-6 font-mono text-caption text-steel-mesh">
          Access is by invitation only. Ask the farm owner to add your account.
        </p>
      </div>
    </main>
  );
}
