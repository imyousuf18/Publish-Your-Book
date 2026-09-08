import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <PageIntro
      eyebrow="Costs"
      title="Pricing"
      body="Fixed quotes based on length and editing depth. The full pricing table goes here."
    />
  );
}
