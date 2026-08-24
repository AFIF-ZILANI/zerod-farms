import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barind-rust min-h-[44px] min-w-[44px]";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-barind-rust text-ivory-shell hover:bg-barind-rust/90 focus-visible:outline-barind-rust",
    secondary:
      "border border-ink-black text-ink-black hover:bg-ink-black hover:text-ivory-shell focus-visible:outline-ink-black",
  };

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
