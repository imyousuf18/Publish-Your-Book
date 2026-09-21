# Conventions, pitfalls and verification

## Hard rules

1. **No hard-coded copy in components.** All text comes from `src/lib/site.ts`, or
   `src/lib/service-pages.ts` for the six service pages.
2. **No hard-coded colours, sizes, radii or fonts.** Use tokens from `globals.css`.
3. **Orange fills take ink text, never white.** Orange text uses `text-accent`.
   See `DESIGN.md`.
4. **Every image has meaningful `alt`.** Decorative duplicates get `aria-hidden`.
5. **Every animation has a reduced-motion path.**
6. **Nothing traps the reader.** Anything that takes over the screen needs a
   keyboard exit and a visible way out.
7. **Touch targets ≥ 44px** on small screens (`min-h-11`).
8. **Match the surrounding code**: comment the *why*, especially where a bug was
   fixed, so the next agent does not reintroduce it.

## Known traps (each of these has already caused a bug)

### tailwind-merge silently drops custom classes
`cn()` uses `extendTailwindMerge`. Unregistered custom tokens are misclassified:
`text-lead` and `text-ink-muted` get treated as the same group and one vanishes
from the DOM with no error. **Any new `--text-*`, `--radius-*` or `--shadow-*`
token must be added to the arrays in `src/lib/utils.ts`.**

### Tailwind drops arbitrary values it does not understand
`group-hover:-translate-y-[1lh]` generated no CSS at all. After adding an unusual
arbitrary value, confirm the rule exists (search `document.styleSheets`) — or
write it in plain CSS in `globals.css`.

### `??` does not catch empty strings
An unset `NEXT_PUBLIC_*` variable can inline as `""`. `new URL("")` then crashed
the Vercel build. `resolveSiteUrl()` trims and skips empty values — **do not
replace it with `??`**.

### `useGSAP` reverts too eagerly for long-lived timelines
Its context revert (and StrictMode double-invoke) killed the loader timeline. Use a
plain `useEffect` with explicit cleanup for anything that must survive re-renders.

### Pins inside sticky/transformed ancestors break
Do not wrap `#page-content` or any section containing a ScrollTrigger pin in
`position: sticky`, `transform`, or `filter`.

### sr-only labels escape scroll containers
A scroller only clips absolutely positioned descendants if it (or something
inside it) is their containing block. `sr-only` is `position: absolute`, so
hidden labels inside an unpositioned `overflow-x-auto` strip were placed against
`<body>` and widened a 390px page to 1783px: pannable sideways, and mobile
browsers may zoom out to fit. **Give every scroll container `relative`.**

### Implicit grid columns size to the widest card
`grid` with no column count makes one `auto` column sized to the widest item's
min-content, so one unbreakable row widens every card. Use `grid-cols-1`
(`minmax(0,1fr)`) as the phone base. Also avoid `whitespace-nowrap` + `shrink-0`
pairs in a row without `flex-wrap`.

### Width-only breakpoints catch sideways phones
`md:` is true on an 844×390 phone. Anything that sticks or pins tall content
needs `roomy:` or `pin:` (see DESIGN.md › Layout).

### Invalid CSS fails silently
e.g. `scale(clamp(...vw...))` produces a length, not a number, and the browser
drops the whole declaration. Check computed styles, not just the class list.

### The fluid root makes everything bigger on wide screens
A component that fits at 1440×820 can overflow at 1900×930. Test tall pieces
at both.

### `next dev` rewrites AGENTS.md
The Next.js block at the top of `AGENTS.md` is regenerated on every dev start.
Edit only below it.

## Testing in an AI agent's browser pane

The Claude Code browser pane **suspends `requestAnimationFrame` when the pane is
hidden.** Every GSAP tween, CSS transition and Lenis scroll then sits frozen,
and it looks exactly like a code bug.

Check before debugging any animation:

```js
await new Promise(r => { requestAnimationFrame(() => r(true)); setTimeout(() => r(false), 500); })
```

If `false`: verify logic by driving timelines manually (`tl.progress(p)`) and
reading computed transforms, and say plainly that the motion itself still needs a
human scroll test. Lenis also resets programmatic `scrollTo` in this state.

## Verification checklist before handing work back

- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] Contrast audit on anything that changed colour (target 0 failures; convert
      `oklab()` computed colours properly — naive regex parsing gives false 1:1 results)
- [ ] Mobile audit clean: `scripts/mobile-audit.js` at 320/360/390/430/768/1024 and
      844×390 — `pannable` 0, no overflow, no targets under 44px, no inputs under 16px
- [ ] Tall components checked at 1900×930
- [ ] Keyboard: tab order sensible, focus visible, Escape closes overlays
- [ ] Reduced motion shows the end state
- [ ] State clearly what was verified in a browser and what was not

## Git

- Default branch `main`; Vercel deploys from it.
- Don't commit or push unless asked.
- Commit messages: imperative summary line, body explaining why.
