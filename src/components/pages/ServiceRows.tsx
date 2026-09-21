import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { cn } from "@/lib/utils";
import { services } from "@/lib/site";

/**
 * The six services at full length, one row each, image and text alternating
 * sides. Each row is the front door to that service's own page: the heading, the
 * image and the button all lead there.
 *
 * The image sits on a tinted sheet a little behind it, and Tilt3D turns the pair
 * a few degrees with the pointer, so the row has the same depth as the service
 * page's hero at a gentler angle. Each row is a `.group` so the image also zooms
 * inside a fixed rounded clip on hover, the orionix project-tile treatment.
 *
 * Ids (`service-01`...) are kept so older `/services#service-01` links still land.
 */
export function ServiceRows() {
  return (
    <section id="services" className="border-b border-line py-24 lg:py-32">
      <Container className="space-y-24 lg:space-y-32">
        {services.map((service, i) => (
          <Reveal
            as="article"
            key={service.num}
            id={`service-${service.num}`}
            className="group grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-20"
          >
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              {/* Room for the offset sheet behind the picture. It is shifted by 4%
                  of the picture's width, so the room must be a percentage too:
                  a fixed pr-4 (16px) held on phones but not on a sideways phone,
                  where the picture is 765px wide and the sheet stuck out 30px. */}
              <Tilt3D max={5} className="pb-[5%] pr-[5%]">
                <div className="stage3d relative">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-panel bg-accent-soft"
                    style={{ transform: "translate3d(4%, 5%, -40px)" }}
                  />
                  <ImageSlot
                    ratio="4/3"
                    src={service.image}
                    alt={service.alt}
                    label={service.slotLabel}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    zoom
                    className="rounded-panel shadow-lift"
                  />
                  <span
                    aria-hidden
                    className="absolute left-4 top-4 rounded-pill bg-paper/90 px-3 py-1 font-sans text-xs font-medium tabular-nums text-ink backdrop-blur-sm"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    {service.num}
                  </span>
                </div>
              </Tilt3D>
            </div>

            <div>
              <span className="text-eyebrow font-semibold uppercase text-accent">
                {service.num}
              </span>
              <h2 className="mt-4 text-h1">
                <Link
                  href={`/services/${service.slug}`}
                  className="transition-colors duration-200 hover:text-accent"
                >
                  {service.title}
                </Link>
              </h2>
              <p className="mt-6 max-w-lg text-lead text-ink-muted">{service.body}</p>

              <ul className="mt-8 grid max-w-lg gap-x-6 gap-y-3 border-t border-line pt-6 sm:grid-cols-2">
                {service.items.map((item) => (
                  <li key={item} className="flex items-baseline gap-3 text-base text-ink-muted">
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-accent-bright" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
                <ButtonLink href={`/services/${service.slug}`}>
                  Explore {service.short.toLowerCase()}
                </ButtonLink>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center text-sm text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
                >
                  {service.cta}
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
