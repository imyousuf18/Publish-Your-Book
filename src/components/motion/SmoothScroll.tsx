"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Module-level handle so the loader (and anything else) can lock scrolling
 * without prop-drilling a ref through the tree. */
let lenis: Lenis | null = null;

/* The loader's layout effect runs BEFORE this component's effect, so a lock
 * can be requested before Lenis exists. Track it and apply on init. */
let locked = false;

export function getLenis() {
  return lenis;
}

/** Freeze scrolling — used while the loader is on screen. */
export function lockScroll() {
  locked = true;
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

/** Release scrolling once the loader is done. */
export function unlockScroll() {
  locked = false;
  document.documentElement.style.overflow = "";
  lenis?.start();
}

/**
 * Lenis smooth scroll, wired into GSAP's ticker.
 *
 * Order matters: Lenis must drive ScrollTrigger.update and run off GSAP's
 * ticker, otherwise pinned/scrubbed timelines lag a frame behind the smoothed
 * scroll position and pins visibly drift.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Honour reduced motion by simply not smoothing — native scroll is fine.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenis = instance;
    // Honour a lock requested before this instance existed.
    if (locked) instance.stop();

    instance.on("scroll", ScrollTrigger.update);

    // Lenis expects milliseconds; gsap.ticker reports seconds.
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
