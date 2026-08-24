# ZeroD Farms — Design System (v1)

## Grounding
Subject: a working poultry farm in Naogaon, Barind Tract, Bangladesh, operating under the ZeroD group. Single job of the page: visibility + contact, at a premium execution level. Not a generic agri-startup template, not a corporate SaaS skin dropped onto a chicken farm.

The palette below is pulled from the farm's actual material world — feed grain, tin coop roofing, the region's distinctive red Barind soil, eggshell — instead of a generic warm-cream-plus-terracotta default. Logo stays as-is: your existing black & white "ZeroD Farms" mark is not recolored; it sits on the palette below, not swallowed by it.

---

## Color System

| Name | Hex | Role |
|---|---|---|
| Ink Black | `#14120F` | Primary text, logo, dark UI elements |
| Barind Rust | `#9A3324` | Primary accent — CTAs, links, key highlights |
| Feed Gold | `#D8A73E` | Secondary accent — small highlights, hover states, dividers |
| Steel Mesh | `#6E6A61` | Muted text, borders, disabled states, captions |
| Ivory Shell | `#F7F1E4` | Primary background |
| Paper White | `#FFFDF8` | Card/panel background (sits just above Ivory Shell) |

**Usage rules**
- Ivory Shell is the default background everywhere. Paper White only for elevated cards/panels — the tonal step is subtle, not a hard white-card-on-cream look.
- Barind Rust carries CTAs and interactive elements only. Don't use it decoratively — if more than ~10% of a section is rust, dial it back.
- Feed Gold is a garnish, not a base — dividers, small icons, hover accents. Never a background fill larger than a button or tag.
- Text is always Ink Black on light backgrounds, or Ivory Shell on Ink Black / Rust backgrounds. Never Rust-on-Rust or Gold text on light background (fails contrast).
- Buttons: solid Rust background + Ivory Shell text (primary), or Ink Black outline + Ink Black text (secondary/ghost).

---

## Typography

| Role | Typeface | Notes |
|---|---|---|
| Display | Zilla Slab (Bold/SemiBold) | Headlines, hero type. Sturdy, stamped-signage character — evokes text branded on a feed sack or gate sign, not an editorial magazine serif. |
| Body | IBM Plex Sans (Regular/Medium) | Paragraphs, nav, buttons. Technical/clean — keeps a visual thread back to ZeroD's other (software) sub-companies. |
| Data / Utility | IBM Plex Mono (Regular) | Labels, tags, contact details, any numeric/tabular content. Callback to weighing/batch data — literal tie to how the farm actually operates. |

**Type scale** (base 16px, ratio ~1.25)
- Display XL: 56px / 1.05 line-height — hero headline only
- Display L: 40px / 1.1 — section headers
- Display M: 28px / 1.2 — card/subsection headers
- Body L: 18px / 1.6 — intro paragraphs
- Body M: 16px / 1.6 — default body text
- Caption: 13px / 1.4, letter-spacing +0.02em, IBM Plex Mono — labels, meta text

Weight discipline: display face used Bold or SemiBold only — never light-weight slab serif, it kills the sturdy character. Body face stays Regular for paragraphs, Medium for UI labels/buttons.

---

## Spacing & Grid

8px base unit. Use only these steps: `4, 8, 16, 24, 32, 48, 64, 96, 128`.

- Section vertical padding: 96px desktop / 64px mobile
- Card internal padding: 24–32px
- Element gaps within a card: 16px
- Max content width: 1120px, centered, 24px side gutters on mobile
- Grid: 12-column desktop, collapses to single column under 768px

Don't invent one-off spacing values outside this scale — it's what keeps the layout feeling deliberate instead of eyeballed.

---

## Components

**Buttons**
- Primary: Rust fill, Ivory text, 8px radius, 16/24px padding. Hover: darken rust ~8%.
- Secondary: transparent, 1px Ink Black border, Ink Black text. Hover: fill Ink Black, text flips to Ivory.
- Contact CTAs (`Call`, `WhatsApp`) get primary treatment — they're the actual conversion action on this site.

**Section divider — the signature element**
A recurring tick-mark row (short vertical strokes, like a weighing-scale gradation), rendered in Barind Rust, used between major sections instead of a plain rule line or numbered markers (01/02/03). This is literal to what the farm does — it's not decoration for its own sake. Keep it thin (1–2px strokes), low height (~12px), full content-width or centered short — pick one and stay consistent.

**Cards** (What We Do, future Gallery items)
Paper White background, 8px radius, no drop shadow — use a 1px Steel Mesh border instead of shadow for the "premium minimal" feel (shadows read soft/generic; hairline borders read precise).

---

## Imagery & Placeholder Rules

**Right now (no real photos yet):**
- Do NOT use stock farm/chicken photography, even as a placeholder. It reads as generic the moment anyone sees it, and undercuts the mono-adjacent premium goal.
- Placeholder treatment: solid Steel Mesh grey blocks at the correct target aspect ratio, with a small centered Plex Mono label (e.g. `PHOTO — 4:5`). Honest about being a placeholder, holds the grid correctly.
- Hero, since it has no photo to lean on: thin single-weight line-art illustration (outline of a hen, feather, or the tick-mark motif scaled up) in Ink Black, on Ivory Shell — carries the visual weight typography alone can't.

**Once real photos exist (pre-launch swap):**
- Treat all farm photography in true black & white or a tight duotone (Ink Black → Ivory Shell), not full color — this is where the black-and-white instinct from earlier still earns its place: on photography specifically, where it reads premium and editorial instead of empty.
- Aspect ratios: 4:5 for gallery grid items, 16:9 for any hero/banner photo.

---

## Motion

Minimal, functional only:
- Hero text: fade + 8px slide-up on load, ~400ms, ease-out.
- Sections: fade + 8px slide-up on scroll-into-view, staggered ~60ms per child if a group.
- No parallax, no hover-triggered scale/zoom, no auto-playing background motion.
- Respect `prefers-reduced-motion` — disable all of the above for users who request it.

Reasoning: your actual audience is on mobile, possibly weaker connections outside Dhaka. Restraint here isn't just taste, it's load performance.

---

## Copy Voice
Plain, direct, short sentences. No "industry-leading," "passionate about quality," "state-of-the-art" filler. Say what the farm actually does, in language a buyer or neighbor would use, not marketing language.

---

## Accessibility / Quality Floor
- Ink Black (`#14120F`) on Ivory Shell (`#F7F1E4`): passes AA/AAA for all text sizes.
- Barind Rust (`#9A3324`) on Ivory Shell: passes AA for large text/buttons — verify in-browser before shipping body-size rust text.
- All interactive elements need a visible focus outline (2px, Rust or Ink Black — don't rely on browser default).
- Minimum tap target: 44x44px for Call/WhatsApp buttons.

---

## Tech Notes (carried from the earlier brief)
Next.js static site, single page, content in one constants file. No CMS, no backend, no form service — `tel:` and `wa.me` links only. Deploy on Vercel.
