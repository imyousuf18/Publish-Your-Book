import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

/**
 * Shared masthead for the inner routes. These pages are stubs so the primary
 * navigation never dead-ends; fill them in as real content arrives.
 */
export function PageIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Section className="border-b border-line">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-h1">{title}</h1>
        <p className="mt-5 text-lead text-ink-muted">{body}</p>
      </div>
    </Section>
  );
}
