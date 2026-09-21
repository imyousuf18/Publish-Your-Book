# Architecture

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** App Router, Turbopack | Breaking changes vs older Next — read `node_modules/next/dist/docs/` before using an API you are unsure of |
| UI | React 19, TypeScript (strict) | |
| Styling | **Tailwind CSS v4**, CSS-first `@theme` | No `tailwind.config.*` — tokens live in `src/app/globals.css` |
| Motion | GSAP 3.15 + ScrollTrigger + SplitText, `@gsap/react` | |
| Smooth scroll | Lenis, driven from `gsap.ticker` | |
| Icons | Phosphor, `@phosphor-icons/react/dist/ssr` | Plain names: `List`, `X`, `ArrowUp`, `ArrowUpRight` |
| Class merging | `clsx` + `tailwind-merge` via `cn()` | Custom tokens must be registered — see `CONVENTIONS.md` |
| Lint | ESLint **9.x** pinned | `eslint-config-next@16` crashes on ESLint 10 |

Scripts: `npm run dev | build | start | lint | typecheck`.

## File map

```
src/
├── app/
│   ├── layout.tsx       Fonts, metadata, loader, header, #page-content, footer
│   ├── page.tsx         Homepage — composes sections in order
│   ├── globals.css      ALL design tokens + base styles + hand-written CSS blocks
│   ├── {services,process,work,genres,about,case-studies,author-guide,pricing,contact}/
│   │                    Real pages, one per nav item — see "Inner pages" below
│   ├── services/[slug]/ The six individual service pages (SSG, dynamicParams off)
│   ├── {privacy,terms}/ Short legal pages (noindex)
│   └── {sitemap,robots}.ts  Generated /sitemap.xml and /robots.txt
├── components/
│   ├── book/Book.tsx            3D book markup (820×540 px space, pure markup)
│   ├── loader/BookLoader.tsx    Full-screen intro that steps through the book
│   ├── layout/
│   │   ├── SiteHeader.tsx       Top header ↔ bottom dock ↔ hidden (3 states)
│   │   ├── NavCapsule.tsx       Dark pill nav with animated ring + "More"
│   │   ├── SiteFooter.tsx       Footer (#site-footer)
│   │   ├── FooterReveal.tsx     Measures footer → --footer-h, enables reveal
│   │   └── PageIntro.tsx        Inner-page heading block
│   ├── motion/
│   │   ├── SmoothScroll.tsx     Lenis setup; exports getLenis/lockScroll/unlockScroll
│   │   ├── HorizontalTrack.tsx  Pinned sideways-scrolling track (props: center, trailing)
│   │   ├── TextReveal.tsx       SplitText line reveal
│   │   ├── Reveal.tsx           Fade/rise on enter
│   │   ├── Parallax.tsx         Scroll-linked drift
│   │   ├── Tilt3D.tsx           Perspective root: scroll turn + pointer tilt on nested layers
│   │   └── ScrollLine.tsx       A line that draws itself as its parent scrolls past
│   ├── service/                 Service-page blocks: ServiceHero (+ServiceObject, JourneyRail),
│   │                            ServiceSignals, ServiceProcess, ServiceBeginEnd,
│   │                            ServicePortfolio (+Book3D), ServiceNext, ServiceStart,
│   │                            ServiceRoad (the /services road map)
│   ├── seo/JsonLd.tsx           Renders a JSON-LD script
│   ├── sections/                One file per homepage band
│   ├── pages/                   Inner-page blocks: PageHero, FaqList, PointGrid,
│   │                            ServiceRows, PlanCards, AboutStory
│   ├── forms/ContactForm.tsx    Validated enquiry form (client)
│   └── ui/                      Button (+ RollingLabel), Container, Section, Eyebrow, ImageSlot
└── lib/
    ├── site.ts          Site-wide copy, nav, section content, resolveSiteUrl()
    ├── service-pages.ts Full copy for the six service pages (split out for size)
    ├── schema.ts        JSON-LD builders: organisation, service, breadcrumb, list, FAQ
    └── utils.ts         cn() with extendTailwindMerge
public/
├── Assets/              Logos (logo-wordmark.png is the trimmed header logo)
└── images/{services,covers,cases}/   WebP artwork
docs/                    You are here
```

