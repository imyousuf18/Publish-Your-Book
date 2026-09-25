# Roadmap and open items

Last updated: 2026-09-19.

## Needs a human test (built, not motion-verified)

The agent's browser pane cannot run scroll animation (see `CONVENTIONS.md`), so
these were verified by layout and logic only:

- [ ] **Homepage intro (video)** — watch it on a real machine and a real
      iPhone (autoplay, Low Power Mode → fades straight away) and Android. The
      frames, cuts, timings and skip rules were verified in headless Chrome.
- [ ] **Hero toolbar demo** — watch the pointer demo and the invitation on a
      real phone; check a first-time visitor clicks the bar unprompted.
- [ ] **Nav hand-over** — header rises away and the dock rises in, tied to the
      scroll and reversing on scroll-up; the dock stays when scrolling up mid-page.
- [ ] **Footer reveal** slides smoothly; dock hides once the footer shows.
- [ ] **Journey pop-up** open/close animation, and wheel/touch scrolling inside
      the form on a real trackpad and phone.

- [ ] **Service pages** — check by hand on a real device: hero tilt follows the
      pointer, the process line fills while scrolling, standing books square up on
      hover, and the closing button opens the right form. Also open each of the six
      pages on a phone; overflow was measured at 390px (none) but not touched.

## Before launch

- [ ] **Confirm the Author Guide articles' facts.** `articles.ts` gives real,
      substantive advice but invents no company facts (no prices, no invented
      statistics). Have someone who does the work read all ten against how the
      business actually operates, and note that `publishedDate` in `articles.ts`
      is a single shared date — split it out per article if these are meant to
      look like they were written over time rather than published together.
- [ ] **Confirm the service-page copy.** `service-pages.ts` describes each process
      in general terms and invents no numbers, prices or turnarounds. Check every
      step, deliverable and FAQ against how the business really works, and add real
      timelines where the business wants to publish them.
- [ ] **The two `cases` case studies (and their testimonial quotes) are still
      fictional placeholders** — Long Way from Kerrville and Mabel and the Nine
      Moons, with invented word counts, timelines and quotes. The `covers`
      portfolio is now real (see Done, below); these two in-depth case studies
      were out of scope for that pass and still need real client stories, or to
      be removed until there are some. Marketing's service page still shows a
      note instead of work for the same reason.

- [ ] **Wire both forms to a backend.** The contact form and the journey pop-up
      form validate and show a thank-you state but send nothing. The journey form
      includes a **manuscript file upload** (up to 25 MB), so the endpoint must
      accept multipart data and store files (e.g. Vercel Blob or S3); an email
      service like Resend alone cannot take a 25 MB attachment. Add spam protection
      (honeypot or Turnstile) and server-side validation that mirrors the client
      rules, and include the `journey` field in the notification.
- [ ] **Legal pages need a lawyer's review before launch.** `/terms` and `/privacy`
      (`src/lib/legal.ts`) are drafted, modeled on a sister site's structure,
      covering scope, payment, refunds, ownership and data handling for Chicago,
      IL. They state real commitments (e.g. the refund and revision terms) that
      the business must actually be able to keep, and use Illinois as the
      governing law — confirm both before this goes live.
- [ ] **Review page copy.** About, Pricing and the FAQs were written from the brief
      without company facts: no founding year, team, numbers or prices were
      invented. Add real ones where the business wants them.
- [ ] **Real artwork.** Replace CC0/generated images with client covers and
      case-study photography (update `alt` text in `site.ts`).
- [ ] **Vercel deployment.** Commit `a4e8d70` was pushed but the live site kept
      serving an older build. Check the Deployments tab before pushing more.
- [ ] Commit and push the current local changes (palette, loader, form, footer,
      hover work — all uncommitted as of this date).
