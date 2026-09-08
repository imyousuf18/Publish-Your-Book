import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { testimonials } from "@/lib/site";

/**
 * ALTERNATIVE to Testimonials (three equal bordered cards).
 *
 * Three identical cards in a row is the most templated layout on the web, and
 * Articles was using the same shape directly below it. Here one quote carries
 * the section at display size and the other two sit under it as compact
 * credits, so the section has a focal point instead of three competing ones.
 */
export function TestimonialFeature() {
  const [lead, ...rest] = testimonials;

  return (
    <section id="testimonials" className="border-b border-line bg-paper py-24 lg:py-32">
      <Container>
        <Reveal>
          <figure className="max-w-4xl">
            <blockquote className="font-display text-h1 leading-tight text-ink">
              &ldquo;{lead.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-base font-medium text-ink">{lead.name}</span>
              <span className="text-sm text-ink-subtle">{lead.book}</span>
            </figcaption>
          </figure>
        </Reveal>

        <ul className="mt-20 grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-20">
          {rest.map((testimonial, i) => (
            <Reveal as="li" key={testimonial.name} delay={i * 90}>
              <figure>
                <blockquote className="text-lead leading-relaxed text-ink-muted">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3">
                  <span className="text-sm font-medium text-ink">{testimonial.name}</span>
                  <span className="text-sm text-ink-subtle">{testimonial.book}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
