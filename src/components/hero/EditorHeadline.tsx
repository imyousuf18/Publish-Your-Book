"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  CaretDown,
  Check,
  TextB,
  TextItalic,
  TextUnderline,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { INTRO_OFF_CLASS } from "@/lib/intro";
import { hero, heroEditor, type HeroInk, type HeroLevel } from "@/lib/site";

/*
 * The headline with a formatting bar under it — orionix's hero device. The bar
 * really sets the headline: heading level, bold, italic, underline and ink.
 *
 * Nothing below moves when the headline changes. An invisible copy of the
 * headline at its widest setting (Heading 1, bold) reserves the space, and the
 * styled version is centred inside it. Without that, every change of size or
 * weight rewrapped the headline and shoved the toolbar and buttons around.
 *
 * MAKING IT OBVIOUSLY YOURS TO USE. It used to restyle itself on a loop, and
 * people watched it like a video — a visitor had to be told the bar worked.
 * Now it shows a hand, once, and then waits for the reader:
 *
 *   waiting  a text cursor blinks at the end of the headline (editors have
 *            taught everyone what that means)
 *   demo     once the intro has gone and the bar is in view: a pointer (a tap
 *            dot on touch screens) glides in, the headline is "selected",
 *            the pointer clicks Italic, the headline changes — once
 *   invite   "Your turn: style this headline ↑" under the bar, and the bar's
 *            ring breathes until it is used
 *   engaged  the first touch, click or focus inside it: everything above
 *            stands down and the reader is driving
 *
 * Clicking the headline itself (where people try first) selects it and nudges
 * them to the bar. Reduced motion: no pointer and no demo; the invitation and a
 * steady ring appear straight away.
 *
 * Accessibility: the <h1> carries the real title as screen-reader text and the
 * drawn version is aria-hidden, so restyling never re-announces the heading.
 * B/I/U are toggle buttons (aria-pressed); level and ink are menus of radio
 * items; the line under the bar is a polite live region describing the result.
 */

type Style = {
  level: HeroLevel;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  ink: HeroInk;
};

type Phase = "waiting" | "demo" | "invite" | "engaged";

const DEFAULT: Style = { level: "h1", bold: false, italic: false, underline: false, ink: "ink" };

/** How long after the bar comes into view the demo starts. */
const DEMO_DELAY_MS = 600;
/** How long a click on the headline keeps the nudge up. */
const NUDGE_MS = 2400;

const SIZE: Record<HeroLevel, string> = {
  h1: "text-h1 md:text-display short:text-h2",
  h2: "text-h2 md:text-h1 short:text-h3",
  h3: "text-h3 md:text-h2 short:text-h3",
};

function describe(s: Style) {
  const level = heroEditor.levels.find((l) => l.id === s.level)!.label;
  const ink = heroEditor.inks.find((i) => i.id === s.ink)!.label;
  const marks = [s.bold && "bold", s.italic && "italic", s.underline && "underlined"].filter(Boolean);
  return `${level}${marks.length ? `, ${marks.join(", ")}` : ""}, in ${ink}: ${heroEditor.coda}`;
}

