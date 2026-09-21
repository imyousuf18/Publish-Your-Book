import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/motion/TextReveal";
import { JourneyDialog, JourneyTrigger } from "@/components/forms/JourneyDialog";
import type { ServiceDetail } from "@/lib/service-pages";
import { site } from "@/lib/site";

const REASSURANCES = [
  "We reply within two working days.",
  "No cost and no obligation to start the conversation.",
  "You keep every right and every royalty.",
] as const;

/**
 * The last stop of every service page. The button opens the same pop-up form as
 * the homepage's "Three ways in" cards, with the question set that matches the
 * service and a `service` field so the team knows which page it came from. The
 * dialog is mounted here once, the same way the Journeys section mounts it.
 * The plain contact form and the email address stay one click away.
 */
export function ServiceStart({
  detail,
  short,
}: {
  detail: ServiceDetail;
  short: string;
}) {
  return (
    <section
      id="start"
      className="scroll-mt-20 py-28 lg:py-40"
      style={{ background: "var(--color-inverse)", color: "var(--color-inverse-ink)" }}
    >
      <Container>
        <Eyebrow className="text-accent-tint">Start here</Eyebrow>
        <TextReveal as="h2" className="mt-6 max-w-5xl text-h2 sm:text-h1 lg:text-display">
          {detail.start.title} <span className="italic">{detail.start.em}</span>
        </TextReveal>
        <p className="mt-8 max-w-xl text-lead text-inverse-ink/70">{detail.start.body}</p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <JourneyTrigger journey={detail.journey} variant="primary" service={detail.slug}>
            Start with {short.toLowerCase()}
          </JourneyTrigger>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center text-sm text-inverse-ink/80 underline underline-offset-4 transition-colors duration-200 hover:text-inverse-ink"
          >
            Or use the contact form
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center text-sm text-inverse-ink/80 underline underline-offset-4 transition-colors duration-200 hover:text-inverse-ink"
          >
            {site.email}
          </a>
        </div>

        <ul className="mt-14 grid gap-4 border-t border-inverse-ink/15 pt-8 sm:grid-cols-3">
          {REASSURANCES.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-inverse-ink/80">
              <Check size={16} weight="bold" aria-hidden className="mt-0.5 shrink-0 text-accent-tint" />
              {line}
            </li>
          ))}
        </ul>
      </Container>

      <JourneyDialog />
    </section>
  );
}
