import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Article } from "@/lib/articles";

/**
 * The article itself: an intro paragraph, then each section as an `<h2>` with
 * its body and an optional bullet list, then a "Key takeaways" summary and a
 * single related-page callout. A single centred prose column — no sidebar,
 * no image breaks — matching the site's plain, editorial voice.
 */
export function ArticleBody({ article }: { article: Article }) {
  return (
    <section className="border-b border-line py-20 lg:py-28">
      <Container className="max-w-2xl">
        <Reveal>
          <p className="text-lead leading-relaxed text-ink">{article.intro}</p>
        </Reveal>

        <div className="mt-4 space-y-12">
          {article.sections.map((section, i) => (
            <Reveal key={section.heading} delay={Math.min(i, 4) * 60}>
              <h2 className="text-h2">{section.heading}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{section.body}</p>
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-muted">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 rounded-card border border-line bg-surface p-8 lg:p-10">
          <p className="text-eyebrow font-semibold uppercase text-accent">Key takeaways</p>
          <ul className="mt-5 space-y-3">
            {article.takeaways.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-relaxed text-ink">
                <Check size={16} weight="bold" aria-hidden className="mt-1 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {(article.related.service || article.related.path) && (
          <Reveal delay={90} className="mt-8">
            <Link
              href={article.related.service ? `/services/${article.related.service}` : article.related.path!}
              className="group inline-flex min-h-11 items-center gap-2 text-base font-medium text-ink underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
            >
              {article.related.label}
              <ArrowRight
                size={16}
                weight="bold"
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
