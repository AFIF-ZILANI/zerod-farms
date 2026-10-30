import type { ReactNode } from "react";

const TONES = {
  success: "border-feed-gold/70 bg-feed-gold/10 text-ink-black",
  error: "border-barind-rust/50 bg-barind-rust/5 text-ink-black",
  info: "border-steel-mesh/40 bg-paper-white text-ink-black",
} as const;

export function Notice({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`mb-6 rounded-md border px-4 py-3 font-body text-body-m ${TONES[tone]}`}
    >
      {children}
    </div>
  );
}
