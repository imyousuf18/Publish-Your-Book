import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { hero, stages } from "@/lib/site";

/**
 * The book itself now lives in the loader, so the hero is type-led: a very
 * large statement, revealed line by line, over a slowly drifting stage rail.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper pt-32 pb-24 lg:pt-44 lg:pb-32">
      <Container>
        <Reveal>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </Reveal>

        <TextReveal as="h1" className="mt-8 max-w-5xl text-display text-ink lg:text-mega">
          {hero.title}
        </TextReveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <TextReveal as="p" className="max-w-xl text-lead text-ink-muted" delay={120}>
            {hero.body}
          </TextReveal>

          <Reveal delay={220} className="flex flex-wrap gap-3">
            <ButtonLink href={hero.primaryCta.href} size="lg" data-cursor="link">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="secondary"
              size="lg"
              data-cursor="link"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </Reveal>
        </div>

        {/* The five stages, as a quiet rail — the same words the book prints. */}
        <Parallax distance={-56} className="mt-24 lg:mt-32">
          <ul className="flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            {stages.map((stage, i) => (
              <li key={stage.word} className="flex items-baseline gap-3">
                <span className="text-eyebrow font-semibold uppercase text-accent">
                  0{i + 1}
                </span>
                <span className="text-h3 text-ink">{stage.word}</span>
              </li>
            ))}
          </ul>
        </Parallax>
      </Container>
    </section>
  );
}
