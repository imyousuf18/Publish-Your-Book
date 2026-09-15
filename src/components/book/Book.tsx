"use client";

import type { RefObject } from "react";
import { hero, stages } from "@/lib/site";

/* --------------------------------------------------------------------------
 * The 3D book, as pure markup. All motion lives in whatever drives it — this
 * file only builds the scene and hands back the nodes to animate.
 *
 * MODEL — this is the important part.
 *
 * Every board and leaf sits at the SAME place: the right half of the spread,
 * hinged on its left edge. Stacked front-to-back they are:
 *
 *     front cover  ->  leaf 1 .. leaf 5  ->  back board
 *
 * So a closed book shows exactly one thing: the front cover. There is no
 * loose left-hand page sitting beside it — the left half is empty until
 * something flips onto it. Each element is pushed apart on Z so the closed
 * book has real thickness instead of z-fighting.
 *
 * Faces: the front face is what you see before the element flips; the back
 * face (rotateY 180) is what you see after. The back board's back face is the
 * BACK COVER, so once it flips last the book reads as closed, back cover up.
 * ----------------------------------------------------------------------- */
export const BOOK_W = 820;
export const BOOK_H = 540;
export const HALF = BOOK_W / 2;

/** Board/leaf thickness on Z, in px. Gives the closed book its edge. */
const LIFT = 1.6;

export type BookProps = {
  fitRef: RefObject<HTMLDivElement | null>;
  bookRef: RefObject<HTMLDivElement | null>;
  spreadRef: RefObject<HTMLDivElement | null>;
  coverRef: RefObject<HTMLDivElement | null>;
  backRef: RefObject<HTMLDivElement | null>;
  leafRefs: RefObject<(HTMLDivElement | null)[]>;
};

const FACE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  boxSizing: "border-box",
};

const PAGE_FACE: React.CSSProperties = {
  ...FACE,
  background: "var(--color-book-page)",
  padding: "52px 44px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
};

const BOARD_FACE: React.CSSProperties = {
  ...FACE,
  padding: "56px 48px",
  display: "flex",
  flexDirection: "column",
};

/** Scale the scene so the book clears the viewport with margin. */
export function fitScale() {
  const pad = window.innerWidth < 768 ? 32 : 96;
  return Math.max(
    0.26,
    Math.min((window.innerWidth - pad) / BOOK_W, (window.innerHeight - pad) / BOOK_H, 1.05),
  );
}

