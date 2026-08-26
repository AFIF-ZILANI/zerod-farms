interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  className?: string;
}

// Shared header for the light informational sections — a rust tick + mono
// eyebrow above a slab title, matching the ledger voice used in Contact.
export function SectionHeader({
  eyebrow,
  title,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-barind-rust" aria-hidden="true" />
        <span className="font-mono text-caption text-steel-mesh uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-display-l font-semibold text-ink-black leading-[1.1] max-w-[20ch]">
        {title}
      </h2>
    </div>
  );
}
