"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Tilt3DProps = {
  /** Largest pointer tilt in degrees, reached at the edge of the object. */
  max?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * A perspective root for a 3D scene, driven two ways at once.
 *
 * Scroll turns the whole scene a few degrees as it passes through the
 * viewport. The pointer tilts it toward the cursor on top of that. They are
 * two nested layers, not one, because both write `rotation` and a single
 * element can only be tweened by one of them at a time.
 *
 * Children go on different `translateZ` depths (see ServiceObject); the
 * rotation is what turns that depth into parallax. Every layer here is
 * `.stage3d` (preserve-3d), or the depth flattens.
 *
 * Pointer tilt is written through gsap.quickTo, never React state. It only runs
 * for a fine hover pointer, since a touch screen has no cursor to follow. The
 * scroll turn still runs on touch, and it is skipped, with the pointer tilt,
 * for reduced motion, which leaves the scene static.
 */
export function Tilt3D({ max = 9, className, children }: Tilt3DProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const scrollLayer = useRef<HTMLDivElement | null>(null);
  const pointerLayer = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      const scroll = scrollLayer.current;
      const pointer = pointerLayer.current;
      if (!el || !scroll || !pointer) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        scroll,
        { rotationY: -7, rotationX: 2 },
        {
          rotationY: 7,
          rotationX: -2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const toY = gsap.quickTo(pointer, "rotationY", { duration: 0.7, ease: "power3.out" });
      const toX = gsap.quickTo(pointer, "rotationX", { duration: 0.7, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        toY(nx * max * 2);
        toX(-ny * max * 2);
      };
      const onLeave = () => {
        toY(0);
        toX(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("tilt3d", className)}>
      <div ref={scrollLayer} className="stage3d">
        <div ref={pointerLayer} className="stage3d">
          {children}
        </div>
      </div>
    </div>
  );
}
