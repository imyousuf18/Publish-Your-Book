import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { testimonials } from "@/lib/site";

export function Testimonials() {
  return (
    <section id="testimonials" className="border-b border-line bg-paper py-24 lg:py-32">
      <Container>
        <TextReveal as="h2" className="max-w-3xl text-h1">
            In their words.
          </TextReveal>

        <ul className="mt-16 grid gap-0 border-t-2 border-ink lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <Reveal
              as="li"
              key={testimonial.name}
              delay={i * 90}
              className="border-b-2 border-ink lg:border-b-0 lg:border-r-2 lg:last:border-r-0"
            >
              <figure className="flex h-full flex-col p-8 lg:p-10">
                <blockquote className="flex-1 font-display text-h3 leading-snug text-ink">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8">
                  <p className="text-sm font-medium text-ink">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-ink-subtle">{testimonial.book}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
