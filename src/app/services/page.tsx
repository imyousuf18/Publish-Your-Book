import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <PageIntro
      eyebrow="What we do"
      title="Services"
      body="Assessment, editing, design, and distribution. Detailed service pages go here."
    />
  );
}
