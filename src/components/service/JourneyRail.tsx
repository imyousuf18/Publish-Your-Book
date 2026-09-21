import Link from "next/link";
import { serviceDetails } from "@/lib/service-pages";
import { services } from "@/lib/site";

/**
 * The six services as one road, with "you are here". The same numbered-word
 * rail the homepage hero uses for the five stages, made into links, so every
 * service page shows where it sits in the whole journey and lets the reader
 * step to any other stop.
 */
export function JourneyRail({ current }: { current: string }) {
  return (
    <nav aria-label="The six services" className="border-t border-line pt-6">
      <ol className="flex flex-wrap gap-x-2 gap-y-1 sm:gap-x-6">
        {serviceDetails.map((detail, i) => {
          const service = services.find((s) => s.slug === detail.slug);
          const isCurrent = detail.slug === current;
          return (
            <li key={detail.slug}>
              <Link
                href={`/services/${detail.slug}`}
                aria-current={isCurrent ? "page" : undefined}
                title={service?.title}
                className="group inline-flex min-h-11 items-baseline gap-3 border-b-2 border-transparent px-1 pt-2 text-ink-muted transition-colors duration-200 hover:text-ink aria-[current=page]:border-accent-bright aria-[current=page]:text-ink"
              >
                <span className="text-eyebrow font-semibold uppercase text-accent">
                  0{i + 1}
                </span>
                <span className="font-display text-h3">{detail.stage}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
