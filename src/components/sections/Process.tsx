import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { steps } from "@/lib/site";

/**
 * Dark full-bleed band. The heading sticks while the six steps scroll past it —
 * the same `position: sticky` trick as the journey stack, applied to a column
 * rather than to cards.
 */
export function Process() {
  return (
    <section
      id="process"
      className="border-b border-line py-24 lg:py-32"
      style={{ background: "var(--color-inverse)", color: "var(--color-inverse-ink)" }}
    >
      <Container className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow className="text-accent-tint">How it works</Eyebrow>
          <TextReveal as="h2" className="mt-5 text-h1">
            Six stages, nothing hidden.
          </TextReveal>
          <p className="mt-6 max-w-sm text-lead" style={{ color: "rgb(244 238 227 / 0.7)" }}>
            You know what happens next, what it costs and who is doing it, before any work
            begins.
          </p>
        </div>

        <ol>
          {steps.map((step, i) => (
            <Reveal as="li" key={step.num} delay={i * 60}>
              <div className="flex gap-8 border-t border-inverse-ink/15 py-8 lg:gap-12">
                <span
                  className="font-display text-h3 tabular-nums"
                  style={{ color: "var(--color-accent-tint)" }}
                >
                  {step.num}
                </span>
                <div>
                  <h3 className="text-h3">{step.title}</h3>
                  <p
                    className="mt-3 max-w-md text-sm leading-relaxed"
                    style={{ color: "rgb(244 238 227 / 0.66)" }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
