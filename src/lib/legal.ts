/**
 * Content for /terms and /privacy.
 *
 * Same rule as site.ts and service-pages.ts: every visible string lives in
 * data, not in components. Structured as numbered sections so the two pages
 * can render a consistent, skimmable layout (PageIntro masthead, then one
 * heading + body + optional list per section).
 *
 * This is standard-shape agency terms and a standard-shape privacy policy —
 * covering the topics any publishing-services business needs to cover
 * (scope, payment, ownership, refunds; what we collect, how we use it, your
 * rights) — written for Publish Your Book's own services and in the site's
 * plain, no-hype voice. It is not a substitute for review by a lawyer
 * licensed in Illinois before this goes live; see docs/ROADMAP.md.
 */
import { site } from "./site";

export type LegalSection = { heading: string; body: string; list?: string[] };

const addr = site.address;

export const legalEffectiveDate = "September 23, 2026";

export const termsSections: LegalSection[] = [
  {
    heading: "01. Who these terms are between",
    body: `These Terms of Service ("Terms") govern your use of the ${site.name} website and the services we provide. By visiting this website, submitting a form, sending us a manuscript, signing a project agreement or paying an invoice, you agree to these Terms. If you do not agree to them, please do not use the website or our services.`,
  },
  {
    heading: "02. What we do",
    body: `${site.name} provides publishing services for authors: writing and ghostwriting, editing and proofreading, book cover and interior design, children's book illustration, publishing and distribution, and author marketing. The exact deliverables, timeline and cost for your project are set out in the written scope and quote we send you, not on this website, and that written scope is what governs the work.`,
  },
  {
    heading: "03. We are an independent publishing services company",
    body: `${site.name} is independent. We are not affiliated with, endorsed by, or officially connected to Amazon, Kindle Direct Publishing (KDP), Barnes & Noble Press, IngramSpark, Apple Books, Kobo, Google Books or any other retailer or distribution platform. Where we mention a platform on this website, it is to describe how our services work with it, not to claim a relationship with it.`,
  },
  {
    heading: "04. Using this website",
    body: `You agree to use this website lawfully. You may not try to bypass its security, scrape or reproduce its content without permission, submit false or infringing information through our forms, or attempt to gain unauthorized access to any part of it. We may restrict access to anyone who breaches these Terms.`,
  },
  {
    heading: "05. Enquiries are not an agreement",
    body: `Filling in a form, booking a call, or sending us a manuscript does not, by itself, create a service agreement. A project begins once we have sent you a written scope and quote and you have accepted it, or made the agreed initial payment. Anything we say about timeline or price before we have read your manuscript is an estimate, and may change once we have.`,
  },
  {
    heading: "06. What we need from you",
    body: `A project moves at the pace of the material and feedback you give us. You are responsible for:`,
    list: [
      "giving us accurate contact and billing details",
      "sending a manuscript or files that are yours to send",
      "reviewing drafts, proofs and designs within the time set out in your schedule",
      "giving clear, timely approval at each stage",
      "paying invoices on the agreed schedule",
    ],
  },
  {
    heading: "07. Payment",
    body: `Fees are quoted in writing, based on the manuscript and the work it needs, before any billable work begins. Unless your agreement says otherwise, work does not start until the agreed first payment is received, and you are responsible for any tax that applies to your invoice.`,
  },
  {
    heading: "08. Refunds and cancellation",
    body: `You may cancel a project in writing at any time. Because our work is custom — editing, design, illustration and writing done specifically for your book — payment for work already completed is not refundable once that work has begun. If you cancel partway through a project, we will invoice for the stages completed and refund the balance of anything paid in advance for stages not yet started. Where your written agreement sets out different refund terms for your project, that agreement controls.`,
  },
  {
    heading: "09. Revisions",
    body: `The number of revision rounds included in your project is set out in your written scope. Reasonable revisions within that scope are included; requests that go beyond it — a different direction, added chapters, a second cover concept once one is approved — may be quoted as additional work. Once you approve a stage in writing, further changes to it are treated as new work.`,
  },
  {
    heading: "10. Timelines",
    body: `We give you a stage-by-stage schedule with your quote and work to it in good faith. Timelines can move because of slow feedback, a manuscript that needs more work than first thought, or a retailer's own review process, and we are not responsible for delays caused by those things or by circumstances outside our control.`,
  },
  {
    heading: "11. Your manuscript and your rights",
    body: `This is the part we take most seriously. You keep every right to your manuscript and to the finished book — copyright, royalties, all of it — at every stage. Nothing in these Terms, and nothing about hiring us, transfers ownership of your work to us. Where we create original material for you (a cover design, illustrations, formatted files), that material becomes yours once it is paid for in full, as set out in your project agreement. You are responsible for making sure anything you send us is yours to send, or that you hold the rights and permissions needed to use it.`,
  },
  {
    heading: "12. Showing your book in our portfolio",
    body: `We may show finished covers, interiors, illustrations or case studies from your project on this website or in our own marketing, unless you ask us in writing not to. If you would rather your project stayed private, tell us and we will leave it out.`,
  },
  {
    heading: "13. Confidentiality",
    body: `We treat manuscripts, drafts and project details as confidential, and use them only to do the work you have asked for. That does not extend to information that is already public, or that we are required by law to disclose, or that we need to share with a specific contractor working on your project. If you need a signed non-disclosure agreement, ask us and we will provide one.`,
  },
  {
    heading: "14. Working with publishing platforms",
    body: `Where a project includes publishing or distribution, we prepare and submit your book to the retailers or platforms you choose. We do not control a platform's own review process, approval decisions, royalty rates, pricing rules or removals, and we are not responsible for a platform's delay or rejection of a submission that meets its published requirements.`,
  },
  {
    heading: "15. Marketing services",
    body: `Author marketing and branding work — launch materials, an author page, a review outreach kit — is built around your book and handed to you to use. We do not run advertising campaigns or manage ongoing social media as a default part of this service; if you want that, ask us and we will scope it separately.`,
  },
  {
    heading: "16. No promise of sales or rankings",
    body: `We do the work in front of us as well as we can, and we are honest with you about what it can realistically achieve. We do not, and cannot, promise a certain number of sales, a bestseller ranking, media coverage or reviews. Anything we say about a past project is a description of that project, not a guarantee about yours.`,
  },
  {
    heading: "17. Costs that are not ours",
    body: `Some projects involve costs that are not part of our fee: an ISBN, a copyright registration, print costs, a stock image licence, or a paid tool a project specifically needs. Unless we have said otherwise in writing, those costs are separate from our quote and are yours to cover.`,
  },
  {
    heading: "18. What we cannot work on",
    body: `We will not knowingly work on content that is unlawful, plagiarized, defamatory or that infringes someone else's rights, and we may decline or pause a project if we believe it falls into one of those categories.`,
  },
  {
    heading: "19. This website's own content",
    body: `The text, images, logos and design of this website belong to ${site.name} or are used with permission. Please do not copy or reuse them without asking us first.`,
  },
  {
    heading: "20. Limits on our liability",
    body: `To the extent the law allows, ${site.name} is not liable for indirect or consequential loss — lost sales, lost profits or lost opportunities — arising from our services. Our total liability for a claim relating to a project is limited to the amount you paid us for that project.`,
  },
  {
    heading: "21. Governing law",
    body: `These Terms are governed by the laws of the State of Illinois, without regard to its conflict-of-law rules. Any dispute will be handled in a court of competent jurisdiction, unless your written agreement with us says otherwise.`,
  },
  {
    heading: "22. Changes to these terms",
    body: `We may update these Terms from time to time. We will post the revised version on this page with a new effective date. If you keep using our website or services after an update, that means you accept the change; a project already under a signed agreement is governed by the terms in that agreement.`,
  },
  {
    heading: "23. Contact us",
    body: `Questions about these Terms can be sent to ${site.email}, or in writing to ${site.name}, ${addr.line1}, ${addr.city}, ${addr.region} ${addr.postalCode}.`,
  },
];

