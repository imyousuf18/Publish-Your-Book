/*
 * Mobile responsiveness audit. Run in the browser console on any page of the
 * running site (same origin), then:
 *
 *   await __mobileAudit(["/", "/pricing"], [320, 360, 390, 430, 768, 1024])
 *   await __mobileAudit(["/"], [844], 390)   // phone held sideways
 *
 * Each route loads in an offscreen iframe of that size, so media queries
 * respond exactly as on a device. Per page and size it reports:
 *   pannable      px the page can be scrolled sideways (must be 0)
 *   overflow      elements past the screen edge, outside any scroller
 *   textClip      text wider than its own box (unbreakable words)
 *   smallTargets  tap targets under 44px (below 1024px only)
 *   smallInputs   form fields under 16px (iOS zooms on focus)
 *   tinyText      text under 12px
 *
 * `pannable` is the check that matters most: it caught sr-only labels escaping
 * a scroller and widening a 390px page to 1783px, which every element-level
 * check missed. At 768px+ on desktop Chrome, GSAP's pin spacer can show ~15px
 * pannable; that is scrollbar width, not reachable by a person (body's
 * overflow-x: clip hides it), and does not occur on phones.
 */
// Mobile audit harness. Loads each route in a same-origin iframe at a given
// width, so media queries respond to the iframe, then measures inside it.
window.__mobileAudit = async (routes, widths, height = 800) => {
  const results = [];
  const load = (url, w) =>
    new Promise((res) => {
      const f = document.createElement("iframe");
      f.style.cssText = `position:fixed;left:-99999px;top:0;width:${w}px;height:${height}px;border:0`;
      f.onload = () => setTimeout(() => res(f), 900);
      f.src = url;
      document.body.appendChild(f);
    });

  for (const route of routes) {
    for (const w of widths) {
      const f = await load(route, w);
      const d = f.contentDocument;
      const win = f.contentWindow;
      // Drop the loader overlay; it is fixed and not part of page layout.
      d.querySelector(".z-\\[200\\]")?.remove();
      d.documentElement.style.overflow = "";
      const vw = d.documentElement.clientWidth;
      // Ground truth: can the page actually be moved sideways?
      win.scrollTo(400, 0);
      const pannable = win.scrollX;
      win.scrollTo(0, 0);
      const docW = d.documentElement.scrollWidth;

      // Is this element inside something that intentionally scrolls or clips sideways?
      const contained = (el) => {
        let n = el.parentElement;
        while (n && n !== d.body && n !== d.documentElement) {
          const cs = win.getComputedStyle(n);
          if (["auto", "scroll", "hidden", "clip"].includes(cs.overflowX)) return true;
          if (cs.position === "fixed" && n.getBoundingClientRect().width <= vw + 1) {
            // inside a fixed bar that itself fits: fine unless it overflows
          }
          n = n.parentElement;
        }
        return false;
      };

      const overflow = [];
      const textClip = [];
      const smallTargets = [];
      const smallInputs = [];
      const tinyText = [];

      for (const el of d.querySelectorAll("body *")) {
        const cs = win.getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (el.closest("[aria-hidden='true'], .sr-only, dialog:not([open]), [inert]")) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;

        // 1. Sticks out past either screen edge, and nothing is meant to clip it.
        if ((r.right > vw + 1 || r.left < -1) && !contained(el) && cs.position !== "fixed") {
          overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} [${Math.round(r.left)}→${Math.round(r.right)}]`);
        }

        // 2. Text wider than its own box (a long word that cannot wrap).
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (hasText && el.scrollWidth > el.clientWidth + 2 && cs.overflowX === "visible" && !["inline"].includes(cs.display)) {
          textClip.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}" ${el.scrollWidth}>${el.clientWidth}`);
        }

        if (hasText && parseFloat(cs.fontSize) < 12) {
          tinyText.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 20)}" ${cs.fontSize}`);
        }

        // 3. Touch targets under 44px (only meaningful below lg).
        if (w < 1024 && el.matches("a[href], button, summary, select, input:not([type=hidden]):not(.sr-only), textarea, label:has(> input.sr-only)")) {
          if (!el.closest(".lg\\:block, .lg\\:flex") || win.getComputedStyle(el.closest(".lg\\:block, .lg\\:flex") || el).display !== "none") {
            if (r.height < 44 && !(el.matches("a") && cs.display === "inline")) {
              smallTargets.push(`${el.tagName.toLowerCase()} "${(el.textContent.trim() || el.getAttribute("aria-label") || "").slice(0, 22)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
            }
          }
        }

        // 4. Form fields under 16px zoom the page on iOS when focused.
        if (el.matches("input:not([type=hidden]):not([type=file]):not([type=radio]):not([type=checkbox]), select, textarea") && parseFloat(cs.fontSize) < 16) {
          smallInputs.push(`${el.name || el.tagName} ${cs.fontSize}`);
        }
      }

      const uniq = (a) => [...new Set(a)];
      results.push({
        route,
        w,
        pannable,
        docW,
        vw,
        overflow: uniq(overflow).slice(0, 6),
        overflowCount: uniq(overflow).length,
        textClip: uniq(textClip).slice(0, 5),
        smallTargets: uniq(smallTargets).slice(0, 6),
        smallTargetCount: uniq(smallTargets).length,
        smallInputs: uniq(smallInputs),
        tinyText: uniq(tinyText).slice(0, 4),
      });
      f.remove();
    }
  }
  return results;
};
