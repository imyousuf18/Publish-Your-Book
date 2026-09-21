"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Book, fitScale } from "@/components/book/Book";
import { lockScroll, unlockScroll } from "@/components/motion/SmoothScroll";

/* The loader advances in DISCRETE STEPS, one per scroll gesture.
 *
 * It used to be scrubbed: deltas accumulated into a target and the timeline
 * eased toward it. That is lovely on a mouse wheel and unusable everywhere
 * else — one trackpad flick with inertia dumps thousands of pixels and skips
 * the whole book, while a cautious two-finger nudge barely moves it. Both
 * complaints ("scrolls too much", "doesn't scroll properly") are the same bug.
 *
 * So: the timeline carries labelled stops, a gesture moves exactly one stop,
 * and every event inside that gesture's inertia burst is swallowed. Wheel,
 * touch and keyboard all go through the same one-step function, so a phone
 * behaves identically to a desktop.
 *
 * The steps are:
 *   0  closed book at rest
 *   1  grown and opened
 *   2..6  one leaf turned per step (five leaves, no overlap — an overlapping
 *         riffle cannot be stepped through one page at a time)
 *   7  closed, turned over, settled  -> loader exits
 */

/** Seconds each phase occupies on the timeline. Stops are derived from these. */
const D = { grow: 1.1, open: 0.9, leaf: 0.9, close: 1.2, settle: 0.8 };

/** How long one step takes to play out, in seconds. */
const STEP_DUR = 0.85;

/** Quiet time, in ms, before new wheel events count as a fresh gesture.
 *  Trackpad inertia keeps firing for a while after the fingers lift; anything
 *  inside this window belongs to the gesture already served. */
const GESTURE_GAP = 220;

/** Minimum finger travel, in px, that counts as one swipe. */
const SWIPE_PX = 36;

const REST = { scale: 0.46, rotY: -28, rotX: 12, rotZ: -2 };

/* Resting size on narrow screens. The spread is fitted to the viewport width,
 * and a closed book is only half a spread, so at 0.46 it rested ~80px wide on
 * a 390px phone: a speck in the middle of a dark screen. Phones rest it larger;
 * it still grows to the full-width open spread (OPEN.scale) from there. */
const REST_SCALE_NARROW = 0.78;
const restScale = () => (window.innerWidth < 640 ? REST_SCALE_NARROW : REST.scale);
const OPEN = { scale: 1, rotY: -6, rotX: 6, rotZ: 0 };

/* A closed book occupies only the right half of the spread box, so it needs a
 * shift to sit optically centred. Opening unwinds the shift to zero.
 *
 * The close turns the whole book over (see TURN), which mirrors the X axis —
 * so the shift has to be inverted to land centred again rather than half a
 * book-width off to the side. */
const CLOSED_RIGHT = -25;
const OPEN_CENTRE = 0;
const CLOSED_MIRRORED = 25;

