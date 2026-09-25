import type { Metadata } from "next";
import { ArticlesList } from "@/components/sections/ArticlesList";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqList } from "@/components/pages/FaqList";
import { PageHero } from "@/components/pages/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { articles } from "@/lib/articles";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { faqs, pageHeroes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Author Guide",
  description:
    "Straight answers on editing, rights, costs and timelines — written for authors deciding what their book needs, before they spend anything.",
  alternates: { canonical: "/author-guide" },
};

export default function AuthorGuidePage() {
  return (
    <>
      <JsonLd
        data={itemListSchema(
          articles.map((a) => ({ name: a.title, path: `/author-guide/${a.slug}` })),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Author guide", path: "/author-guide" },
        ])}
      />

      <PageHero content={pageHeroes.guide} />
      <ArticlesList />
      <FaqList items={faqs.guide} heading="Short answers, first." />
      <CtaBanner
        title="Still have a"
        em="question?"
        body="Ask us directly. We answer honestly, even when the answer is that you do not need us."
      />
    </>
  );
}
