import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { getNeighbours, getService, serviceDetails, type ServiceDetail } from "@/lib/service-pages";

/**
 * The next stop on the road. Previous and next are the neighbours in the order
 * the six services run, so a reader can simply keep going; "also worth a look"
 * covers the cases where the natural next step is somewhere else. The two ends
 * of the road get a way back to the overview instead of a dead card.
 */
function StopCard({
  detail,
  direction,
}: {
  detail: ServiceDetail;
  direction: "prev" | "next";
}) {
  const service = getService(detail.slug);
  const position = serviceDetails.findIndex((d) => d.slug === detail.slug) + 1;
  const Arrow = direction === "next" ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={`/services/${detail.slug}`}
      className="group grid h-full gap-3 border-t border-line py-8 transition-colors duration-200 hover:border-accent"
    >
      <span className="text-eyebrow font-semibold uppercase text-ink-subtle">
        {direction === "next" ? "Next on the road" : "Before this"} · 0{position} {detail.stage}
      </span>
      <span className="flex items-center justify-between gap-6">
        <span className="font-display text-h2 transition-colors duration-200 group-hover:text-accent">
          {service?.title}
        </span>
        <Arrow
          size={22}
          weight="bold"
          aria-hidden
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
        />
      </span>
      <span className="max-w-md text-sm leading-relaxed text-ink-muted">{detail.road}</span>
    </Link>
  );
}

export function ServiceNext({ slug, related }: { slug: string; related: ServiceDetail["related"] }) {
  const { prev, next } = getNeighbours(slug);
  // Neighbours already have their own cards above; only list what they miss.
  const pairs = related
    .filter((r) => r !== prev?.slug && r !== next?.slug)
    .map((r) => serviceDetails.find((d) => d.slug === r))
    .filter((d): d is ServiceDetail => Boolean(d));

  return (
    <section className="border-b border-line bg-surface-alt py-24 lg:py-32">
      <Container>
        <Eyebrow>Keep going</Eyebrow>
        <TextReveal as="h2" className="mt-5 max-w-3xl text-h1">
          Where this <span className="italic">leads.</span>
        </TextReveal>

        <div className="mt-14 grid gap-x-16 md:grid-cols-2">
          <Reveal>
            {prev ? (
              <StopCard detail={prev} direction="prev" />
            ) : (
              <Link
                href="/services"
                className="group grid h-full gap-3 border-t border-line py-8 transition-colors duration-200 hover:border-accent"
              >
                <span className="text-eyebrow font-semibold uppercase text-ink-subtle">
                  The whole road
                </span>
                <span className="flex items-center justify-between gap-6">
                  <span className="font-display text-h2 transition-colors duration-200 group-hover:text-accent">
                    All six services
                  </span>
                  <ArrowLeft size={22} weight="bold" aria-hidden className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-accent" />
                </span>
                <span className="max-w-md text-sm leading-relaxed text-ink-muted">
                  See how they fit together, from the first idea to the launch.
                </span>
              </Link>
            )}
          </Reveal>
          <Reveal delay={90}>
            {next ? (
              <StopCard detail={next} direction="next" />
            ) : (
              <Link
                href="/services"
                className="group grid h-full gap-3 border-t border-line py-8 transition-colors duration-200 hover:border-accent"
              >
                <span className="text-eyebrow font-semibold uppercase text-ink-subtle">
                  The end of the road
                </span>
                <span className="flex items-center justify-between gap-6">
                  <span className="font-display text-h2 transition-colors duration-200 group-hover:text-accent">
                    Back to all services
                  </span>
                  <ArrowRight size={22} weight="bold" aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                </span>
                <span className="max-w-md text-sm leading-relaxed text-ink-muted">
                  Every service can be booked on its own, or all six together.
                </span>
              </Link>
            )}
          </Reveal>
        </div>

        {pairs.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            <span className="mr-2 text-sm text-ink-subtle">Also worth a look</span>
            {pairs.map((pair) => (
              <Link
                key={pair.slug}
                href={`/services/${pair.slug}`}
                className="inline-flex min-h-11 items-center rounded-pill border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink hover:bg-surface-alt"
              >
                {getService(pair.slug)?.title}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
