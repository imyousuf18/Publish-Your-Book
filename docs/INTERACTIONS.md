# Interactions and motion

How each moving part works, and the constraints that shaped it. Read the relevant
section before changing any of these — most of them were rebuilt at least once
after a user-reported bug.

## 1. Book loader — `components/loader/BookLoader.tsx`

A full-screen intro over the page: a closed book grows, opens, turns its pages,
closes, then the loader slides up and away.

**It advances one step per scroll gesture.** Not scrubbed. This is a hard
requirement from user complaints ("scrolls too much" / "doesn't scroll
properly") — both were caused by the old delta-accumulating scrub.

- Steps (7 gestures): open → leaf 1 → 2 → 3 → 4 → 5 → close-and-settle → exit.
- Phase durations in `D`; stop times are recorded while building the timeline.
- Leaves turn **sequentially, never overlapping** — an overlapping riffle cannot
  be stopped between pages.
- Every inner tween is `ease: "none"`; the step tween (`STEP_DUR` 0.85s,
  `power2.inOut`) supplies the easing, so nothing is eased twice.
- **Wheel**: the first event of a burst steps; events within `GESTURE_GAP`
  (220ms) of quiet are inertia and are swallowed — including while animating.
- **Touch**: one step per finger-down once travel exceeds `SWIPE_PX` (36px).
- **Keyboard**: Space/PageDown/ArrowDown/Enter forward, ArrowUp/PageUp back,
  **Escape exits**. A visible **Skip** button is in the tab order.
- Plays on every page load (no sessionStorage gate — that was removed on request).
- Reduced motion: loader is skipped entirely.

Book physics (`Book.tsx`): a stack — front cover, 5 leaves, back board — all on the
right half, hinged on the left edge, separated by `LIFT` on Z. **The back board
never flips.** On close, the cover and all leaves return together as one slab while
the whole book turns over 180°, landing back-cover-up. Flipping the back board
reads as a seventh page turn; this was reported as a bug and must not return.

Uses a plain `useEffect`, **not** `useGSAP` — useGSAP's context revert (including
StrictMode double-invoke) killed the in-flight timeline. Guard clause at the top
prevents Fast Refresh crashes once the loader has unmounted.

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
