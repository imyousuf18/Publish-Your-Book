"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type ScrollLineProps = {
  /** "y" fills top to bottom, "x" fills left to right. */
  axis?: "x" | "y";
  /** Positions and sizes the track. Give it a thickness and an inset. */
  className?: string;
  /** Colours the fill. The track colour goes in `className`. */
  fillClassName?: string;
};

/**
 * A line that draws itself as the reader scrolls past its parent.
 *
 * The parent must be `position: relative`: the line is absolutely placed by the
 * caller and its progress follows the parent's own trip through the viewport,
 * so a tall list fills as its steps go by. The fill is a scaled child, not an
 * animated width or height, so it costs no layout.
 *
 * Scrubbed, so it works with scroll alone. Reduced motion shows it full.
 */
export function ScrollLine({ axis = "y", className, fillClassName }: ScrollLineProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const fill = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      const bar = fill.current;
      if (!el || !bar) return;

      const key = axis === "y" ? "scaleY" : "scaleX";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(bar, { [key]: 1 });
        return;
      }

      gsap.fromTo(
        bar,
        { [key]: 0 },
        {
          [key]: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top 65%",
            end: "bottom 65%",
            scrub: true,
          },
        },
      );
    },
    { scope: root, dependencies: [axis] },
  );

  return (
    <div ref={root} aria-hidden className={cn("pointer-events-none", className)}>
      <div
        ref={fill}
        className={cn("h-full w-full", axis === "y" ? "origin-top" : "origin-left", fillClassName)}
        style={{ transform: axis === "y" ? "scaleY(0)" : "scaleX(0)" }}
      />
    </div>
  );
}
