/**
 * The homepage intro (components/loader/BookLoader.tsx): a short pre-rendered
 * video of the 3D book — it arrives, opens, turns its pages, closes — that
 * then fades into the homepage. Once per visit, only when a visit lands on
 * the homepage.
 *
 * Whether it plays is decided BEFORE first paint by INTRO_GUARD, an inline
 * script in the root layout's <head> — so it runs exactly once per document
 * load, on every page. It adds INTRO_OFF_CLASS to <html> when the intro must
 * not show, and CSS hides the intro on that class — so a repeat visit never
 * flashes the dark screen for the moment it takes JavaScript to arrive.
 *
 * When it will play, the guard also starts the video the moment the HTML has
 * been parsed (DOMContentLoaded) — without waiting for the page's JavaScript,
 * which on a slow load can be seconds later — and listens for input until the
 * intro's code takes over (INTRO_EARLY_SKIP). The <video> itself is in the
 * server HTML with preload="none", so a repeat visit, where the intro is off,
 * never downloads it. (The guard only calls play(), which loads it anyway; it
 * must not touch the element's attributes before React hydrates, or the
 * server HTML no longer matches.)
 *
 * Off when:
 *   - the visit did not LAND on the homepage: it is an entrance, never an
 *     interruption, so following a link to Home from another page skips it
 *     (the guard used to live in the page itself; React never runs a script
 *     it renders on the client, so that path skipped the guard entirely)
 *   - it has already played in this tab's session (a sessionStorage flag,
 *     which a duplicated tab inherits). Add ?intro to the URL to replay it —
 *     for reviewing it, not a feature anyone is sent to.
 *   - the reader asks for reduced motion, or for reduced data (Save-Data)
 *
 * Kept outside the component because the root layout is a server component:
 * a constant imported from a "use client" module would arrive as a client
 * reference, not as the string.
 */
export const INTRO_SEEN_KEY = "pyb:intro-seen";
export const INTRO_OFF_CLASS = "intro-off";

/** Set by the guard when the reader pressed, clicked, scrolled or touched
 * before the intro's JavaScript had started — their skip is honoured the
 * moment it does, instead of being lost to the loading page. */
export const INTRO_EARLY_SKIP = "__pybIntroSkip";

/**
 * The choreography, in seconds. The studio (app/dev/intro-studio) renders the
 * video from it; change it there and re-render (scripts/render-intro.mjs).
 *   enter  the closed book rises and settles into its pose
 *   hold   a breath before it opens
 *   play   opens, turns five pages, closes and turns over
 *   rest   a beat on the back cover before the page fades in
 */
export const INTRO_TIMELINE = (() => {
  const t = { enter: 0.7, hold: 0.15, play: 2.4, rest: 0.25 };
  return { ...t, total: t.enter + t.hold + t.play + t.rest };
})();

/** Two cuts: the book is framed for the screen's shape, as the live scene was. */
export const INTRO_MEDIA = {
  landscape: { video: "/videos/intro-landscape", poster: "/images/intro/intro-landscape.webp", width: 1920, height: 1080 },
  portrait: { video: "/videos/intro-portrait", poster: "/images/intro/intro-portrait.webp", width: 1080, height: 1920 },
} as const;

const q = JSON.stringify;

export const INTRO_GUARD = `try{var d=document.documentElement,n=navigator;if(location.pathname!=="/"){d.classList.add(${q(
  INTRO_OFF_CLASS,
)});throw 0}if(/[?&]intro(=|&|$)/.test(location.search))sessionStorage.removeItem(${q(
  INTRO_SEEN_KEY,
)});if(sessionStorage.getItem(${q(INTRO_SEEN_KEY)})||matchMedia("(prefers-reduced-motion: reduce)").matches||(n.connection&&n.connection.saveData)){d.classList.add(${q(
  INTRO_OFF_CLASS,
)})}else{document.addEventListener("DOMContentLoaded",function(){var v=document.querySelector("[data-intro] video");if(v&&!document.hidden){var p=v.play();p&&p.catch(function(){})}});var t=["keydown","pointerdown","wheel","touchstart"],f=function(e){if(e.key&&/^(Shift|Control|Alt|Meta)$/.test(e.key))return;window[${q(
  INTRO_EARLY_SKIP,
)}]=1;t.forEach(function(x){removeEventListener(x,f,true)})};t.forEach(function(x){addEventListener(x,f,{capture:true,passive:true})})}}catch(e){}`;

/**
 * The intro's <video>, as an HTML string for dangerouslySetInnerHTML: React
 * does not render the `muted` ATTRIBUTE for <video>, and without it iOS will
 * not autoplay. Sources carry media queries, so the browser downloads only the
 * cut that fits the screen (portrait first; a browser that ignores `media`
 * takes the first it can play). preload="none": nothing is fetched unless the
 * intro actually plays.
 */
export const INTRO_VIDEO_HTML = (() => {
  const src = (cut: keyof typeof INTRO_MEDIA, media?: string) =>
    [
      [".webm", 'video/webm; codecs="vp9"'],
      [".mp4", "video/mp4"],
    ]
      .map(
        ([ext, type]) =>
          `<source src="${INTRO_MEDIA[cut].video}${ext}" type='${type}'${media ? ` media="${media}"` : ""}>`,
      )
      .join("");
  return `<video muted playsinline preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" class="absolute inset-0 size-full object-cover">${src("portrait", "(max-aspect-ratio: 1/1)")}${src("landscape")}</video>`;
})();
