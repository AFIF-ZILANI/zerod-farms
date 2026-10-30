"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  batchShareMessage,
  batchUrl,
  whatsappShareLink,
} from "../../lib/production/format";

interface ShareBatchProps {
  batchCode: string;
  breed: string;
  status: "upcoming" | "available";
  /** Full-width button (cards on mobile) vs. inline. */
  block?: boolean;
  /** Which way the menu opens; use "up" near the bottom of a card. */
  placement?: "up" | "down";
  /** Icon-only trigger (label kept for screen readers) for tight spaces. */
  iconOnly?: boolean;
  className?: string;
}

// Web Share support is a browser capability, not state — read it without an
// effect so the server render (false) and hydration stay consistent.
const subscribe = () => () => {};
const canNativeShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-secure contexts: fall back to a hidden textarea.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function ShareGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

const itemClass =
  "flex w-full items-center gap-3 px-4 py-3 min-h-11 text-left font-body text-body-m text-ink-black hover:bg-ivory-shell focus-visible:bg-ivory-shell focus-visible:outline-none transition-colors";

export function ShareBatch({ batchCode, breed, status, block = false, placement = "up", iconOnly = false, className = "" }: ShareBatchProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const native = useSyncExternalStore(subscribe, canNativeShare, () => false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const url = batchUrl(batchCode);
  const message = batchShareMessage({ batchCode, breed, status });

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(t);
  }, [feedback]);

  async function shareNatively() {
    setOpen(false);
    try {
      // The URL travels in its own field; keep it out of the text so share
      // targets that append it don't show it twice.
      await navigator.share({
        title: `ZeroD Farms – Batch ${batchCode}`,
        text: message.replace(`${url}\n`, "").replace(url, "").trim(),
        url,
      });
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") setFeedback("Sharing failed — try Copy link.");
    }
  }

  async function copyLink() {
    setOpen(false);
    setFeedback((await copyText(url)) ? "Link copied" : "Couldn't copy — long-press the address bar instead.");
  }

  return (
    <div ref={rootRef} className={`relative ${block ? "w-full" : ""} ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        aria-label={iconOnly ? `Share batch ${batchCode}` : undefined}
        className={`inline-flex items-center justify-center gap-2 ${iconOnly ? "px-3.5" : "px-4"} py-3 min-h-11 whitespace-nowrap rounded-lg border border-ink-black text-ink-black font-body font-medium text-body-m hover:bg-ink-black hover:text-ivory-shell transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-black ${
          block ? "w-full" : ""
        }`}
      >
        <ShareGlyph />
        {iconOnly ? <span className="sr-only">Share Batch</span> : "Share Batch"}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={`Share batch ${batchCode}`}
          className={`absolute z-30 right-0 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-steel-mesh/30 bg-paper-white shadow-[0_18px_40px_-20px_rgba(20,18,15,0.45)] ${
            placement === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <p className="px-4 pt-3 pb-2 font-mono text-caption text-steel-mesh uppercase tracking-widest">
            Share batch {batchCode}
          </p>
          {native && (
            <button type="button" role="menuitem" onClick={shareNatively} className={itemClass}>
              <ShareGlyph />
              Share via…
            </button>
          )}
          <a
            role="menuitem"
            href={whatsappShareLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-barind-rust">
              <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0zm0 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
            </svg>
            Share on WhatsApp
          </a>
          <button type="button" role="menuitem" onClick={copyLink} className={`${itemClass} border-t border-steel-mesh/15`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Copy link
          </button>
        </div>
      )}

      <span role="status" aria-live="polite" className={`absolute left-1/2 -translate-x-1/2 ${placement === "up" ? "bottom-full mb-2" : "top-full mt-2"} whitespace-nowrap`}>
        {feedback && (
          <span className="inline-block rounded-md bg-ink-black px-3 py-1.5 font-mono text-caption text-ivory-shell">
            {feedback === "Link copied" ? "✓ " : ""}
            {feedback}
          </span>
        )}
      </span>
    </div>
  );
}
