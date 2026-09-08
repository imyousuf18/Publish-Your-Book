import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageIntro
      eyebrow="Who we are"
      title="About"
      body="The team, the imprint, and why we work the way we do. Company story goes here."
    />
  );
}
