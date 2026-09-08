import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="font-display text-h1 text-accent">404</p>
        <h1 className="mt-4 text-h2">This page is not on the shelf.</h1>
        <p className="mt-5 text-lead text-ink-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <ButtonLink href="/" className="mt-8">
          Back to the homepage
        </ButtonLink>
      </div>
    </Section>
  );
}
