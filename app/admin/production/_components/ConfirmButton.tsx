"use client";

import { useId, useRef, type ReactNode } from "react";
import { dangerButtonClass, primaryButtonClass, secondaryButtonClass } from "./ui";

interface ConfirmButtonProps {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  tone?: "danger" | "primary";
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

// A trigger button plus a native modal <dialog> — focus trapping, Escape to
// close and the backdrop all come from the browser.
export function ConfirmButton({
  title,
  body,
  confirmLabel,
  onConfirm,
  tone = "danger",
  disabled,
  className,
  children,
}: ConfirmButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button type="button" disabled={disabled} className={className} onClick={() => dialogRef.current?.showModal()}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-steel-mesh/30 bg-paper-white p-0 text-ink-black backdrop:bg-ink-black/50"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="p-6">
          <h2 id={titleId} className="font-display text-display-m font-semibold">
            {title}
          </h2>
          <div className="mt-3 font-body text-body-m text-steel-mesh">{body}</div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" className={secondaryButtonClass} onClick={() => dialogRef.current?.close()} autoFocus>
              Cancel
            </button>
            <button
              type="button"
              className={tone === "danger" ? dangerButtonClass : primaryButtonClass}
              onClick={() => {
                dialogRef.current?.close();
                onConfirm();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
