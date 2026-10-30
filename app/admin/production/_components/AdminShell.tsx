import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "../../actions";

interface AdminShellProps {
  email: string | undefined;
  children: ReactNode;
}

export function AdminShell({ email, children }: AdminShellProps) {
  return (
    <>
      <header className="sticky top-0 z-40 bg-ink-black text-ivory-shell border-b border-steel-mesh/20">
        <div className="max-w-content mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/production" className="inline-flex items-center gap-3" aria-label="Production admin home">
              <Image src="/zerod-farms-logo.svg" alt="" width={96} height={26} className="invert" />
              <span className="hidden sm:inline h-4 w-px bg-steel-mesh/40" aria-hidden="true" />
              <span className="hidden sm:inline font-mono text-caption uppercase tracking-widest text-feed-gold">
                Production admin
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden md:inline font-mono text-caption text-steel-mesh truncate max-w-56">{email}</span>
            <Link
              href="/#production"
              target="_blank"
              className="font-mono text-caption uppercase tracking-wider text-ivory-shell/80 hover:text-feed-gold transition-colors px-2 py-2"
            >
              View site ↗
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="font-mono text-caption uppercase tracking-wider text-ivory-shell/80 hover:text-feed-gold transition-colors px-2 py-2"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-content w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </>
  );
}
