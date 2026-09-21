"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight, EnvelopeSimple, List, X } from "@phosphor-icons/react/dist/ssr";
import { RollingLabel } from "@/components/ui/Button";
import { NavCapsule } from "@/components/layout/NavCapsule";
import { getLenis, lockScroll, unlockScroll } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/utils";
import { moreLinks, navLinks, site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

/*
 * Desktop navigation has three states, matching creativeans.com as measured
 * with real wheel input on the live site:
 *
 *   "top"     At the very top of the page: the full header (logo, ring
 *             capsule, two actions) floats over the hero; the dock is away.
 *   "dock"    Scrolling DOWN anywhere below the top: the header slides up
 *             and fades, and the dock rises at the bottom centre.
 * There used to be a third state: scrolling UP below the top put BOTH away,
 * leaving no navigation on screen at all until you either scrolled back down
 * or reached the very top. That is the reference site's behaviour, but it
 * reads as the nav having disappeared. The dock now simply stays for the whole
 * page below the top zone, in both directions.
 *
 * Small screens are deliberately different, again as the reference does it:
 * the compact bar stays visible in both directions so the menu is always one
 * tap away.
 */
type NavMode = "top" | "transit" | "dock" | "hidden";

/*
 * The hand-over between header and dock is SCROLL-LINKED, not a timed switch.
 *
 * It used to flip a state at 24px and run two fixed 300ms fades, so a flick of
 * the wheel fired the whole change at once and it read as a jump. Now each bar
 * is scrubbed against scroll position, with the two ranges overlapping:
 *
 *   0 ──── HEADER_OUT        header rises off the top, in step with the scroll
 *        DOCK_IN ──── DOCK_END   dock rises from the bottom as you keep going
 *
 * Scrolling back up plays it in reverse, at the reader's own speed. The ranges
 * are px of page scroll; the overlap is what makes it feel like one movement.
 */
const HEADER_OUT = 160;
const DOCK_IN = 90;
const DOCK_END = 280;

/** Footer uncovered by more than this many px: the dock gets out of the way. */
const FOOTER_ZONE = 72;

/* Which bar takes clicks. Neither does mid-hand-over, so a half-visible bar
 * can't swallow a click meant for the page. Midpoints of each range. */
const HEADER_LIVE_UNTIL = HEADER_OUT / 2;
const DOCK_LIVE_FROM = (DOCK_IN + DOCK_END) / 2;

const CTA = { label: "Start your book", href: "/contact" };

/** The orionix label roll — see ui/Button.tsx and the LABEL ROLL block in
 *  globals.css for what it is and why it is not written in utilities. */
const Roll = RollingLabel;

function Wordmark({ className }: { className?: string }) {
  return (
    <Image
      // Trimmed copy of the supplied logo. The original PNG is 68% transparent
      // padding vertically, so at any given height the artwork rendered at a
      // third of that size and read as tiny.
      src="/Assets/logo-wordmark.png"
      alt={site.name}
      width={1827}
      height={259}
      priority
      className={cn("w-auto", className)}
    />
  );
}

export function SiteHeader() {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [mode, setMode] = useState<NavMode>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerBarRef = useRef<HTMLDivElement | null>(null);
  const dockBarRef = useRef<HTMLDivElement | null>(null);

  /* Position alone decides now — scroll direction no longer matters, so the
   * dock never vanishes mid-page. ScrollTrigger still drives it rather than a
   * scroll listener because it already ticks in step with Lenis. setMode with
   * an unchanged value bails out, so most updates cost nothing. */
  useEffect(() => {
    /* How much of the fixed footer is currently uncovered. At maximum scroll
     * the whole footer is showing, so the shortfall from max scroll is exactly
     * how much of it is still hidden. */
    const revealed = (y: number) => {
      const h = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--footer-h"),
      );
      if (!h) return 0;
      return h - (ScrollTrigger.maxScroll(window) - y);
    };

    const resolve = (y: number): NavMode => {
      if (y < HEADER_LIVE_UNTIL) return "top";
      // The footer carries its own navigation, so a dock over it is clutter.
      if (revealed(y) > FOOTER_ZONE) return "hidden";
      return y >= DOCK_LIVE_FROM ? "dock" : "transit";
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setMode(resolve(self.scroll())),
    });

    // A page restored mid-scroll (reload, back button) must start docked.
    const raf = requestAnimationFrame(() => setMode(resolve(st.scroll())));

    /* The scrubbed hand-over. Reduced motion gets none of it: the classes on
     * the outer elements simply show one bar or the other. */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const header = headerBarRef.current;
      const dock = dockBarRef.current;
      if (!header || !dock) return;

      // scrub 0.5: trails the scroll by half a second, so a wheel's stepped
      // input still draws a smooth line instead of jumping with each notch.
      gsap.fromTo(
        header,
        { yPercent: 0, autoAlpha: 1 },
        {
          yPercent: -140,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { start: 0, end: HEADER_OUT, scrub: 0.5 },
        },
      );
      gsap.fromTo(
        dock,
        { yPercent: 170, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { start: DOCK_IN, end: DOCK_END, scrub: 0.5 },
        },
      );
    });

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
      mm.revert();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [menuOpen]);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circle =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200";

  return (
    <>
      {/* ---- Desktop: top header ---------------------------------------- */}
      <header
        inert={mode !== "top"}
        className={cn(
          "fixed inset-x-0 top-0 z-50 hidden lg:block",
          // Movement is scrubbed on the inner bar; this only stops a departing
          // header taking clicks, and hides it outright under reduced motion.
          mode !== "top" && "pointer-events-none motion-reduce:opacity-0",
        )}
      >
        <div
          ref={headerBarRef}
          className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-8 pt-5 xl:px-12">
          <Link href="/" aria-label={`${site.name} home`} className="justify-self-start">
            <Wordmark className="h-5 xl:h-7" />
          </Link>

          <NavCapsule placement="top" />

          <div className="flex items-center gap-2 justify-self-end">
            <a
              href={`mailto:${site.email}`}
              aria-label="Talk to us by email"
              className={cn(circle, "border border-ink/15 bg-paper/80 text-ink backdrop-blur-md hover:border-ink hover:bg-ink hover:text-inverse-ink")}
            >
              <EnvelopeSimple size={18} weight="regular" aria-hidden />
            </a>
            <Link
              href={CTA.href}
              className="group inline-flex h-11 items-center gap-3 overflow-clip rounded-full bg-accent-bright pl-5 pr-1.5 text-sm font-normal text-ink transition-[filter] duration-200 hover:brightness-95"
            >
              <Roll>{CTA.label}</Roll>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-accent-bright transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={15} weight="bold" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ---- Desktop: bottom dock while scrolling down -------------------- */}
      <div
        inert={mode !== "dock"}
        className={cn(
          "fixed inset-x-0 bottom-8 z-50 hidden justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex",
          // The rise in is scrubbed on the inner bar. This outer layer only
          // handles stepping aside for the footer (a timed slide, since the
          // footer arriving is an event, not a scroll range), click-blocking
          // mid-hand-over, and the reduced-motion fallback.
          mode === "hidden" && "pointer-events-none translate-y-24 opacity-0",
          (mode === "top" || mode === "transit") && "pointer-events-none",
          mode !== "dock" && mode !== "hidden" && "motion-reduce:opacity-0",
        )}
      >
        <div ref={dockBarRef} className="invisible flex items-center gap-2 motion-reduce:visible">
          <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className={cn(circle, "nav-ring !p-px")}
          >
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-ink/90 text-inverse-ink backdrop-blur-md transition-colors hover:bg-ink">
              <ArrowUp size={17} weight="bold" aria-hidden />
            </span>
          </button>
          <NavCapsule placement="bottom" />
          <Link
            href={CTA.href}
            aria-label={CTA.label}
            className={cn(circle, "bg-accent-bright text-ink shadow-lift hover:brightness-95")}
          >
            <ArrowUpRight size={18} weight="bold" aria-hidden />
          </Link>
        </div>
      </div>

      {/* ---- Small screens ------------------------------------------------ */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-paper/85 backdrop-blur-md lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          {/* min-h-11: the logo is only 20px tall, too small a target on its own. */}
          <Link href="/" aria-label={`${site.name} home`} className="inline-flex min-h-11 items-center">
            <Wordmark className="h-5" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={cn(circle, "bg-ink text-inverse-ink")}
          >
            <List size={18} weight="bold" aria-hidden />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex min-h-[100dvh] flex-col bg-paper lg:hidden"
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Wordmark className="h-5" />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className={cn(circle, "border border-ink/15 text-ink")}
            >
              <X size={18} weight="bold" aria-hidden />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-8">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 font-display text-h2 text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-base text-ink-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 border-t border-line p-5">
            <a
              href={`mailto:${site.email}`}
              aria-label="Talk to us by email"
              className={cn(circle, "border border-ink/15 text-ink")}
            >
              <EnvelopeSimple size={18} aria-hidden />
            </a>
            <Link
              href={CTA.href}
              onClick={() => setMenuOpen(false)}
              className="group inline-flex h-11 flex-1 items-center justify-between gap-3 overflow-clip rounded-full bg-accent-bright pl-5 pr-1.5 text-sm font-normal text-ink"
            >
              <Roll>{CTA.label}</Roll>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-accent-bright">
                <ArrowUpRight size={15} weight="bold" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
