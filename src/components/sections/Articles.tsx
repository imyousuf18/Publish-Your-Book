import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { articles } from "@/lib/articles";

export function Articles() {
  return (
    <section id="articles" className="border-b border-line bg-surface-alt py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <TextReveal as="h2" className="max-w-2xl text-h1">
            Read this before you spend anything.
          </TextReveal>
          </div>
          <Link
            href="/#articles"
            className="text-sm font-medium text-accent underline underline-offset-4"
          >
            All articles
          </Link>
        </div>

        <ul className="mt-16 grid gap-0 border-t-2 border-ink lg:grid-cols-3">
          {articles.map((article, i) => (
            <Reveal
              as="li"
              key={article.title}
              delay={i * 90}
              className="border-b-2 border-ink lg:border-b-0 lg:border-r-2 lg:last:border-r-0"
            >
              <article
                className="flex h-full flex-col items-start p-8 lg:p-10"
              >
                <p className="text-eyebrow font-semibold uppercase text-accent">
                  {article.tag}
                </p>
                <h3 className="mt-5 text-h3">{article.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                  {article.dek}
                </p>
                <span className="mt-8 border-b-2 border-accent pb-1 text-sm font-medium text-ink">
                  Read the guide
                </span>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
