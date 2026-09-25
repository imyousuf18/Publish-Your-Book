# Interactions and motion

How each moving part works, and the constraints that shaped it. Read the relevant
section before changing any of these — most of them were rebuilt at least once
after a user-reported bug.

## 1. Homepage intro — `components/loader/BookLoader.tsx`, `lib/intro.ts`

A short **video** of the book: it rises and settles, opens, turns its five pages,
closes and turns over — then the homepage fades in. ~3.5s. **Once per visit, only
when a visit lands on the homepage**, and any input skips it.

**Why a video.** The same book used to run live in WebGL. Even after the fixes
below it needed ~2.8s of downloading and GPU work before it could move on a fast
desktop, missed its deadline on the dev server every time, and on slower phones —
so visitors often saw a closed book lift away without opening. The video is
rendered from that exact scene, frame by frame, so it looks identical; it starts
almost at once on every device; and the homepage ships no 3D code at all.

| Rule | How |
|---|---|
| **Instant** | Frame 0 is a still in the server HTML (`<picture>`, a landscape and a portrait cut), so the book is there at first paint. The `<video>` is in the server HTML too (`INTRO_VIDEO_HTML`, `preload="none"`, sources with media queries so only the fitting cut downloads), and the guard starts it at DOMContentLoaded — it does not wait for the page's JavaScript. |
| **Short** | Plays by itself, then fades (700ms) into the page. The bar under it runs with the video. |
| **Skippable** | Any wheel, touch, pointer-down or key (bar bare modifiers) fades it in 350ms — including input from before the JavaScript arrived (`INTRO_EARLY_SKIP`) and Tab, which then lands on the page's "Skip to content" link (the intro sits after it in the layout for exactly this). No visible Skip button (removed on request) — the intro is short enough not to need one, and any input still dismisses it. |
| **Bounded** | Not playing 500ms after it could have: a small loading ring. Not playing by 2s, stalled for 1.5s, or autoplay refused (iOS Low Power Mode): it fades away. It never holds anyone. |
| **Seen** | A homepage opened in a background tab waits — the play, the clock and the once-per-session flag are all spent only when the tab is looked at. |
| **Once, on landing** | `sessionStorage` (`pyb:intro-seen`); `?intro` in the URL replays it for review. Only when the visit lands on `/`: following a link to Home never plays it. The guard is an inline script in the root layout's `<head>` (once per document — React never runs a script it renders on the client, so it cannot live in a page); it adds `intro-off` to `<html>` for a repeat visit, a non-home landing, reduced motion or Save-Data, and CSS hides `[data-intro]` on it — no flash, no video download. `<html>` carries `suppressHydrationWarning` for that class. |
| **On top** | Mounted from the root layout, after the skip link, and rendered only on `/`. Inside the page it sat in `#page-content` — its own stacking context at z-index 1 — and the header and dock drew over it. |

Two traps met on the way:

- **React does not render the `muted` attribute on `<video>`**, and iOS will not
  autoplay without it — hence the raw HTML string.
- **Nothing may touch the video's attributes before hydration.** The guard set
  `preload` and React reported a hydration mismatch; it now only calls `play()`.

### Re-rendering the video — `app/dev/intro-studio`, `scripts/render-intro.mjs`

The choreography lives in `INTRO_TIMELINE` (`lib/intro.ts`): enter 0.7s, hold
0.15s, play 2.4s, rest 0.25s. To change the book, its cover, the entrance or the
timing, edit the scene or the timeline, then:

```
npm run dev
node scripts/render-intro.mjs
```

The script opens the studio page (development only — a 404 in production) in
headless Chrome at 1920×1080 and 1080×1920, renders every frame at 60fps by
setting the scene exactly, encodes in the browser (WebCodecs via `mediabunny`,
a dev dependency), and writes `public/videos/intro-{landscape,portrait}.{webm,mp4}`
(VP9 ~0.6MB, H.264 ~0.8–0.9MB) and the stills `public/images/intro/intro-*.webp`.
No ffmpeg needed. **Check the fonts first**: if the dev server failed to download
the Google fonts when it started, the cover renders in a fallback face — restart it.

### Speed fixes to the 3D book (still in the scene)

