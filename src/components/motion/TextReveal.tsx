"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Mode = "lines" | "chars";

type TextRevealProps = {
  /**
   * "lines" — each line rises out from behind a mask. The default; best for
   * headlines and paragraphs.
   * "chars" — a very fast per-character stagger. This is the effect that reads
   * as "typing" on the reference site; it is a stagger, not a typewriter.
   */
  mode?: Mode;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  children: React.ReactNode;
};

export function TextReveal({
  mode = "lines",
  delay = 0,
  className,
  as: Tag = "div",
  children,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      /* Masking only works if each line is its own overflow-hidden box, which
       * is what linesClass + the CSS below provides.
       *
       * autoSplit re-splits when web fonts finish loading and when the width
       * changes. Without it, lines were measured in the fallback font at mount;
       * once Roboto arrived with different glyph widths each frozen line
       * re-wrapped inside itself, leaving ragged one- and two-word lines.
       * Returning the tween from onSplit lets SplitText rebuild it on every
       * re-split while keeping its progress, so revealed text never replays. */
      const split = SplitText.create(el, {
        type: mode === "chars" ? "chars,lines" : "lines",
        linesClass: "tr-line",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(el, { opacity: 1 });
          const targets = mode === "chars" ? self.chars : self.lines;
          return gsap.from(targets, {
            yPercent: 110,
            opacity: mode === "chars" ? 0 : 1,
            duration: mode === "chars" ? 0.4 : 0.9,
            ease: "power3.out",
            stagger: mode === "chars" ? 0.012 : 0.08,
            delay: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          });
        },
      });

      // SplitText rewrites the DOM; revert restores the original markup so
      // screen readers and re-renders see clean text.
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<never>} className={cn("opacity-0", className)}>
      {children}
    </Tag>
  );
}
