import { Container } from "@/components/ui/Container";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { HorizontalTrack } from "@/components/motion/HorizontalTrack";
import { TextReveal } from "@/components/motion/TextReveal";
import { services } from "@/lib/site";

/** Six services on a pinned horizontal track. */
export function Services() {
  return (
    <section id="services" className="border-b border-line bg-surface-alt">
      <Container className="py-24 lg:py-32">
        <TextReveal as="h2" className="max-w-4xl text-h1">
          Everything between a draft and a shelf.
        </TextReveal>
        <p className="mt-6 max-w-xl text-lead text-ink-muted">
          Take the whole process or only the part you need. Nothing is bundled to pad an
          invoice.
        </p>
      </Container>

      <HorizontalTrack className="pb-24 lg:pb-32">
        {services.map((service) => (
          <article
            key={service.num}
            data-cursor="read"
            className="flex w-[86vw] shrink-0 flex-col rounded-card border border-line bg-surface p-8 shadow-card sm:w-[60vw] lg:w-[34vw] lg:p-10"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-eyebrow font-semibold uppercase text-accent">
                {service.num}
              </span>
            </div>
            <h3 className="mt-5 text-h3">{service.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{service.body}</p>

            <ul className="mt-7 space-y-2 border-t border-line pt-5">
              {service.items.map((item) => (
                <li key={item} className="text-sm text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>

            <ImageSlot
              ratio="4/3"
              label={service.slotLabel}
              className="mt-8"
              sizes="(min-width: 1024px) 34vw, 86vw"
            />
          </article>
        ))}
      </HorizontalTrack>
    </section>
  );
}
