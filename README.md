# ZeroD Farms

Marketing site for **ZeroD Farms** — a poultry operation in Mahadebpur, Naogaon, Bangladesh. _Healthy food for everyone._

Founded on 31 December 2019 by **Kazi Bahalul Arfin**, the farm runs five controlled sheds with a 10,000-bird capacity and produces around 5,000 Pakistani Sonali Classic birds a month on Leader Feed, batch-tracked from placement to harvest. Day-to-day operations and the farm's in-house software are led by CEO **[Afif Zilani](https://afifzilani.com)**.

Part of the [ZeroD](https://zerod.bd) brand.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- [Bun](https://bun.sh) as package manager and runtime
- [Supabase](https://supabase.com) — Postgres, Auth and Storage for production batches

## Getting started

```bash
bun install
cp .env.example .env.local   # Supabase URL + publishable key (optional for the static sections)
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

It's a single-page site. Static copy lives in one place so the page reads as layout, not prose. Production batches are the one live part: they come from Supabase and are managed in a protected admin panel.

```
app/
  page.tsx               # the page — all sections
  layout.tsx             # metadata + JSON-LD structured data
  lib/constants.ts       # all static site copy and data (single source of truth)
  lib/production/        # batch types, public queries, date/WhatsApp formatting
  lib/supabase/          # Supabase clients (public, server/cookies, browser) + admin check
  components/            # SectionHeader, Card, Button, AnimateOnScroll, SectionDivider
  components/production/ # Production & Wholesale Availability section, batch cards, media player
  admin/                 # /admin/login and /admin/production (batches, media, publishing)
  production/[code]/     # permanent, shareable batch pages
  media/[id]/route.ts    # published-only media → short-lived signed URL
  api/cron/              # nightly deletion of videos past retention
  globals.css            # Tailwind theme — design tokens (color, type scale)
  sitemap.ts
proxy.ts                 # refreshes the admin session, gates /admin
supabase/migrations/     # schema, RLS, storage bucket + policies
public/
  robots.txt
```

## Production & wholesale availability

The homepage `#production` section shows batches **available for sale** and **upcoming wholesale sales**, with real farm videos and WhatsApp/phone enquiry buttons. Each published batch also has a shareable page at `/production/<CODE>` with all its videos and a **Share Batch** menu (native share, WhatsApp, copy link). It's a B2B enquiry tool — no prices, cart, checkout or customer accounts.

Uploaded videos are kept only until 2 days after a batch's sale window ends, then deleted by a nightly job (`vercel.json`).

Setup (Supabase project, migration, first admin account, env vars, deployment) and day-to-day use are in **[docs/production-admin.md](docs/production-admin.md)**.

## SEO & GEO

The site is built to be citable by search engines and AI answer engines:

- A linked JSON-LD `@graph` in `layout.tsx` — `LocalBusiness`, `Person` (founder and CEO), and `WebSite` nodes, cross-referenced by `@id`, with `sameAs` links for entity resolution.
- A `FAQPage` block whose answers mirror the on-page FAQ, so the same facts are available as machine-readable Q&A.
- Canonical URL, Open Graph and Twitter cards, `sitemap.ts`, and `robots.txt`.

Edit facts in `app/lib/constants.ts`; the structured data and the FAQ both draw from confirmed data only.

## Contact

West Kazipara, Kundona, Fotepur Madrasa Road, Mahadebpur, Naogaon – 6530, Bangladesh
Phone / WhatsApp / Imo: +880 1354-711846 (Imo ID `imoid_wiN6TNNstQ`) · zerodfarms@gmail.com
