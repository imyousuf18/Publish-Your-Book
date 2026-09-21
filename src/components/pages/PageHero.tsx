import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { site, type PageHeroContent } from "@/lib/site";

/**
 * Masthead for every inner page.
 *
 * The heading ends in one italic phrase (`em`), the same device the homepage
 * headings use. Top padding clears the fixed header on both breakpoints: the
 * desktop header floats ~64px deep, the mobile bar is 64px.
 */
export function PageHero({
  content,
  cta = true,
  compact = false,
}: {
  content: PageHeroContent;
  /** Show the Start-your-book / Talk-to-us pair under the intro. */
  cta?: boolean;
  /** Shorter masthead for pages whose content is the point (Contact), so
   *  it starts above the fold on a laptop instead of below it. */
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-b border-line",
        compact ? "pb-12 pt-32 lg:pb-14 lg:pt-36" : "pb-16 pt-36 lg:pb-24 lg:pt-48",
      )}
    >
      <Container>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <TextReveal as="h1" className={cn("mt-6 max-w-5xl", compact ? "text-h1" : "text-display")}>
          {content.title} <span className="italic">{content.em}</span>
        </TextReveal>

        <Reveal delay={150}>
          <p className={cn("max-w-2xl text-lead text-ink-muted", compact ? "mt-5" : "mt-8")}>{content.body}</p>
          {cta && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact" size="lg">
                Start your book
              </ButtonLink>
              {/* Secondary is email, not a second link to /contact: two buttons to
                  the same place is one choice dressed up as two. */}
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center px-2 text-sm text-ink underline underline-offset-4 transition-colors duration-200 hover:text-accent"
              >
                or email {site.email}
              </a>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
