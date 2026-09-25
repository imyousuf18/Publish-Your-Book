import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { articles as allArticles } from "@/lib/articles";

/**
 * An editorial index of articles: full-width rows, the title at heading size,
 * the tag and dek supporting it. Reads like a contents page, which suits a
 * publisher.
 *
 * Shared by the homepage (a short, curated list — `featuredHome` in
 * articles.ts — under "Read this before you spend anything") and
 * `/author-guide` (the full set). Each row links to the article's own page.
 */
export function ArticlesList({
  heading = "Read this before you spend anything.",
  articles,
  viewAllHref,
}: {
  heading?: string;
  /** Defaults to the full list; the homepage passes the `featuredHome` subset. */
  articles?: typeof allArticles;
  /** "All articles" link. Omit on the page that already shows everything. */
  viewAllHref?: string;
}) {
  const items = articles ?? allArticles;

  return (
    <section id="articles" className="border-b border-line bg-surface-alt py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <TextReveal as="h2" className="max-w-2xl text-h1">
            {heading}
          </TextReveal>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4"
            >
              All articles
            </Link>
          )}
        </div>

        <ul className="mt-16">
          {items.map((article, i) => (
            <Reveal as="li" key={article.slug} delay={i * 80}>
              <Link
                href={`/author-guide/${article.slug}`}
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
                    {article.dek}
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
