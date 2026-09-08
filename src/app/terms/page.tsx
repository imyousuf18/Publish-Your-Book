import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <PageIntro
      eyebrow="Legal"
      title="Terms"
      body="Terms of service go here."
    />
  );
}
