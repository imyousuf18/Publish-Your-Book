"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins a section and translates a wide track sideways as you scroll past it.
 *
 * The runway is derived from the track's real overflow width rather than a
 * hard-coded height, so adding or removing cards keeps the scroll distance
 * proportional and the last card always lands flush against the right edge.
 *
 * Below `md` the pin is skipped entirely and the track becomes a normal
 * swipeable overflow strip — pinning plus horizontal translation is the most
 * fragile combination on touch devices, and a native swipe is better anyway.
 */
export function HorizontalTrack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        },
        () => {
          const distance = () => track.scrollWidth - window.innerWidth;
          if (distance() <= 0) return;

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  /* Three layers, each doing one job:
   *   outer   clips the oversized track on desktop, so a `w-max` strip cannot
   *           widen the whole document and give the page a horizontal scrollbar
   *   scroller native swipe on touch; transparent on desktop
   *   track    the actual wide strip GSAP translates */
  return (
    <div ref={sectionRef} className={cn(className, "md:overflow-hidden")}>
      <div className="overflow-x-auto md:overflow-x-visible">
        {/* The leading padding matches Container's inset instead of the plain
            page gutter. Container is `max-w-site mx-auto px-6/px-10`, so on a
            viewport wider than --container-site its content starts well inside
            the page edge. A track padded to the raw gutter therefore began its
            first card up to 200px left of the section heading above it, which
            is what made these bands look unaligned. `max()` keeps the plain
            gutter on narrow screens where there is no centring gap. */}
        <div ref={trackRef} className="track-inset flex w-max gap-8 pr-6 lg:pr-10">
          {children}
        </div>
      </div>
    </div>
  );
}
