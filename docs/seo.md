# ZeroD Farms — SEO / GEO Guidelines

**Scope note:** This is a single-page local contact site (§3 of the PRD explicitly excludes CMS/blog/content marketing). Most of what's marketed as "GEO" — a still-undefined, mostly enterprise-focused practice around getting cited by ChatGPT/Perplexity/Gemini — does not apply here. There's no blog, no content depth, no competitive search volume to chase. Don't buy GEO tracking tools for this site; it's wasted spend. What follows is ranked by actual impact, not by how trendy it sounds.

---

## 0. Priority order (read this before implementing anything below)

1. **Google Business Profile** — outside this codebase, but higher-impact than everything in this file combined for local discovery ("poultry farm Naogaon," "broiler supplier Mahadebpur"). Set this up if it doesn't exist. Not optional, not covered further here since it's not a site-build task.
2. **NAP consistency** — same name/address/phone everywhere, byte-for-byte.
3. **Structured data (JSON-LD)** — cheap, high-value, the one place SEO and "GEO" genuinely overlap.
4. **Standard technical SEO** — meta tags, OG tags, sitemap, robots.txt, semantic HTML.
5. **Content clarity** — already covered by the existing Copy Voice rule in the Design System; nothing new to do here.

---

## 1. NAP — canonical, use exactly this everywhere

Any deviation across the website, Google Business Profile, Facebook, or elsewhere actively hurts local search trust. Copy-paste, don't retype.

```
Name:     ZeroD Farms
Phone:    +8801341570410
WhatsApp: https://wa.me/8801341570410
Email:    zerodfarms@gmail.com
Address:  West Kazipara, Kundona, Fotepur Madrasa Road, Mahadebpur, Naogaon – 6530
```

⚠️ Still unconfirmed (see PRD §4.10): whether 6530 is genuinely the postal code and whether "Fotepur Madrasa Road" is correct as a formal address line. Fix this before it goes live anywhere — a wrong address propagated across GBP + site + socials is harder to unwind later than a missing one.

---

## 2. Structured data (JSON-LD)

Add to the page `<head>` (or via Next.js `generateMetadata` / a `<script type="application/ld+json">` in the root layout). This is real, not decorative — it's the clearest machine-readable statement of who you are, for both Google and AI answer engines.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://zerodfarms.vercel.app/#business",
  "name": "ZeroD Farms",
  "description": "Poultry farm in Mahadebpur, Naogaon, Bangladesh — [broiler/layer, pending confirmation] production with 5 sheds and 10,000-bird capacity.",
  "url": "https://zerodfarms.vercel.app",
  "telephone": "+8801341570410",
  "email": "zerodfarms@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "West Kazipara, Kundona, Fotepur Madrasa Road",
    "addressLocality": "Mahadebpur",
    "addressRegion": "Naogaon",
    "postalCode": "6530",
    "addressCountry": "BD"
  },
  "foundingDate": "2019-12-31",
  "founder": {
    "@type": "Person",
    "name": "Kazi Bahalul Arfin"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "ZeroD",
    "url": "https://zerod.vercel.app"
  }
}
```

**Do not ship this until:**
- `description` has real broiler/layer wording (currently a placeholder bracket — don't let this go live with a bracket in it)
- Domain URLs are confirmed (placeholder `zerodfarms.vercel.app` used above — replace with real deployed URL)
- Address format is confirmed per §1 above

**Also add** an `Organization` schema block for the ZeroD parent brand if the footer links to zerod.vercel.app, so the sub-brand relationship is machine-legible.

---

## 3. Meta tags (per PRD §4, single route — one set of tags)

```html
<title>ZeroD Farms — [Broiler/Layer, pending] Poultry Farm in Naogaon, Bangladesh</title>
<meta name="description" content="ZeroD Farms is a [broiler/layer, pending] poultry operation in Mahadebpur, Naogaon — 5 sheds, 10,000-bird capacity, ~5,000 birds produced monthly. Call, WhatsApp, or visit." />
<link rel="canonical" href="https://zerodfarms.vercel.app/" />
```

**Blocked on the same open item as the PRD:** the title and description both depend on the broiler/layer answer. Don't write final copy with a guess baked in — a factually wrong meta description is worse than a generic one, since it's often what gets shown verbatim in search results and AI answer summaries.

### Open Graph / Twitter Card
Matters more than usual here because your primary contact channel is WhatsApp — link previews are genuinely part of the user experience, not boilerplate.

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="ZeroD Farms — Poultry Farm in Naogaon, Bangladesh" />
<meta property="og:description" content="[same as meta description above]" />
<meta property="og:image" content="https://zerodfarms.vercel.app/og-image.jpg" />
<meta property="og:url" content="https://zerodfarms.vercel.app/" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
```

