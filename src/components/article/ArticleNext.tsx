import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import type { Article } from "@/lib/articles";

function StopCard({ article, direction }: { article: Article; direction: "prev" | "next" }) {
  const Arrow = direction === "next" ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={`/author-guide/${article.slug}`}
      className="group grid h-full gap-3 border-t border-line py-8 transition-colors duration-200 hover:border-accent"
    >
      <span className="text-eyebrow font-semibold uppercase text-ink-subtle">
        {direction === "next" ? "Next article" : "Previous article"} · {article.tag}
      </span>
      <span className="flex items-center justify-between gap-6">
        <span className="font-display text-h3 transition-colors duration-200 group-hover:text-accent">
          {article.title}
        </span>
        <Arrow
          size={20}
          weight="bold"
          aria-hidden
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
        />
      </span>
    </Link>
  );
}

export function ArticleNext({ prev, next }: { prev?: Article; next?: Article }) {
  if (!prev && !next) return null;
  return (
    <section className="border-b border-line bg-surface-alt py-20 lg:py-28">
      <Container>
        <Eyebrow>Keep reading</Eyebrow>
        <TextReveal as="h2" className="mt-5 max-w-3xl text-h1">
          More from the <span className="italic">guide.</span>
        </TextReveal>

        <div className="mt-10 grid gap-x-16 md:grid-cols-2">
          <Reveal>
            {prev ? (
              <StopCard article={prev} direction="prev" />
            ) : (
              <Link
                href="/author-guide"
                className="group grid h-full gap-3 border-t border-line py-8 transition-colors duration-200 hover:border-accent"
              >
                <span className="text-eyebrow font-semibold uppercase text-ink-subtle">
                  The whole guide
                </span>
                <span className="flex items-center justify-between gap-6">
                  <span className="font-display text-h3 transition-colors duration-200 group-hover:text-accent">
                    All articles
                  </span>
                  <ArrowLeft size={20} weight="bold" aria-hidden className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-accent" />
                </span>
              </Link>
            )}
          </Reveal>
          <Reveal delay={90}>
            {next ? (
              <StopCard article={next} direction="next" />
            ) : (
              <Link
                href="/author-guide"
                className="group grid h-full gap-3 border-t border-line py-8 transition-colors duration-200 hover:border-accent"
              >
                <span className="text-eyebrow font-semibold uppercase text-ink-subtle">
                  The end of the guide
                </span>
                <span className="flex items-center justify-between gap-6">
                  <span className="font-display text-h3 transition-colors duration-200 group-hover:text-accent">
                    Back to all articles
                  </span>
                  <ArrowRight size={20} weight="bold" aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                </span>
              </Link>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
