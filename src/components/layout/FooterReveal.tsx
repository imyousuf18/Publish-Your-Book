"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Measures the footer and publishes its height as `--footer-h`.
 *
 * That variable does two jobs: it is the bottom margin the page content
 * reserves so the fixed footer has somewhere to be revealed, and it is what
 * SiteHeader reads to know when the footer is on screen.
 *
 * The reveal is the "uncover" variant: the footer is fixed at the bottom on a
 * lower layer, and the opaque page content slides up off it as you reach the
 * end. wearedirect.co gets the same picture the other way round — their last
 * section is `position: sticky; bottom: 0; z-index: 1` and the footer scrolls
 * over it at `z-index: 5`. I did not copy that literally because it would put
 * a sticky, stacking-context-forming ancestor around every ScrollTrigger pin
 * on the page, and pinning inside a sticky ancestor is exactly the combination
 * that has already cost us a day. The uncover touches nothing inside <main>.
 *
 * If the footer is ever taller than the viewport it cannot be revealed this
 * way (a fixed element taller than the screen simply gets cut off), so the
 * variable goes to 0 and everything falls back to an ordinary footer in flow.
 */
export function FooterReveal() {
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const apply = () => {
      const h = footer.offsetHeight;
      const fits = h > 0 && h < window.innerHeight * 0.95;
      document.documentElement.style.setProperty("--footer-h", fits ? `${h}px` : "0px");
      document.documentElement.dataset.footerReveal = fits ? "on" : "off";
      ScrollTrigger.refresh();
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(footer);
    window.addEventListener("resize", apply);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      document.documentElement.style.removeProperty("--footer-h");
      delete document.documentElement.dataset.footerReveal;
    };
  }, []);

  return null;
}
