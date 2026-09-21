import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqList } from "@/components/pages/FaqList";
import { PageHero } from "@/components/pages/PageHero";
import { PointGrid } from "@/components/pages/PointGrid";
import { Process } from "@/components/sections/Process";
import { approvals, faqs, pageHeroes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Publishing Process",
  description:
    "Six stages from manuscript to shelf, in writing before work begins: scope, timeline, ownership and cost, upfront. No hidden fees.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero content={pageHeroes.process} />
      <Process />
      <PointGrid
        eyebrow="Your sign-off"
        heading={<>What you approve, <span className="italic">and when.</span></>}
        intro="Four points where the book waits for your approval before it moves on."
        items={approvals}
        tone="alt"
      />
      <FaqList items={faqs.process} />
      <CtaBanner />
    </>
  );
}
