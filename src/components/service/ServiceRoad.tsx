import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollLine } from "@/components/motion/ScrollLine";
import { TextReveal } from "@/components/motion/TextReveal";
import { serviceDetails } from "@/lib/service-pages";
import { services } from "@/lib/site";

/**
 * The six services as one road, at a glance. A line runs through numbered stops
 * and draws itself as the reader scrolls past: left to right on a wide screen,
 * top to bottom on a narrow one (two lines, one shown at each width, because a
 * scaled line can only fill along one axis).
 *
 * Every stop is a link to its own page. The rows below show the same six in
 * full; this is the map, and they are the guidebook.
 */
export function ServiceRoad() {
  return (
    <section className="border-b border-line py-24 lg:py-32">
      <Container>
        <Eyebrow>The road</Eyebrow>
        <TextReveal as="h2" className="mt-5 max-w-3xl text-h1">
          The road a book <span className="italic">travels.</span>
        </TextReveal>
        <p className="mt-6 max-w-xl text-lead text-ink-muted">
          Most books pass through these six stages. Some need all of them, some need one.
          Follow the road from the start, or jump to the part you need.
        </p>

        <div className="relative mt-16">
          <ScrollLine
            axis="x"
            className="absolute left-0 right-0 top-5 hidden h-px bg-line lg:block"
            fillClassName="bg-accent-bright"
          />
          <ScrollLine
            axis="y"
            className="absolute bottom-6 left-5 top-6 w-px bg-line lg:hidden"
            fillClassName="bg-accent-bright"
          />

          <ol className="grid gap-10 lg:grid-cols-6 lg:gap-6">
            {serviceDetails.map((detail, i) => {
              const service = services.find((s) => s.slug === detail.slug);
              return (
                <Reveal as="li" key={detail.slug} delay={i * 70}>
                  <Link
                    href={`/services/${detail.slug}`}
                    className="group grid grid-cols-[auto_1fr] gap-x-6 lg:block"
                  >
                    <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-paper font-sans text-xs font-medium tabular-nums text-ink transition-colors duration-300 group-hover:border-transparent group-hover:bg-accent-bright">
                      0{i + 1}
                    </span>
                    <span className="block lg:mt-6">
                      <span className="block font-display text-h3 transition-colors duration-200 group-hover:text-accent">
                        {detail.stage}
                      </span>
                      <span className="mt-2 block text-sm font-medium text-ink">
                        {service?.title}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-ink-muted">
                        {detail.road}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ink">
                        Explore
                        <ArrowRight
                          size={14}
                          weight="bold"
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
