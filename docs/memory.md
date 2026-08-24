# ZeroD Farms — Project Memory

## Project Identity
- **Product:** ZeroD Farms informational + contact website
- **Entity:** ZeroD Farms (poultry operation), part of the ZeroD group
- **Owner:** Afif Zilani
- **Format:** Single-page site, Next.js static, deployed on Vercel
- **Primary job:** Information visibility + direct path to contact
- **Secondary job:** House PoultryScale's Global Poultry Dataset initiative section

## Tech Stack
- **Framework:** Next.js 16.3.2 (App Router)
- **React:** 19.2.8
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Package manager:** Bun 1.2.21
- **Deploy:** Vercel
- **Fonts:** Geist (current default, will replace with design system fonts)

## Design System (v1)
### Colors
| Name | Hex | Role |
|---|---|---|
| Ink Black | `#14120F` | Primary text, dark sections, logo |
| Barind Rust | `#9A3324` | Primary accent — CTAs, dividers |
| Feed Gold | `#D8A73E` | Secondary accent — Dataset section highlights |
| Steel Mesh | `#6E6A61` | Muted text, placeholders, borders |
| Ivory Shell | `#F7F1E4` | Primary background |
| Paper White | `#FFFDF8` | Elevated cards, Dataset section background |

### Typography
| Role | Typeface | Size/Weight |
|---|---|---|
| Display | Zilla Slab (Bold/SemiBold) | 56/40/28px scale |
| Body | IBM Plex Sans (Regular/Medium) | 18px intro, 16px default |
| Data/Utility | IBM Plex Mono (Regular) | 13px labels, +0.02em tracking |

### Spacing
- 8px base unit: `4, 8, 16, 24, 32, 48, 64, 96, 128`
- Section vertical padding: 96px desktop / 64px mobile
- Max content width: 1120px, 24px mobile gutters
- 12-column grid, collapses to 1 column under 768px

### Components
- Primary button: Rust fill, Ivory text, 8px radius
- Secondary button: 1px Ink Black border, transparent fill
- Cards: Paper White, 1px Steel Mesh border, no shadow, 8px radius
- Tick-mark divider: repeating 2px Barind Rust strokes, 8px gaps

### Motion
- Fade + 8px slide-up on load/scroll, ~400ms, ease-out
- Respect `prefers-reduced-motion`

### Imagery
- NO stock photography ever
- Placeholder: Steel Mesh blocks with aspect ratio labels
- Real photos: black & white or Ink Black↔Ivory Shell duotone

## Content Sections (PRD §4)
1. **Navigation** — Sticky top bar, wordmark left, anchor links right, hamburger under 768px
2. **Hero** — Full-bleed 16:9, placeholder now, headline + tagline + CTA
3. **Our Production** — 3-card row, ⚠️ BLOCKED on broiler/layer confirmation
4. **Gallery** — 3-column grid, 4:5 ratio, placeholder
5. **Our Farm (About)** — ✅ RESOLVED, single paragraph
6. **Timeline** — ⚠️ PARTIAL, only 2 data points (2019 + 2026)
7. **Our Team** — ⚠️ PARTIAL, only founder name
8. **Our Vision** — ✅ RESOLVED, "Healthy food for everyone."
9. **Global Poultry Dataset** — ⚠️ CTA UNRESOLVED
10. **Contact** — ✅ RESOLVED, phone/WhatsApp/email/address
11. **Footer** — "Part of ZeroD," links to zerod.vercel.app

## Content Blockers (hard)
- ❌ Broiler/layer/both confirmation → blocks §4.3
- ❌ Production stats visibility decision → blocks §4.3
- ❌ Dataset CTA link target → blocks §4.9
- ⚠️ Timeline milestones → partial (ship with 2 points or hold?)
- ⚠️ Team names/roles/photos → partial (hold for v2?)
- ⚠️ Breed naming ("Sonali" vs "Pakistani Sonali") → verify before publish
- ⚠️ Address format confirmation → verify postal code

## Build Decisions
1. **Blocked sections:** Build with "Pending" placeholder text, never fabricate content
2. **Timeline:** Ship with 2 data points as minimal timeline
3. **Team:** Show founder only with "More team members coming soon"
4. **Dataset CTA:** Show "Coming soon" static text, no clickable CTA
5. **Fonts:** Load Zilla Slab, IBM Plex Sans, IBM Plex Mono via next/font
6. **Animations:** Use Intersection Observer for scroll-triggered fade-in
7. **SEO:** Full JSON-LD, meta tags, OG tags, sitemap, robots.txt
8. **Contact links:** `tel:`, `wa.me`, `mailto:` only, 44×44px tap targets

## File Structure
```
app/
  layout.tsx          — Root layout with fonts + metadata
  page.tsx            — Main page (all sections)
  globals.css         — Tailwind + design tokens
  sitemap.ts          — Dynamic sitemap
public/
  robots.txt          — Robots file
  zerod-farms-logo.svg — Existing logo
docs/
  prd.md              — Product requirements
  design.md           — Design system
  seo.md              — SEO guidelines
  memory.md           — This file
  tasks.md            — Task breakdown
```
