import type { Metadata } from "next";
import { ArticlesList } from "@/components/sections/ArticlesList";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqList } from "@/components/pages/FaqList";
import { PageHero } from "@/components/pages/PageHero";
import { faqs, pageHeroes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Author Guide",
  description:
    "Straight answers on editing, rights, costs and timelines — written for authors deciding what their book needs, before they spend anything.",
};

export default function AuthorGuidePage() {
  return (
    <>
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
