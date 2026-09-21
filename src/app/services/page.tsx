import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqList } from "@/components/pages/FaqList";
import { Journeys } from "@/components/sections/Journeys";
import { PageHero } from "@/components/pages/PageHero";
import { ServiceRows } from "@/components/pages/ServiceRows";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRoad } from "@/components/service/ServiceRoad";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { faqs, pageHeroes, services, site } from "@/lib/site";

const description =
  "Book publishing services in one place: ghostwriting, editing, cover design, illustration, publishing and distribution, and marketing. Book one service or all six.";

export const metadata: Metadata = {
  title: "Book Publishing Services",
  description,
  keywords: [
    "book publishing services",
    "book ghostwriting services",
    "book editing services",
    "book cover design services",
    "children's book illustration",
    "book distribution services",
    "book marketing services for authors",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    siteName: site.name,
    title: `Book Publishing Services · ${site.name}`,
    description,
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={itemListSchema(
          services.map((s) => ({ name: s.title, path: `/services/${s.slug}` })),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <PageHero content={pageHeroes.services} />
      <ServiceRoad />
      <ServiceRows />
      <Journeys />
      <FaqList items={faqs.services} />
      <CtaBanner
        title="Tell us which part you"
        em="need."
        body="One service or all six. We will read what you have and tell you what it needs, and what it does not."
      />
    </>
  );
}
