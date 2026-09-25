# Project brief

## What this is

The marketing website for **Publish Your Book**, an independent book-publishing
services company based in Chicago, Illinois. It takes an author from a draft or a
finished manuscript to a published, distributed book.

- Tagline: *From finished manuscript to published author.*
- Positioning: *Your book deserves better than a template.* Edited, designed and
  distributed properly — **the author keeps every right and every royalty.**
- Contact: `info@publishyourbook.us` · `site.address` in `site.ts` (3525 W
  Peterson Avenue, Suite 400, Chicago, IL 60659) — used on `/terms`, `/privacy`
  and in the business JSON-LD in `schema.ts`.

## Who it is for

Three entry points, mirrored in the homepage "Journeys" section:

| Journey | Author's situation |
|---|---|
| I Have an Idea | Needs writing or ghostwriting help to get to a manuscript |
| I Have a Manuscript | Needs editing, design and publishing |
| My Book Is Ready | Needs distribution and marketing |

## Services (six)

Writing & ghostwriting · Editing & proofreading · Book cover & interior design ·
Children's book illustration · Publishing & distribution · Book marketing.

Canonical wording lives in `src/lib/site.ts` (`services`). Do not invent services
or prices that are not there.

## Goals of the site

1. **Convert** — every page leads to *Start your book* (`/contact`). The contact
   form is the primary conversion.
2. **Earn trust** — real process (six stages), real covers, case studies and
   testimonials; no inflated claims.
3. **Feel premium and editorial**, not templated — a book-publishing brand should
   read like a well-made book. See `DESIGN.md`.
4. **Be accessible to everyone** — WCAG AA contrast, keyboard access, reduced
   motion, 44px touch targets, no motion that traps the reader.
5. **Stay easy to change** — all copy in one file, all visual values in one file.

## Tone of voice

Plain, confident, specific. Short sentences. No hype, no exclamation marks, no
"unlock your potential". Speak to the author as a peer. Honest about what is
included ("Nothing is bundled to pad an invoice.").

## Deployment

| | |
|---|---|
| Repo | `github.com/imyousuf18/Publish-Your-Book`, branch `main` |
| Hosting | Vercel project `publishyourbook` |
| Node | `>=20.9.0` |
| Site URL | from `NEXT_PUBLIC_SITE_URL`, falling back to `VERCEL_URL`, then localhost — see `resolveSiteUrl()` in `src/lib/site.ts` |

## Current status

The homepage and all nine nav pages are built. Each of the six services has its
own page under `/services/[slug]`, laid out as a journey from "is it for you" to a
closing call to action; `/services` is the road map that links to them. `/privacy`
and `/terms` have short drafted copy that a lawyer must review. `/contact` and the
journey pop-up form are validated **with no backend yet**.
See `ROADMAP.md` for everything open.