/** Degrees the book turns over on closing, to present its back cover. */
const TURN = 180;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function BookLoader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const fit = useRef<HTMLDivElement | null>(null);
  const book = useRef<HTMLDivElement | null>(null);
  const spread = useRef<HTMLDivElement | null>(null);
  const cover = useRef<HTMLDivElement | null>(null);
  const back = useRef<HTMLDivElement | null>(null);
  const leaves = useRef<(HTMLDivElement | null)[]>([]);

  /* Once the loader is done it is removed from the DOM entirely rather than
   * left as a display:none shell — roughly thirty nodes, several of which
   * carry will-change hints, kept alive for the life of the page otherwise. */
  const [done, setDone] = useState(false);

  const measure = useCallback(() => {
    if (fit.current) fit.current.style.transform = `scale(${fitScale()})`;
  }, []);

  /* Deliberately a plain effect, not useGSAP: useGSAP reverts its gsap.context
   * on every cleanup — including React StrictMode's double-invoke — which kills
   * the in-flight timeline and leaves the loader frozen. This owns its own
   * lifecycle. */
  useEffect(() => {
    /* Once finished, the loader renders nothing and every ref is null. Fast
     * Refresh re-runs effects on edit, and without this guard gsap.set(null)
     * threw and forced a full reload. Never animate nodes that are not there. */
    if (done || !rootRef.current || !book.current || !cover.current || !back.current) return;

    lockScroll();

    const leafNodes = leaves.current.filter(Boolean) as HTMLDivElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setDone(true);
      unlockScroll();
    };

    if (reduced) {
      gsap.set(rootRef.current, { display: "none" });
      window.removeEventListener("resize", measure);
      finish();
      return;
    }

    // Fit and resting state first, then reveal — nothing is painted mid-jump.
    measure();
    window.addEventListener("resize", measure);

    gsap.set(book.current, {
      scale: restScale(),
      rotateY: REST.rotY,
      rotateX: REST.rotX,
      rotateZ: REST.rotZ,
    });
    gsap.set(spread.current, { xPercent: CLOSED_RIGHT });
    gsap.set([cover.current, back.current, ...leafNodes], { rotateY: 0 });
    gsap.to(fit.current, { opacity: 1, duration: 0.45, ease: "power2.out" });

    /* Paused, and every tween eased "none": the step tween below supplies the
     * easing, so a phase does not get eased twice. */
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

    /** Timeline times, in seconds, that a gesture can come to rest on. */
    const stopTimes: number[] = [0];
    let t = 0;

    // 1. Grow and open, as one step — a closed book comes forward, then the
    //    front cover swings left and the spread recentres.
    tl.to(
      book.current,
      {
        scale: OPEN.scale,
        rotateY: OPEN.rotY,
        rotateX: OPEN.rotX,
        rotateZ: OPEN.rotZ,
        duration: D.grow,
      },
      t,
    );
    t += D.grow;
    tl.to(cover.current, { rotateY: -180, duration: D.open }, t).to(
      spread.current,
      { xPercent: OPEN_CENTRE, duration: D.open },
      t,
    );
    t += D.open;
    stopTimes.push(t);

    /* 2. Leaves turn one at a time, back to back. The old build overlapped
     * them into a riffle, which looked good scrubbed but cannot be stepped:
     * stopping "after page two" would leave pages three to five hanging
     * half-turned. Sequential turns are what make one-page-per-gesture true. */
    leafNodes.forEach((leaf) => {
      tl.to(leaf, { rotateY: -180, duration: D.leaf }, t);
      t += D.leaf;
      stopTimes.push(t);
    });

    /* 4. Close.
     *
     * The back board NEVER flips. Flipping it was a seventh page turn after
     * the five leaves — no amount of overlap or recolouring disguises that,
     * because it genuinely is one more page turning on a book that already
     * looks shut.
     *
     * What a reader actually does is lift the whole read stack back over at
     * once. So the front cover and every leaf return to 0 together, as a
     * single slab, while the book itself turns over. The back board stays put
     * at 0 the entire time; once the book has turned, the face pointing at the
     * viewer is that board's reverse — the back cover — with the pages tucked
     * behind it. One gesture, no extra flip, and it lands back cover up. */
    tl.to([cover.current, ...leafNodes], { rotateY: 0, duration: D.close }, t)
      .to(book.current, { rotateY: OPEN.rotY + TURN, duration: D.close }, t)
      .to(spread.current, { xPercent: CLOSED_MIRRORED, duration: D.close }, t);
    t += D.close;

    /* 5. The closed book settles back down to resting size, keeping the turn
     * (TURN - REST.rotY, not -REST.rotY — the latter would quietly rotate the
     * book back to front-cover-up and undo the close). */
    tl.to(
      book.current,
      {
        scale: restScale(),
        rotateY: TURN - REST.rotY,
        rotateX: REST.rotX,
        rotateZ: -REST.rotZ,
        duration: D.settle,
      },
      t,
    );
    t += D.settle;
    // Close and settle read as one movement, so they share a single stop.
    stopTimes.push(t);

    /* ------------------------------------------------------------------
     * One gesture, one step.
     * ---------------------------------------------------------------- */
    const total = tl.duration();
    const stops = stopTimes.map((time) => clamp(time / total, 0, 1));
    const last = stops.length - 1;

    const head = { p: 0 };
    let index = 0;
    let animating = false;
    let burst = false;
    let burstTimer: ReturnType<typeof setTimeout> | undefined;
    let touchY = 0;
    let swiped = false;

    const exit = () => {
      if (finished) return;
      gsap
        .timeline({ onComplete: finish })
        .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: "power3.inOut" })
        .set(rootRef.current, { display: "none" });
    };

    /** Move exactly one stop. Anything asking for more is ignored. */
    const step = (dir: 1 | -1) => {
      if (animating || finished) return;
      if (index === last && dir === 1) {
        exit();
        return;
      }
      const next = clamp(index + dir, 0, last);
      if (next === index) return;
      index = next;

      if (hintRef.current) {
        gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.3, overwrite: true });
      }

      animating = true;
      gsap.to(head, {
        p: stops[index],
        duration: STEP_DUR,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => {
          tl.progress(head.p);
          if (barRef.current) barRef.current.style.transform = `scaleX(${head.p})`;
        },
        onComplete: () => {
          animating = false;
          // The book is shut and settled: let it be seen, then release.
          if (index === last) gsap.delayedCall(0.45, exit);
        },
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      clearTimeout(burstTimer);
      burstTimer = setTimeout(() => {
        burst = false;
      }, GESTURE_GAP);
      /* Already served this burst — or still playing the last step. Either way
       * the event is inertia, not intent. Note `burst` is set even when the
       * step is refused, so a long flick cannot queue up behind the animation
       * and fire the moment it ends. */
      const served = burst || animating;
      burst = true;
      if (served) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      swiped = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (swiped) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) < SWIPE_PX) return;
      swiped = true; // one step per finger-down, however far the finger travels
      step(dy > 0 ? 1 : -1);
    };

    // Keyboard: the loader must never be a dead end for anyone who cannot scroll.
    const onKey = (e: KeyboardEvent) => {
      if ([" ", "PageDown", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault();
        step(1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      }
      if (e.key === "Escape") exit(); // always an out
    };

    const skip = skipRef.current;
    skip?.addEventListener("click", exit);

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(burstTimer);
      gsap.killTweensOf(head);
      skip?.removeEventListener("click", exit);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      tl.kill();
      unlockScroll();
    };
  }, [measure, done]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{ background: "var(--color-inverse)" }}
    >
      <Book
        fitRef={fit}
        bookRef={book}
        spreadRef={spread}
        coverRef={cover}
        backRef={back}
        leafRefs={leaves}
      />

      {/* An intro nobody can leave is a trap. One always-available exit, in the
          tab order, reachable by click or Escape. */}
      <button
        ref={skipRef}
        type="button"
        className="absolute right-6 top-6 inline-flex min-h-11 items-center rounded-pill border border-inverse-ink/25 px-4 text-eyebrow font-semibold uppercase text-inverse-ink/70 transition-colors duration-200 hover:border-inverse-ink hover:text-inverse-ink lg:right-12 lg:top-10"
      >
        Skip
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-8 lg:p-12">
        <div className="flex items-end justify-between gap-8">
          <p
            className="text-eyebrow font-semibold uppercase"
            style={{ color: "var(--color-accent-tint)" }}
          >
            Publish Your Book
          </p>
          <p
            ref={hintRef}
            className="text-eyebrow font-semibold uppercase text-inverse-ink/70"
          >
            {/* Touchscreens swipe; "scroll" only makes sense with a wheel or trackpad. */}
            <span className="pointer-coarse:hidden">Scroll to turn the page</span>
            <span className="hidden pointer-coarse:inline">Swipe to turn</span>
          </p>
        </div>
        <div className="mt-5 h-px w-full bg-inverse-ink/15">
          <div
            ref={barRef}
            className="h-full origin-left"
            style={{ background: "var(--color-accent-tint)", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
