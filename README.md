# ZeroD Farms

Marketing site for **ZeroD Farms** — a poultry operation in Mahadebpur, Naogaon, Bangladesh. _Healthy food for everyone._

Founded on 31 December 2019 by **Kazi Bahalul Arfin**, the farm runs five controlled sheds with a 10,000-bird capacity and produces around 5,000 Pakistani Sonali Classic birds a month on Leader Feed, batch-tracked from placement to harvest. Day-to-day operations and the farm's in-house software are led by CEO **[Afif Zilani](https://afifzilani.com)**.

Part of the [ZeroD](https://zerod.vercel.app) brand.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- [Bun](https://bun.sh) as package manager and runtime

## Getting started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
bun run build   # production build
bun start       # serve the production build
bun run lint    # eslint
```

## Structure

It's a single-page site. Content and copy live in one place so the page reads as layout, not prose.

```
app/
  page.tsx          # the page — all sections
  layout.tsx        # metadata + JSON-LD structured data
  lib/constants.ts  # all site copy and data (single source of truth)
  components/        # SectionHeader, Card, Button, AnimateOnScroll, SectionDivider
  globals.css        # Tailwind theme — design tokens (color, type scale)
  sitemap.ts
public/
  robots.txt
```

## SEO & GEO

The site is built to be citable by search engines and AI answer engines:

- A linked JSON-LD `@graph` in `layout.tsx` — `LocalBusiness`, `Person` (founder and CEO), and `WebSite` nodes, cross-referenced by `@id`, with `sameAs` links for entity resolution.
- A `FAQPage` block whose answers mirror the on-page FAQ, so the same facts are available as machine-readable Q&A.
- Canonical URL, Open Graph and Twitter cards, `sitemap.ts`, and `robots.txt`.

Edit facts in `app/lib/constants.ts`; the structured data and the FAQ both draw from confirmed data only.

## Contact

West Kazipara, Kundona, Fotepur Madrasa Road, Mahadebpur, Naogaon – 6530, Bangladesh
Phone / WhatsApp: +880 1341-570410 · zerodfarms@gmail.com
