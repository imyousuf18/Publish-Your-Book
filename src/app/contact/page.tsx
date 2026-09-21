import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send us the first three chapters and get honest feedback on what your book needs. No cost, no obligation, no pitch deck.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero content={pageHeroes.contact} cta={false} compact />

      <Container className="pb-24 pt-12 lg:pb-32 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <ContactForm />

          <aside className="text-sm text-ink-muted lg:w-64">
            <h2 className="text-eyebrow font-semibold uppercase text-ink">
              Rather just email?
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-flex min-h-11 items-center text-accent underline underline-offset-4"
            >
              {site.email}
            </a>
            <p className="mt-6">
              We read every enquiry ourselves. No sales sequence and no chatbot, just a
              reply from someone who has read what you sent.
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}
