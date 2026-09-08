import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <PageIntro
      eyebrow="Legal"
      title="Privacy"
      body="Privacy policy goes here."
    />
  );
}
