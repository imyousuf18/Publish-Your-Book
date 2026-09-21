import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/motion/TextReveal";
import { faqSchema } from "@/lib/schema";
import type { Faq } from "@/lib/site";

/**
 * Questions and answers on native <details>.
 *
 * No client state: <details> is keyboard- and screen-reader-accessible out of
 * the box, works without JavaScript, and is findable with the browser's own
 * in-page search even while closed.
 */
export function FaqList({
  items,
  heading = "Questions authors ask.",
}: {
  items: Faq[];
  heading?: string;
}) {
  return (
    <section className="border-b border-line py-24 lg:py-32">
      {/* Structured data only — matches the visible Q&A below so search
          engines can read the same answers as an FAQ rich result. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(items)) }}
      />
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <TextReveal as="h2" className="mt-5 text-h1">
            {heading}
          </TextReveal>
        </div>

        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.q}>
              <details className="group rounded-card border border-line bg-surface transition-colors duration-200 open:border-ink/20 hover:border-ink/30">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 px-6 py-4 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  {/* Plus that turns into a minus. Pure CSS, driven by [open]. */}
                  <span
                    aria-hidden
                    className="relative h-3.5 w-3.5 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                  />
                </summary>
                <p className="px-6 pb-6 text-base leading-relaxed text-ink-muted">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
