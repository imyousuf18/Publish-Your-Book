import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";

/**
 * A numbered grid of short points: values, pricing factors, stages.
 *
 * Deliberately not cards-in-a-row with icons — just a number, a title and a
 * sentence on a hairline, which keeps inner pages as quiet as the references.
 */
export function PointGrid({
  eyebrow,
  heading,
  intro,
  items,
  tone = "default",
  columns = 4,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  intro?: string;
  items: readonly { title: string; body: string }[];
  tone?: "default" | "alt";
  /** Columns from `lg` up. Three suits six items; four suits four. */
  columns?: 3 | 4;
}) {
  return (
    <section
      className={cn("border-b border-line py-24 lg:py-32", tone === "alt" && "bg-surface-alt")}
    >
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <TextReveal as="h2" className="mt-5 max-w-3xl text-h1">
          {heading}
        </TextReveal>
        {intro && <p className="mt-6 max-w-xl text-lead text-ink-muted">{intro}</p>}

        <ol
          className={cn(
            "mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2",
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 80} className="border-t border-ink/15 pt-6">
                <span className="font-sans text-xs tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-h3">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">{item.body}</p>
              </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