export const privacySections: LegalSection[] = [
  {
    heading: "01. What this policy covers",
    body: `${site.name} ("we", "us", "our") respects your privacy. This Privacy Policy explains what information we collect when you visit this website or use our writing, editing, design, illustration, publishing or marketing services, how we use it, and the choices you have. Using this website or sending us your information means you agree to what is described here.`,
  },
  {
    heading: "02. Information we collect",
    body: `Information you give us directly:`,
    list: [
      "your name, email address and any phone number you provide",
      "the details of your project, including your manuscript, notes, drafts, artwork or other files you send us",
      "billing information you give us to pay an invoice",
      "anything you tell us by email, form or in conversation",
    ],
  },
  {
    heading: "03. Information collected automatically",
    body: `When you visit our website, we may automatically collect standard technical information: your IP address, browser and device type, the pages you visit, and similar data gathered through cookies or analytics tools, so we can see how the site is used and keep it working properly.`,
  },
  {
    heading: "04. How we use your information",
    body: `We use what you send us to reply to your enquiry, assess a manuscript, deliver the service you have booked, send invoices and updates, and keep basic business records. We do not sell your personal information.`,
  },
  {
    heading: "05. Email, and any phone number you give us",
    body: `If you give us your email address or phone number, we will use it to reply about your enquiry or project — updates, drafts, invoices and scheduling. We will not add you to marketing you did not ask for. You can ask us at any time to stop contacting you for anything other than an active project.`,
  },
  {
    heading: "06. Cookies and analytics",
    body: `This website may use cookies or a similar analytics tool to understand how it is used, so we can improve it. You can block or clear cookies in your browser; some parts of the site may work less well if you do.`,
  },
  {
    heading: "07. Who we share information with",
    body: `We do not sell your information. We may share it with people who need it to deliver your project or run our business:`,
    list: [
      "the editor, designer, illustrator or writer working on your book",
      "a payment processor, to take a payment you have authorized",
      "hosting, email or analytics providers that keep this website running",
      "a professional adviser, such as an accountant, where needed",
      "a court, regulator or authority, where we are required by law to disclose it",
    ],
  },
  {
    heading: "08. Your manuscript and project files",
    body: `A manuscript, draft or file you send us is used only to assess or complete the work you have asked for. We treat it as confidential, and we do not claim ownership of it — see the ownership terms in our Terms of Service. You are responsible for making sure you have the right to send us anything you submit.`,
  },
  {
    heading: "09. Payment information",
    body: `Payments are handled through a third-party payment processor. We do not store full card details on our own systems; the processor handles that information under its own privacy policy.`,
  },
  {
    heading: "10. Keeping your information safe",
    body: `We take reasonable steps to protect the information and files you share with us from unauthorized access or loss. No website or email system can be guaranteed completely secure, so please avoid sending highly sensitive personal information, like a government ID number, by email.`,
  },
  {
    heading: "11. How long we keep it",
    body: `We keep enquiry details and project files for as long as we need them to respond to you, deliver a project, or meet our own accounting and legal obligations, and we delete or archive them once they are no longer needed. You can ask us to delete your information sooner, subject to anything we are required to keep.`,
  },
  {
    heading: "12. Your rights",
    body: `You can ask us, at any time, to:`,
    list: [
      "tell you what personal information we hold about you",
      "correct information that is wrong or out of date",
      "delete your personal information, once any active project has concluded",
      "stop using your information for anything beyond an active project",
    ],
  },
  {
    heading: "13. Links to other websites",
    body: `Our website and our emails may link to other sites, including retailers and publishing platforms. We are not responsible for their privacy practices; once you leave our site, their own policy applies.`,
  },
  {
    heading: "14. Children's privacy",
    body: `Our services are for adult authors and businesses. We do not knowingly collect personal information from children under 13, and if we learn that we have, we will delete it.`,
  },
  {
    heading: "15. Visitors outside the United States",
    body: `${site.name} is based in the United States. If you contact us from elsewhere, your information will be processed and stored here, under the laws of the United States and the State of Illinois.`,
  },
  {
    heading: "16. Changes to this policy",
    body: `We may update this Privacy Policy from time to time. Any change will be posted here with a new effective date; continuing to use our website or services afterward means you accept the update.`,
  },
  {
    heading: "17. Contact us",
    body: `Questions about this policy, or a request about your information, can be sent to ${site.email}, or in writing to ${site.name}, ${addr.line1}, ${addr.city}, ${addr.region} ${addr.postalCode}.`,
  },
];
