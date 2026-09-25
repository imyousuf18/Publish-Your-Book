import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { legalEffectiveDate, termsSections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern working with Publish Your Book: ownership, scope, payment and how our agreements work.",
  // Not a page worth ranking for; keeps this boilerplate off search results
  // without affecting the rest of the domain.
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Terms of Service"
        body="The terms that govern working with us, in plain language."
      />
      <Container className="max-w-2xl py-16 lg:py-20">
        <p className="text-sm text-ink-subtle">Effective {legalEffectiveDate}</p>

        <div className="mt-10 space-y-10">
          {termsSections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-h3">{section.heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">{section.body}</p>
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-muted">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