`og:image` needs a real 1200×630px image — cannot be the Steel Mesh placeholder block per the Imagery rules (§5.7), since this is the one image surface users see *before* they ever land on the site. If real farm photography isn't ready by launch, use a clean text-on-Ivory-Shell graphic (wordmark + tagline) rather than the grey placeholder — this is the one exception worth carving out from the placeholder rule, because a grey box in a WhatsApp link preview looks broken, not honest.

---

## 4. Sitemap & robots.txt

Single-route site, so both are trivial — no reason to skip them.

**`/public/robots.txt`**
```
User-agent: *
Allow: /

Sitemap: https://zerodfarms.vercel.app/sitemap.xml
```

**`/app/sitemap.ts`** (Next.js App Router)
```ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://zerodfarms.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

---

## 5. Semantic HTML / on-page structure

- One `<h1>` only — the hero headline (§4.2). Every other section header (`Our Production`, `Gallery`, `Our Farm`, etc.) is `<h2>`.
- Use `<address>` for the contact block (§4.10), not a plain `<div>`.
- Use `<nav>` for the sticky top bar (§4.1).
- Contact links get real semantic markup, not just styled divs:
  ```html
  <a href="tel:+8801341570410">Call</a>
  <a href="https://wa.me/8801341570410">WhatsApp</a>
  <a href="mailto:zerodfarms@gmail.com">Email</a>
  ```
- All placeholder Steel Mesh image blocks (§5.7 of the Design System) still need real `alt` text describing what the eventual photo will show — e.g. `alt="Broiler shed interior, ZeroD Farms"` — not `alt="placeholder"`. Screen readers and image search both depend on this, and it costs nothing to write correctly now instead of retrofitting later.

---

## 6. Performance (ties directly to PRD §6)

Core Web Vitals are a direct Google ranking factor, and the PRD's existing performance budget already points the right direction — this section just makes the SEO reasoning explicit:

- No hero video, no heavy JS libraries — already specified in PRD §6, keep it that way.
- Static Next.js export means fast TTFB and no server round-trip — don't undo this by adding client-side data fetching for content that's static anyway.
- Placeholder Steel Mesh blocks should be CSS, not images, until real photos exist — zero image weight for content that isn't real yet.
- Once real photos land: serve via `next/image` with proper `sizes` and lazy loading below the fold. Don't hand-roll `<img>` tags.

---

## 7. Content-clarity guidelines (the actual "GEO" overlap)

This isn't new work — it's already mandated by the Design System's Copy Voice section ("plain, direct, short sentences, no filler"). Restated here because it happens to be the one real point of overlap between good copywriting and how AI answer engines extract and cite information: direct, unambiguous, fact-first sentences get pulled into summaries more reliably than vague marketing language. No action item beyond what's already in the Design System — just don't let anyone "punch up" the copy with filler language later under the assumption it reads more professional. It doesn't, and it actively hurts here.

---

## 8. What NOT to do

- Don't add a blog "for SEO." A single-page site with no content strategy behind it produces thin, occasional posts that hurt more than they help. If content marketing becomes a real goal later, that's a separate initiative with its own plan — not a bolt-on to this build.
- Don't buy GEO tracking/optimization SaaS tools for this site. That tooling is priced and built for brands competing on search volume; a hyperlocal contact page has nothing for it to optimize.
- Don't fabricate review counts, ratings, or aggregate schema (`AggregateRating`) — there's no review data yet, and fake schema is a Google penalty risk, not a growth hack.
- Don't add `FAQPage` schema without real, genuine FAQs — same reasoning.

---

## 9. Still blocked on the same open items as the PRD

This file cannot be fully implemented until:
- Broiler / layer / both — blocks meta title, meta description, and the JSON-LD `description` field
- Real domain URL — currently placeholder `zerodfarms.vercel.app` throughout this doc, swap once deployed
- Address format confirmation (postal code, road/landmark line)
- A real OG image (or the text-on-Ivory-Shell exception described in §3)

Everything else in this file is implementable now.
