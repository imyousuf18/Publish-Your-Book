"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's rounded frame, and the pointer it listens to.
 *
 * Writes the pointer position as --mx / --my (each -1 to 1, 0 at the centre)
 * straight onto the element, once per animation frame at most. Children use
 * them in calc() to drift at their own depth — no React state, so moving the
 * mouse re-renders nothing. Touch screens and reduced motion leave both at 0,
 * which is simply the still arrangement.
 */
export function ParallaxFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 2 - 1;
      y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ ["--mx" as string]: 0, ["--my" as string]: 0 }}>
      {children}
    </div>
  );
}
