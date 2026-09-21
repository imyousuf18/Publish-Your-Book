import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { JourneyRail } from "@/components/service/JourneyRail";
import { ServiceObject } from "@/components/service/ServiceObject";
import type { ServiceDetail } from "@/lib/service-pages";
import { site, services } from "@/lib/site";

type Service = (typeof services)[number];

/**
 * Masthead for a service page: breadcrumb, the service's own heading and lead,
 * the 3D object, and the road showing where this stop sits among the six.
 * Top padding clears the fixed header, matching PageHero.
 */
export function ServiceHero({
  detail,
  service,
  index,
}: {
  detail: ServiceDetail;
  service: Service;
  index: number;
}) {
  return (
    <section className="border-b border-line pb-16 pt-32 lg:pb-20 lg:pt-40">
      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center text-sm text-ink-subtle">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden className="px-1">
              <CaretRight size={12} />
            </li>
            <li>
              <Link href="/services" className="inline-flex min-h-11 items-center hover:text-ink">
                Services
              </Link>
            </li>
            <li aria-hidden className="px-1">
              <CaretRight size={12} />
            </li>
            <li aria-current="page" className="inline-flex min-h-11 items-center text-ink">
              {service.short}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <Eyebrow>{detail.hero.eyebrow}</Eyebrow>
            <TextReveal as="h1" className="mt-6 max-w-2xl text-h2 sm:text-h1">
              {detail.hero.title} <span className="italic">{detail.hero.em}</span>
            </TextReveal>

            <Reveal delay={150}>
              <p className="mt-8 max-w-xl text-lead text-ink-muted">{detail.hero.lead}</p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="#start" size="lg">
                  Start with {service.short.toLowerCase()}
                </ButtonLink>
                <a
                  href="#how"
                  className="inline-flex min-h-11 items-center px-2 text-sm text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
                >
                  See how it works
                </a>
              </div>
              <p className="mt-6 text-sm text-ink-subtle">
                Questions first? Email{" "}
                <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>

          <ServiceObject
            image={service.image}
            alt={service.alt}
            chips={service.items}
            number={`0${index + 1}`}
          />
        </div>

        <div className="mt-16 lg:mt-20">
          <JourneyRail current={detail.slug} />
        </div>
      </Container>
    </section>
  );
}