export function Book({
  fitRef,
  bookRef,
  spreadRef,
  coverRef,
  backRef,
  leafRefs,
}: BookProps) {
  const boardGeometry = (z: number): React.CSSProperties => ({
    position: "absolute",
    left: HALF,
    top: 0,
    width: HALF,
    height: BOOK_H,
    transformOrigin: "left center",
    transformStyle: "preserve-3d",
    translate: `0 0 ${z}px`,
    willChange: "transform",
  });

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ perspective: "2200px" }}
    >
      {/* Starts invisible on purpose. The server sends this markup and the
          browser paints it before React hydrates, so an un-positioned book
          would flash at full size in the wrong spot first. The driver applies
          the fit scale and the resting transform, THEN fades this in — so the
          first thing ever seen is a correctly placed closed book.

          (The fit cannot be done in CSS: scale() needs a unitless number and
          `(100vw - 96px) / 820` evaluates to a length, which browsers reject
          outright, silently leaving the book unscaled.) */}
      <div ref={fitRef} style={{ transformStyle: "preserve-3d", opacity: 0 }}>
        <div
          ref={bookRef}
          style={{
            width: BOOK_W,
            height: BOOK_H,
            position: "relative",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div
            ref={spreadRef}
            style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}
          >
            {/* ---- Back board. Flips last; its reverse is the back cover. ---- */}
            <div
              ref={backRef}
              style={{
                ...boardGeometry(-(stages.length + 1) * LIFT),
                zIndex: 100,
                boxShadow: "18px 22px 44px rgb(22 20 18 / 0.3)",
              }}
            >
              {/* Inside back cover — the endpaper, visible once every leaf has
                  turned. Deliberately cream, not dark: if this face were dark
                  it would already look like a shut book, and the board turning
                  over it afterwards would read as one stray extra page rather
                  than the cover closing. */}
              <div
                style={{
                  ...BOARD_FACE,
                  background: "var(--color-book-page)",
                  justifyContent: "flex-end",
                }}
              >
                <p className="text-[12px] leading-[1.4] tracking-[0.12em] font-semibold uppercase text-ink-subtle">Colophon</p>
                <p className="mt-[12px] text-[14px] text-ink-muted">
                  Every right and every royalty stays with you.
                </p>
              </div>
              {/* Back cover — the face the finished book rests on. */}
              <div
                style={{
                  ...BOARD_FACE,
                  transform: "rotateY(180deg)",
                  background: "var(--color-book-cover)",
                  justifyContent: "space-between",
                }}
              >
                <p
                  className="text-[12px] leading-[1.4] tracking-[0.12em] font-semibold uppercase"
                  style={{ color: "var(--color-accent-tint)" }}
                >
                  Publish Your Book
                </p>
                <div>
                  <div className="h-px w-[96px]" style={{ background: "var(--color-accent-tint)" }} />
                  <p className="mt-[24px] text-[14px]" style={{ color: "rgb(244 238 227 / 0.6)" }}>
                    Editing, design and publishing for authors who keep their rights.
                  </p>
                </div>
              </div>
            </div>

            {/* ---- Leaves. Inset from the boards, like real pages. ---- */}
            {stages.map((stage, i) => (
              <div
                key={stage.word}
                ref={(el) => {
                  leafRefs.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  left: HALF + 6,
                  top: 10,
                  width: HALF - 16,
                  height: BOOK_H - 20,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  translate: `0 0 ${-(i + 1) * LIFT}px`,
                  zIndex: 200 - i,
                  willChange: "transform",
                }}
              >
                <div
                  style={{
                    ...PAGE_FACE,
                    borderLeft: "1px solid rgb(22 20 18 / 0.1)",
                    boxShadow: "inset 14px 0 22px -18px rgb(22 20 18 / 0.4)",
                  }}
                >
                  <p className="text-[12px] leading-[1.4] tracking-[0.12em] font-semibold uppercase text-accent">
                    Stage 0{i + 1}
                  </p>
                  <p className="mt-[12px] font-display text-[54px] leading-none text-ink">{stage.word}</p>
                  <p className="mt-[16px] max-w-[256px] text-[14px] leading-relaxed text-ink-muted">
                    {stage.note}
                  </p>
                </div>
                <div style={{ ...PAGE_FACE, transform: "rotateY(180deg)" }}>
                  <p className="text-[12px] leading-[1.4] tracking-[0.12em] font-semibold uppercase text-ink-subtle">
                    {stage.word}
                  </p>
                  <p className="mt-[12px] max-w-[256px] text-[14px] leading-relaxed text-ink-muted">
                    {stage.note}
                  </p>
                </div>
              </div>
            ))}

            {/* ---- Front cover. Top of the stack: the only thing a closed
                    book shows. ---- */}
            <div
              ref={coverRef}
              style={{
                ...boardGeometry(LIFT),
                zIndex: 300,
                boxShadow: "18px 22px 44px rgb(22 20 18 / 0.3)",
              }}
            >
              <div
                style={{
                  ...BOARD_FACE,
                  background: "var(--color-book-cover)",
                  justifyContent: "space-between",
                }}
              >
                <p
                  className="text-[12px] leading-[1.4] tracking-[0.12em] font-semibold uppercase"
                  style={{ color: "var(--color-accent-tint)" }}
                >
                  Publish Your Book
                </p>
                <div>
                  <p
                    className="font-display text-[40px] leading-tight"
                    style={{ color: "var(--color-inverse-ink)" }}
                  >
                    {hero.title}
                  </p>
                  <div className="mt-[32px] h-px w-[96px]" style={{ background: "var(--color-accent-tint)" }} />
                </div>
              </div>
              {/* Inside front cover — the colophon, seen once the book opens. */}
              <div
                style={{
                  ...BOARD_FACE,
                  transform: "rotateY(180deg)",
                  background: "var(--color-book-page)",
                  justifyContent: "flex-end",
                }}
              >
                <p className="text-[12px] leading-[1.4] tracking-[0.12em] font-semibold uppercase text-accent">Colophon</p>
                <p className="mt-[12px] text-[22px] leading-[1.3] text-ink">Publishing services for authors.</p>
                <p className="mt-[8px] text-[14px] text-ink-muted">Austin, Texas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
