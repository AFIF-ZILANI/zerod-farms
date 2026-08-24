interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Card({ title, description, icon, className = "" }: CardProps) {
  return (
    <div
      className={`bg-paper-white border border-steel-mesh/30 rounded-lg p-6 ${className}`}
    >
      {icon && <div className="mb-4 text-barind-rust">{icon}</div>}
      <h3 className="font-display text-display-m font-semibold text-ink-black mb-2">
        {title}
      </h3>
      <p className="font-body text-body-m text-steel-mesh">{description}</p>
    </div>
  );
}
