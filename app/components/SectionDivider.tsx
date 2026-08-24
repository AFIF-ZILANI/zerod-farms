export function SectionDivider() {
  return (
    <div className="flex justify-center py-8" aria-hidden="true">
      <div className="flex gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-0.5 h-3 bg-barind-rust"
          />
        ))}
      </div>
    </div>
  );
}
