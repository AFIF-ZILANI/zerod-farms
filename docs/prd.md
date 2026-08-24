# ZeroD Farms — Website PRD (v2)

**Status:** Design system locked. Several content blockers from v1 are now resolved (see §7). Two remain open and still block build: broiler/layer confirmation (§4.3) and the Dataset CTA link target (§4.9). Do not invent values for anything still marked pending.

---

## 1. Overview

| | |
|---|---|
| Product | ZeroD Farms informational + contact website |
| Entity | ZeroD Farms (poultry operation), part of the ZeroD group |
| Owner | Afif Zilani |
| Format | Single-page site, Next.js static, deployed on Vercel |

## 2. Purpose

Primary job: information visibility and a direct path to contact — not a sales funnel, not an investor pitch. Secondary job: house a distinct section introducing PoultryScale's Global Poultry Dataset initiative (confirmed as belonging under ZeroD Farms) without letting it dilute the farm's core message.

**Audience:** local buyers/wholesalers and the general public (primary); researchers/partners interested in the dataset initiative (secondary, served by §4.9 only).

## 3. Out of Scope (v1)

CMS, backend, database, forms service, e-commerce, multi-language, user accounts. Contact is handled entirely via `tel:`, `wa.me`, and `mailto:` links.

---

## 4. Information Architecture

Final section order, top to bottom:

