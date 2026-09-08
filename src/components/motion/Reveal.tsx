"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  /** Delay before this element starts, in ms. Use to stagger siblings. */
  delay?: number;
  /** How far it rises, in px. */
  distance?: number;
  as?: "div" | "section" | "li" | "article";
  className?: string;
  children: React.ReactNode;
};

/**
 * Fade-and-rise on first entry. Fires once, then stops observing.
 *
 * Deliberately CSS-transition based rather than GSAP: these run on dozens of
 * elements per page and a plain transition is cheaper than a tween per node.
 * The starting state lives in an inline style so there is no flash of
 * unstyled-then-hidden content on hydration.
 */
export function Reveal({
  delay = 0,
  distance = 24,
  as: Tag = "div",
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          node.style.transitionDelay = `${delay}ms`;
          node.style.opacity = "1";
          node.style.transform = "translateY(0)";
          observer.unobserve(node);

          /* Drop will-change once the reveal is done. There are dozens of
           * these on the page and each one holds a compositor layer for the
           * lifetime of the document otherwise — real memory, for a hint that
           * stopped being useful the moment the transition ended. */
          node.addEventListener(
            "transitionend",
            () => {
              node.style.willChange = "auto";
            },
            { once: true },
          );
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("will-change-[opacity,transform]", className)}
      style={{
        opacity: 0,
        transform: `translateY(${distance}px)`,
        transition:
          "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </Tag>
  );
}
