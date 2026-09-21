import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern working with Publish Your Book: ownership, scope, payment and how our agreements work.",
  // Not a page worth ranking for; keeps thin boilerplate off search results
  // without affecting the rest of the domain.
  robots: { index: false, follow: true },
};

const sections = [
  {
    heading: "Ownership",
    body: `You keep every right to your manuscript and the finished book, including copyright, at every stage of the process. Nothing we do transfers ownership of your work to us.`,
  },
  {
    heading: "Scope and agreement",
    body: `Every project begins with a written scope: the deliverables, timeline and cost, agreed before any billable work begins. Work outside that scope is quoted separately before it starts.`,
  },
  {
    heading: "Payment",
    body: `Payment is split across the stages of a project, so you are never billed for work that has not started. Specific terms are set out in your project agreement.`,
  },
  {
    heading: "Revisions and approval",
    body: `You review and approve work at each stage of the process described on our Process page. Revision rounds are set out in your project agreement.`,
  },
  {
    heading: "Cancellation",
    body: `Either party may end an engagement in writing. You keep and are entitled to all work already delivered and paid for.`,
  },
  {
    heading: "Contact",
    body: `Questions about these terms can be sent to ${site.email}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Terms of Service"
        body="The terms that govern working with us, in plain language."
      />
      <Container className="max-w-2xl space-y-10 py-16 lg:py-20">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-h3">{section.heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">{section.body}</p>
          </div>
        ))}
      </Container>
    </>
  );
}
