import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Publish Your Book collects, uses and protects the information you share with us, including manuscripts and contact details.",
  // Not a page worth ranking for; keeps thin boilerplate off search results
  // without affecting the rest of the domain.
  robots: { index: false, follow: true },
};

const sections = [
  {
    heading: "What we collect",
    body: `When you contact us, submit a form or send a manuscript, we collect what you provide directly: your name, email address, and anything you write or attach, including manuscript files. We do not collect payment details through this website.`,
  },
  {
    heading: "How we use it",
    body: `We use what you send to respond to your enquiry, assess your manuscript and, if you become a client, to deliver the services you have engaged us for. We do not sell, rent or trade your information to third parties.`,
  },
  {
    heading: "Manuscripts and creative work",
    body: `A manuscript you send us is treated as confidential. It is used only to assess or complete the work you have asked for, and it remains your property at every stage — see the ownership terms in our Process.`,
  },
  {
    heading: "How long we keep it",
    body: `We keep enquiry details and manuscripts for as long as needed to respond to you or deliver a project, and delete them on request once a project has concluded.`,
  },
  {
    heading: "Your rights",
    body: `You can ask us what information we hold about you, ask us to correct it, or ask us to delete it, by emailing ${site.email}.`,
  },
  {
    heading: "Contact",
    body: `Questions about this policy can be sent to ${site.email}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Privacy Policy"
        body="How we collect, use and protect the information you share with us."
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
