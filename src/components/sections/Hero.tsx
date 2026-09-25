import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { EditorHeadline } from "@/components/hero/EditorHeadline";
import { FloatingCovers } from "@/components/hero/FloatingCovers";
import { ParallaxFrame } from "@/components/hero/ParallaxFrame";
import { RippleField } from "@/components/hero/RippleField";
import { StudioClock } from "@/components/hero/StudioClock";
import { hero, site } from "@/lib/site";

/**
 * The hero, built on orionix.framer.website's structure:
 *
 *   orionix                            ours
 *   ---------------------------------  ------------------------------------
 *   centred serif headline             our headline, centred
 *   a formatting bar that restyles     the same: level, bold, italic,
 *   the headline                       underline and ink, set live
 *   one big floating object            our covers, floating in the margins
 *   rippling on a WebGL shader         a faint typeset spread behind it all,
 *                                      rippling gently under the pointer and
 *                                      on click (RippleField); covers stay still
 *   soft ground in an inset frame      a paper frame inset 8px from the edge
 *   timezone + email in the corners    Chicago time and email; the pitch at
 *                                      the foot, centred
 *
 * It fits one screen at every size: the frame is 100svh (less its 8px inset)
 * and the content is trimmed on short screens rather than letting the frame
 * grow — see the snug / short variants in globals.css.
 *
 * The previous hero is HeroShelf.tsx — import it as Hero in app/page.tsx to go
 * back.
 */
export function Hero() {
  return (
    <section className="bg-paper p-2">
      <ParallaxFrame className="relative flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[1.75rem] bg-surface-alt/70">
        <RippleField />
        <FloatingCovers layout="scatter" />

        {/* z-20, above the foot row's z-10: the toolbar's menus open downward
         * and must pass over the foot on short screens, not under it. */}
        <Container className="relative z-20 flex flex-1 flex-col items-center justify-center pb-4 pt-[4.5rem] text-center lg:pt-28 short:pb-2 short:pt-16">
          <Reveal className="short:hidden">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </Reveal>

          <div className="mt-4 w-full md:mt-6 short:mt-0">
            <EditorHeadline />
          </div>

          <Reveal delay={200} className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-8 short:mt-3">
            <ButtonLink href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary" size="lg">
              {hero.secondaryCta.label}
            </ButtonLink>
          </Reveal>

          <FloatingCovers layout="hand" />
        </Container>

        {/* The foot of the frame: time, pitch, email — orionix's corners.
         * On phones the pitch goes first and time and email share a row; on
         * short screens the pitch gives way so the hero still fits. */}
        <Container className="relative z-10 flex flex-wrap items-center justify-between gap-x-4 pb-3 lg:grid lg:grid-cols-[1fr_minmax(0,28rem)_1fr] lg:items-end lg:pb-8">
          {/* Under 360px time and email cannot share a row; the time goes. */}
          <div className="max-[359px]:hidden">
            <StudioClock className="text-xs sm:text-sm" />
          </div>
          <p className="order-first mx-auto mb-2 w-full max-w-md text-center text-sm leading-relaxed text-ink-muted max-lg:snug:hidden lg:order-none lg:mb-0 lg:w-auto">
            {hero.body}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center text-xs text-ink underline max-[359px]:mx-auto sm:text-sm lg:justify-self-end underline-offset-4 transition-colors duration-200 hover:text-accent"
          >
            {site.email}
          </a>
        </Container>
      </ParallaxFrame>
    </section>
  );
}
