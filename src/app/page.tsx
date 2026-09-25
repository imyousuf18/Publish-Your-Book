import { ArticlesList } from "@/components/sections/ArticlesList";
import { Cases } from "@/components/sections/Cases";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { GenresList } from "@/components/sections/GenresList";
import { Hero } from "@/components/sections/Hero";
import { Journeys } from "@/components/sections/Journeys";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { TestimonialFeature } from "@/components/sections/TestimonialFeature";
import { Work } from "@/components/sections/Work";
import { articles } from "@/lib/articles";

const homeArticles = articles.filter((a) => a.featuredHome);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Journeys />
      <Services />
      <Process />
      <GenresList />
      <Work preview />
      <Cases />
      <TestimonialFeature />
      <ArticlesList articles={homeArticles} viewAllHref="/author-guide" />
      <CtaBanner />
    </>
  );
}