## Homepage section order

`Hero → Journeys → Services → Process → GenresList → Work → Cases →
TestimonialFeature → ArticlesList → CtaBanner`

`Genres.tsx`, `Testimonials.tsx` and `Articles.tsx` are **unused alternates** kept
from an earlier layout (0 importers). Do not edit them expecting a visible change;
see `ROADMAP.md` for the pending decision on deleting them.

## Inner pages

Every page is `PageHero` → body sections → `CtaBanner`. Hero copy lives in
`pageHeroes` in `site.ts` (`title` + italic `em`).

| Route | Body sections |
|---|---|
| `/services` | ServiceRoad (six-stop road map) · ServiceRows (6 rows, each linking to its page) · Journeys · FaqList |
| `/services/[slug]` | ServiceHero · ServiceSignals · PointGrid (what you get) · ServiceProcess · ServiceBeginEnd · ServicePortfolio · FaqList · ServiceNext · ServiceStart (no CtaBanner) |
| `/process` | Process · PointGrid (sign-off points from `stages`) · FaqList |
| `/work` | Work (filterable covers) · TestimonialFeature |
| `/genres` | GenresList · Work |
| `/about` | AboutStory · PointGrid (`values`) · Journeys · TestimonialFeature |
| `/case-studies` | Cases · TestimonialFeature |
| `/author-guide` | ArticlesList · FaqList |
| `/pricing` | PlanCards (no prices — quoted per manuscript) · PointGrid (`pricingFactors`) · FaqList |
| `/contact` | compact PageHero · ContactForm (no CtaBanner) |

`PageHero` props: `cta` (primary button + email link, default on) and `compact`
(smaller heading, used on Contact so the form starts above the fold).

Nav and footer link to these pages, not homepage anchors. The homepage
sections keep their `id`s, so old `/#services`-style links still work.
`NavCapsule` marks the current page with `aria-current="page"`.

## Service pages

`/services/[slug]` is one template driven by `src/lib/service-pages.ts`. Slugs
(`book-ghostwriting`, `book-editing`, `book-cover-design`,
`childrens-book-illustration`, `book-publishing`, `book-marketing`) are keyword
URLs and are defined once, on each entry of `services` in `site.ts`; the page
content is keyed to them. `dynamicParams = false`, so any other slug is a 404.

The pages are ordered as a journey: hero (with a rail showing all six stops) →
is it for you → what you get → how it is done → how it begins and ends → proof →
questions → next stop → start. The last section opens the same `JourneyDialog`
form as the homepage, with the question set in `detail.journey` and a `service`
field on the submission. To add a service: add it to `services` in `site.ts`, add
an entry to `serviceDetails`, and it appears in the routes, sitemap, footer and
road map with no other change.

Each page emits `Service`, `BreadcrumbList` and `FAQPage` JSON-LD and sets its
own title, description, keywords, canonical and Open Graph in `generateMetadata`.

## Data flow

Content is static TypeScript. Sections import from `src/lib/site.ts` (and the
service pages from `src/lib/service-pages.ts`) and render.
No CMS, no API, no database. (Sanity was discussed as a future CMS; not adopted.)

## Server vs client

Sections and pages are Server Components by default. Anything with GSAP, Lenis,
scroll listeners, pointer state or form state is `"use client"` (12 files today).
Keep new sections server-side unless they genuinely need the browser.

## Layout layering (important)

```
BookLoader        fixed, z-[200]   — removed from the DOM when finished
SiteHeader        fixed, z-50      — header at top, dock at bottom
#page-content     relative, z-1, opaque bg, margin-bottom: var(--footer-h)
#site-footer      fixed bottom-0, z-0  (only when html[data-footer-reveal="on"])
```

Anything added between header and footer must go inside `#page-content`, or it
will not slide off the footer with the rest of the page.
