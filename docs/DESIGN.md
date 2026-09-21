# Design system

Every value below is a token in the `@theme` block of `src/app/globals.css`.
**Change the token, never hard-code the value in a component.**

## Colour

Background and orange taken from **eleken.co** (sampled from the live site) for a
natural, warm, editorial feel.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `paper` | `#f9f7f3` | Page background (eleken off-white) | — |
| `surface` | `#ffffff` | Cards | — |
| `surface-alt` | `#e6e4e0` | Tinted bands, footer | — |
| `ink` | `#1d1e22` | Primary text | 15.6:1 on paper |
| `ink-muted` | `#52535a` | Body copy, secondary | 7.15:1 |
| `ink-subtle` | `#616269` | Captions, labels | 5.67:1 paper, 4.78:1 surface-alt |
| `line` | `#dcd9d3` | Borders, dividers | — |
| `accent` | `#9e4606` | Orange **text** | 5.89:1 paper, 4.96:1 surface-alt |
| `accent-hover` | `#833a05` | Hover for accent text | — |
| `accent-bright` | `#ff8308` | Eleken orange — **fills only** | ink on it: 6.74:1 |
| `accent-tint` | `#ff9d3d` | Orange on dark bands | 8.04:1 on inverse |
| `accent-soft` | `#ffeedd` | Pale orange wash | — |
| `inverse` / `inverse-ink` | `#1d1e22` / `#f9f7f3` | Dark bands | — |
| `book-cover/inner/page` | `#1d1e22` / `#2a2b30` / `#f2efe9` | Loader book only | — |

### The orange rule — do not break it

Eleken's `#ff8308` is **2.31:1 on paper and 2.47:1 under white text**. It fails
AA for text in every combination except dark text on top of it.

- Orange **fill** (buttons, CTA circles, ring) → `bg-accent-bright text-ink`. Never `text-white`.
- Orange **text** → `text-accent` (the darkened `#9e4606`).
- Orange on dark backgrounds → `accent-tint`.

The site currently has **0 contrast failures**. Any new colour pairing must be
checked before it ships.

## Typography

| Role | Face | Where |
|---|---|---|
| Display | **Playfair Display** 400/500, normal + *italic* | `h1–h4`, via `font-display` |
| Body / UI | **Roboto** 300–700 | Everything else, via `font-sans` |

- Headings are weight **400** (set in base styles) — elegance comes from size, not weight.
- **Italic is the signature**: one emphasised word or phrase per headline, same face.
  Current uses: *template.* (hero), *shelf.* (services), *nothing hidden.* (process),
  *chapters.* (CTA). Use it sparingly — one per heading at most.
- Root size is fluid: `html { font-size: clamp(16px, 7.36px + 0.65vw, 24px) }`.
  **Every rem grows with the viewport** — 16.7px at 1440, 19.7px at 1900. Test
  tall components at wide viewports, not just 1440.

Type scale tokens (`text-*`) are **fluid and mobile-first**: `clamp(phone, fluid, desktop)`.

| Token | Phone (floor) | Desktop (cap) |
|---|---|---|
| `mega` | 3rem (48px) | 7rem |
| `display` | 2.5rem (40px) | 5rem |
| `h1` | 2.125rem (34px) | 3.5rem |
| `h2` | 1.75rem (28px) | 2.25rem |
| `h3` | 1.25rem (20px) | 1.5rem |

Caps are reached around 1100–1300px, so desktop is unchanged. They were fixed rem
before, and the root floors at 16px, so a phone got desktop sizes (display 80px on
390px) and long words filled the screen. `lead` 1.0625rem and `eyebrow` 0.9375rem
are fixed.

The loader book (`Book.tsx`) pins its text in **px**, not rem, because it lives in
a fixed 820×540 coordinate space that must not scale with the root.

## Shape and depth

| Token | Value | Source |
|---|---|---|
| `rounded-card` | `1rem` (~16–17px) | umanodesign.studio — radii cluster at 10–16px |
| `rounded-panel` | `1.25rem` (~21px) | umano feature cards — media panels (Services track) |
| `rounded-pill` | `999px` | Buttons, nav |
| `shadow-card` / `shadow-lift` | soft two-layer | Resting / raised |

Book covers deliberately use `rounded-[3px]` — real books have near-square corners.

## Layout

**Mobile-first.** Base classes are the phone layout; `sm:`/`md:`/`lg:` add to it.
Two custom variants cover layouts that need *height* as well as width (a phone
held sideways is 844px wide but only 390px tall):

| Variant | Means | Used for |
|---|---|---|
| `roomy:` | ≥768px wide **and** ≥600px tall | Journeys sticky stack |
| `pin:` | roomy **and** motion allowed | Pinned horizontal tracks |

Defined with `@custom-variant` at the top of `globals.css`. HorizontalTrack's
`gsap.matchMedia` string must match `pin` exactly.

- Content column: `max-w-site` = **1200px**, via `Container` (`px-6`, `lg:px-10`).
- Full-bleed horizontal tracks align their first card with the column using
  `.track-inset` (mirrors Container padding — keep them in sync).
- `body { overflow-x: clip }` — `clip`, not `hidden`, so sticky and pins still work.

## Depth (3D)

Service pages use real CSS 3D, not fake shadows: a hero object on stacked sheets
with floating chips, and standing books for the portfolio. It stays inside the
palette: `accent-soft` and `inverse` sheets, `accent-bright` fills carrying `ink`
text (the number disc), white chips with `shadow-lift`. Depth is for objects. Text
and layout never tilt. See INTERACTIONS.md section 9 for how each piece works.

## Motion principles

From the alfdesigngroup UX article: **UI transitions 150–400ms**. Hover and
state changes use 200–380ms. Only scroll-driven choreography (loader, pinned
tracks) runs longer, because the reader controls its pace.

Every animation must have a `prefers-reduced-motion` path. The global reduce
block in `globals.css` zeroes CSS transitions; GSAP code checks the media query
itself.

## Reference sites and what was taken from each

| Site | Taken | Not taken |
|---|---|---|
| **creativeans.com** | Nav structure: logo left, centred capsule, two actions right; top header → bottom dock; Roboto + regular-weight serif with italic emphasis; fluid root | Their Memogram font (commercial licence) |
| **eleken.co** | Off-white `#f9f7f3`, orange `#ff8308`, tinted band, near-black | Using the orange for text (fails AA) |
| **umanodesign.studio** | Simplicity; native cursor; 16px radii; Lenis; **Services card structure** — tinted 21px media panel + caption on the page (icon, title, one line), no card box, 33px gap | Their bold sans titles (we keep Playfair) |
| **orionix.framer.website** | Button **label roll**; project-tile **image zoom inside a fixed rounded clip** | Framer runtime |
| **wearedirect.co** | Footer revealed from the bottom as the page slides off it | Their literal sticky-section method (conflicts with our pins) |
| **alfdesigngroup.com** (article) | 150–400ms UI motion, 4.5:1 contrast, 44px targets, form rules, mobile-first 390px | — |
| nbnzia.com, riangle.com | Early motion direction: SplitText reveals, sticky stacks, horizontal tracks, parallax | — |

## Imagery

WebP under `public/images/`, rendered through `ImageSlot` (fixed aspect ratio,
labelled placeholder until `src` is set, so layout never shifts). Every image
needs meaningful `alt` text from `site.ts`. Current artwork is CC0 or generated —
replace with real client covers when available.
