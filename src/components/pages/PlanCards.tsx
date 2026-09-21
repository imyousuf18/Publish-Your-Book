import { Check } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { plans } from "@/lib/site";

/**
 * Three ways to work with us, laid out the way orionix lays out its plans:
 * three rounded panels, the middle one inverted, each ending in an
 * "Inquire"-style button rather than a checkout.
 *
 * There are intentionally no prices. Books are quoted after they are read, and
 * a made-up "from $X" figure would be the first thing an author holds us to.
 */
export function PlanCards() {
  return (
    <section className="border-b border-line py-24 lg:py-32">
      <Container>
        {/* grid-cols-1, not an implicit auto column: auto sizes to the widest
            card's min-content, so one unbreakable row widened all three. */}
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal
              as="li"
              key={plan.name}
              delay={i * 90}
              className={cn(
                "flex flex-col rounded-card border p-6 sm:p-8 lg:p-10",
                plan.featured
                  ? "border-transparent bg-inverse text-inverse-ink shadow-lift"
                  : "border-line bg-surface text-ink",
              )}
            >
              {/* Wraps on a phone: name + "Recommended" side by side could not get
                  narrower than ~224px and pushed the cards off a 320px screen. */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <h2 className="text-h3">{plan.name}</h2>
                {plan.featured && (
                  <span className="shrink-0 whitespace-nowrap rounded-pill bg-accent-bright px-3 py-1 text-xs font-medium text-ink">
                    Recommended
                  </span>
                )}
              </div>
              <p className={cn("mt-3 text-lead", plan.featured ? "text-inverse-ink" : "text-ink")}>
                {plan.summary}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  plan.featured ? "text-inverse-ink/75" : "text-ink-muted",
                )}
              >
                {plan.audience}
              </p>

              <p
                className={cn(
                  "mt-8 border-t pt-6 font-display text-h2",
                  plan.featured ? "border-inverse-ink/15" : "border-line",
                )}
              >
                Quoted per <span className="italic">manuscript</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.includes.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex gap-3 text-sm leading-relaxed",
                      plan.featured ? "text-inverse-ink/85" : "text-ink-muted",
                    )}
                  >
                    <Check
                      size={16}
                      weight="bold"
                      aria-hidden
                      className={cn("mt-0.5 shrink-0", plan.featured ? "text-accent-tint" : "text-accent")}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/contact"
                variant={plan.featured ? "primary" : "secondary"}
                className="mt-10 w-full"
              >
                {plan.cta}
              </ButtonLink>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
