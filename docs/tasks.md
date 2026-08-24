# ZeroD Farms — Task Breakdown

## Phase 1: Foundation
- [x] 1.1 Read and understand all docs (PRD, design, SEO)
- [x] 1.2 Create memory.md with project context
- [x] 1.3 Create tasks.md (this file)
- [x] 1.4 Set up design tokens in globals.css (colors, fonts, spacing)
- [x] 1.5 Load custom fonts (Zilla Slab, IBM Plex Sans, IBM Plex Mono) via next/font
- [x] 1.6 Update layout.tsx with proper metadata + fonts + JSON-LD
- [x] 1.7 Add robots.txt to public/

## Phase 2: Core Components
- [x] 2.1 Create Tailwind config with design system tokens (in globals.css @theme)
- [x] 2.2 Build SectionDivider component (tick-mark motif)
- [x] 2.3 Build Button component (primary + secondary variants)
- [x] 2.4 Build Card component (Paper White, Steel Mesh border)
- [x] 2.5 Build PlaceholderBlock component (Steel Mesh with aspect ratio label)

## Phase 3: Sections
- [x] 3.1 Build Navigation (sticky top bar, hamburger mobile)
- [x] 3.2 Build Hero section (full-bleed placeholder, headline, CTA)
- [x] 3.3 Build Our Production section (3-card row, pending blocker)
- [x] 3.4 Build Gallery section (3-column grid, placeholder)
- [x] 3.5 Build Our Farm (About) section (resolved content)
- [x] 3.6 Build Timeline section (2 data points)
- [x] 3.7 Build Our Team section (founder only)
- [x] 3.8 Build Our Vision section (resolved content)
- [x] 3.9 Build Global Poultry Dataset section (pending CTA)
- [x] 3.10 Build Contact section (resolved content, semantic HTML)
- [x] 3.11 Build Footer

## Phase 4: Animation & Polish
- [x] 4.1 Add Intersection Observer hook for scroll animations
- [x] 4.2 Add fade + slide-up animation to sections
- [x] 4.3 Add prefers-reduced-motion support
- [x] 4.4 Responsive testing (375px → 1440px)

## Phase 5: SEO
- [x] 5.1 Add JSON-LD structured data (LocalBusiness)
- [x] 5.2 Add Organization schema for ZeroD parent
- [x] 5.3 Add meta tags + OG tags in generateMetadata
- [x] 5.4 Create sitemap.ts
- [x] 5.5 Verify semantic HTML (h1, h2, nav, address)

## Phase 6: Final
- [x] 6.1 Run build, fix any errors
- [x] 6.2 Run lint, fix any warnings
- [ ] 6.3 Update README.md with project-specific info
