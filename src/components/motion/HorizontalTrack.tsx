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
 * Outside the `pin` variant (under 768px wide, under 600px tall, or reduced
 * motion) the pin is skipped entirely and the track becomes a normal swipeable
 * overflow strip. Height matters: a phone held sideways is 844px wide but only
 * 390px tall, and pinning plus horizontal translation is the most fragile
 * combination on touch devices, where a native swipe is better anyway.
 */
export function HorizontalTrack({
  children,
  className,
  trailing = "md:pr-10",
  center = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Trailing space after the last card, as Tailwind padding classes.
   *  A wide value parks the final card near the middle of the screen at the
   *  end of the run instead of flush against the right edge, so there is time
   *  to read it before the section releases. */
  trailing?: string;
  /** Centres the track vertically inside a full-height pinned box. Use for
   *  tall cards: without it the pin puts the track's top at the viewport top
   *  and anything taller than the screen is cut off. */
  center?: boolean;
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
          // Must match the `pin` variant in globals.css exactly.
          desktop: "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
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
    <div
      ref={sectionRef}
      className={cn(
        className,
        "pin:overflow-hidden",
        /* lg:pb-24 reserves the bottom dock's band (bottom-8 + an h-11 capsule
         * + breathing room, all rem so it scales with the dock). The track is
         * centred in the space ABOVE the dock, not the whole screen, so the
         * bottom of a card never sits behind it. The dock only exists at lg. */
        center && "pin:flex pin:min-h-[100svh] pin:flex-col pin:justify-center lg:pin:pb-24",
      )}
    >
      {/* `relative` is load-bearing. A scroll box only clips absolutely
          positioned descendants if it (or something inside it) is their
          containing block. Without it, every `sr-only` label in the cards
          (position: absolute) was positioned against <body> at its natural
          spot up to 2127px to the right, escaped the scroller, and widened
          the whole page: on a 390px phone the document was 1783px wide and
          could be panned sideways. */}
      <div className="relative overflow-x-auto pin:overflow-x-visible">
        {/* The leading padding matches Container's inset instead of the plain
            page gutter. Container is `max-w-site mx-auto px-6/px-10`, so on a
            viewport wider than --container-site its content starts well inside
            the page edge. A track padded to the raw gutter therefore began its
            first card up to 200px left of the section heading above it, which
            is what made these bands look unaligned. `max()` keeps the plain
            gutter on narrow screens where there is no centring gap. */}
        <div ref={trackRef} className={cn("track-inset flex w-max gap-8 pr-6", trailing)}>
          {children}
        </div>
      </div>
    </div>
  );
}
