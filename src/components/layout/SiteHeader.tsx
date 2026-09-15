"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight, EnvelopeSimple, List, X } from "@phosphor-icons/react/dist/ssr";
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
 *   "hidden"  Scrolling UP before reaching the top: both are put away, so
 *             the reader gets a clear screen. Scrolling down again brings
 *             the dock straight back; reaching the top restores the header.
 *
 * Small screens are deliberately different, again as the reference does it:
 * the compact bar stays visible in both directions so the menu is always one
 * tap away.
 */
type NavMode = "top" | "dock" | "hidden";

/** Within this many px of the top the full header shows (theirs is ~20-40). */
const TOP_ZONE = 24;

const CTA = { label: "Start your book", href: "/contact" };

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

  /* Direction comes from ScrollTrigger rather than a scroll listener: it is
   * already ticking in step with Lenis, and it reports direction itself.
   * setMode with an unchanged value bails out, so most updates cost nothing. */
  useEffect(() => {
    const resolve = (y: number, direction: number): NavMode =>
      y <= TOP_ZONE ? "top" : direction === 1 ? "dock" : "hidden";

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setMode(resolve(self.scroll(), self.direction)),
    });

    // A page restored mid-scroll (reload, back button) starts without a
    // direction: keep it clear until the reader scrolls.
    const raf = requestAnimationFrame(() => {
      if (st.scroll() > TOP_ZONE) setMode("hidden");
    });

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
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
          "fixed inset-x-0 top-0 z-50 hidden transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block",
          mode !== "top" && "pointer-events-none -translate-y-24 opacity-0",
        )}
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-8 pt-5 xl:px-12">
          <Link href="/" aria-label={`${site.name} home`} className="justify-self-start">
            <Wordmark className="h-7 xl:h-10" />
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
              className="group inline-flex h-11 items-center gap-3 rounded-full bg-accent pl-5 pr-1.5 text-sm font-normal text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              {CTA.label}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-accent transition-transform duration-300 group-hover:rotate-45">
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
          "fixed inset-x-0 bottom-8 z-50 hidden justify-center transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex",
          mode === "dock" ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0",
        )}
      >
        <div className="flex items-center gap-2">
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
            className={cn(circle, "bg-accent text-white shadow-lift hover:bg-accent-hover")}
          >
            <ArrowUpRight size={18} weight="bold" aria-hidden />
          </Link>
        </div>
      </div>

      {/* ---- Small screens ------------------------------------------------ */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-paper/85 backdrop-blur-md lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" aria-label={`${site.name} home`}>
            <Wordmark className="h-6 sm:h-7" />
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
            <Wordmark className="h-6 sm:h-7" />
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
              className="inline-flex h-11 flex-1 items-center justify-between gap-3 rounded-full bg-accent pl-5 pr-1.5 text-sm font-normal text-white"
            >
              {CTA.label}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-accent">
                <ArrowUpRight size={15} weight="bold" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
