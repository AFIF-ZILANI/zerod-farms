import type { Metadata } from "next";
import { Zilla_Slab, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://zerodfarms.vercel.app/#business",
  name: "ZeroD Farms",
  description:
    "Poultry farm in Mahadebpur, Naogaon, Bangladesh — production with 5 sheds and 10,000-bird capacity.",
  url: "https://zerodfarms.vercel.app",
  telephone: "+8801341570410",
  email: "zerodfarms@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "West Kazipara, Kundona, Fotepur Madrasa Road",
    addressLocality: "Mahadebpur",
    addressRegion: "Naogaon",
    postalCode: "6530",
    addressCountry: "BD",
  },
  foundingDate: "2019-12-31",
  founder: {
    "@type": "Person",
    name: "Kazi Bahalul Arfin",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "ZeroD",
    url: "https://zerod.vercel.app",
  },
};

export const metadata: Metadata = {
  title: "ZeroD Farms — Poultry Farm in Naogaon, Bangladesh",
  description:
    "ZeroD Farms is a poultry operation in Mahadebpur, Naogaon — 5 sheds, 10,000-bird capacity, ~5,000 birds produced monthly. Call, WhatsApp, or visit.",
  keywords: [
    "poultry farm",
    "Naogaon",
    "Bangladesh",
    "broiler",
    "Sonali",
    "ZeroD Farms",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "ZeroD Farms — Poultry Farm in Naogaon, Bangladesh",
    description:
      "ZeroD Farms is a poultry operation in Mahadebpur, Naogaon — 5 sheds, 10,000-bird capacity.",
    url: "https://zerodfarms.vercel.app",
    locale: "en_US",
    siteName: "ZeroD Farms",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroD Farms — Poultry Farm in Naogaon, Bangladesh",
    description:
      "ZeroD Farms is a poultry operation in Mahadebpur, Naogaon — 5 sheds, 10,000-bird capacity.",
  },
  metadataBase: new URL("https://zerodfarms.vercel.app"),
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${zillaSlab.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
