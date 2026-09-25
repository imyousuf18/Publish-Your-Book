import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Book3D } from "@/components/service/Book3D";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { covers, hero, heroProof, heroShelf, site } from "@/lib/site";

/**
 * The hero: an argument on the left, the product on the right.
 *
 * It used to be type only — eyebrow, headline, paragraph, buttons and a rail of
 * the five stages, all left-aligned in one column with the right half of the
 * screen empty. For a publisher that was the wrong thing to leave out: the most
 * persuasive thing we own is finished books, and there were none above the fold.
 *
 * So three covers stand here, built from the same `Book3D` faces the service
 * pages use (real spine, page block and contact shadow), turned on a shelf and
 * squaring up to the reader on hover. No gradients, no glow, no floating
 * shapes — the warmth comes from the books and the paper.
 */

/*
 * Shelf arrangement. The books OVERLAP rather than sitting in equal thirds:
 * spread across the column they arrived as small scattered thumbnails, while
 * overlapping ones read as a shelf and are a third larger in the same space.
 * The middle book is widest and stands in front.
 */
const SHELF = [
  { width: "w-[42%]", overlap: "", lift: "translate-y-3", z: "z-10" },
  { width: "w-[50%]", overlap: "-ml-[17%]", lift: "-translate-y-2", z: "z-20" },
  { width: "w-[42%]", overlap: "-ml-[17%]", lift: "translate-y-5", z: "z-10" },
];

/** The previous hero (headline + standing shelf). Kept for a one-line swap back:
 *  import { HeroShelf as Hero } in app/page.tsx. */
export function HeroShelf() {
  const shelf = heroShelf
    .map((title) => covers.find((c) => c.title === title))
    .filter((c): c is (typeof covers)[number] => Boolean(c));

  return (
    <section className="relative border-b border-line bg-paper pb-14 pt-32 lg:pb-16 lg:pt-36">
      <Container>
        {/*
         * Three grid children, not two, so the order can differ by screen:
         *
         *   phone    headline → BOOKS → paragraph → buttons
         *   lg       headline + paragraph + buttons on the left,
         *            books spanning both rows on the right
         *
         * Stacked as one column with the books last, they began 820px down a
         * 320px-wide screen — below the fold on every phone — so the hero still
         * read as type only on exactly the screens most people use.
         *
         * The type column takes the larger share: at an even split the display
         * headline broke to four lines and pushed the hero past the fold.
         */}
        <div className="grid items-center gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8">
          {/* ---- The claim ---------------------------------------------- */}
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <Reveal>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </Reveal>

            <TextReveal as="h1" className="mt-6 text-h1 text-ink md:text-display">
              {hero.title.slice(0, hero.title.lastIndexOf(" "))}{" "}
              <span className="italic">{hero.title.slice(hero.title.lastIndexOf(" ") + 1)}</span>
            </TextReveal>
          </div>

          {/* ---- The product. Second on a phone, right-hand column at lg. -- */}
          <Reveal
            delay={260}
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
          >
            <Tilt3D max={4}>
              {/* Capped below lg: on a sideways phone the column is wide but the
                  screen is short, and the shelf grew taller than the viewport. */}
              {/* Width in REM, not a percentage of the column. The page
                  container stops at 1200px while the root font keeps growing
                  with the viewport, so a column-relative shelf stayed the same
                  size while the type around it grew — on a 1820px screen the
                  books had shrunk to a third of the headline's height. In rem
                  the shelf rides the same fluid curve as the type. Capped by
                  the column so it can never overflow. */}
              <ul className="mx-auto flex w-full max-w-[19rem] items-end justify-center sm:max-w-sm lg:max-w-[30rem]">
                {shelf.map((cover, i) => (
                  <li
                    key={cover.title}
                    className={`group ${SHELF[i].width} ${SHELF[i].overlap} ${SHELF[i].z} ${SHELF[i].lift}`}
                  >
                    <Book3D
                      src={cover.image}
                      alt={cover.alt}
                      sizes="(min-width: 1024px) 17vw, (min-width: 640px) 26vw, 34vw"
                      priority
                    />
                  </li>
                ))}
              </ul>
            </Tilt3D>
          </Reveal>

          {/* ---- The detail and the actions ----------------------------- */}
          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <TextReveal as="p" className="max-w-xl text-lead text-ink-muted" delay={120}>
              {hero.body}
            </TextReveal>

            {/* Directly under the sentence they follow from. They used to be
                floated to the far side of a two-column grid, so the eye had to
                jump the width of the page to find the action. */}
            <Reveal delay={220} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
              <ButtonLink href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="secondary" size="lg">
                {hero.secondaryCta.label}
              </ButtonLink>
              <a
                href={`mailto:${site.email}`}
                /* Hidden on phones: three actions each took their own row. */
                className="hidden min-h-11 items-center px-1 text-sm text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-accent sm:inline-flex"
              >
                or send three chapters
              </a>
            </Reveal>
          </div>
        </div>

        {/* ---- What actually separates us ------------------------------- */}
        <Reveal delay={320}>
          <ul className="mt-14 grid gap-x-10 gap-y-6 border-t border-line pt-6 sm:grid-cols-3 lg:mt-16">
            {heroProof.map((point) => (
              <li key={point.title}>
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.06em] text-accent">
                  {point.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{point.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
