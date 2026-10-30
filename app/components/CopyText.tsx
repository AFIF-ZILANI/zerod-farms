"use client";

import { useEffect, useState } from "react";

interface CopyTextProps {
  value: string;
  /** Accessible name for the button, e.g. "Copy Imo ID". */
  label: string;
  className?: string;
}

// Small copy-to-clipboard button with inline confirmation.
export function CopyText({ value, label, className = "" }: CopyTextProps) {
  const [copied, setCopied] = useState<boolean | null>(null);

  useEffect(() => {
    if (copied === null) return;
    const t = setTimeout(() => setCopied(null), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 min-h-9 font-mono text-caption uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-feed-gold ${className}`}
    >
      <span aria-live="polite">{copied === true ? "✓ Copied" : copied === false ? "Copy failed" : "Copy"}</span>
    </button>
  );
}
