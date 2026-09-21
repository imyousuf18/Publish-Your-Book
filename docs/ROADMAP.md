# Roadmap and open items

Last updated: 2026-09-19.

## Needs a human test (built, not motion-verified)

The agent's browser pane cannot run scroll animation (see `CONVENTIONS.md`), so
these were verified by layout and logic only:

- [ ] **Book loader** — one page per gesture on mouse wheel, trackpad (with
      inertia) and phone swipe; Skip button; Escape.
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

- [ ] **Confirm the service-page copy.** `service-pages.ts` describes each process
      in general terms and invents no numbers, prices or turnarounds. Check every
      step, deliverable and FAQ against how the business really works, and add real
      timelines where the business wants to publish them.
- [ ] **Proof on service pages.** They reuse the placeholder covers and the two
      case studies already on the site. Marketing shows a note instead of work.
      Replace with real client work, and add case studies for editing, publishing
      and marketing when they exist.

- [ ] **Wire both forms to a backend.** The contact form and the journey pop-up
      form validate and show a thank-you state but send nothing. The journey form
      includes a **manuscript file upload** (up to 25 MB), so the endpoint must
      accept multipart data and store files (e.g. Vercel Blob or S3); an email
      service like Resend alone cannot take a 25 MB attachment. Add spam protection
      (honeypot or Turnstile) and server-side validation that mirrors the client
      rules, and include the `journey` field in the notification.
- [ ] **Legal pages.** `/privacy` and `/terms` are stubs and need real legal copy.
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
- [ ] Lighthouse pass: LCP < 2.5s, CLS ~0 (loader must not delay content paint).

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

Mobile-first responsive pass: fluid type scale; `roomy:`/`pin:` height-aware
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
