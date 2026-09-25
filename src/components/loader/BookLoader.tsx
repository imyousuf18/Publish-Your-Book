"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { lockScroll, unlockScroll } from "@/components/motion/SmoothScroll";
import {
  INTRO_EARLY_SKIP,
  INTRO_MEDIA,
  INTRO_OFF_CLASS,
  INTRO_SEEN_KEY,
  INTRO_VIDEO_HTML,
} from "@/lib/intro";

/* The homepage intro: a short video of the book — it arrives, opens, turns its
 * pages, closes — then a fade into the homepage. ~3.5s, once per visit, only
 * when a visit lands on the homepage.
 *
 * It is a VIDEO, pre-rendered from the 3D book (app/dev/intro-studio,
 * scripts/render-intro.mjs), not the 3D book running live. Live, the book
 * needed ~2.8s of downloading and GPU work before it could move on a fast
 * desktop, and never made it in time on the dev server or slower phones —
 * visitors got a closed book that lifted away without opening. The video
 * starts almost at once, on every device, and the homepage carries no 3D code.
 *
 * The rules:
 *
 *   Instant    Frame 0 of the video is a still in the server HTML (<picture>,
 *              one per framing), so the book is there at first paint. The
 *              <video> is in the server HTML too, and the guard in <head>
 *              starts it as soon as the HTML is parsed — it does not wait for
 *              this component (on a slow first load, seconds later).
 *   Short      Plays by itself, then fades into the page. Nothing to learn.
 *   Skippable  Any wheel, touch, click or key — or Skip — fades out at once,
 *              even input from before the JavaScript arrived (the guard
 *              records it). Tab too: the page's "Skip to content" link is the
 *              first stop and must not sit hidden under the intro.
 *   Bounded    Not playing LOADING_SIGN_MS after it could have? A small
 *              loading sign appears. Not playing by DEADLINE_MS? It fades
 *              away. Stalls mid-play for STALL_MS? Same. Autoplay refused
 *              (e.g. iOS Low Power Mode)? Same, straight away.
 *   Seen       A homepage opened in a background tab waits: nothing is spent
 *              — not the clock, not the once-per-session flag — until the
 *              tab is actually looked at.
 *   Once       Once per tab session, only when the visit lands on "/"; off
 *              for reduced motion and Save-Data. Decided in lib/intro.ts.
 */

const LOADING_SIGN_MS = 500;
const DEADLINE_MS = 2000;
const STALL_MS = 1500;
const FADE = { natural: 700, quick: 350 };

const introWanted = () =>
  typeof document !== "undefined" && !document.documentElement.classList.contains(INTRO_OFF_CLASS);
const noSubscribe = () => () => {};

