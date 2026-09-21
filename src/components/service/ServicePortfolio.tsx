import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Book3D } from "@/components/service/Book3D";
import type { ServiceDetail } from "@/lib/service-pages";
import { cases, covers } from "@/lib/site";
import { cn } from "@/lib/utils";

/** A row of standing books with their title and category underneath. */
function Shelf({
  books,
  className,
  many = false,
}: {
  books: (typeof covers)[number][];
  className?: string;
  /** Many books share a grid; one or two keep a fixed width beside the heading. */
  many?: boolean;
}) {
  return (
    <ul
      className={cn(
        many
          ? "grid grid-cols-2 gap-x-6 gap-y-16 sm:grid-cols-3 lg:grid-cols-4"
          : "flex flex-wrap gap-x-10 gap-y-12",
        className,
      )}
    >
      {books.map((cover, i) => (
        <Reveal
          as="li"
          key={cover.title}
          delay={(i % 4) * 90}
          className={cn(!many && "w-48 sm:w-56 lg:w-60")}
        >
          <div className="group">
            <Book3D src={cover.image} alt={cover.alt} />
            <h3 className="mt-8 text-h3 transition-colors duration-200 group-hover:text-accent">
              {cover.title}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">{cover.meta}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * Proof, in the shape that fits the service: standing 3D covers for the books
 * it touched, the matching case study when there is one, and a plain note when
 * there is nothing honest to show. Marketing has no template to display, so it
 * says so and points to the work page rather than padding the section.
 */
export function ServicePortfolio({ portfolio }: { portfolio: ServiceDetail["portfolio"] }) {
  const shown = portfolio.covers
    .map((title) => covers.find((c) => c.title === title))
    .filter((c): c is (typeof covers)[number] => Boolean(c));
  const study = portfolio.caseIndex !== undefined ? cases[portfolio.caseIndex] : undefined;
  const few = shown.length > 0 && shown.length <= 2;

  const quote = portfolio.quote && (
    <Reveal className="mt-10">
      <blockquote className="max-w-xl border-l-2 border-accent pl-6">
        <p className="font-display text-h3 leading-snug text-ink">
          &ldquo;{portfolio.quote.text}&rdquo;
        </p>
        <footer className="mt-4 text-sm text-ink-subtle">
          {portfolio.quote.name} · {portfolio.quote.book}
        </footer>
      </blockquote>
    </Reveal>
  );

  return (
    <section className="border-b border-line py-24 lg:py-32">
      <Container>
        {/* One or two books sit beside the heading, so the section does not read
            as a lone cover in an empty row. A shelf of many goes below it. */}
        <div
          className={cn(
            few && "grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-24",
          )}
        >
          <div>
            <Eyebrow>Proof</Eyebrow>
            <TextReveal as="h2" className="mt-5 max-w-3xl text-h2 sm:text-h1">
              {portfolio.heading}
            </TextReveal>
            <p className="mt-6 max-w-xl text-lead text-ink-muted">{portfolio.intro}</p>
            {few && quote}
          </div>

          {few && <Shelf books={shown} className="justify-center lg:justify-end" />}
        </div>

        {shown.length > 0 && !few && <Shelf books={shown} className="mt-16" many />}
        {!few && quote}

        {study && (
          <Reveal className="mt-20 grid gap-10 border-t border-line pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <ImageSlot
              ratio="4/3"
              src={study.image}
              alt={study.alt}
              label={study.slotLabel}
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="rounded-panel"
            />
            <div>
              <p className="text-eyebrow font-semibold uppercase text-accent">{study.kicker}</p>
              <h3 className="mt-4 text-h2">{study.title}</h3>

              <dl className="mt-6 space-y-4">
                {(
                  [
                    ["Starting point", study.start],
                    ["Challenge", study.challenge],
                    ["Result", study.result],
                  ] as const
                ).map(([term, detail]) => (
                  <div key={term}>
                    <dt className="text-eyebrow font-semibold uppercase text-ink-subtle">{term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{detail}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-5">
                {study.stats.map((stat) => (
                  <div key={stat.l}>
                    <p className="font-display text-h3 text-ink">{stat.v}</p>
                    <p className="mt-1 text-eyebrow font-semibold uppercase text-ink-subtle">
                      {stat.l}
                    </p>
                  </div>
                ))}
              </div>

              <blockquote className="mt-6 border-l-2 border-accent pl-6">
                <p className="font-display text-h3 leading-snug text-ink">
                  &ldquo;{study.quote}&rdquo;
                </p>
                <footer className="mt-3 text-sm text-ink-subtle">{study.author}</footer>
              </blockquote>
            </div>
          </Reveal>
        )}

        {portfolio.note && (
          <p className="mt-12 max-w-2xl border-l-2 border-accent pl-6 text-lead text-ink-muted">
            {portfolio.note}
          </p>
        )}

        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-2">
          <Link
            href="/case-studies"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
          >
            Read the case studies
            <ArrowRight size={14} weight="bold" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/work"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
          >
            See all our work
            <ArrowRight size={14} weight="bold" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
