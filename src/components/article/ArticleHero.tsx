import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import type { Article } from "@/lib/articles";
import { readingTime } from "@/lib/articles";

/**
 * Masthead for an article: breadcrumb, tag, headline, dek and a reading-time
 * line. Text-led, no image — the site has no real photography for blog
 * headers, and the guide already reads as an editorial contents page rather
 * than a magazine, so a clean typographic hero fits it better than a
 * placeholder image would.
 */
export function ArticleHero({ article, publishedLabel }: { article: Article; publishedLabel: string }) {
  return (
    <section className="border-b border-line pb-16 pt-32 lg:pb-20 lg:pt-40">
      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center text-sm text-ink-subtle">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden className="px-1">
              <CaretRight size={12} />
            </li>
            <li>
              <Link href="/author-guide" className="inline-flex min-h-11 items-center hover:text-ink">
                Author guide
              </Link>
            </li>
          </ol>
        </nav>

        <div className="mt-6 max-w-3xl">
          <Eyebrow>{article.tag}</Eyebrow>
          <TextReveal as="h1" className="mt-6 text-h2 sm:text-display">
            {article.title}
          </TextReveal>

          <Reveal delay={150}>
            <p className="mt-8 text-lead text-ink-muted">{article.dek}</p>
            <p className="mt-6 text-sm text-ink-subtle">
              {publishedLabel} · {readingTime(article)} min read
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