export function EditorHeadline() {
  const [style, setStyle] = useState<Style>(DEFAULT);
  const [changed, setChanged] = useState(false);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [nudge, setNudge] = useState(false);
  const touched = useRef(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const italicRef = useRef<HTMLButtonElement | null>(null);
  const ghostRef = useRef<HTMLSpanElement | null>(null);
  const pressRef = useRef<HTMLSpanElement | null>(null);
  const selectRef = useRef<HTMLSpanElement | null>(null);
  const nudgeTimer = useRef(0);

  /* The demo: once, when the intro has gone and the bar is in view. */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    const run = () => {
      if (touched.current) return;
      const wrap = wrapRef.current;
      const btn = italicRef.current;
      const ghost = ghostRef.current;
      if (reduced || !wrap || !btn || !ghost) {
        setPhase("invite");
        return;
      }
      const w = wrap.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const x = b.left - w.left + b.width / 2;
      const y = b.top - w.top + b.height / 2;
      const at = (dx: number, dy: number) => `translate(${x + dx}px, ${y + dy}px)`;

      setPhase("demo");
      // Start below and to the right of Italic, without animating there.
      ghost.style.transition = "none";
      ghost.style.transform = at(80, 70);
      void ghost.offsetWidth;
      ghost.style.transition = "";

      later(() => {
        ghost.style.opacity = "1";
        selectRef.current?.setAttribute("data-selected", "");
      }, 40);
      later(() => (ghost.style.transform = at(0, 0)), 320);
      later(() => pressRef.current?.setAttribute("data-press", ""), 1080);
      later(() => {
        pressRef.current?.removeAttribute("data-press");
        if (!touched.current) setStyle((s) => ({ ...s, italic: true }));
      }, 1220);
      later(() => {
        selectRef.current?.removeAttribute("data-selected");
        ghost.style.opacity = "0";
        ghost.style.transform = at(26, 30);
      }, 1900);
      later(() => !touched.current && setPhase("invite"), 2150);
    };

    const whenInView = () => {
      const bar = barRef.current;
      if (!bar) return run();
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          later(run, DEMO_DELAY_MS);
        },
        { threshold: 0.6 },
      );
      io.observe(bar);
    };

    // Not while the homepage intro is still on screen.
    const html = document.documentElement;
    if (html.classList.contains(INTRO_OFF_CLASS)) whenInView();
    else {
      mo = new MutationObserver(() => {
        if (!html.classList.contains(INTRO_OFF_CLASS)) return;
        mo?.disconnect();
        whenInView();
      });
      mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    }

    return () => {
      timers.forEach(clearTimeout);
      io?.disconnect();
      mo?.disconnect();
    };
  }, []);

  useEffect(() => () => clearTimeout(nudgeTimer.current), []);

  /** The reader has taken over: the demo and the invitation stand down. */
  const engage = () => {
    if (touched.current) return;
    touched.current = true;
    setPhase("engaged");
    clearTimeout(nudgeTimer.current);
    setNudge(false);
    if (ghostRef.current) ghostRef.current.style.opacity = "0";
    selectRef.current?.removeAttribute("data-selected");
  };
  const set = (patch: Partial<Style>) => {
    engage();
    setChanged(true);
    setStyle((s) => ({ ...s, ...patch }));
  };

  /** A click on the headline: select it, and point at the bar. */
  const onHeadline = () => {
    selectRef.current?.setAttribute("data-selected", "");
    setNudge(true);
    clearTimeout(nudgeTimer.current);
    nudgeTimer.current = window.setTimeout(() => {
      selectRef.current?.removeAttribute("data-selected");
      setNudge(false);
    }, NUDGE_MS);
  };

  const title = hero.headline;
  const cut = title.lastIndexOf(" ") + 1;
  const words = (
    <>
      {title.slice(0, cut)}
      <span className="italic">{title.slice(cut)}</span>
    </>
  );
  const inkValue = heroEditor.inks.find((i) => i.id === style.ink)!.value;
  const inviting = phase === "invite" || nudge;

  return (
    <div
      ref={wrapRef}
      className="relative flex flex-col items-center"
      onPointerDown={(e) => {
        // A click on the headline is not using the bar; it gets its own nudge.
        if (!(e.target as Element).closest("[data-headline]")) engage();
      }}
      onFocusCapture={engage}
    >
      <h1 className="grid max-w-4xl text-center text-ink">
        <span className="sr-only">{title}</span>

        {/* The reservation: the widest setting, never seen. */}
        <span aria-hidden className="invisible font-bold [grid-area:1/1] text-h1 md:text-display short:text-h2">
          {words}
        </span>

        <span
          aria-hidden
          data-headline
          onClick={onHeadline}
          className={cn(
            "cursor-text self-center [grid-area:1/1] transition-[font-size,color] duration-300 ease-out",
            SIZE[style.level],
            style.bold && "font-bold",
            style.italic && "italic",
            style.underline && "underline decoration-[0.06em] underline-offset-[0.14em]",
          )}
          style={{ color: inkValue }}
        >
          <span ref={selectRef} className="hero-select">
            {words}
          </span>
          {/* The text cursor: until the reader takes over. */}
          {phase !== "engaged" && <span className="hero-caret" />}
        </span>
      </h1>

      {/* ---- The formatting bar --------------------------------------- */}
      <div
        ref={barRef}
        role="toolbar"
        aria-label="Format the headline"
        className={cn(
          "mt-6 inline-flex items-center gap-0.5 rounded-xl bg-surface p-1 text-ink shadow-[0_0_0_1px_rgb(29_30_34/0.06),0_8px_24px_rgb(29_30_34/0.08)] md:mt-8 short:mt-3",
          inviting && "hero-invite",
        )}
      >
        <Menu
          label="Heading level"
          value={style.level}
          options={heroEditor.levels}
          onChange={(level) => set({ level })}
          render={(o) => (
            // "H1" under 360px, where "Heading 1" makes the bar wider than the screen.
            <span className="whitespace-nowrap">
              <span className="max-[359px]:hidden">{o.label}</span>
              <span className="min-[360px]:hidden">{o.short}</span>
            </span>
          )}
          renderRow={(o) => o.short}
          buttonClassName="px-3"
        />
        <Divider />
        <Toggle label="Bold" on={style.bold} onClick={() => set({ bold: !style.bold })}>
          <TextB size={18} weight="bold" aria-hidden />
        </Toggle>
        <Toggle ref={italicRef} label="Italic" on={style.italic} onClick={() => set({ italic: !style.italic })}>
          <TextItalic size={18} weight="bold" aria-hidden />
        </Toggle>
        <Toggle label="Underline" on={style.underline} onClick={() => set({ underline: !style.underline })}>
          <TextUnderline size={18} weight="bold" aria-hidden />
        </Toggle>
        <Divider />
        <Menu
          label="Ink"
          value={style.ink}
          options={heroEditor.inks}
          onChange={(ink) => set({ ink })}
          render={(o) => (
            <>
              <span aria-hidden className="size-4 rounded-full" style={{ background: o.value }} />
              <span className="sr-only">{o.label}</span>
            </>
          )}
          renderItem={(o) => (
            <>
              <span aria-hidden className="size-4 rounded-full" style={{ background: o.value }} />
              {o.label}
            </>
          )}
          renderRow={(o) => (
            <>
              <span aria-hidden className="size-4 rounded-full" style={{ background: o.value }} />
              <span className="sr-only">{o.label}</span>
            </>
          )}
          buttonClassName="px-2.5"
          align="right"
        />
      </div>

      {/* The line under the bar: the invitation, then what the reader chose.
          Exactly one line tall either way, so nothing below moves. On
          sideways phones it is read, not shown. */}
      <p aria-live="polite" className="mt-3 min-h-[1.5em] max-w-md text-sm text-ink-muted short:sr-only">
        {changed ? (
          describe(style)
        ) : inviting ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 font-medium leading-[1.5em] text-accent">
            <ArrowUp size={13} weight="bold" aria-hidden />
            {heroEditor.invite}
          </span>
        ) : (
          heroEditor.idle
        )}
      </p>

      {/* The demo pointer (a tap dot on touch screens). Decorative. */}
      <span ref={ghostRef} aria-hidden className="hero-ghost">
        <span
          ref={pressRef}
          className="block origin-top-left transition-transform duration-150 data-[press]:scale-[0.82]"
        >
          <svg
            width="22"
            height="26"
            viewBox="0 0 22 26"
            className="pointer-coarse:hidden"
            fill="#1d1e22"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <path d="M1.5 1.5v19.2l5-4.6 3.4 7.6 3.6-1.6-3.4-7.4h6.9z" />
          </svg>
          <span className="-ml-4 -mt-4 hidden size-8 rounded-full border-2 border-white bg-ink/35 pointer-coarse:block" />
        </span>
      </span>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="mx-0.5 h-5 w-px bg-line" />;
}

