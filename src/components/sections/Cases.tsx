import { Container } from "@/components/ui/Container";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { cases } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Two case studies, alternating sides, each image on a slow parallax drift. */
export function Cases() {
  return (
    <section id="cases" className="border-b border-line bg-paper py-24 lg:py-32">
      <Container>
        <TextReveal as="h2" className="max-w-3xl text-h1">
          Two books, start to press.
        </TextReveal>

        <div className="mt-20 space-y-24 lg:space-y-32">
          {cases.map((study, i) => (
            <article
              key={study.title}
              className={cn(
                "grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <Parallax distance={-64}>
                <ImageSlot
                  ratio="4/5"
                  src={study.image}
                  alt={study.alt}
                  label={study.slotLabel}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                />
              </Parallax>

              <Reveal>
                <p className="text-eyebrow font-semibold uppercase text-accent">
                  {study.kicker}
                </p>
                <h3 className="mt-4 text-h2">{study.title}</h3>

                <dl className="mt-8 space-y-5 border-t border-line pt-6">
                  {(
                    [
                      ["Starting point", study.start],
                      ["Challenge", study.challenge],
                      ["Result", study.result],
                    ] as const
                  ).map(([term, detail]) => (
                    <div key={term}>
                      <dt className="text-eyebrow font-semibold uppercase text-ink-subtle">
                        {term}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{detail}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-6">
                  {study.stats.map((stat) => (
                    <div key={stat.l}>
                      <p className="font-display text-h3 text-ink">{stat.v}</p>
                      <p className="mt-1 text-eyebrow font-semibold uppercase text-ink-subtle">
                        {stat.l}
                      </p>
                    </div>
                  ))}
                </div>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {study.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-pill border border-line px-3 py-1 text-xs text-ink-muted"
                    >
                      {service}
                    </li>
                  ))}
                </ul>

                <blockquote className="mt-8 border-l-2 border-accent pl-6">
                  <p className="font-display text-h3 leading-snug text-ink">
                    &ldquo;{study.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-sm text-ink-subtle">{study.author}</footer>
                </blockquote>
              </Reveal>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