export function BookLoader() {
  /* The server always renders the intro; the pre-paint guard hides it with
   * CSS when it is off. On the client the answer is read from <html> — via
   * useSyncExternalStore, so hydration uses the server's answer first and a
   * client-side return to the homepage never flashes it. */
  const wanted = useSyncExternalStore(noSubscribe, introWanted, () => true);
  /* Mounted from the root layout (so it sits above the header and dock), but
   * only ever rendered on the homepage — other pages don't even get its
   * markup, or its still. */
  const home = usePathname() === "/";
  const [done, setDone] = useState(false);
  const active = home && wanted && !done;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const signRef = useRef<HTMLDivElement | null>(null);
  const leaving = useRef(false);

  const finish = useCallback(() => {
    document.documentElement.classList.add(INTRO_OFF_CLASS);
    setDone(true);
  }, []);

  /** Fade into the homepage. Timer-driven, not animation-driven: leaving must
   *  never depend on a frame being drawn (background tabs draw none). */
  const leave = useCallback(
    (pace: keyof typeof FADE = "quick") => {
      if (leaving.current) return;
      leaving.current = true;
      const root = rootRef.current;
      if (!root) {
        finish();
        return;
      }
      root.style.transition = `opacity ${FADE[pace]}ms ease`;
      root.style.opacity = "0";
      root.style.pointerEvents = "none";
      setTimeout(finish, FADE[pace] + 50);
    },
    [finish],
  );

  useEffect(() => {
    if (!active) return;
    const host = hostRef.current;
    if (!host) return;
    lockScroll();

    const video = host.querySelector("video");
    if (!video) return;

    let started = false; // the clock is running (the tab has been seen)
    let playing = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    let stall = 0;

    const showSign = (on: boolean) => {
      if (signRef.current) signRef.current.style.opacity = on ? "1" : "0";
    };

    const onPlaying = () => {
      playing = true;
      showSign(false);
      clearTimeout(stall);
      // The bar runs with the video: one transition over what is left of it.
      const bar = barRef.current;
      if (bar && Number.isFinite(video.duration)) {
        const left = Math.max(0, video.duration - video.currentTime);
        bar.style.transition = `transform ${left}s linear`;
        bar.style.transform = "scaleX(1)";
      }
    };
    const onWaiting = () => {
      if (!playing) return;
      clearTimeout(stall);
      stall = window.setTimeout(() => leave(), STALL_MS);
    };
    const onEnded = () => leave("natural");
    const onError = () => leave();
    video.addEventListener("playing", onPlaying);
    // The guard may have started it before this code ran.
    if (!video.paused && video.readyState > 2) onPlaying();
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    /* Start only when the reader can see the tab: the play, the clock and the
     * once-per-session flag are all spent here. */
    const begin = () => {
      if (document.hidden || started || leaving.current) return;
      started = true;
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        // Storage blocked: it simply plays again next visit.
      }
      video.preload = "auto";
      video.play().catch(() => leave()); // autoplay refused: don't hold anyone
      later(() => !playing && showSign(true), LOADING_SIGN_MS);
      later(() => !playing && leave(), DEADLINE_MS);
    };

    // Asked to skip before this code had even loaded.
    if ((window as unknown as Record<string, unknown>)[INTRO_EARLY_SKIP]) leave();
    else begin();
    document.addEventListener("visibilitychange", begin);

    const skip = (e: Event) => {
      // A modifier on its own is not a request to leave.
      if (e instanceof KeyboardEvent && /^(Shift|Control|Alt|Meta)$/.test(e.key)) return;
      leave();
    };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach((type) => window.addEventListener(type, skip, { passive: true }));

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(stall);
      document.removeEventListener("visibilitychange", begin);
      events.forEach((type) => window.removeEventListener(type, skip));
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      video.pause();
      unlockScroll();
    };
  }, [active, leave]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      data-intro
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{ background: "var(--color-inverse)" }}
    >
      {/* The still: frame 0 of whichever cut fits the screen's shape — the
          same test the guard uses to pick the video. */}
      <picture>
        <source media="(max-aspect-ratio: 1/1)" srcSet={INTRO_MEDIA.portrait.poster} type="image/webp" />
        {/* A plain <img> (alt="": decorative): next/image would add a
            lazy-loading, sized wrapper this full-bleed, first-paint still must
            not have. */}
        <img
          src={INTRO_MEDIA.landscape.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>

      {/* The video: frame 0 is the still, same fit, so it covers it exactly.
          Raw HTML — see INTRO_VIDEO_HTML for why. */}
      <div
        ref={hostRef}
        aria-hidden
        className="absolute inset-0"
        dangerouslySetInnerHTML={{ __html: INTRO_VIDEO_HTML }}
      />

      {/* Only if the video is slow to start: a quiet sign that something is on
          its way, instead of a frozen screen. */}
      <div
        ref={signRef}
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 lg:bottom-28"
      >
        <span className="block size-6 animate-spin rounded-full border-2 border-inverse-ink/15 border-t-accent-tint" />
      </div>

      {/* Skip is always there, for pointer and screen-reader users: an intro
          nobody can leave is a trap. Any other input leaves too. */}
      <div className="absolute right-6 top-6 lg:right-12 lg:top-10">
        <button
          type="button"
          onClick={() => leave()}
          className="inline-flex min-h-11 items-center rounded-pill border border-inverse-ink/25 px-4 text-eyebrow font-semibold uppercase text-inverse-ink/70 transition-colors duration-200 hover:border-inverse-ink hover:text-inverse-ink"
        >
          Skip intro
        </button>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 p-8 lg:p-12">
        <p className="text-eyebrow font-semibold uppercase" style={{ color: "var(--color-accent-tint)" }}>
          Publish Your Book
        </p>
        <div className="mt-5 h-px w-full bg-inverse-ink/15">
          <div
            ref={barRef}
            className="h-full origin-left"
            style={{ background: "var(--color-accent-tint)", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