function Toggle({
  ref,
  label,
  on,
  onClick,
  children,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-lg transition-colors duration-150",
        on ? "bg-ink text-inverse-ink" : "hover:bg-surface-alt",
      )}
    >
      {children}
    </button>
  );
}

/** Height a menu needs beside its button (4 items × 44px, padding, gap). */
const MENU_ROOM = 208;
/** The mobile header, which a menu must not open under. */
const HEADER = 64;

/** Where a menu opens: below, above, or — when neither fits, as on a phone
 * held sideways — as a single row of choices below or above. */
type Place = "down" | "up" | "row-down" | "row-up";

/**
 * A small menu of radio items: a button with aria-haspopup, arrow keys to move,
 * Enter/Space to choose, Escape or a click outside to close (focus returns to
 * the button).
 */
function Menu<T extends { id: string; label: string }>({
  label,
  value,
  options,
  onChange,
  render,
  renderItem,
  renderRow,
  buttonClassName,
  align = "left",
}: {
  label: string;
  value: T["id"];
  options: readonly T[];
  onChange: (id: T["id"]) => void;
  render: (o: T) => React.ReactNode;
  renderItem?: (o: T) => React.ReactNode;
  /** Compact content for the single-row layout. */
  renderRow: (o: T) => React.ReactNode;
  buttonClassName?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  /* The hero frame clips its overflow, so a menu hanging off the screen would
   * be cut off: pick the side with room when opening. */
  const [place, setPlace] = useState<Place>("down");
  const root = useRef<HTMLDivElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const current = options.find((o) => o.id === value)!;
  const checkedIndex = options.findIndex((o) => o.id === value);

  useEffect(() => {
    if (!open) return;
    items.current[checkedIndex]?.focus();
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
    // Focus the checked item only as the menu opens, not on every change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choosePlace = (): Place => {
    const r = button.current?.getBoundingClientRect();
    if (!r) return "down";
    const below = window.innerHeight - r.bottom;
    const above = r.top - HEADER;
    if (below >= MENU_ROOM) return "down";
    if (above >= MENU_ROOM) return "up";
    return below >= above ? "row-down" : "row-up";
  };
  const row = place.startsWith("row");

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = options.length;
    const next = row ? "ArrowRight" : "ArrowDown";
    const prev = row ? "ArrowLeft" : "ArrowUp";
    if (e.key === next || e.key === prev) {
      e.preventDefault();
      items.current[(i + (e.key === next ? 1 : n - 1)) % n]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items.current[e.key === "Home" ? 0 : n - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${current.label}`}
        onClick={() => {
          if (!open) setPlace(choosePlace());
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setPlace(choosePlace());
            setOpen(true);
          }
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-surface-alt",
          open && "bg-surface-alt",
          buttonClassName,
        )}
      >
        {render(current)}
        <CaretDown
          size={12}
          weight="bold"
          aria-hidden
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "absolute z-30 rounded-xl bg-surface p-1 text-left shadow-[0_0_0_1px_rgb(29_30_34/0.06),0_12px_32px_rgb(29_30_34/0.14)]",
            align === "right" ? "right-0" : "left-0",
            place === "down" || place === "row-down" ? "top-full mt-2" : "bottom-full mb-2",
            row ? "flex gap-0.5" : "min-w-40",
          )}
        >
          {options.map((o, i) => {
            const checked = o.id === value;
            return (
              <button
                key={o.id}
                ref={(el) => {
                  items.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={checked}
                tabIndex={-1}
                onClick={() => {
                  onChange(o.id);
                  close();
                }}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "flex min-h-11 items-center rounded-lg text-sm text-ink transition-colors duration-150 hover:bg-surface-alt focus-visible:bg-surface-alt",
                  row
                    ? cn("min-w-11 justify-center px-2", checked && "bg-surface-alt font-semibold")
                    : "w-full gap-2.5 px-3",
                )}
              >
                {row ? (
                  renderRow(o)
                ) : (
                  <>
                    {renderItem ? renderItem(o) : o.label}
                    <Check
                      size={14}
                      weight="bold"
                      aria-hidden
                      className={cn("ml-auto", checked ? "opacity-100" : "opacity-0")}
                    />
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
