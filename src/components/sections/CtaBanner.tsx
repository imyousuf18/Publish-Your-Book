import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/motion/TextReveal";
import { site } from "@/lib/site";

/** Closing dark full-bleed band. */
export function CtaBanner() {
  return (
    <section
      className="py-28 lg:py-40"
      style={{ background: "var(--color-inverse)", color: "var(--color-inverse-ink)" }}
    >
      <Container>
        <Eyebrow className="text-accent-tint">Start here</Eyebrow>
        <TextReveal as="h2" className="mt-6 max-w-5xl text-display lg:text-mega">
          Send us the first three <span className="italic">chapters.</span>
        </TextReveal>
        <p className="mt-8 max-w-xl text-lead" style={{ color: "rgb(244 238 227 / 0.7)" }}>
          We will read them and tell you honestly what your book needs. No cost, no
          obligation, no pitch deck.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <ButtonLink href="/contact" size="lg" data-cursor="link">
            Start your book
          </ButtonLink>
          <a
            href={`mailto:${site.email}`}
            data-cursor="link"
            className="text-sm underline underline-offset-4"
            style={{ color: "rgb(244 238 227 / 0.7)" }}
          >
            {site.email}
          </a>
        </div>
      </Container>
    </section>
  );
}
