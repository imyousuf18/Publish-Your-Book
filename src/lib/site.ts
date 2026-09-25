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
    "Full-service book publishing in Chicago, Illinois: ghostwriting, editing, cover design and distribution. You keep every right and every royalty.",
  url: resolveSiteUrl(),
  email: "info@publishyourbook.us",
  location: "Chicago, Illinois",
  /** Registered / mailing address. Used on the legal pages and in structured data. */
  address: {
    line1: "3525 W Peterson Avenue, Suite 400",
    city: "Chicago",
    region: "IL",
    regionName: "Illinois",
    postalCode: "60659",
    country: "US",
  },
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "Genres", href: "/genres" },
];

/** Secondary destinations, shown in the navigation capsule's "More" menu. */
export const moreLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Author guide", href: "/author-guide" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Writing and ghostwriting", href: "/services/book-ghostwriting" },
      { label: "Editing and proofreading", href: "/services/book-editing" },
      { label: "Cover and interior design", href: "/services/book-cover-design" },
      { label: "Children’s book illustration", href: "/services/childrens-book-illustration" },
      { label: "Publishing and distribution", href: "/services/book-publishing" },
      { label: "Author marketing", href: "/services/book-marketing" },
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
      { label: "Author guide", href: "/author-guide" },
      { label: "Case studies", href: "/case-studies" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The hero argues one thing: the author makes the calls, we do the craft. Its
 * toolbar lets the reader restyle the headline, so the words say the same.
 *
 * `title` is the line printed on the loader's book cover (and the previous
 * hero, HeroShelf); `headline` is the live hero's. Kept apart so the loader
 * stays as it is when the hero's words change.
 */
export const hero = {
  eyebrow: "Independent publishing, your final say",
  title: "Your book deserves better than a template.",
  headline: "A book made with you, not for you.",
  body: "You bring the manuscript, or the idea. We bring the editors, designers and distribution, and every choice comes to you: the edit, the cover, the type. Nothing prints without your yes, and every right and royalty stays yours.",
  primaryCta: { label: "Start your book", href: "/contact" },
  secondaryCta: { label: "See where you decide", href: "/process" },
} as const;

/**
 * The three covers standing in the hero, named from `covers` below so there is
 * one source for the artwork. Chosen to look unlike each other at a glance:
 * a thriller, a children's book and a fantasy title.
 */
export const heroShelf = [
  "The Nanny",
  "Lucy and the Enchanted Forest",
  "Embers",
] as const;

/**
 * The homepage's short "a few, then go see the rest" preview of the Work
 * section (see `Work`'s `preview` prop) — different three from `heroShelf`
 * so the same covers don't repeat twice on one page.
 */
export const homeCovers = [
  "And So It Is...",
  "The Rule of Three",
  "Roy Rooster: The Brave Little Soul",
] as const;

/**
 * What the hero argues once the headline has landed.
 *
 * This replaced a rail of the five stages. Those words are printed on the
 * loader's book and listed again by the Process section, so the most valuable
 * strip on the page was spending itself on a third repetition instead of the
 * things that actually separate us from a packager.
 */
/**
 * The hero's type toolbar, after orionix.framer.website, whose hero headline
 * can be restyled live from a formatting bar under it. Ours hands the reader
 * the choices a typesetter makes on every page — size, weight, slant,
 * underline, ink — as a small proof of the headline's promise: on your book,
 * the calls are yours.
 *
 * Inks are taken from the covers on the hero (slate from The Nanny, indigo
 * from Lucy and the Enchanted Forest) plus our readable orange; every one is
 * at least 5:1 on the hero ground, so any combination stays legible.
 */
