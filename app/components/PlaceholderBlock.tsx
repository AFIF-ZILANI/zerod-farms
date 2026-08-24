interface PlaceholderBlockProps {
  aspectRatio?: "16/9" | "4/5" | "1/1";
  label?: string;
  className?: string;
}

export function PlaceholderBlock({
  aspectRatio = "4/5",
  label,
  className = "",
}: PlaceholderBlockProps) {
  const ratioLabels: Record<string, string> = {
    "16/9": "PHOTO — 16:9",
    "4/5": "PHOTO — 4:5",
    "1/1": "PHOTO — 1:1",
  };

  return (
    <div
      className={`bg-steel-mesh flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspectRatio }}
    >
      <span className="font-data text-xs tracking-widest text-ivory-shell/70 uppercase">
        {label ?? ratioLabels[aspectRatio]}
      </span>
    </div>
  );
}
