"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Book, fitScale } from "@/components/book/Book";
import { lockScroll, unlockScroll } from "@/components/motion/SmoothScroll";

/* Timeline positions out of 100. The whole thing is scrubbed by scroll, so
 * these are proportions of the gesture rather than seconds.
 *
 *   0  ->  grow      the closed book (front cover only) comes forward
 *  22  ->  open      front cover swings left; the spread recentres
 *  36  ->  flip      the five leaves turn, overlapping into a riffle
 *  76  ->  close     the read stack shuts as one unit while the book turns
 *                   over, landing back cover up (no extra page flip)
 *  90  ->  settle    the closed book eases back down
 */
const T = { growEnd: 22, openEnd: 36, flipEnd: 76, closeEnd: 90, settleEnd: 100 };

/** Scroll distance, in px, that plays the whole animation once. */
const SCROLL_SPAN = 1600;

const REST = { scale: 0.46, rotY: -28, rotX: 12, rotZ: -2 };
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
      scale: REST.scale,
      rotateY: REST.rotY,
      rotateX: REST.rotX,
      rotateZ: REST.rotZ,
    });
    gsap.set(spread.current, { xPercent: CLOSED_RIGHT });
    gsap.set([cover.current, back.current, ...leafNodes], { rotateY: 0 });
    gsap.to(fit.current, { opacity: 1, duration: 0.45, ease: "power2.out" });

    // Paused: scroll drives it, nothing plays on its own.
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

    // 1. Grow — a closed book, front cover only, coming forward.
    tl.to(
      book.current,
      {
        scale: OPEN.scale,
        rotateY: OPEN.rotY,
        rotateX: OPEN.rotX,
        rotateZ: OPEN.rotZ,
        duration: T.growEnd,
        ease: "power2.inOut",
      },
      0,
    );

    // 2. Front cover swings open; the spread recentres as it does.
    tl.to(
      cover.current,
      { rotateY: -180, duration: T.openEnd - T.growEnd, ease: "power1.inOut" },
      T.growEnd,
    ).to(
      spread.current,
      { xPercent: OPEN_CENTRE, duration: T.openEnd - T.growEnd, ease: "power1.inOut" },
      T.growEnd,
    );

    /* 3. Leaves turn in sequence, overlapping so it reads as a riffle rather
     * than five separate flips. */
    const flipDur = 16;
    const stagger =
      leafNodes.length > 1 ? (T.flipEnd - T.openEnd - flipDur) / (leafNodes.length - 1) : 0;
    leafNodes.forEach((leaf, i) => {
      tl.to(
        leaf,
        { rotateY: -180, duration: flipDur, ease: "power1.inOut" },
        T.openEnd + i * stagger,
      );
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
    const overlap = 8;
    const closeStart = T.flipEnd - overlap;
    const closeDur = T.closeEnd - closeStart;

    tl.to(
      [cover.current, ...leafNodes],
      { rotateY: 0, duration: closeDur, ease: "power2.inOut" },
      closeStart,
    )
      .to(
        book.current,
        { rotateY: OPEN.rotY + TURN, duration: closeDur, ease: "power2.inOut" },
        closeStart,
      )
      .to(
        spread.current,
        { xPercent: CLOSED_MIRRORED, duration: closeDur, ease: "power2.inOut" },
        closeStart,
      );

    /* 5. The closed book settles back down to resting size, keeping the turn
     * (TURN - REST.rotY, not -REST.rotY — the latter would quietly rotate the
     * book back to front-cover-up and undo the close). */
    tl.to(
      book.current,
      {
        scale: REST.scale,
        rotateY: TURN - REST.rotY,
        rotateX: REST.rotX,
        rotateZ: -REST.rotZ,
        duration: T.settleEnd - T.closeEnd,
        ease: "power2.inOut",
      },
      T.closeEnd,
    );

    /* ------------------------------------------------------------------
     * Scroll drives the timeline. The page itself cannot scroll while the
     * loader is up, so wheel/touch deltas are accumulated into a target and
     * eased toward — that easing is what makes it feel scrubbed rather than
     * step-wise. Progress only ever moves forward.
     * ---------------------------------------------------------------- */
    let target = 0;
    let current = 0;
    let raf = 0;
    let touchY = 0;

    const advance = (delta: number) => {
      target = clamp(target + delta / SCROLL_SPAN, 0, 1);
      if (target > 0.02 && hintRef.current) {
        gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.3, overwrite: true });
      }
    };

    const onWheel = (e: WheelEvent) => advance(e.deltaY);
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      advance((touchY - y) * 2.2);
      touchY = y;
    };
    // Keyboard: the loader must never be a dead end for anyone who cannot scroll.
    const onKey = (e: KeyboardEvent) => {
      if ([" ", "PageDown", "ArrowDown", "Enter"].includes(e.key)) advance(320);
      if (["ArrowUp", "PageUp"].includes(e.key)) advance(-320);
    };

    const exit = () => {
      if (finished) return;
      gsap
        .timeline({ onComplete: finish })
        .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: "power3.inOut" })
        .set(rootRef.current, { display: "none" });
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0004) current = target;
      tl.progress(current);
      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`;
      if (current > 0.995) {
        tl.progress(1);
        exit();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
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
            Scroll to open
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
