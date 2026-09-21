import type { Metadata } from "next";
import { Cases } from "@/components/sections/Cases";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/pages/PageHero";
import { TestimonialFeature } from "@/components/sections/TestimonialFeature";
import { pageHeroes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "How a memoir went from 40 hours of interviews to a published book in 14 weeks. How a children's book got a character sheet the author owns outright.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero content={pageHeroes.cases} />
      <Cases />
      <TestimonialFeature />
      <CtaBanner
        title="See what your draft"
        em="could be."
        body="Send the first three chapters. We will read them and tell you honestly what your book needs."
      />
    </>
  );
}
