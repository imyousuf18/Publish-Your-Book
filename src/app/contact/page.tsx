import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageIntro
      eyebrow="Get in touch"
      title="Contact"
      body="Send us the first three chapters. The enquiry form will be wired up here."
    />
  );
}