export const heroEditor = {
  levels: [
    { id: "h1", label: "Heading 1", short: "H1" },
    { id: "h2", label: "Heading 2", short: "H2" },
    { id: "h3", label: "Heading 3", short: "H3" },
  ],
  inks: [
    { id: "ink", label: "Ink", value: "#1d1e22" },
    { id: "rust", label: "Rust", value: "#9e4606" },
    { id: "spruce", label: "Spruce", value: "#203a3c" },
    { id: "indigo", label: "Indigo", value: "#1f2b57" },
  ],
  /** Shown before anything is changed. Kept to one line on a phone. */
  idle: "Try it. On your book, every call is yours.",
  /** After the one-time demo: the hand-over. Short enough for one line on a phone. */
  invite: "Your turn: style this headline",
  /** Appended to the description once something is changed. */
  coda: "your book, your call.",
  timeZone: "America/Chicago",
} as const;

export type HeroLevel = (typeof heroEditor.levels)[number]["id"];
export type HeroInk = (typeof heroEditor.inks)[number]["id"];

export const heroProof = [
  { title: "Every right, every royalty", body: "Yours. We publish under your name, not ours." },
  { title: "Read before quoted", body: "We price the book in front of us, not a package tier." },
  { title: "Nothing bundled", body: "Take one service or all six. No padding." },
] as const;

/**
 * The five stages printed on the book's leaves in the loader animation.
 *
 * `note` is the RECTO (the right-hand page you read before the turn) and
 * `detail` is the VERSO (the back of that same leaf, which lands on the left
 * after it turns). They must stay DIFFERENT: the verso used to repeat the
 * recto word for word, so every stage was read twice in a row and the turn
 * looked like the same page flipping twice.
 */
