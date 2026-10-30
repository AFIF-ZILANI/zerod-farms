import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Production admin — ZeroD Farms",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex-1 flex flex-col bg-ivory-shell">{children}</div>;
}
