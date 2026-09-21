import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Megaphone,
  PaintBrushBroad,
  PenNib,
  PencilLine,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { HorizontalTrack } from "@/components/motion/HorizontalTrack";
import { TextReveal } from "@/components/motion/TextReveal";
import { services } from "@/lib/site";

/** One icon per service, keyed by `num` so copy and order stay in site.ts. */
const ICONS: Record<string, typeof PenNib> = {
  "01": PenNib,
  "02": PencilLine,
  "03": BookOpenText,
  "04": PaintBrushBroad,
  "05": Storefront,
  "06": Megaphone,
};

/**
 * Six services on a pinned horizontal track.
 *
 * Card structure taken from umanodesign.studio's feature row, measured on the
 * live site: their "cards" are not boxes at all. Each is
 *
 *   media panel   487×422, flat tint (#e7e8e6), 21px radius, overflow hidden,
 *                 the visual cropped inside it
 *   caption       20px below: a small icon beside the title, then one line
 *                 of body copy — straight on the page, no border, no fill,
 *                 no shadow
 *
 * laid out in a flex row with a 33px gap. That openness is what makes it read
 * calm, and it is the opposite of what these cards were before: a bordered
 * white box stacking a number, heading, body, divider, list and image.
 *
 * Adapted to our theme: the panel uses our surface-alt tint and the
 * `rounded-panel` token (1.25rem ≈ their 21px); titles stay in the Playfair
 * display face instead of their bold sans; the number moves into a small pill
 * on the panel; body copy is Roboto. The item lists live on /services now, one
 * link away, rather than crowding six cards here.
 */
export function Services() {
  return (
    <section id="services" className="border-b border-line bg-paper">
      <Container className="py-24 lg:py-32">
        <TextReveal as="h2" className="max-w-4xl text-h1">
          Everything between a draft and a <span className="italic">shelf.</span>
        </TextReveal>
        <p className="mt-6 max-w-xl text-lead text-ink-muted">
          Ghostwriting, editing, cover design, illustration, distribution and marketing —
          take the whole process or only the part you need. Nothing is bundled to pad an
          invoice.
        </p>
      </Container>

      {/* No bottom padding once the box is centring: `pb-32` shrank the content
          box by 128px (158px at a 1920px root, where the whole scale is 24%
          bigger), so a card taller than what was left overflowed upward and
          its head was cut off by the top of the screen. `trailing` parks the
          sixth card near the middle at the end of the run so it can be read. */}
      <HorizontalTrack className="pb-24 pin:pb-0" center trailing="pin:pr-[34vw]">
        {services.map((service) => {
          const Icon = ICONS[service.num] ?? PenNib;
          return (
            <article key={service.num} className="group w-[82vw] shrink-0 sm:w-[56vw] lg:w-[34vw]">
              {/* The panel. Umano's is 8/7 (487×422), but at 34vw that made the
                  card ~745px on a 1900×855 screen and its link fell behind the
                  bottom dock. 4/3, capped at 40svh, keeps the whole card short
                  enough to sit centred above the dock; the image crops rather
                  than the card growing. */}
              <div className="relative">
                <ImageSlot
                  ratio="4/3"
                  src={service.image}
                  alt={service.alt}
                  label={service.slotLabel}
                  className="max-h-[40svh] rounded-panel bg-surface-alt"
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 56vw, 82vw"
                  zoom
                />
                <span className="absolute left-4 top-4 rounded-pill bg-paper/90 px-3 py-1 font-sans text-xs font-medium tabular-nums text-ink backdrop-blur-sm">
                  {service.num}
                </span>
              </div>

              {/* The caption: straight on the page, as theirs is. */}
              <div className="mt-5 max-w-[34rem]">
                <h3 className="flex items-center gap-3 text-h3">
                  <Icon size={22} weight="regular" aria-hidden className="shrink-0 text-accent" />
                  {service.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink-muted">{service.body}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
                >
                  Explore {service.short.toLowerCase()}
                  <span className="sr-only"> : {service.title}</span>
                  <ArrowRight
                    size={14}
                    weight="bold"
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </HorizontalTrack>
    </section>
  );
}
