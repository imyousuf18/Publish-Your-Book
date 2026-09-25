import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleNext } from "@/components/article/ArticleNext";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { articles, getArticle, getNeighbourArticles, publishedDate } from "@/lib/articles";
import { site } from "@/lib/site";

/** Only the ten known articles exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const path = `/author-guide/${slug}`;
  const title = `${article.title} · ${site.name}`;
  return {
    title: article.title,
    description: article.seo.description,
    keywords: article.seo.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: site.name,
      title,
      description: article.seo.description,
      publishedTime: publishedDate.iso,
    },
    twitter: { card: "summary_large_image", title, description: article.seo.description },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/author-guide/${slug}`;
  const { prev, next } = getNeighbourArticles(slug);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: article.title,
          description: article.seo.description,
          path,
          datePublished: publishedDate.iso,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Author guide", path: "/author-guide" },
          { name: article.title, path },
        ])}
      />

      <ArticleHero article={article} publishedLabel={publishedDate.label} />
      <ArticleBody article={article} />
      <ArticleNext prev={prev} next={next} />
      <CtaBanner
        title="Send us the first three"
        em="chapters."
        body="We will read them and tell you honestly what your book needs. No cost, no obligation, no pitch deck."
      />
    </>
  );
}