### 4.1 Navigation
Sticky top bar: wordmark left, anchor links to Production / Gallery / Our Farm / Contact right (collapse Timeline/Team/Vision/Dataset into an overflow or omit from nav — designer's call at build time). Collapses to a hamburger under 768px.

### 4.2 Hero
Full-bleed image, 16:9. **Placeholder now:** solid Steel Mesh (`#6E6A61`) block, `PHOTO — 16:9` mono label, dark gradient scrim (`rgba(20,18,15,0.75)` to `rgba(20,18,15,0.1)`, bottom to top). Headline (Zilla Slab, 28–32px), one-line tagline, single primary CTA ("Call now").
**Swap at launch:** replace placeholder with real photo, same aspect ratio and scrim treatment.

### 4.3 Our Production — ⚠️ STILL BLOCKED
Three-card row (single column on mobile): Broiler rearing, Batch tracking, Local supply.

**This section cannot be finalized.** Two unresolved issues:
1. **Broiler vs. layer vs. both — not yet confirmed.** Sonali is a dual-purpose breed; the current card copy assumes broiler/meat operation. If ZeroD Farms also sells eggs, this section's copy and possibly card count is wrong.
2. **Spec conflict on stats:** v1 spec says icon + label only, "no invented stats." Real numbers now exist (5 sheds, 10,000-bird capacity, ~5,000 birds/month) — decide whether these appear here (as a 4th card or stat strip) or stay off the public page. Not decided yet; do not default silently either way.

### 4.4 Gallery
3-column grid (1-column mobile), 4:5 aspect ratio per item. **Placeholder now:** Steel Mesh blocks, `4:5` mono label. Swap for real photos pre-launch, black & white or Ink Black↔Ivory Shell duotone per §5.7.

### 4.5 Our Farm (About) — ✅ RESOLVED

> ZeroD Farms started on 31 December 2019, when Kazi Bahalul Arfin set up the first shed in Naogaon with 2,500 Sonali birds. Six years on, we run five sheds with capacity for 10,000 birds and produce around 5,000 birds a month for local buyers and wholesalers, on Leader Feed. We're building our own tools — a farm dashboard, an employee app for daily shed work, and PoultryScale — to run a farm that's more digital, more efficient, and lighter on the environment. The goal hasn't moved since day one: healthy food, for everyone.

Single paragraph, fits 480px max-width. Note: "Sonali" here is written as the standard Bangladeshi cross-breed name — confirm before launch if your supplier uses different breed terminology ("Pakistani Sonali" was mentioned once and doesn't match standard breed naming; verify this isn't a mix-up before it's public).

### 4.6 Timeline — ⚠️ PARTIAL

Only two verified data points exist. Per the "never invent values" rule, no intermediate milestones are fabricated:

- **31 Dec 2019** — Founded by Kazi Bahalul Arfin, first shed, 2,500 Sonali birds
- **2026** — 5 sheds, 10,000-bird capacity, ~5,000 birds/month produced

**Decision still needed:** ship with just these two points, hold the section for v2, or supply the missing shed-by-shed expansion dates. A two-point "timeline" is thin — worth deciding if it's worth shipping as-is.

### 4.7 Our Team — ⚠️ PARTIAL
3-avatar grid, circular placeholder + `Name — pending`.

Known: founder is Kazi Bahalul Arfin. No role title given, no additional team members named, no photos. **Recommend holding for v2** until at least roles are supplied — one name in a 3-avatar grid looks incomplete rather than intentional.

### 4.8 Our Vision — ✅ RESOLVED

> *Healthy food for everyone.*

Zilla Slab italic, per spec.

### 4.9 Global Poultry Dataset — ⚠️ COPY DRAFTED, CTA UNRESOLVED

Visually distinct band — Paper White background, hairline borders, Feed Gold accent. Eyebrow: "Beyond the farm."

> We're building a live, public poultry dataset through PoultryScale — real weighing and production data from farms across Bangladesh, made open for research and better decision-making. Coming soon.

**Blocking issue:** the CTA button ("Learn about PoultryScale →") has no confirmed destination — the dataset itself isn't live. Three options, pick one before build:
1. Link to PoultryScale's own site/landing page (if one is public).
2. Show "Coming soon" as static text, no clickable CTA.
3. Hold this entire section for v2, consistent with the Timeline/Team treatment.

### 4.10 Contact — ✅ RESOLVED (pending address confirmation)

Inverted band, Ink Black background, Ivory Shell text. Tabler icons, stacked on mobile.

- **Phone:** `tel:+8801341570410`
- **WhatsApp:** `https://wa.me/8801341570410`
- **Email:** `mailto:zerodfarms@gmail.com`
- **Address:** West Kazipara, Kundona, Fotepur Madrasa Road, Mahadebpur, Naogaon – 6530

⚠️ Address is reformatted from a raw input that didn't parse cleanly. Confirm before launch: is 6530 the postal code for the full address, and is "Fotepur Madrasa" a landmark/road reference rather than a formal address line? Wrong address on a public contact page is worse than a missing one.

### 4.11 Footer
Single line, "Part of ZeroD," links back to zerod.vercel.app.

---

## 5. Design System

### 5.1 Color

| Name | Hex | Role |
|---|---|---|
| Ink Black | `#14120F` | Primary text, dark sections, logo |
| Barind Rust | `#9A3324` | Primary accent — CTAs, dividers, core-flow sections |
| Feed Gold | `#D8A73E` | Secondary accent — reserved for the Dataset section + small highlights |
| Steel Mesh | `#6E6A61` | Muted text, placeholders, borders |
| Ivory Shell | `#F7F1E4` | Primary background |
| Paper White | `#FFFDF8` | Elevated cards, Dataset section background |

### 5.2 Typography

| Role | Typeface | Size/Weight |
|---|---|---|
| Display | Zilla Slab, Bold/SemiBold | 56/40/28px scale, never light weight |
| Body | IBM Plex Sans, Regular/Medium | 18px intro, 16px default |
| Data/Utility | IBM Plex Mono, Regular | 13px labels, +0.02em tracking |

### 5.3 Spacing
8px base unit: `4, 8, 16, 24, 32, 48, 64, 96, 128`. Section vertical padding 96px desktop / 64px mobile. Max content width 1120px, 24px mobile gutters. 12-column grid, collapses to 1 column under 768px.

### 5.4 Signature element
Tick-mark divider (repeating 2px Barind Rust strokes, 8px gaps) between every major section.

### 5.5 Components
- **Primary button:** Rust fill, Ivory text, 8px radius.
- **Secondary/outline button:** 1px Ink Black or Feed Gold border (Feed Gold reserved for Dataset section), transparent fill.
- **Cards:** Paper White, 1px Steel Mesh border, no drop shadow, 8px radius.

### 5.6 Motion
Fade + 8px slide-up on load/scroll only. No parallax, no autoplay, no hover-zoom. Respect `prefers-reduced-motion`.

### 5.7 Imagery & placeholder rules
No stock photography, ever, even temporarily — use labeled Steel Mesh blocks at the correct aspect ratio instead. Real photography, once available, is treated in true black & white or Ink Black↔Ivory Shell duotone, not full color.

### 5.8 Accessibility
Ink Black on Ivory Shell passes AAA. Barind Rust on Ivory Shell passes AA for large text/buttons only — verify before using at body size. All interactive elements need a visible 2px focus outline. Minimum tap target 44×44px.

---

## 6. Technical Requirements

- Next.js static site, single route, content in one constants/config file (no CMS).
- No backend, no database, no form-submission service.
- Contact via `tel:`, `wa.me`, `mailto:` links only.
- Mobile-first build; test 375px through 1440px.
- Performance budget: no hero video, no heavy JS libraries.
- Deploy: Vercel.

---

## 7. Content Blockers — live status

| Item | Status |
|---|---|
| Real farm photos (hero + gallery) | Missing — placeholder until pre-launch swap |
| Phone number | ✅ Resolved |
| WhatsApp number | ✅ Resolved |
| Email address | ✅ Resolved |
| Farm address/location | ✅ Resolved — pending format confirmation (§4.10) |
| Broiler / layer / both | ❌ Still missing — blocks §4.3 |
| Production stats visibility decision | ❌ Not decided — spec conflict, see §4.3 |
| Timeline milestones | ⚠️ Partial — start + present only, no in-between dates |
| Team names, roles, photos | ⚠️ Partial — founder name only, no role, no other members, no photos |
| Vision statement | ✅ Resolved |
| Dataset section copy | ✅ Drafted |
| Dataset CTA link target | ❌ Not decided — blocks §4.9 |
| Existing ZeroD Farms logo file | Not yet shared |
| Breed naming confirmation ("Sonali" vs "Pakistani Sonali") | ⚠️ Unconfirmed — verify before publishing §4.5 |
| Revenue figure reconciliation (1.6–2 Cr vs. 2.4 Cr cited elsewhere) | ⚠️ Unresolved — not blocking this page directly, but flagged for consistency across ZeroD materials |

## 8. Definition of Done
- All sections in §4 implemented in the specified order.
- Design tokens match §5 exactly — no ad-hoc colors, fonts, or spacing values.
- Every unresolved item from §7 is either filled with real content or clearly marked pending in the UI — never silently fabricated.
- §4.3 broiler/layer question and §4.9 CTA link target resolved before this ships — these are the two hard blockers remaining.
- Contact links functional and tap-target compliant.
- Responsive 375px–1440px, passes basic contrast/focus checks.
