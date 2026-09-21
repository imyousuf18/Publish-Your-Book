import type { Metadata } from "next";
import { AboutStory } from "@/components/pages/AboutStory";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Journeys } from "@/components/sections/Journeys";
import { PageHero } from "@/components/pages/PageHero";
import { PointGrid } from "@/components/pages/PointGrid";
import { TestimonialFeature } from "@/components/sections/TestimonialFeature";
import { pageHeroes, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "An independent publishing company built on one rule: authors keep their rights and royalties. Here's how we work, and why it's not a vanity press.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero content={pageHeroes.about} />
      <AboutStory />
      <PointGrid
        eyebrow="What we hold to"
        heading={<>Four promises, <span className="italic">in writing.</span></>}
        items={values}
        tone="alt"
      />
      <Journeys />
      <TestimonialFeature />
      <CtaBanner />
    </>
  );
}