1. **One shader program for every sheet** (`customProgramCacheKey` `"book-sheet"`);
   a key per sheet compiled the same shader nine times. Per-material uniforms
   survive sharing, so leaves still turn one at a time.
2. **`gl.compileAsync` before the first frame.**
3. **Textures sized to the screen** (`superSample()` in `pageTextures.ts`).

**Closing is one movement.** The covers shut and the book turns over to show its
back; the back board never flips (that read as a seventh page turn).

**Recto and verso must differ.** `stages[].note` is the recto, `stages[].detail`
the verso, and folios run 1–10 across the spread.

### The WebGL book — `components/book3d/`

- `pageTextures.ts` draws every face on a 2D canvas (palette from CSS variables,
  type from the next/font families, copy from `site.ts`) in a 900×1186 layout
  space, scaled by `superSample()`. Fonts are awaited first or the artwork bakes
  in a fallback face.
- `BookScene.tsx` builds the sheets **imperatively** and reaches them through a
  ref. A scene is mutated every frame and React rightly forbids mutating values
  created during render.
- Each sheet is a subdivided plane hinged on the spine, bent in a **vertex
  shader** patched into MeshStandardMaterial via `onBeforeCompile`, so the curled
  page keeps real lighting. Both faces are one double-sided mesh; the fragment
  shader picks front or back from `gl_FrontFacing`, mirroring the back in u.
- The book is driven by one number, `flow`: 0 closed, 1 open, 1+n after leaf n,
  one more to close. The intro tweens it from 0 to `stages.length + 2`.

Bugs found while building it, all of which looked like "the turn is broken":

1. **A solid "page block" for bulk enclosed the sheets**, hiding the right-hand
   page. The stacked sheets give the edge its thickness; there is no block.
2. **Turned pages kept their original depth**, behind the opened cover. Each sheet
   carries `zRight` and `zLeft` and travels between the stacks as it turns.
3. **The rotation swung the page away from the reader**, behind the unturned
   stack. It arcs **towards** the reader (+z), with the bow subtracted.
4. **The closed book slid half out of frame** at the end: the mirrored spread
   offset counted twice. Closing returns to the offset it had at the start.

Framing: the camera is pulled in until the book fills the screen. Two distances
are computed from the canvas size — closed book and open spread — and blended as
it opens. `MARGIN` leaves room for Skip and the bottom bar. The studio renders
each video cut at its own aspect ratio, so the framing adapts exactly as the
live scene did. Change the scene, then re-render the video (above).

## 1b. Hero — `components/sections/Hero.tsx`

Built on orionix.framer.website's hero, including its two interactions: a
formatting bar that really restyles the headline, and a WebGL ripple under the
pointer. Centred serif headline, covers floating around it, a soft frame inset
8px from the screen edge, small true details in the foot corners.

**It fits one screen at every size.** The frame is `100svh` (less its inset)
and content is trimmed on short screens instead of letting the frame grow. Two
height variants in `globals.css` drive it:

| Variant | Query | What gives way |
|---|---|---|
| `snug` | max-height 780px | the fanned covers (below `xl`); the pitch paragraph (below `lg`) |
| `short` | max-height 540px (phones sideways) | eyebrow; the note under the bar (still announced, `sr-only`); headline one size down |

Under 360px wide the time is dropped from the foot and the level menu reads
"H1" rather than "Heading 1", or the bar is wider than the screen. Checked at
320×640, 390×844, 844×390, 768×1024, 1024×768, 1280×720, 1440×860 and
1820×1000: exactly one screen, nothing clipped.

### The formatting bar — `hero/EditorHeadline.tsx`, copy in `heroEditor`

