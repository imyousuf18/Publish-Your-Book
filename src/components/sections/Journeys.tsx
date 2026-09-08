import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { journeys } from "@/lib/site";

/**
 * The three entry points, as a sticky stack: each card sticks to the top of
 * the viewport while the next rises over it.
 *
 * This is plain `position: sticky` rather than ScrollTrigger pinning — the
 * reference site does the same thing, and it needs no pin-spacer, no runway
 * maths and no refresh handling. Each card is offset a little further down so
 * the stacked edges stay visible underneath.
 *
 * Sticky only applies from `md` up. On a phone, three cards each pinned a
 * little further down eats most of the viewport and the stack reads as a bug
 * rather than an effect, so below `md` they are plain stacked blocks.
 */
export function Journeys() {
  return (
    <section id="journeys" className="relative border-b border-line bg-paper py-24 lg:py-32">
      <Container>
        <TextReveal as="h2" className="max-w-3xl text-h1">
          Three ways in. Pick the one that sounds like you.
        </TextReveal>
      </Container>

      <Container className="mt-16">
        {journeys.map((journey, i) => (
          <div
            key={journey.num}
            className="md:sticky"
            style={{ top: `calc(6rem + ${i * 2.5}rem)`, zIndex: 10 + i }}
          >
            <div
              className="mb-8 grid gap-8 rounded-card border border-line p-10 shadow-card lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-14 lg:p-14"
              style={{
                background: i === 1 ? "var(--color-inverse)" : "var(--color-surface)",
                color: i === 1 ? "var(--color-inverse-ink)" : "var(--color-ink)",
              }}
            >
              <span
                className="font-display text-h2"
                style={{ color: i === 1 ? "var(--color-accent-tint)" : "var(--color-accent)" }}
              >
                {journey.num}
              </span>
              <div>
                <h3 className="text-h2">{journey.title}</h3>
                <p
                  className="mt-4 max-w-xl text-lead"
                  style={{
                    color: i === 1 ? "rgb(244 238 227 / 0.72)" : "var(--color-ink-muted)",
                  }}
                >
                  {journey.body}
                </p>
              </div>
              <ButtonLink
                href="/contact"
                variant={i === 1 ? "primary" : "secondary"}
                size="lg"
                data-cursor="link"
              >
                Start here
              </ButtonLink>
            </div>
          </div>
        ))}
      </Container>

      <Container className="mt-16">
        <Reveal>
          <p className="text-sm text-ink-subtle">
            Not sure which one? Send the first three chapters and we will tell you.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
