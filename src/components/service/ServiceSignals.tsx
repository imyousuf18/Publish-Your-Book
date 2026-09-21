import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import type { ServiceDetail } from "@/lib/service-pages";

/** "Is this the right place to start?" — the reader recognises their own situation. */
export function ServiceSignals({ signals }: { signals: ServiceDetail["signals"] }) {
  return (
    <section className="border-b border-line py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <Eyebrow>Is it for you</Eyebrow>
          <TextReveal as="h2" className="mt-5 text-h2 sm:text-h1">
            {signals.heading}
          </TextReveal>
          <p className="mt-6 max-w-sm text-lead text-ink-muted">{signals.intro}</p>
        </div>

        <ul>
          {signals.items.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 80}>
              <div className="flex gap-6 border-t border-line py-7 lg:gap-10">
                <span className="w-10 shrink-0 font-display text-h3 tabular-nums text-accent">
                  0{i + 1}
                </span>
                <p className="text-lead text-ink">{item}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
