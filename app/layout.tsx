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

const SITE_URL = "https://zerodfarms.vercel.app";

// Linked @graph so search and AI engines resolve the farm, its founder, and
// its CEO as distinct, connected entities. Every value is confirmed — no
// invented coordinates, employee counts, prices, or social profiles.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "ZeroD Farms",
      description:
        "Poultry farm in Mahadebpur, Naogaon, Bangladesh — production with 5 sheds and 10,000-bird capacity.",
      url: SITE_URL,
      telephone: "+8801341570410",
      email: "zerodfarms@gmail.com",
      image: `${SITE_URL}/images/hero.webp`,
      logo: `${SITE_URL}/zerod-farms-logo.svg`,
      slogan: "Healthy food for everyone.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "West Kazipara, Kundona, Fotepur Madrasa Road",
        addressLocality: "Mahadebpur",
        addressRegion: "Naogaon",
        postalCode: "6530",
        addressCountry: "BD",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Naogaon and surrounding districts, Bangladesh",
      },
      foundingDate: "2019-12-31",
      founder: { "@id": `${SITE_URL}/#founder` },
      employee: { "@id": `${SITE_URL}/#ceo` },
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Pakistani Sonali Classic broiler",
          category: "Poultry",
          description:
            "Pakistani Sonali Classic birds raised from day-old chicks to market weight on Leader Feed, batch-tracked from placement to harvest.",
        },
      },
      parentOrganization: {
        "@type": "Organization",
        name: "ZeroD",
        url: "https://zerod.vercel.app",
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Kazi Bahalul Arfin",
      jobTitle: "Founder & Owner",
      worksFor: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#ceo`,
      name: "Afif Zilani",
      alternateName: "Kazi Afif Zilani",
      jobTitle: "Chief Executive Officer",
      description:
        "Full-stack developer and CEO of ZeroD Farms, leading the farm's management and its in-house software.",
      url: "https://afifzilani.com",
      worksFor: { "@id": `${SITE_URL}/#business` },
      sameAs: [
        "https://github.com/AFIF-ZILANI",
        "https://www.linkedin.com/in/afifzilani",
        "https://stackoverflow.com/users/22881891/afif-zilani",
        "https://orcid.org/0009-0005-0673-3154",
        "https://x.com/afif_zilani",
        "https://hashnode.com/@afifzilani",
        "https://bsky.app/profile/afif-zilani.bsky.social",
        "https://www.reddit.com/user/afifzilani",
        "https://huggingface.co/afifzilani",
        "https://instagram.com/afif.zilani",
        "https://facebook.com/AFIF.ZILANI00",
        "https://threads.com/afif.zilani",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "ZeroD Farms",
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
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
    "Pakistani Sonali Classic",
    "Sonali",
    "ZeroD Farms",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "ZeroD Farms — Poultry Farm in Naogaon, Bangladesh",
    description:
      "ZeroD Farms is a poultry operation in Mahadebpur, Naogaon — 5 sheds, 10,000-bird capacity.",
    url: "https://zerodfarms.vercel.app",
    locale: "en_US",
    siteName: "ZeroD Farms",
    images: [
      {
        url: "/images/hero.webp",
        alt: "ZeroD Farms poultry sheds in Naogaon, Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroD Farms — Poultry Farm in Naogaon, Bangladesh",
    description:
      "ZeroD Farms is a poultry operation in Mahadebpur, Naogaon — 5 sheds, 10,000-bird capacity.",
    images: ["/images/hero.webp"],
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
