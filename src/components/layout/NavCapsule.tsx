"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { moreLinks, navLinks } from "@/lib/site";

type NavCapsuleProps = {
  /** Where the capsule sits. Decides which way the More menu opens. */
  placement: "top" | "bottom";
  className?: string;
};

/**
 * The centre navigation: a dark capsule inside a 1px animated rust ring.
 *
 * Used twice, in the top header and in the bottom dock that replaces it
 * mid-page, so both are always identical.
 */
export function NavCapsule({ placement, className }: NavCapsuleProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  // Now that every item is a real page, show the reader where they are.
  const pathname = usePathname();
  /* "page" for the page itself; "true" for a section the page sits inside, so
     the Services item stays lit on every /services/... page. */
  const currentState = (href: string) =>
    pathname === href ? "page" : pathname.startsWith(`${href}/`) ? "true" : undefined;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <nav
        aria-label="Main"
        className="nav-ring"
        onPointerMove={(e) => {
          // Written straight to the element: a pointer position is a
          // continuous value and must never drive a React re-render.
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
      >
        <div className="rounded-full bg-ink/90 p-1 backdrop-blur-md">
          <ul className="flex items-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={currentState(link.href)}
                  className="inline-block rounded-full px-4 py-2 text-[0.833rem] font-medium tracking-[0.025em] text-inverse-ink/85 transition-colors duration-200 hover:bg-inverse-ink/10 hover:text-inverse-ink aria-[current=page]:bg-inverse-ink/15 aria-[current=page]:text-inverse-ink aria-[current=true]:bg-inverse-ink/15 aria-[current=true]:text-inverse-ink xl:px-5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.08em] transition-colors duration-200 xl:px-5",
                  open
                    ? "bg-inverse-ink/15 text-inverse-ink"
                    : "text-inverse-ink/85 hover:bg-inverse-ink/10 hover:text-inverse-ink",
                )}
              >
                {open ? (
                  <X size={15} weight="bold" aria-hidden />
                ) : (
                  <List size={15} weight="bold" aria-hidden />
                )}
                More
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          "absolute right-0 min-w-56 rounded-card border border-inverse-ink/10 bg-ink/95 p-2 shadow-lift backdrop-blur-md",
          placement === "top" ? "top-full mt-3" : "bottom-full mb-3",
        )}
      >
        <ul>
          {moreLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={currentState(link.href)}
                onClick={() => setOpen(false)}
                className="block rounded-[0.5rem] px-4 py-2.5 text-sm text-inverse-ink/80 transition-colors hover:bg-inverse-ink/10 hover:text-inverse-ink aria-[current=page]:text-accent-tint"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
