import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqList } from "@/components/pages/FaqList";
import { PageHero } from "@/components/pages/PageHero";
import { PlanCards } from "@/components/pages/PlanCards";
import { PointGrid } from "@/components/pages/PointGrid";
import { faqs, pageHeroes, pricingFactors } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Publishing Pricing",
  description:
    "What drives the cost of publishing your book — length, editing level, design and format — explained before you get a quote. No bundled add-ons.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero content={pageHeroes.pricing} cta={false} />
      <PlanCards />
      <PointGrid
        eyebrow="What shapes a quote"
        heading={<>Four things decide <span className="italic">the price.</span></>}
        items={pricingFactors}
        tone="alt"
      />
      <FaqList items={faqs.pricing} />
      <CtaBanner
        title="Ask for your"
        em="quote."
        body="We read the manuscript first, then quote for the work it needs. No cost, no obligation, no pitch deck."
      />
    </>
  );
}
