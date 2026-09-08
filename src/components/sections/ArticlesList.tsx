import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { articles } from "@/lib/site";

/**
 * ALTERNATIVE to Articles (three equal bordered cards).
 *
 * An editorial index rather than a card grid: full-width rows, the title at
 * heading size, the tag and summary supporting it. Reads like a contents page,
 * which suits a publisher, and stops this section from repeating the shape of
 * the one above it.
 */
export function ArticlesList() {
  return (
    <section id="articles" className="border-b border-line bg-surface-alt py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <TextReveal as="h2" className="max-w-2xl text-h1">
            Read this before you spend anything.
          </TextReveal>
          <Link
            href="/#articles"
            className="text-sm font-medium text-accent underline underline-offset-4"
          >
            All articles
          </Link>
        </div>

        <ul className="mt-16">
          {articles.map((article, i) => (
            <Reveal as="li" key={article.title} delay={i * 80}>
              <Link
                href="/#articles"
                data-cursor="read"
                className="group grid gap-4 border-t border-line py-8 transition-colors hover:border-accent lg:grid-cols-[auto_1fr_auto] lg:items-baseline lg:gap-12"
              >
                <span className="font-sans text-xs tabular-nums text-ink-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-h2 transition-colors group-hover:text-accent">
                    {article.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
                    {article.body}
                  </p>
                </div>
                <span className="text-sm text-ink-subtle lg:text-right">{article.tag}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
