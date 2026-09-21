import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import type { ServiceDetail } from "@/lib/service-pages";

/**
 * Where it begins, and where it ends: two panels side by side, the first light
 * and the second dark, with an arrow joining them at desktop width. Reading
 * left to right is the journey: what you bring, what you leave with.
 */
export function ServiceBeginEnd({
  begin,
  finish,
}: {
  begin: ServiceDetail["begin"];
  finish: ServiceDetail["finish"];
}) {
  return (
    <section className="border-b border-line bg-surface-alt py-24 lg:py-32">
      <Container>
        <Eyebrow>Start to finish</Eyebrow>
        <TextReveal as="h2" className="mt-5 max-w-3xl text-h1">
          Where it begins, and where it <span className="italic">ends.</span>
        </TextReveal>

        <div className="relative mt-16 grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-card border border-line bg-surface p-8 lg:p-12">
            <p className="text-eyebrow font-semibold uppercase text-accent">Step in</p>
            <h3 className="mt-4 text-h2">{begin.heading}</h3>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">{begin.body}</p>

            <div className="mt-8 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <h4 className="text-eyebrow font-sans font-semibold uppercase text-ink-subtle">
                  You bring
                </h4>
                <ul className="mt-4 space-y-3">
                  {begin.bring.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-eyebrow font-sans font-semibold uppercase text-ink-subtle">
                  We send back
                </h4>
                <ul className="mt-4 space-y-3">
                  {begin.send.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-card bg-inverse p-8 text-inverse-ink shadow-lift lg:p-12"
          >
            <p className="text-eyebrow font-semibold uppercase text-accent-tint">Step out</p>
            <h3 className="mt-4 text-h2">{finish.heading}</h3>
            <p className="mt-4 text-base leading-relaxed text-inverse-ink/75">{finish.body}</p>

            <div className="mt-8 border-t border-inverse-ink/15 pt-8">
              <h4 className="text-eyebrow font-sans font-semibold uppercase text-inverse-ink/60">
                You receive
              </h4>
              <ul className="mt-4 space-y-3">
                {finish.receive.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-inverse-ink/85">
                    <Check
                      size={16}
                      weight="bold"
                      aria-hidden
                      className="mt-0.5 shrink-0 text-accent-tint"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent-bright text-ink shadow-lift lg:grid"
          >
            <ArrowRight size={22} weight="bold" />
          </span>
        </div>
      </Container>
    </section>
  );
}
