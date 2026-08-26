interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  spec?: string;
  className?: string;
}

export function Card({
  title,
  description,
  icon,
  spec,
  className = "",
}: CardProps) {
  return (
    <div
      className={`flex flex-col h-full bg-paper-white border border-steel-mesh/30 rounded-lg p-6 transition-colors hover:border-barind-rust/40 ${className}`}
    >
      {icon && <div className="mb-4 text-barind-rust">{icon}</div>}
      <h3 className="font-display text-display-m font-semibold text-ink-black mb-2">
        {title}
      </h3>
      <p className="font-body text-body-m text-steel-mesh">{description}</p>
      {spec && (
        <p className="mt-auto pt-4 font-mono text-caption text-steel-mesh uppercase tracking-widest">
          <span className="text-barind-rust" aria-hidden="true">
            /{" "}
          </span>
          {spec}
        </p>
      )}
    </div>
  );
}
