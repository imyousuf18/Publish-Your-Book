# Publish Your Book — website

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript.

## Getting started

```bash
npm install
npm run dev
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`.

## Where things live

```
src/
├── app/
│   ├── layout.tsx          Root layout: fonts, metadata, header/footer, skip link
│   ├── page.tsx            Homepage — composes the sections below, in order
│   ├── globals.css         DESIGN TOKENS + base styles  ← the whole look lives here
│   ├── not-found.tsx       404
│   └── {about,contact,pricing,privacy,services,terms}/
│                           Route stubs so the nav never dead-ends
├── components/
│   ├── layout/             SiteHeader, SiteFooter, PageIntro
│   ├── sections/           One file per homepage band
│   └── ui/                 Container, Section, Button, Eyebrow, ImageSlot
└── lib/
    ├── site.ts             All copy, nav, and section content
    └── utils.ts            cn() — class merging, configured for our token names
```

Two rules keep this easy to restyle:

1. **No component hard-codes a colour, size, radius, or font.** They all reference
   tokens from `globals.css`.
2. **No component hard-codes copy.** It all comes from `src/lib/site.ts`.

## Applying the real design

> **The visual design has not been applied yet.** The design lives in a Claude
> Design project that needs an interactive `/design-login`, which was not
> available in the session that scaffolded this. The colours, type scale, and
> spacing currently in `globals.css` are a neutral editorial **placeholder** —
> deliberately plain, and chosen to be easy to overwrite.

To apply it, get these files from the design project:

- `Publish Your Book - Homepage (Desktop).dc.html` — the artboard: layout, section order, copy
- `_ds/modernist-edd69724-c156-4c35-b8c4-3dc2244cb3f6/styles.css` — **the important one**: the token values
- `_ds/modernist-.../_ds_bundle.js` — component definitions
- `image-slot.js`, `support.js` — Claude Design canvas runtime; not needed for the site

Then:

1. Copy the custom-property values out of the design's `styles.css` into the
   `@theme` block in `src/app/globals.css`, matching them up by role
   (surface / text / accent / border / radius / type scale). Most of the reskin
   happens here.
2. If the design's font-size token *names* differ from ours
   (`display`, `h1`, `h2`, `h3`, `lead`, `eyebrow`), update the `fontSizes`
   array in `src/lib/utils.ts` to match — see the note in that file.
3. Swap the typefaces in `src/app/layout.tsx` (`next/font/google`).
4. Reconcile section order and copy in `src/app/page.tsx` and `src/lib/site.ts`
   against the artboard.

### Why step 2 matters

The same applies to the custom `rounded-*` (`card`, `pill`) and `shadow-*` (`card`, `lift`)
tokens: unregistered, an override like `rounded-[3px]` loses to `rounded-card` on CSS order.
Register every new custom radius or shadow token in `src/lib/utils.ts` too.

`tailwind-merge` needs to know which `text-*` classes are font sizes. If it does
not, it treats `text-lead` and `text-ink-muted` as conflicting utilities and
silently drops the size — the class vanishes from the DOM with no error. Any new
`--text-*` token must be added to `fontSizes` in `src/lib/utils.ts`.

## Images

`ImageSlot` renders a labelled placeholder box until you pass a `src`, then
switches to an optimised `next/image`. Layout does not shift when artwork lands.
Add remote image hosts to `images.remotePatterns` in `next.config.ts`.

## Notes for what comes next

- Everything is a Server Component; nothing needs `"use client"` yet. The FAQ
  accordion uses native `<details>` rather than client-side state.
- The contact page is a stub — no form handler is wired up.
- ESLint is pinned to 9.x: `eslint-config-next@16` bundles an
  `eslint-plugin-react` that crashes on ESLint 10.
