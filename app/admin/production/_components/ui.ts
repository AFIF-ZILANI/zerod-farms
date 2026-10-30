// Shared admin styles — functional, but on the site's own tokens.
export const labelClass =
  "block font-mono text-caption text-steel-mesh uppercase tracking-widest mb-1.5";

export const inputClass =
  "block w-full rounded-md border border-steel-mesh/35 bg-paper-white px-3 py-2.5 min-h-11 font-body text-body-m text-ink-black placeholder:text-steel-mesh/60 focus:border-barind-rust focus:outline-2 focus:outline-offset-0 focus:outline-barind-rust/30 disabled:opacity-60 aria-[invalid=true]:border-barind-rust";

export const hintClass = "mt-1 font-body text-caption text-steel-mesh";

export const errorTextClass = "mt-1 font-body text-caption text-barind-rust";

const buttonBase =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-11 rounded-lg font-body font-medium text-body-m transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

export const primaryButtonClass = `${buttonBase} bg-barind-rust text-ivory-shell hover:bg-barind-rust/90 focus-visible:outline-barind-rust`;

export const secondaryButtonClass = `${buttonBase} border border-ink-black text-ink-black hover:bg-ink-black hover:text-ivory-shell focus-visible:outline-ink-black`;

export const dangerButtonClass = `${buttonBase} border border-barind-rust text-barind-rust hover:bg-barind-rust hover:text-ivory-shell focus-visible:outline-barind-rust`;

export const ghostButtonClass =
  "inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 min-h-9 rounded-md font-mono text-caption uppercase tracking-wider text-steel-mesh hover:text-ink-black hover:bg-ink-black/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-barind-rust disabled:opacity-40 disabled:cursor-not-allowed";

export const panelClass = "rounded-lg border border-steel-mesh/25 bg-paper-white";
