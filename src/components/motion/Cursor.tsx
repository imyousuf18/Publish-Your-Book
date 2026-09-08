"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: a small solid dot that tracks the pointer exactly, and a
 * larger ring that lags behind it.
 *
 * Elements opt in by setting `data-cursor` — see CURSOR_STATES below. The ring
 * uses `mix-blend-mode: difference` so it inverts against whatever it is over,
 * which is what keeps it readable on both the paper and the dark bands without
 * needing per-section colour logic.
 *
 * Pointer-coarse devices get nothing at all: no listeners, no DOM.
 */
const RING_STATES: Record<string, { scale: number; label?: string }> = {
  link: { scale: 1.8 },
  view: { scale: 3.2, label: "View" },
  drag: { scale: 3.2, label: "Drag" },
  read: { scale: 3.2, label: "Read" },
};

export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // No custom cursor on touch, and none when motion is reduced.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    /* Resolve state from the nearest [data-cursor] ancestor, so a whole card
     * can declare one state for everything inside it.
     *
     * Links and buttons opt in automatically — tagging every one by hand meant
     * new markup silently lost the cursor. Because `closest` walks outward,
     * a link inside a `data-cursor="read"` card wins, which is what you want:
     * the more specific target decides. */
    const onOver = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.(
        "[data-cursor], a[href], button:not([disabled])",
      );
      const key =
        el?.getAttribute("data-cursor") ??
        (el && (el.tagName === "A" || el.tagName === "BUTTON") ? "link" : "");
      const state = RING_STATES[key];
      if (state) {
        targetScale = state.scale;
        label.textContent = state.label ?? "";
      } else {
        targetScale = 1;
        label.textContent = "";
      }
    };

    const tick = () => {
      // Lerp: the ring chases the dot rather than snapping to it.
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      scale += (targetScale - scale) * 0.16;

      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-200"
      />
      <div
        ref={ringRef}
        style={{ mixBlendMode: "difference" }}
        className="fixed left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 opacity-0 transition-opacity duration-200"
      >
        <span
          ref={labelRef}
          className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white"
        />
      </div>
    </div>
  );
}