- Heading 1/2/3 menu, Bold / Italic / Underline toggles, an ink menu (Ink, Rust,
  and Spruce and Indigo taken from the hero's covers). They set the headline live.
- **Nothing below moves.** An invisible copy of the headline at its widest
  setting (Heading 1, bold) reserves the space; the styled one is centred in it.
- **Menus open where there is room.** Down if 208px fit below, else up, else
  (a phone held sideways, room on neither side) as a single row of choices. The
  frame clips overflow, so a menu hanging off it would be cut off.
- **Layering:** the main block is `z-20`, the foot row `z-10`. Both were
  `z-10`, and on 720px-tall screens an open menu slid under the pitch paragraph.
- **It must look like yours to use.** It used to restyle itself on a loop and
  read as a video — a visitor had to be told it worked. Now, in phases:
  - *waiting* — a text cursor blinks at the end of the headline (`.hero-caret`,
    zero-width so no word moves);
  - *demo*, once, after the intro has gone and the bar is 60% in view: a
    pointer (a tap dot on touch screens) glides in, the headline is "selected"
    (`.hero-select`, the system-blue `--color-selection`, 84% of the glyph box
    so neighbouring lines don't overlap into a dark band), the pointer clicks
    Italic, the headline turns italic;
  - *invite* — "Your turn: style this headline ↑" replaces the line under the
    bar (same height), and the bar's ring breathes (`.hero-invite`);
  - *engaged* — the first pointer-down or focus in it: all of the above stands
    down.
  Clicking the headline — where people try first — selects it and nudges them to
  the bar. Reduced motion: no pointer; the invitation and a steady ring at once.
- a11y: the `<h1>` holds the real title as screen-reader text and the drawn
  version is `aria-hidden`. B/I/U are `aria-pressed` toggles; the menus are
  `menuitemradio` lists (arrow keys, Home/End, Escape returns focus); the note
  under the bar is a polite live region describing the result.
- Playfair Display loads weight 700 for Bold (`app/layout.tsx`).

### The ripple — `hero/RippleField.tsx`

- The same technique as orionix's Framer "Ripple" shader. A height field is run
  through the 2D wave equation on a half-float texture, ping-ponged each frame.
  Pointer movement stamps into it, and pressing strengthens the stamp. Each click
  also launches an analytic expanding ring (up to 8). A small per-channel spread
  gives a colour fringe.
- **What ripples is only a faint typeset spread** (two columns of the process copy
  in 2.2% ink, thinned behind the headline), drawn once into a 2D canvas. **The
  covers are not in it**: they stay ordinary DOM above the canvas. An earlier
  version painted the covers into the surface at orionix's full strength; it was
  too much. Keep it felt, not seen.
- Runs only with a fine hover pointer, without reduced motion, and where WebGL2 +
  `EXT_color_buffer_float` exist. Otherwise it renders nothing. The loop sleeps
  off screen, in a hidden tab, and 4s after the last input.
- The in-app browser pane suspends rAF, so it cannot show this moving. To check it,
  drive headless Chrome over CDP with `--use-angle=swiftshader` and dispatch
  mouse events.

### Covers and foot

- **Covers float in the margins** (`hero/FloatingCovers.tsx`) and drift against
  the pointer at their own depth. `hero/ParallaxFrame.tsx` writes `--mx`/`--my`
  onto the frame, with no React state; touch and reduced motion leave them at 0.
  Scattered from `xl` only; below that, a fanned hand of three sits under the
  buttons (unless `snug`). Covers load with `priority`.
- The foot row: Chicago time (`hero/StudioClock.tsx`, set after mount), the
  pitch, the email.

The previous hero (the shelf of three `Book3D` covers beside the type) is kept
as `sections/HeroShelf.tsx`. To go back, import `HeroShelf as Hero` in
`app/page.tsx`.

## 2. Navigation — `components/layout/SiteHeader.tsx`

Desktop (`lg+`). **The header-to-dock hand-over is scroll-linked**, not a
timed switch: GSAP ScrollTrigger `scrub: 0.5` on the inner bar of each.

```
scroll 0 ───────── 160        header rises off the top (yPercent → -140, fades)
          90 ─────────── 280  dock rises from the bottom (yPercent 170 → 0, fades in)
```

The ranges overlap so it reads as one movement, and scrolling up plays it back
in reverse at the reader's speed. It replaced a flag that flipped at 24px and
ran two fixed 300ms fades, which the user reported as not smooth. Constants
`HEADER_OUT`, `DOCK_IN`, `DOCK_END` in `SiteHeader.tsx`.

Which bar takes clicks is decided by **position only** (not direction):

| State | When | Clickable |
|---|---|---|
| `top` | scroll < 80 (half of `HEADER_OUT`) | Header |
| `transit` | 80–185 | Neither — nothing half-visible can swallow a click |
| `dock` | ≥ 185 (midpoint of the dock range) | Dock |
| `hidden` | footer uncovered by > 72px | Neither — dock slides away (timed, not scrubbed: the footer arriving is an event) |

Layering: movement is on the **inner** bars (`headerBarRef`, `dockBarRef`);
the outer elements only handle `inert`, pointer-events, the footer slide-away,
and the reduced-motion fallback (`motion-reduce:` classes show one bar or the
other with no movement).

Scrolling **up** mid-page keeps the dock. An earlier version hid everything on
scroll-up; the user rejected it. Mobile: compact top bar always visible, full-screen
menu with focus management and Escape to close.

`NavCapsule`: dark pill with a rotating conic-gradient ring (`.nav-ring`,
`@property --ring-angle`). Pointer position is written straight to CSS variables
— never React state (it would re-render on every mouse move).

## 3. Footer reveal — `FooterReveal.tsx` + `globals.css`

Taken from wearedirect.co. The footer is fixed on the bottom layer; the opaque
`#page-content` above it reserves exactly `--footer-h` of bottom margin, so at the
end of the page the content slides up off the footer.

- `FooterReveal` measures the footer (ResizeObserver + resize) and sets
  `--footer-h` and `html[data-footer-reveal]`.
- If the footer is ≥ 95% of the viewport height it cannot be revealed, so it
  falls back to normal flow (`data-footer-reveal="off"`).
- With JS disabled the footer is simply in normal flow.
- Wearedirect uses a sticky last section instead; not copied because it would put
  a sticky stacking context around every ScrollTrigger pin.

## 4. Services horizontal track — `HorizontalTrack.tsx`

Pinned section; the track translates sideways by its real overflow width.

- `center` prop: centres the track in a `min-h-[100svh]` pinned box. Required for
  tall cards — otherwise the card top is cut off by the screen.
- `trailing` prop: padding after the last card. Services uses `md:pr-[34vw]` so the
  final card rests **in the middle of the screen** where it can be read.
- **The centred box reserves the dock's band** (`lg:pb-24`), so cards are centred
  in the space *above* the bottom dock. Without it the card's link sat behind the
  dock on a 1900×855 screen. Any other bottom padding on a centred track is a bug:
  `pb-32` (158px at a 1900px root) caused the earlier "card stuck to the top" bug.
- Measured clearance between card bottom and dock: 117px at 1900×855, 127px at
  1440×820, 115px at 1366×768, 221px at 2560×1300.
- Card design follows umanodesign.studio: a media panel (`rounded-panel`,
  `surface-alt`) and a caption with no box. The panel is **4/3 capped at
  `max-h-[40svh]`**, not umano's 8/7, to keep the whole card short enough to clear
  the dock; the image crops rather than the card growing. Item lists are not on the cards; "What's included" links
  to `/services#service-NN` (anchors on ServiceRows).
- Below `md`: no pin, native horizontal swipe.

## 5. Hover effects (orionix.framer.website)

**Label roll** — all primary buttons and header CTAs. The label renders twice in a
one-line window (`.roll`); on hover/focus-visible `.roll__inner` moves
`translateY(-50%)`, so the second copy replaces the first. The duplicate is
`aria-hidden` (accessible name stays single). Use `ButtonLink`/`Button`, or
`RollingLabel` for hand-built links. Opt out with `roll={false}`.

Written as plain CSS in `globals.css` because Tailwind silently produced **no rule**
for `group-hover:-translate-y-[1lh]`.

**Image zoom** — `ImageSlot zoom` inside a `.group` parent: the image scales to
1.04 inside a clip that does not move. Used on book covers and Services cards.

## 6. Text and scroll reveals

- `TextReveal`: SplitText into masked lines (`.tr-line`), `autoSplit: true` so
  lines re-split after the webfont loads (otherwise lines end ragged).
- `Reveal`: fade + short rise on enter, fires once.
- `Parallax`: small scroll-linked `translateY`.

## 7. Journey pop-up forms — `components/forms/JourneyDialog.tsx`

The three "Three ways in" cards each open a pop-up form with their own
questions. It is **one component with three question sets** (`journeyForms` in
`site.ts`), not three forms, and every submission carries `journey`
(`idea` | `manuscript` | `ready`) so the team knows which card was clicked.

| Card | Asks for (beyond name, email, notes) |
|---|---|
| I Have an Idea | the idea, genre, progress, help wanted, start timeline |
| I Have a Manuscript | **file upload** (Word/PDF/RTF/ODT, 25 MB), title, genre, word count, stage, services needed, publishing route |
| My Book Is Ready | title, genre, current status, link, help wanted, launch date |

How it works, and why:

- **Native `<dialog>` + `showModal()`** gives the focus trap, Escape, inert page
  and top layer for free. Do not replace it with a div modal.
- `JourneyTrigger` (the card button) dispatches a `journey:open` window event;
  `JourneyDialog` is mounted once inside the Journeys section and listens. This
  keeps the section a Server Component. The dialog appears wherever Journeys does
  (home, /services, /about).
- **Scroll lock is released synchronously** in `close()`, and Escape is routed
  through it via `onCancel`. It must not depend on the dialog's `close` event:
  that event is dispatched later, and when it was late the page stayed
  scroll-locked after the dialog had gone.
- `data-lenis-prevent` on the scroll area: a stopped Lenis blocks every wheel
  event, which would freeze scrolling inside the form.
- Focus goes to the first field on open and back to the card's button on close
  (explicitly, because Safari does not focus buttons on click).
- A backdrop click closes only an **untouched** form. Reopening the same card
  keeps what was typed; a different card, or a completed send, resets it.
- **Rejected files are never stored.** Wrong type or over the limit shows an error
  and leaves the dropzone in place. Drag-and-drop is handled on the dropzone label,
  because the visually hidden input cannot receive a drop itself.
- Validation matches ContactForm: on blur, re-checked while typing only after an
  error has shown, and on submit it focuses the first invalid field.

**No backend yet.** `onSubmit` builds the complete `FormData` (including the file
and `journey`) and stops there; that is the one place to POST it.

To add or change a question, edit `journeyForms` in `site.ts`. Supported kinds:
`text`, `url`, `number`, `date`, `textarea`, `select`, `radio`, `checkboxes`, `file`.

## 9. 3D objects and the service journey

**Tilt3D** (`motion/Tilt3D.tsx`) is a perspective root with two nested layers.
Scroll turns the scene about 7° as it crosses the viewport (a scrubbed
ScrollTrigger); the pointer tilts it on top, via `gsap.quickTo`, never React
state. Two layers because both write `rotation` and one element can only be
tweened by one of them. Pointer tilt runs for a fine hover pointer only; touch
keeps the scroll turn. Reduced motion leaves the scene static.

**ServiceObject** (service hero) puts the service photograph on two back sheets
at negative Z, with the deliverables as chips and the service number as a disc at
positive Z. The rotation turns that depth into parallax; nothing animates by
itself. The chips duplicate the list further down, so they are `aria-hidden`.
`ServiceRows` reuses the idea at a gentler angle (`max={5}`, one back sheet).

**Book3D** is a standing book of real faces (cover, back, spine, page block) in
container units (`cqw`), turned -26° at rest, squaring up on hover or focus. The
cover face has a solid background so it never reads see-through while its image
loads. The shadow is a sibling of the rotating body so it stays on the ground.

**ScrollLine** draws a line by scaling a child as its *parent* scrolls past
(`top 65%` to `bottom 65%`, scrubbed). Vertical on the service process timeline,
horizontal on the `/services` road map at `lg`, vertical below it (two instances,
one hidden at each width). Reduced motion shows it full.

**Journey rail** (`service/JourneyRail.tsx`) is the homepage hero's numbered stage
rail turned into links: every service page shows all six stops and where it sits.
`ServiceNext` steps to the previous and next stop; the ends link back to
`/services`. The nav's "Services" item stays lit on `/services/...` pages
(`aria-current="true"`, versus `"page"` on the exact page).

**Final call to action** (`ServiceStart`) is a `JourneyTrigger` with a `service`
prop, opening the shared `JourneyDialog` with the matching question set. The
submission gains a `service` field. Still no backend; see the ROADMAP.

## 8. Cursor

**Native.** The custom cursor was removed on request, matching umanodesign.studio.
Do not add one back without being asked.

## Smooth scroll — `SmoothScroll.tsx`

Lenis, driven from `gsap.ticker`, calling `ScrollTrigger.update` on scroll. Use
`getLenis()` for programmatic scrolling and `lockScroll()`/`unlockScroll()` for
modals and the loader — never set `overflow: hidden` on the body directly.