export const stages = [
  {
    word: "Write",
    note: "Outlining, coaching and ghostwriting that keeps your voice.",
    detail: "You approve the outline before a word is drafted, then every chapter as it lands.",
  },
  {
    word: "Edit",
    note: "Developmental, line, copyediting and proofreading.",
    detail: "Four levels, applied to what the manuscript actually needs. You decide what stays.",
  },
  {
    word: "Design",
    note: "Covers and interiors set for print and screen.",
    detail: "Cover, interior and the print-ready files, proofed on the stock the book will use.",
  },
  {
    word: "Illustrate",
    note: "Characters, scenes and artwork for younger readers.",
    detail: "Character sheets first, then roughs, then the finished spreads.",
  },
  {
    word: "Publish",
    note: "Formats, metadata and distribution setup.",
    detail: "An ISBN in your name, metadata written for the shelf, and distribution checked.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Journeys — the three entry points, shown as a sticky stack                   */
/* -------------------------------------------------------------------------- */

export const journeys = [
  {
    id: "idea",
    num: "01",
    title: "I Have an Idea",
    body: "You have the premise, the notes or a few chapters. We help you plan the book, coach you through it, or write it with you in your own voice.",
    cta: "Start with your idea",
  },
  {
    id: "manuscript",
    num: "02",
    title: "I Have a Manuscript",
    body: "The draft is done. We edit it, proofread it, format it and design the cover and interior, so it reads like a finished book.",
    cta: "Send your manuscript",
  },
  {
    id: "ready",
    num: "03",
    title: "My Book Is Ready",
    body: "The book is finished. We set up publishing and distribution, build the launch materials, or relaunch a book that never found its readers.",
    cta: "Plan your launch",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Services — horizontal track                                                 */
/* -------------------------------------------------------------------------- */

export const services = [
  {
    num: "01",
    title: "Writing and Ghostwriting",
    body: "Work with a writer who builds the book alongside you, from the first conversation to a structured manuscript that sounds like you and no one else.",
    slug: "book-ghostwriting",
    short: "Ghostwriting",
    cta: "Ask about ghostwriting",
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
    body: "From developmental editing to proofreading, matched to what your manuscript actually needs. Every change is visible and you decide what stays.",
    slug: "book-editing",
    short: "Editing",
    cta: "Ask about editing",
    items: ["Developmental editing", "Line editing", "Copyediting", "Proofreading"],
    slotLabel: "Marked-up proof pages",
    image: "/images/services/editing.webp",
    alt: "Red pen on a printed page being proofread",
  },
  {
    num: "03",
    title: "Book Cover and Interior Design",
    body: "Covers built to work on a shelf and as a thumbnail, with interiors typeset so the book is comfortable to read in every format.",
    slug: "book-cover-design",
    short: "Design",
    cta: "Ask about design",
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
    body: "A children’s book illustrator who develops your characters and paints full-colour spreads with you, page by page, from first sketch to final art.",
    slug: "childrens-book-illustration",
    short: "Illustration",
    cta: "Ask about illustration",
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
    body: "Print and eBook formats, ISBNs, metadata and retailer setup, with each step explained in writing before anything is submitted.",
    slug: "book-publishing",
    short: "Publishing",
    cta: "Ask about publishing",
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
    body: "Launch materials and an author presence that fit the book. Practical work, with no promises about sales or rankings.",
    slug: "book-marketing",
    short: "Marketing",
    cta: "Ask about marketing",
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
    body: "Tell us the genre, the length and where the book stands. You do not need a manuscript to start the conversation.",
  },
  {
    num: "02",
    title: "Receive a Project Assessment",
    body: "We read what you have and write down what the book needs, and what it does not, so you never pay for extras.",
  },
  {
    num: "03",
    title: "Review the Scope and Agreement",
    body: "Deliverables, timeline, terms and ownership go in writing before any work begins. If something is wrong, we change it.",
  },
  {
    num: "04",
    title: "Create and Refine the Book",
    body: "Drafting, editing, design and illustration happen in review rounds. Nothing moves on until you approve it.",
  },
  {
    num: "05",
    title: "Approve the Final Files",
    body: "You sign off on the interior, the cover and the metadata before anything is submitted anywhere.",
  },
  {
    num: "06",
    title: "Publish and Promote",
    body: "We prepare the formats, set up the channels and hand over the launch materials. The files stay yours.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Genres — horizontal track                                                   */
/* -------------------------------------------------------------------------- */

export const genres = [
  {
    id: "fiction",
    label: "Fiction and novels",
    body: "Structural editing for plot, pacing and point of view, then a cover built to sit on its category shelf.",
    tags: ["Developmental editing", "Cover design"],
  },
  {
    id: "memoir",
    label: "Memoirs and autobiographies",
    body: "Memoir ghostwriting and editing drafted from interviews, so the book keeps the voice of the person telling the story.",
    tags: ["Ghostwriting", "Line editing"],
  },
  {
    id: "business",
    label: "Business and leadership",
    body: "Business book ghostwriting and editing that turn frameworks into clear chapters, with diagrams and a professional interior.",
    tags: ["Outlining", "Hardcover"],
  },
  {
    id: "self-help",
    label: "Self-help and personal development",
    body: "Exercises, worksheets and takeaways edited and typeset so readers can actually use the book.",
    tags: ["Workbook layout"],
  },
  {
    id: "childrens",
    label: "Children’s books",
    body: "Age-appropriate text length, character development and full-colour spreads planned around the page turn.",
    tags: ["Illustration", "Print colour"],
  },
  {
    id: "poetry",
    label: "Poetry",
    body: "Line breaks and white space respected in typesetting, with sequencing help where a collection needs shape.",
    tags: ["Typesetting"],
  },
  {
    id: "faith",
    label: "Faith-based and inspirational",
    body: "Careful handling of citations, scripture references and devotional structure for faith-based and inspirational books.",
    tags: ["Reference checking"],
  },
  {
    id: "education",
    label: "Educational books",
    body: "Curriculum-aware structure, figures, tables and indexes, prepared for classroom use.",
    tags: ["Figures", "Index"],
  },
  {
    id: "comics",
    label: "Comics and graphic novels",
    body: "Graphic novel publishing from script to panel: thumbnails, inking, lettering and print-ready page assembly.",
    tags: ["Panel art", "Lettering"],
  },
  {
    id: "historical-fiction",
    label: "Historical fiction",
    body: "Period research support, timeline checks and jackets that signal the era at a glance.",
    tags: ["Fact checking", "Cover design"],
  },
  {
    id: "cookbooks",
    label: "Cookbooks and lifestyle",
    body: "Recipe formatting, photography layout and cookbook interiors that hold up next to a stove.",
    tags: ["Photo layout", "Print colour"],
  },
  {
    id: "science-tech",
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

/**
 * The real portfolio: 28 published covers. Titles, categories and author
 * credits are as published; where a cover carries no visible author credit,
 * the alt text describes the cover without inventing one.
 */
export const covers = [
  { title: "And So It Is...", meta: "Memoir · Cover design", cat: "Memoir",
    image: "/images/covers/and-so-it-is.webp",
    alt: "Memoir book cover design for And So It Is... by Jamie Lynn Sigler" },
  { title: "The Madness behind the Mask", meta: "Nonfiction · Cover design", cat: "Nonfiction",
    image: "/images/covers/the-madness-behind-the-mask.webp",
    alt: "Nonfiction book cover design for The Madness behind the Mask by Gwyn Devereaux" },
  { title: "The Madness behind the Gavel-Justice", meta: "Nonfiction · Cover design", cat: "Nonfiction",
    image: "/images/covers/the-madness-behind-the-gavel-justice.webp",
    alt: "Nonfiction book cover design for The Madness behind the Gavel-Justice by Gwyn Devereaux" },
  { title: "We All Have a Story! Here's Mine.", meta: "Memoir · Cover design", cat: "Memoir",
    image: "/images/covers/we-all-have-a-story-heres-mine.webp",
    alt: "Memoir book cover design for We All Have a Story! Here's Mine. by Maurice Chandler" },
  { title: "Dispensing Pills Popping Pills", meta: "Memoir · Cover design", cat: "Memoir",
    image: "/images/covers/dispensing-pills-popping-pills.webp",
    alt: "Memoir book cover design for Dispensing Pills Popping Pills by Brooke Forsythe, RN" },
  { title: "Becoming Glitch", meta: "Fantasy · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/becoming-glitch.webp",
    alt: "Fantasy novel book cover design for Becoming Glitch by Daniel Sayre" },
  { title: "Voodoo War", meta: "Fantasy · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/voodoo-war.webp",
    alt: "Fantasy novel book cover design for Voodoo War by Nate Stack" },
  { title: "The Strange Case of Guaritori Diolco", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/the-strange-case-of-guaritori-diolco.webp",
    alt: "Fiction novel book cover design for The Strange Case of Guaritori Diolco by Bill Hiatt" },
  { title: "Embers", meta: "Fantasy · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/embers.webp",
    alt: "Fantasy novel book cover design for Embers by C.J. Shaffer" },
  { title: "The Assassin's Betrayal", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/the-assassins-betrayal.webp",
    alt: "Fiction novel book cover design for The Assassin's Betrayal by Auston King" },
  { title: "The Assassin's Shadow", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/the-assassins-shadow.webp",
    alt: "Fiction novel book cover design for The Assassin's Shadow by Auston King" },
  { title: "Broken Soul", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/broken-soul.webp",
    alt: "Fiction novel book cover design for Broken Soul by Kevin Wallace" },
  { title: "The Nanny", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/the-nanny.webp",
    alt: "Fiction novel book cover design for The Nanny by A.J. Rivers" },
  { title: "Turn to Home", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/turn-to-home.webp",
    alt: "Fiction novel book cover design for Turn to Home by Kate Bold" },
  { title: "Facts Are Stubborn Things", meta: "Nonfiction · Cover design", cat: "Nonfiction",
    image: "/images/covers/facts-are-stubborn-things.webp",
    alt: "Nonfiction book cover design for Facts Are Stubborn Things by Richard A. Danzig" },
  { title: "Missing", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/missing.webp",
    alt: "Fiction novel book cover design for Missing by Dianne Scott" },
  { title: "The Brangus Rebellion", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/the-brangus-rebellion.webp",
    alt: "Fiction novel book cover design for The Brangus Rebellion by R.R. Corvi" },
  { title: "Dark Island", meta: "Fiction · Cover design", cat: "Fiction",
    image: "/images/covers/dark-island.webp",
    alt: "Fiction novel book cover design for Dark Island by Matt James" },
  { title: "A Guide to Getting Lost", meta: "Fantasy and romance · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/a-guide-to-getting-lost.webp",
    alt: "Romance novel book cover design for A Guide to Getting Lost by Ashley Witkowski" },
  { title: "The Rule of Three", meta: "Fantasy and romance · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/the-rule-of-three.webp",
    alt: "Fantasy romance book cover design for The Rule of Three by Sara Cate" },
  { title: "The Quiescent Hunter", meta: "Fantasy and romance · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/the-quiescent-hunter.webp",
    alt: "Fantasy romance book cover design for The Quiescent Hunter by Luna Larkin" },
  { title: "Forbidden Fate", meta: "Fantasy and romance · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/forbidden-fate.webp",
    alt: "Fantasy romance book cover design for Forbidden Fate by Jezebel Thorne" },
  { title: "Craving His Captive", meta: "Fantasy and romance · Cover design", cat: "Fantasy and romance",
    image: "/images/covers/craving-his-captive.webp",
    alt: "Romance novel book cover design for Craving His Captive by Jezebel Thorne" },
  { title: "Roy Rooster: The Brave Little Soul", meta: "Children’s · Cover design", cat: "Children’s",
    image: "/images/covers/roy-rooster-the-brave-little-soul.webp",
    alt: "Children's book cover design for Roy Rooster: The Brave Little Soul by Jess Phillips" },
  { title: "Great Grandma Loves Me!", meta: "Children’s · Cover design", cat: "Children’s",
    image: "/images/covers/great-grandma-loves-me.webp",
    alt: "Children's book cover design for Great Grandma Loves Me!" },
  { title: "Who Likes to Brush His Teeth?", meta: "Children’s · Cover design", cat: "Children’s",
    image: "/images/covers/who-likes-to-brush-his-teeth.webp",
    alt: "Children's book cover design for Who Likes to Brush His Teeth? by Libi Ashkenazy Nosov" },
  { title: "Lucy and the Enchanted Forest", meta: "Children’s · Cover design", cat: "Children’s",
    image: "/images/covers/lucy-and-the-enchanted-forest.webp",
    alt: "Children's book cover design for Lucy and the Enchanted Forest by Z.P. Anthony Williams" },
  { title: "Think Big Live", meta: "Children’s · Cover design", cat: "Children’s",
    image: "/images/covers/think-big-live.webp",
    alt: "Children's book cover design for Think Big Live by Kat Kronenberg" },
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

/* Full article content moved to lib/articles.ts (it outgrew a teaser list —
   each entry is now a complete guide with its own page at
   /author-guide/[slug]). ArticlesList reads from there. */

/* -------------------------------------------------------------------------- */
/* Inner pages                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Masthead copy for every inner page. The heading renders as `title` followed
 * by `em` in italic — the one emphasised phrase per heading the design uses.
 */
export const pageHeroes = {
  services: {
    eyebrow: "Services",
    title: "Six services. Take the whole book, or one",
    em: "part of it.",
    body: "Every service has its own page, so you can see what it includes, how the work is done and what you finish with. Book one, or take the whole road from idea to launch.",
  },
  process: {
    eyebrow: "Process",
    title: "How a manuscript becomes a",
    em: "book.",
    body: "The same six stages for every title, with a named person at each one and your sign-off before anything moves forward.",
  },
  work: {
    eyebrow: "Work",
    title: "Covers, interiors and",
    em: "finished books.",
    body: "A selection of titles we have edited, designed and published. Filter by the kind of book you are writing.",
  },
  genres: {
    eyebrow: "Genres",
    title: "Fiction, non-fiction and",
    em: "everything between.",
    body: "Each genre has its own conventions for length, trim size, cover and shelf. We work to them rather than around them.",
  },
  about: {
    eyebrow: "About",
    title: "An independent imprint that works for the",
    em: "author.",
    body: "We edit, design and publish books for people who want them done properly, and who want to keep their rights while we do it.",
  },
  cases: {
    eyebrow: "Case studies",
    title: "What happened between the draft and the",
    em: "shelf.",
    body: "Two books followed from first conversation to print: what the author brought, what changed, and how it went.",
  },
  guide: {
    eyebrow: "Author guide",
    title: "Know what you are buying",
    em: "before you buy it.",
    body: "Plain answers on editing, rights, pricing and distribution. The things worth understanding before you spend anything on a book.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us about the book you are",
    em: "making.",
    body: "Where it is now and what you want it to become. A paragraph is enough to start, and we reply within two working days.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Priced by the manuscript,",
    em: "not by the package.",
    body: "Every book is quoted individually after we have read it. These are the three ways authors usually work with us.",
  },
} as const;

export type PageHeroContent = (typeof pageHeroes)[keyof typeof pageHeroes];

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const aboutStory = {
  heading: "Publishing without the fine print.",
  paragraphs: [
    "Too many authors pay to publish and find out afterwards that the contract kept their rights, the edit was a spellcheck and the cover came from a template. Publish Your Book exists to do the opposite.",
    "We are a small team of editors, designers and publishing specialists in Chicago, Illinois. Every book is handled by people who have read it, and every decision is explained before it is made.",
    "You own the finished files, the ISBN and every royalty. If you want to take the book elsewhere tomorrow, you can, and we will hand over what you need to do it.",
  ],
} as const;

export const values = [
  {
    title: "Your rights stay yours",
    body: "No rights grab and no royalty share. The book, the files and the income belong to you.",
  },
  {
    title: "Read before we quote",
    body: "We read the manuscript before pricing it, so the quote reflects the work the book needs rather than a package tier.",
  },
  {
    title: "Nothing is bundled",
    body: "Take one service or all six. We never add anything to a quote to make it look bigger.",
  },
  {
    title: "You sign off every stage",
    body: "Nothing moves forward without your approval, and you can see every change before it is made final.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Pricing. No figures on purpose: every book is quoted after it is read.      */
/* -------------------------------------------------------------------------- */

export const plans = [
  {
    name: "Single service",
    summary: "One part of the process, done properly.",
    audience: "For authors who have most of the book handled and need one specialist.",
    includes: [
      "Any one of the six services",
      "A named editor or designer",
      "Two rounds of revisions",
      "Print-ready or submission-ready files",
    ],
    cta: "Ask about a service",
    featured: false,
  },
  {
    name: "Manuscript to book",
    summary: "Editing, design and publishing in one run.",
    audience: "For finished manuscripts that need to become a professional book.",
    includes: [
      "Editing matched to what the manuscript needs",
      "Cover and full interior design",
      "ISBN, metadata, print and eBook formats",
      "Distribution setup with major retailers",
      "One project lead from start to launch",
    ],
    cta: "Get a quote",
    featured: true,
  },
  {
    name: "Idea to launch",
    summary: "The whole journey, from the first outline.",
    audience: "For authors starting from an idea, notes or a partial draft.",
    includes: [
      "Outlining, coaching or full ghostwriting",
      "Everything in Manuscript to book",
      "Launch and marketing plan",
      "Support after launch",
    ],
    cta: "Talk it through",
    featured: false,
  },
] as const;

/** The points where the book waits for the author, drawn from the six stages. */
export const approvals = [
  { title: "Scope and agreement", body: "Deliverables, timeline, terms and ownership are agreed in writing before any work begins." },
  { title: "Every round of edits", body: "Tracked changes let you accept, reject or discuss each one before it is made final." },
  { title: "Cover and interior", body: "You approve the cover direction and the interior design before the files are finished." },
  { title: "Final files and metadata", body: "Nothing is submitted to a retailer until you have signed off the files and the listing details." },
] as const;

export const pricingFactors = [
  { title: "Length", body: "Editing and typesetting are priced on word count and page count." },
  { title: "Condition", body: "A clean manuscript needs a lighter edit than an early draft." },
  { title: "Illustration", body: "Full-colour and illustrated books take more design time than text." },
  { title: "Formats", body: "Paperback, hardback, eBook and audiobook each need their own files." },
] as const;

/* -------------------------------------------------------------------------- */
/* FAQs, grouped by the page they appear on                                   */
/* -------------------------------------------------------------------------- */

export type Faq = { q: string; a: string };

export const faqs: Record<"services" | "process" | "pricing" | "guide", Faq[]> = {
  services: [
    { q: "Can I book just one service?", a: "Yes. Every service can be booked on its own, and we never add anything to a quote to make it look bigger." },
    { q: "Do you work with self-published authors?", a: "Most of our authors publish independently. We also prepare manuscripts for submission to agents and traditional publishers." },
    { q: "Will the book still sound like me?", a: "That is the point of a good edit. We explain every suggested change and you decide what stays." },
    { q: "Where do I start if I am not sure what I need?", a: "Start with the three ways in above, or send us a paragraph about where the book is now. We will point you to the right service, even if the answer is a single one." },
    { q: "What are the four levels of editing?", a: "Developmental editing looks at structure, plot and pacing. Line editing works on style and flow. Copyediting corrects grammar and consistency. Proofreading is the final check for typos and formatting. Most books need some of these, not all four." },
  ],
  process: [
    { q: "How long does a book take?", a: "It depends on length and condition: a clean manuscript moves faster than an early draft. You get a stage-by-stage schedule with your quote, before you agree to anything." },
    { q: "Who will I work with?", a: "A named project lead, plus the editor and designer assigned to your book. You are never passed to a queue." },
    { q: "What if I disagree with an edit?", a: "You approve every stage. Tracked changes let you accept, reject or discuss each one." },
    { q: "Do I need a finished manuscript to start?", a: "No. Authors start from an idea, notes, part of a draft or a finished book. Tell us where you are and we will suggest where to begin." },
  ],
  pricing: [
    { q: "Why are there no prices listed?", a: "Two books of the same length can need very different work. We read the manuscript first, then quote for what it actually needs." },
    { q: "Do you take a share of royalties?", a: "No. You pay for the work once. Every royalty is yours." },
    { q: "How do payments work?", a: "Payment is split across the stages of the project, so you never pay for work that has not started. The schedule is written into your agreement." },
    { q: "Can I start with one service and add more later?", a: "Yes. Nothing locks you in, so you can start with an edit or a cover and add other services when you are ready." },
  ],
  guide: [
    { q: "Do I need an ISBN?", a: "For print books sold through retailers, yes. We can register one in your name so you remain the publisher of record." },
    { q: "What is the difference between line editing and copyediting?", a: "Line editing works on style and flow, sentence by sentence. Copyediting corrects grammar, consistency and accuracy." },
    { q: "Should I publish independently or traditionally?", a: "It depends on your goals, timeline and genre. We will talk it through honestly, even if the answer is not to work with us." },
    { q: "What's the difference between a publishing services company and a vanity press?", a: "A vanity press typically keeps your rights, bundles services you may not need, and earns from the author paying rather than the book selling. We charge for the work, add nothing you have not agreed to, and you keep every right and royalty from day one." },
  ],
};

/* -------------------------------------------------------------------------- */
/* Journey forms: the pop-up opened from each "Three ways in" card             */
/* -------------------------------------------------------------------------- */

/**
 * One form, three question sets. Every submission carries `journey`, so the
 * team always knows which card the author clicked. Name, email and a free
 * "anything else" box are shared and added by the component; only the
 * questions that differ between journeys are listed here.
 */
export type JourneyId = "idea" | "manuscript" | "ready";

export type JourneyField =
  | { kind: "text" | "url" | "number" | "date"; name: string; label: string; hint?: string; required?: boolean }
  | { kind: "textarea"; name: string; label: string; hint?: string; required?: boolean; rows?: number }
  | { kind: "select" | "radio"; name: string; label: string; hint?: string; required?: boolean; options: readonly string[] }
  | { kind: "checkboxes"; name: string; label: string; hint?: string; required?: boolean; options: readonly string[] }
  | { kind: "file"; name: string; label: string; hint?: string; required?: boolean; accept: string; maxMb: number };

const genreOptions = [
  "Fiction",
  "Non-fiction",
  "Memoir or biography",
  "Children's book",
  "Business or self-help",
  "Poetry",
  "Other or not sure",
] as const;

export const journeyForms: Record<
  JourneyId,
  { title: string; intro: string; submit: string; fields: readonly JourneyField[] }
> = {
  idea: {
    title: "Tell us about your idea",
    intro: "No manuscript needed. A few sentences about the book you want to write is enough for us to suggest a way in.",
    submit: "Send my idea",
    fields: [
      { kind: "textarea", name: "idea", label: "What is the book about?", hint: "The premise, the argument or the story, in a few sentences.", required: true, rows: 5 },
      { kind: "select", name: "genre", label: "What kind of book is it?", options: genreOptions, required: true },
      { kind: "radio", name: "progress", label: "How far along are you?", options: ["Just the idea", "Notes or an outline", "Some chapters drafted"], required: true },
      { kind: "checkboxes", name: "help", label: "What help are you looking for?", hint: "Choose any that apply.", options: ["Planning and outlining", "Writing coaching", "Full ghostwriting", "Not sure yet"], required: true },
      { kind: "select", name: "timeline", label: "When would you like to start?", options: ["As soon as possible", "In the next three months", "Later this year", "Just exploring"] },
    ],
  },
  manuscript: {
    title: "Send us your manuscript",
    intro: "Upload the manuscript, or the first three chapters, and tell us what you want done with it. We read it before we quote.",
    submit: "Send my manuscript",
    fields: [
      { kind: "file", name: "manuscript", label: "Manuscript", hint: "Word, PDF, RTF or ODT, up to 25 MB. The first three chapters are fine.", accept: ".doc,.docx,.pdf,.rtf,.odt", maxMb: 25, required: true },
      { kind: "text", name: "title", label: "Working title" },
      { kind: "select", name: "genre", label: "Genre", options: genreOptions, required: true },
      { kind: "number", name: "wordCount", label: "Approximate word count", hint: "A rough figure is fine." },
      { kind: "radio", name: "stage", label: "Where is the manuscript now?", options: ["First draft", "Revised draft", "Finished and self-edited", "Already professionally edited"], required: true },
      { kind: "checkboxes", name: "help", label: "What do you need?", hint: "Choose any that apply.", options: ["Developmental editing", "Line editing", "Copyediting", "Proofreading", "Cover design", "Interior design", "Publishing and distribution"], required: true },
      { kind: "radio", name: "goal", label: "How do you plan to publish?", options: ["Publish independently", "Submit to agents or publishers", "Not decided yet"] },
    ],
  },
  ready: {
    title: "Tell us about your book",
    intro: "Your book is finished or already out. Tell us where it is and what you want to happen next.",
    submit: "Send my details",
    fields: [
      { kind: "text", name: "title", label: "Book title", required: true },
      { kind: "select", name: "genre", label: "Genre", options: genreOptions, required: true },
      { kind: "radio", name: "status", label: "Where is the book now?", options: ["Finished, not yet published", "Published independently", "Published traditionally, rights returned"], required: true },
      { kind: "url", name: "link", label: "Link to the book", hint: "A retailer or website page, if it is already out." },
      { kind: "checkboxes", name: "help", label: "What do you need?", hint: "Choose any that apply.", options: ["Distribution setup", "Launch plan", "Marketing", "Relaunch with a new cover", "Audiobook or new formats"], required: true },
      { kind: "date", name: "launchDate", label: "Target launch date", hint: "Leave blank if you do not have one." },
    ],
  },
};
