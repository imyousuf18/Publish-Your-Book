import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollLine } from "@/components/motion/ScrollLine";
import { TextReveal } from "@/components/motion/TextReveal";
import type { ServiceDetail } from "@/lib/service-pages";

/**
 * "How it is done": a dark band with the heading held while the steps go by,
 * the same construction as the homepage Process band. What is new is the line
 * down the left, which draws itself as the reader scrolls, so the five steps
 * read as one path with a "you are here" rather than five separate blocks.
 *
 * The step markers sit on that line. They are opaque (`bg-inverse`) so the line
 * passes behind them instead of through the numbers.
 */
export function ServiceProcess({ process }: { process: ServiceDetail["process"] }) {
  return (
    <section
      id="how"
      className="scroll-mt-20 border-b border-line py-24 lg:py-32"
      style={{ background: "var(--color-inverse)", color: "var(--color-inverse-ink)" }}
    >
      <Container className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow className="text-accent-tint">How it is done</Eyebrow>
          <TextReveal as="h2" className="mt-5 text-h2 sm:text-h1">
            {process.heading} <span className="italic">{process.em}</span>
          </TextReveal>
          <p className="mt-6 max-w-sm text-lead text-inverse-ink/70">{process.intro}</p>
        </div>

        <div className="relative">
          <ScrollLine
            axis="y"
            className="absolute bottom-4 left-5 top-4 w-px bg-inverse-ink/15"
            fillClassName="bg-accent-tint"
          />
          <ol>
            {process.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 60}>
                <div className="flex gap-6 py-8 lg:gap-10">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-inverse-ink/25 bg-inverse font-display text-h3 tabular-nums text-accent-tint">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-h3">{step.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-inverse-ink/70">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