- [ ] Open Graph image (`twitter.card` is `summary_large_image` but no image is set).
- [ ] Lighthouse pass: LCP < 2.5s, CLS ~0 (the intro's still paints with the HTML; check LCP is not attributed to the overlay).

## Decisions pending

- [ ] Delete unused alternates `Genres.tsx`, `Testimonials.tsx`, `Articles.tsx`,
      or swap them back in for `GenresList` / `TestimonialFeature` / `ArticlesList`.
- [ ] Display font: Playfair Display is the choice now. Memogram (the creativeans
      font) needs a commercial licence; `layout.tsx` would swap to `next/font/local`.
- [ ] CMS: Sanity was discussed so non-developers can edit copy. Not started; the
      single `site.ts` content file makes the migration straightforward.

## Nice to have

- [ ] Genres track: review whether it needs `center` / `trailing` like Services.
- [ ] Move image-generation scripts (currently in a temp scratchpad) into `scripts/`
      (`scripts/mobile-audit.js` is already there).
- [ ] Analytics (Vercel Analytics) with conversion event on form submit.

## Done (recent)

Contact email changed sitewide to `info@publishyourbook.us` (was
`hello@publishyourbook.com`) — single source, `site.email` in `site.ts` ·
Real portfolio: the 8 placeholder covers replaced with the 28 real books from
Bright Ink Publishings' portfolio (same owner's sister brand), downloaded from
the live site and converted to webp in `public/images/covers/`; `covers` in
`site.ts` now has real titles, authors, genres and alt text; `heroShelf` and
every service page's `portfolio.covers` list updated to titles that actually
exist (they were pointing at the removed placeholders); two now-orphaned
portfolio quotes (citing removed titles) removed rather than left pointing at
nothing — see "Before launch" for what's still a placeholder (the two `cases`
case studies) ·
Ten full Author Guide articles (`articles.ts`), each with its own page at
`/author-guide/[slug]` — intro, sections, key takeaways, a related service or
page link, Article/Breadcrumb JSON-LD; `ArticlesList` now links every row to a
real page instead of `/#articles`; homepage shows a five-article
`featuredHome` subset, `/author-guide` shows all ten; both in the sitemap ·
Intro rebuilt as a pre-rendered video (studio + render script, landscape/portrait cuts, starts before hydration, fades into the page), mounted above the header; hero toolbar made obviously interactive (one-time pointer demo, text cursor, selection, "Your turn" invitation, breathing ring) · Homepage intro replaces the scroll-driven loader: plays itself once per visit, homepage only, any input skips, 3.2s deadline; book on screen at first paint (was ~9.5s) — one shared shader program instead of nine, async compile, screen-sized page textures, three.js fetched early · Terms of Service and Privacy Policy rewritten with real sections (scope, payment,
refunds, ownership, data handling), modeled on a sister site; business location
and address moved from Austin, TX to Chicago, IL sitewide (`site.address` in
`site.ts`, the About page, the loader's back cover, and the JSON-LD schema) ·
Real 3D book loader: pages are geometry, bent in a vertex shader as they turn,
lit by real lights; covers and pages drawn from the brand; CSS book kept as the
no-WebGL fallback; three.js lazy-loaded and absent from first load · Fixed the
loader showing every page twice (verso repeated its own recto) · Mobile-first responsive pass: fluid type scale; `roomy:`/`pin:` height-aware
variants (sideways phones get stacked cards and native swipe); fixed a page-wide
sideways-scroll leak on phones (sr-only labels escaping the Services scroller);
pricing cards fit 320px; footer 36% shorter on phones; 44px targets everywhere;
larger loader book and "Swipe to turn" on touch; reduced-motion users can reach
all Services cards · Six individual service pages with a journey structure, 3D hero object and
standing-book portfolio, per-page metadata and Service/Breadcrumb/FAQ JSON-LD,
`/services` reworked as a road map, sitemap and robots, nav highlight on
sub-pages · Visible copy rewrite across the site · SEO metadata and FAQ schema ·

Journey pop-up form: one dialog, three question sets, records which card was
clicked, manuscript upload with drag-and-drop · All nine nav pages built (Services, Process, Work, Genres, About, Case studies,
Author guide, Pricing, Contact) · nav points at pages with current-page state ·
compact masthead on Contact (form above the fold) · Eleken palette with AA-safe orange split · Playfair revert with italic accents ·
smaller logo · Services cards centred and capped, last card rests mid-screen ·
one-page-per-gesture loader with Skip/Escape · native cursor · accessible contact
form · 44px footer targets · dock persists on scroll-up · orionix label roll and
image zoom · wearedirect footer reveal · dock hides at footer · UI transitions
300ms · 0 contrast failures.
