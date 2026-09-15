/**
 * Site-wide content and configuration.
 *
 * Every string the site renders lives here rather than inside components, so
 * copy changes (or a later CMS swap) touch one file. The content below is the
 * real copy from the Modernist design, not placeholder text.
 */

/**
 * Resolve the canonical site URL.
 *
 * This must never return something `new URL()` cannot parse: `metadataBase`
 * in the root layout is evaluated while collecting page data, so a bad value
 * fails the production build outright rather than degrading at runtime.
 *
 * Note the truthiness checks. `??` is wrong here: Next inlines
 * `process.env.NEXT_PUBLIC_*` at build time and an unset variable can arrive
 * as an empty string rather than `undefined`. Empty string is not nullish, so
 * `??` happily passed "" through to `new URL("")` and broke the build on
 * Vercel while working locally, where the variable is genuinely undefined.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Vercel exposes the deployment host with no protocol.
    process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      // Malformed value: ignore it and keep looking rather than crash.
    }
  }

  return "http://localhost:3000";
}

export const site = {
  name: "Publish Your Book",
  tagline: "From finished manuscript to published author.",
  description:
    "Editing, design and publishing for authors who keep their rights. Austin, Texas.",
  url: resolveSiteUrl(),
  email: "hello@publishyourbook.com",
  location: "Austin, Texas",
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Work", href: "/#work" },
  { label: "Genres", href: "/#genres" },
];

/** Secondary destinations, shown in the navigation capsule's "More" menu. */
export const moreLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Case studies", href: "/#cases" },
  { label: "Author guide", href: "/#articles" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Writing and ghostwriting", href: "/#services" },
      { label: "Editing and proofreading", href: "/#services" },
      { label: "Cover and interior design", href: "/#services" },
      { label: "Publishing and distribution", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Author guide", href: "/#articles" },
      { label: "Case studies", href: "/#cases" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: "Independent publishing, done properly",
  title: "Your book deserves better than a template.",
  body: "We take finished manuscripts and turn them into books people actually want to buy: edited, designed and distributed. You keep every right and every royalty.",
  primaryCta: { label: "Start your book", href: "/contact" },
  secondaryCta: { label: "See the process", href: "/#process" },
} as const;

/** The five stages printed on the book's leaves in the loader animation. */
export const stages = [
  { word: "Write", note: "Outlining, coaching and ghostwriting that keeps your voice." },
  { word: "Edit", note: "Developmental, line, copyediting and proofreading." },
  { word: "Design", note: "Covers and interiors set for print and screen." },
  { word: "Illustrate", note: "Characters, scenes and artwork for younger readers." },
  { word: "Publish", note: "Formats, metadata and distribution setup." },
] as const;

/* -------------------------------------------------------------------------- */
/* Journeys — the three entry points, shown as a sticky stack                   */
/* -------------------------------------------------------------------------- */

export const journeys = [
  {
    num: "01",
    title: "I Have an Idea",
    body: "For authors who need planning, outlining, coaching or ghostwriting.",
  },
  {
    num: "02",
    title: "I Have a Manuscript",
    body: "For authors who need editing, proofreading, formatting or design.",
  },
  {
    num: "03",
    title: "My Book Is Ready",
    body: "For authors who need publishing setup, distribution, marketing or relaunch support.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Services — horizontal track                                                 */
/* -------------------------------------------------------------------------- */

export const services = [
  {
    num: "01",
    title: "Writing and Ghostwriting",
    body: "Work with a writer who builds the book with you, from a first conversation to a complete, structured manuscript in your voice.",
    items: [
      "Outline and chapter plan",
      "Interview-based drafting",
      "Full ghostwriting",
      "Author coaching",
    ],
    slotLabel: "Manuscript pages, close-up",
    image: "/images/services/writing.webp",
    alt: "Fountain pen resting on a handwritten page",
  },
  {
    num: "02",
    title: "Editing and Proofreading",
    body: "Four levels of editing, applied to what your manuscript actually needs. You see every change and decide what stays.",
    items: ["Developmental editing", "Line editing", "Copyediting", "Proofreading"],
    slotLabel: "Marked-up proof pages",
    image: "/images/services/editing.webp",
    alt: "Red pen on a printed page being proofread",
  },
  {
    num: "03",
    title: "Book Cover and Interior Design",
    body: "Covers designed for the shelf and the thumbnail, with interiors typeset for comfortable reading in every format.",
    items: [
      "Cover and full spread",
      "Interior typesetting",
      "Print-ready files",
      "eBook conversion",
    ],
    slotLabel: "Hardcover mockup, front view",
    image: "/images/services/design.webp",
    alt: "Open book with its pages fanned out",
  },
  {
    num: "04",
    title: "Children’s Book Illustration",
    body: "Character design and full-colour spreads developed with you, page by page, from sketch to final art.",
    items: [
      "Character development",
      "Storyboard and sketches",
      "Full-colour spreads",
      "Cover artwork",
    ],
    slotLabel: "Children’s book interior spread",
    image: "/images/services/illustration.webp",
    alt: "Watercolour palette, brushes and a blank sketchbook",
  },
  {
    num: "05",
    title: "Publishing and Distribution",
    body: "Format preparation, identifiers, metadata and channel setup, explained in writing before anything is submitted.",
    items: [
      "eBook, paperback, hardcover",
      "ISBN and barcode guidance",
      "Metadata and categories",
      "Channel setup",
    ],
    slotLabel: "Printed books, stacked",
    image: "/images/services/publishing.webp",
    alt: "A stack of red hardcover books",
  },
  {
    num: "06",
    title: "Author Marketing and Branding",
    body: "Launch materials and an author presence that fit the book. No inflated promises about sales or rankings.",
    items: ["Author one-sheet", "Launch assets", "Author page and bio", "Review outreach kit"],
    slotLabel: "Launch materials flat-lay",
    image: "/images/services/marketing.webp",
    alt: "Laptop, notebook and phone laid out on a white desk",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Process                                                                     */
/* -------------------------------------------------------------------------- */

export const steps = [
  {
    num: "01",
    title: "Tell Us About Your Book",
    body: "Share the stage, genre and length. No manuscript required to start the conversation.",
  },
  {
    num: "02",
    title: "Receive a Project Assessment",
    body: "We read what you have and write down what the book needs, and what it does not.",
  },
  {
    num: "03",
    title: "Review the Scope and Agreement",
    body: "Deliverables, timeline, terms and ownership, all in writing before work begins.",
  },
  {
    num: "04",
    title: "Create and Refine the Book",
    body: "Drafting, editing, design and illustration in review rounds you approve.",
  },
  {
    num: "05",
    title: "Approve the Final Files",
    body: "You sign off on the interior, cover and metadata before anything is submitted.",
  },
  {
    num: "06",
    title: "Publish and Promote",
    body: "Formats prepared, channels set up, launch materials handed over to you.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Genres — horizontal track                                                   */
/* -------------------------------------------------------------------------- */

export const genres = [
  {
    label: "Fiction and novels",
    body: "Structural work on plot, pacing and point of view, then a cover built for its category shelf.",
    tags: ["Developmental editing", "Cover design"],
  },
  {
    label: "Memoirs and autobiographies",
    body: "Interview-led drafting and sensitive editing that keeps the voice of the person telling the story.",
    tags: ["Ghostwriting", "Line editing"],
  },
  {
    label: "Business and leadership",
    body: "Frameworks made legible: clear chapter architecture, diagrams and a professional interior.",
    tags: ["Outlining", "Hardcover"],
  },
  {
    label: "Self-help and personal development",
    body: "Exercises, worksheets and takeaways typeset so readers can actually use the book.",
    tags: ["Workbook layout"],
  },
  {
    label: "Children’s books",
    body: "Age-appropriate text length, character development and full-colour spreads planned around the page turn.",
    tags: ["Illustration", "Print colour"],
  },
  {
    label: "Poetry",
    body: "Line breaks and white space respected in typesetting; sequencing help where a collection needs shape.",
    tags: ["Typesetting"],
  },
  {
    label: "Faith-based and inspirational",
    body: "Careful handling of citation, scripture references and devotional structure.",
    tags: ["Reference checking"],
  },
  {
    label: "Educational books",
    body: "Curriculum-aware structure, figures, tables and indexes prepared for classroom use.",
    tags: ["Figures", "Index"],
  },
  {
    label: "Comics and graphic novels",
    body: "Script to panel: thumbnails, inking, lettering and print-ready page assembly.",
    tags: ["Panel art", "Lettering"],
  },
  {
    label: "Historical fiction",
    body: "Period research support, timeline consistency checks and jackets that signal the era at a glance.",
    tags: ["Fact checking", "Cover design"],
  },
  {
    label: "Cookbooks and lifestyle",
    body: "Recipe formatting, photography layout and interiors that hold up next to a stove.",
    tags: ["Photo layout", "Print colour"],
  },
  {
    label: "Science and technology",
    body: "Equations, figures and citations typeset cleanly, with technical review passes built in.",
    tags: ["Figures", "Citations"],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Work — filterable covers                                                    */
/* -------------------------------------------------------------------------- */

export const workFilters = [
  "All work",
  "Fiction",
  "Nonfiction",
  "Children’s",
  "Memoir",
  "Faith and inspiration",
  "Business",
  "Fantasy and romance",
] as const;

export const covers = [
  { title: "The Salt Road", meta: "Fiction · Hardcover, eBook", cat: "Fiction",
    image: "/images/covers/the-salt-road.webp",
    alt: "Cover of The Salt Road by Elena Varga" },
  { title: "Long Way from Kerrville", meta: "Memoir · Paperback", cat: "Memoir",
    image: "/images/covers/long-way-from-kerrville.webp",
    alt: "Cover of Long Way from Kerrville by R. Alvarez" },
  { title: "The Quiet Ledger", meta: "Business · Hardcover", cat: "Business",
    image: "/images/covers/the-quiet-ledger.webp",
    alt: "Cover of The Quiet Ledger by D. Marchetti" },
  {
    title: "Mabel and the Nine Moons",
    meta: "Children’s · Full colour",
    cat: "Children’s",
    image: "/images/covers/mabel-and-the-nine-moons.webp",
    alt: "Cover of Mabel and the Nine Moons by J. Okafor",
  },
  {
    title: "Ashes of the Ninth Court",
    meta: "Fantasy · Paperback, eBook",
    cat: "Fantasy and romance",
    image: "/images/covers/ashes-of-the-ninth-court.webp",
    alt: "Cover of Ashes of the Ninth Court by Owen Hartley",
  },
  {
    title: "Still Waters, Still Here",
    meta: "Faith · Paperback",
    cat: "Faith and inspiration",
    image: "/images/covers/still-waters-still-here.webp",
    alt: "Cover of Still Waters, Still Here by S. Bell",
  },
  {
    title: "Forty Weeks of Small Repairs",
    meta: "Nonfiction · Paperback",
    cat: "Nonfiction",
    image: "/images/covers/forty-weeks-of-small-repairs.webp",
    alt: "Cover of Forty Weeks of Small Repairs by Priya Menon",
  },
  { title: "What the River Kept", meta: "Fiction · Hardcover", cat: "Fiction",
    image: "/images/covers/what-the-river-kept.webp",
    alt: "Cover of What the River Kept by T. Nakamura" },
] as const;

/* -------------------------------------------------------------------------- */
/* Case studies                                                                */
/* -------------------------------------------------------------------------- */

export const cases = [
  {
    kicker: "Case study · Memoir",
    title: "Long Way from Kerrville",
    start: "Forty hours of recorded family interviews and no written draft.",
    challenge:
      "Turning oral history into a chronological narrative without flattening the narrator’s voice.",
    result:
      "A 68,000-word memoir in paperback and eBook, approved by the author before release.",
    stats: [
      { v: "68,000", l: "Words" },
      { v: "2", l: "Formats" },
      { v: "14 wks", l: "To press" },
    ],
    services: [
      "Ghostwriting",
      "Developmental + line editing",
      "Typesetting",
      "Paperback + eBook setup",
    ],
    quote: "They wrote it the way my father talked. That is the part I did not expect.",
    author: "R. Alvarez, author",
    slotLabel: "Memoir cover and interior",
    image: "/images/cases/long-way-from-kerrville.webp",
    alt: "Long Way from Kerrville cover beside an interior page",
  },
  {
    kicker: "Case study · Children’s",
    title: "Mabel and the Nine Moons",
    start: "A finished rhyming text with no illustrations and no page plan.",
    challenge:
      "Fitting 900 words to a 32-page format and developing a character that carries a series.",
    result: "A full-colour hardcover with a character sheet the author owns outright.",
    stats: [
      { v: "32", l: "Pages" },
      { v: "12", l: "Colour spreads" },
      { v: "100%", l: "Author-owned art" },
    ],
    services: [
      "Character development",
      "Full-colour spreads",
      "Cover artwork",
      "Hardcover setup",
    ],
    quote: "Mabel looks exactly like the drawing in my head, only better.",
    author: "J. Okafor, author",
    slotLabel: "Children’s hardcover mockup",
    image: "/images/cases/mabel-and-the-nine-moons.webp",
    alt: "Mabel and the Nine Moons hardcover on linen",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Testimonials                                                                */
/* -------------------------------------------------------------------------- */

export const testimonials = [
  {
    quote:
      "The developmental edit cut two chapters and the book finally moved. I approved every change.",
    name: "D. Marchetti",
    book: "The Quiet Ledger · Business",
  },
  {
    quote:
      "I kept my rights, my files and my royalties. They put all of it in the agreement before I paid anything.",
    name: "S. Bell",
    book: "Still Waters, Still Here · Faith",
  },
  {
    quote: "Six weeks from manuscript to a hardcover I was proud to hand to my mother.",
    name: "T. Nakamura",
    book: "What the River Kept · Fiction",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Articles                                                                    */
/* -------------------------------------------------------------------------- */

export const articles = [
  {
    tag: "Getting started",
    title: "How to Publish a Book for the First Time",
    body: "The decisions that come before the writing: format, budget, timeline and what you actually need help with.",
  },
  {
    tag: "Editing",
    title: "What Type of Editing Does Your Manuscript Need?",
    body: "Developmental, line, copyediting and proofreading: what each one changes, and the order they belong in.",
  },
  {
    tag: "Production",
    title: "Paperback vs. Hardcover: Which Should You Choose?",
    body: "Print costs, reader expectations by genre, and when producing both formats is worth it.",
  },
] as const;
