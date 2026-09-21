import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/pages/PageHero";
import { TestimonialFeature } from "@/components/sections/TestimonialFeature";
import { Work } from "@/components/sections/Work";
import { pageHeroes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Fiction, memoir, children's, business and faith titles we've taken from manuscript to shelf. Filter by genre to see covers and case studies.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero content={pageHeroes.work} />
      <Work />
      <TestimonialFeature />
      <CtaBanner />
    </>
  );
}
