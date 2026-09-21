import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/pages/FaqList";
import { PointGrid } from "@/components/pages/PointGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceBeginEnd } from "@/components/service/ServiceBeginEnd";
import { ServiceHero } from "@/components/service/ServiceHero";
import { ServiceNext } from "@/components/service/ServiceNext";
import { ServicePortfolio } from "@/components/service/ServicePortfolio";
import { ServiceProcess } from "@/components/service/ServiceProcess";
import { ServiceSignals } from "@/components/service/ServiceSignals";
import { ServiceStart } from "@/components/service/ServiceStart";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import {
  getNeighbours,
  getService,
  getServiceDetail,
  serviceSlugs,
} from "@/lib/service-pages";
import { site } from "@/lib/site";

/** Only the six known services exist; anything else is a 404, not a blank page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  if (!detail) return {};

  const path = `/services/${slug}`;
  const title = `${detail.seo.title} · ${site.name}`;
  return {
    title: detail.seo.title,
    description: detail.seo.description,
    keywords: detail.seo.keywords,
    alternates: { canonical: path },
    // A page-level openGraph replaces the layout's whole object rather than
    // merging into it, so the site name is repeated here.
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title,
      description: detail.seo.description,
    },
    twitter: { card: "summary_large_image", title, description: detail.seo.description },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getServiceDetail(slug);
  const service = getService(slug);
  if (!detail || !service) notFound();

  const path = `/services/${slug}`;
  const { index } = getNeighbours(slug);

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: service.title,
          serviceType: detail.seo.title,
          description: detail.seo.description,
          path,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path },
        ])}
      />

      <ServiceHero detail={detail} service={service} index={index} />
      <ServiceSignals signals={detail.signals} />
      <PointGrid
        eyebrow="Included"
        heading={detail.included.heading}
        intro={detail.included.intro}
        items={detail.included.items}
        tone="alt"
        columns={3}
      />
      <ServiceProcess process={detail.process} />
      <ServiceBeginEnd begin={detail.begin} finish={detail.finish} />
      <ServicePortfolio portfolio={detail.portfolio} />
      <FaqList items={detail.faqs} heading={`Questions about ${service.short.toLowerCase()}.`} />
      <ServiceNext slug={slug} related={detail.related} />
      <ServiceStart detail={detail} short={service.short} />
    </>
  );
}
