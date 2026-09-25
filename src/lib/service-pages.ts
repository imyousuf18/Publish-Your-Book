/**
 * Content for the six individual service pages (/services/[slug]) and the road
 * map on /services.
 *
 * Same rule as site.ts: every visible string lives in data, not in components.
 * This is a separate file only because six full pages of copy would triple the
 * size of site.ts. It imports from site.ts (never the reverse), and the short
 * facts each page leans on (the six `services`, the `covers`, the `cases`) are
 * still defined there once.
 *
 * Nothing in here invents a number, price, turnaround or client. Where a fact
 * is not in site.ts, the sentence is written so it stays true without one
 * ("you get a stage-by-stage schedule with your quote").
 *
 * Page shape, in journey order: hero → is it for you → what you get → how it is
 * done → how it begins and ends → proof → questions → next stop → start.
 */
import { services, type Faq, type JourneyId } from "./site";

export type ServiceSlug = (typeof services)[number]["slug"];

export type ServiceDetail = {
  slug: ServiceSlug;
  /** Which "Three ways in" question set the final call to action opens. */
  journey: JourneyId;
  /** One word for the road map and the progress rail. */
  stage: string;
  /** One line for the road map card on /services. */
  road: string;
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; title: string; em: string; lead: string };
  signals: { heading: string; intro: string; items: string[] };
  included: { heading: string; intro: string; items: { title: string; body: string }[] };
  process: { heading: string; em: string; intro: string; steps: { title: string; body: string }[] };
  begin: { heading: string; body: string; bring: string[]; send: string[] };
  finish: { heading: string; body: string; receive: string[] };
  portfolio: {
    heading: string;
    intro: string;
    /** Titles from `covers` in site.ts. Empty when there is nothing honest to show. */
    covers: string[];
    /** Index into `cases` in site.ts. */
    caseIndex?: number;
    /** Shown instead of, or beside, the work when it needs saying plainly. */
    note?: string;
    quote?: { text: string; name: string; book: string };
  };
  faqs: Faq[];
  related: ServiceSlug[];
  start: { title: string; em: string; body: string };
};

export const serviceDetails: ServiceDetail[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "book-ghostwriting",
    journey: "idea",
    stage: "Write",
    road: "From an idea to a structured manuscript, in your own voice.",
    seo: {
      title: "Book Ghostwriting Services",
      description:
        "Book ghostwriting services for memoir, business and non-fiction authors. Interview-led drafting in your voice, plus outlining and coaching if you want to write it yourself. You keep every right.",
      keywords: [
        "book ghostwriting services",
        "hire a ghostwriter for a book",
        "memoir ghostwriter",
        "business book ghostwriter",
        "author coaching",
      ],
    },
    hero: {
      eyebrow: "Writing and ghostwriting",
      title: "Book ghostwriting that still sounds like",
      em: "you.",
      lead: "Work with a professional book ghostwriter who builds the manuscript alongside you, from the first interview to a structured draft in your own voice. You stay the author, and the book and every right in it are yours.",
    },
    signals: {
      heading: "Is this the right place to start?",
      intro: "Ghostwriting and coaching suit authors who have the story or the expertise, and need help getting it onto the page.",
      items: [
        "You have a story or expertise worth a book, but not the hours to write a full manuscript.",
        "You can talk about it for hours, and freeze at a blank page.",
        "You have notes, recordings or a rough draft that never became a book.",
        "You would rather write it yourself, with someone to plan it and keep you moving.",
      ],
    },
    included: {
      heading: "What you get.",
      intro: "Take the whole book, or only the support you need. Each of these can be booked on its own.",
      items: [
        { title: "Outline and chapter plan", body: "A chapter-by-chapter structure agreed with you before drafting starts, so the book has a spine before it has sentences." },
        { title: "Interview-based drafting", body: "We interview you, or the people in your story, and draft from the recordings so the voice on the page is yours." },
        { title: "Full ghostwriting", body: "A writer drafts the whole manuscript in review rounds. You read, react and approve each part before the next begins." },
        { title: "Author coaching", body: "If you would rather write it yourself, regular sessions on structure, pacing and staying on schedule." },
        { title: "A fit for your genre", body: "Memoir, business and leadership, self-help and faith-based books each have their own conventions. The writer is matched to yours." },
        { title: "Your name, your rights", body: "You are the credited author. Ownership is set out in writing before drafting begins." },
      ],
    },
    process: {
      heading: "From the first conversation to the last",
      em: "chapter.",
      intro: "The same five steps on every ghostwriting project, with your approval before each one moves on.",
      steps: [
        { title: "Find the book", body: "We start with a conversation about who the book is for, what it should do for them and how you want to sound. Out of it comes a one-page brief." },
        { title: "Plan the structure", body: "A chapter plan with a short summary of each chapter. You change it until it is right, and drafting does not start until you approve it." },
        { title: "Capture your voice", body: "Recorded interviews, voice notes or samples of your own writing. We listen for how you phrase things, then write the way you talk." },
        { title: "Draft in rounds", body: "The manuscript arrives in sections. You read each one, mark what is off and we revise it before moving on." },
        { title: "Approve the manuscript", body: "When every chapter is signed off you have a complete manuscript, ready for editing or design." },
      ],
    },
    begin: {
      heading: "How it starts",
      body: "Tell us the idea, the reader and how far you have got. You do not need a manuscript. We reply within two working days with what we would suggest and what it would involve.",
      bring: [
        "The idea, in a paragraph or a page",
        "Any notes, recordings or drafts you already have",
        "Who the book is for",
        "A rough deadline, if there is one",
      ],
      send: [
        "A short written assessment of the project",
        "A recommended route: coaching, co-writing or full ghostwriting",
        "A scope and quote in writing, before any work begins",
      ],
    },
    finish: {
      heading: "How it ends",
      body: "You finish with a complete, structured manuscript that reads like you and belongs to you. From there it can go straight to editing, or wherever you choose.",
      receive: [
        "The complete manuscript in an editable format",
        "The approved chapter plan",
        "Any interview recordings and notes gathered along the way",
        "Written confirmation that the book and its rights are yours",
      ],
    },
    portfolio: {
      heading: "A memoir, from forty hours of recordings.",
      intro: "Long Way from Kerrville began as recorded family interviews and no written draft. It ended as a memoir the author approved before release.",
      covers: ["We All Have a Story! Here's Mine.", "And So It Is..."],
      caseIndex: 0,
    },
    faqs: [
      { q: "Will people know a ghostwriter wrote it?", a: "Only if you tell them. You are the credited author, and the agreement sets out who owns what before drafting begins." },
      { q: "Do I have to be a good talker?", a: "No. Interviews are conversations, not performances. We ask the questions and you answer at your own pace, and we shape what you say into chapters." },
      { q: "Can I get help planning the book and write it myself?", a: "Yes. Outlining and author coaching are available on their own, without full ghostwriting." },
      { q: "How long does a ghostwritten book take?", a: "It depends on the length and how much material you already have. You get a stage-by-stage schedule with your quote, before you agree to anything." },
      { q: "What kinds of books do you ghostwrite?", a: "Memoir, business and leadership, self-help and faith-based books are all part of what we do. Tell us what you have in mind and we will say honestly whether we are the right fit." },
    ],
    related: ["book-publishing"],
    start: {
      title: "Tell us about the book you want to",
      em: "write.",
      body: "A paragraph is enough. We read every enquiry ourselves and reply within two working days.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "book-editing",
    journey: "manuscript",
    stage: "Edit",
    road: "Four levels of editing, matched to what the manuscript needs.",
    seo: {
      title: "Book Editing Services",
      description:
        "Book editing services: developmental editing, line editing, copyediting and proofreading, matched to your manuscript. Every change is visible and you decide what stays.",
      keywords: [
        "book editing services",
        "developmental editing services",
        "manuscript editing services",
        "line editing vs copyediting",
        "book proofreading services",
      ],
    },
    hero: {
      eyebrow: "Editing and proofreading",
      title: "Editing that improves the book and keeps it",
      em: "yours.",
      lead: "Book editing matched to what your manuscript actually needs: developmental editing for structure, line editing for style, copyediting for accuracy and proofreading for the final polish. Every change is visible, and you decide what stays.",
    },
    signals: {
      heading: "Is this the right place to start?",
      intro: "Editing is worth the most when the writer stops being the only reader.",
      items: [
        "You have a finished draft and no one but you has read it critically.",
        "Something in the book is not working, and you cannot say what.",
        "You want a professional edit, not a spellcheck.",
        "You are unsure which level of editing you need, or which to pay for first.",
      ],
    },
    included: {
      heading: "What you get.",
      intro: "Four levels of editing, and an honest view of which ones your book needs. Each can be booked on its own.",
      items: [
        { title: "Developmental editing", body: "Structure, plot, argument, pacing and point of view. The big-picture edit, done first, with a written report on what to change and why." },
        { title: "Line editing", body: "Sentence-level work on style, clarity and flow, so the prose reads the way you meant it." },
        { title: "Copyediting", body: "Grammar, punctuation, consistency and factual accuracy, checked against a style sheet built for your book." },
        { title: "Proofreading", body: "The final pass on the finished layout for typos, spacing and formatting slips before anything goes to print." },
        { title: "Every change visible", body: "Edits arrive as tracked changes. Accept, reject or discuss each one." },
        { title: "An honest assessment", body: "We tell you which levels the manuscript needs, and which it does not, so you never pay for extras." },
      ],
    },
    process: {
      heading: "Five passes, in the order that",
      em: "works.",
      intro: "Editing levels belong in a set order. Polishing sentences in a chapter you later cut is money wasted, so structure comes first and proofreading comes last.",
      steps: [
        { title: "Assess the manuscript", body: "We read it and write down which levels of editing it needs and in what order. You may need one, or all four." },
        { title: "Developmental edit", body: "Structure first. You receive an editorial report and notes in the margins, then revise, or we do, depending on the scope." },
        { title: "Line edit", body: "Once the structure holds, we work sentence by sentence on style, rhythm and clarity, in tracked changes." },
        { title: "Copyedit", body: "Grammar, consistency and facts. We keep a style sheet so spellings, names and timelines stay consistent throughout." },
        { title: "Proofread", body: "A final read on the typeset pages, after design, catches what the earlier passes cannot see." },
      ],
    },
    begin: {
      heading: "How it starts",
      body: "Send the manuscript, or the first three chapters. We read before we quote, so the price reflects the work the book needs rather than a package tier.",
      bring: [
        "The manuscript in Word, PDF, RTF or ODT",
        "A rough word count",
        "What you are worried about",
        "Whether you plan to publish independently or submit to agents",
      ],
      send: [
        "An assessment of which levels of editing the book needs, and in what order",
        "A stage-by-stage schedule",
        "A written scope and quote before work begins",
      ],
    },
    finish: {
      heading: "How it ends",
      body: "You finish with a clean, consistent manuscript that you have approved line by line, ready for design or for submission.",
      receive: [
        "The edited manuscript with every change tracked",
        "A clean version with your accepted changes applied",
        "The style sheet for your book",
        "Your editorial report, if you had a developmental edit",
      ],
    },
    portfolio: {
      heading: "A book that finally moved.",
      intro: "Below, a memoir that went through developmental and line editing on its way to press, from first draft to finished manuscript.",
      covers: ["Broken Soul", "Facts Are Stubborn Things"],
      caseIndex: 0,
    },
    faqs: [
      { q: "Which type of editing does my manuscript need?", a: "Most manuscripts need some levels and not others. We read yours and tell you which, and in what order. The author guide has a plain comparison of the four." },
      { q: "Will you rewrite my book?", a: "No. An edit improves what you wrote. Every suggestion is explained, and nothing changes without your approval." },
      { q: "What is the difference between line editing and copyediting?", a: "Line editing works on style and flow, sentence by sentence. Copyediting corrects grammar, consistency and accuracy." },
      { q: "Do you edit manuscripts for agents and traditional publishers?", a: "Yes. We prepare manuscripts for submission as well as for independent publishing." },
      { q: "Can I book proofreading only?", a: "Yes. If the book has already been edited, proofreading on its own is often the sensible choice." },
    ],
    related: ["book-publishing"],
    start: {
      title: "Send us the manuscript, and we will say what it",
      em: "needs.",
      body: "Send the whole thing, or the first three chapters. We read it and tell you honestly which levels of editing it needs.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "book-cover-design",
    journey: "manuscript",
    stage: "Design",
    road: "Covers built for the shelf and the thumbnail, interiors built to be read.",
    seo: {
      title: "Book Cover and Interior Design",
      description:
        "Book cover design services and interior typesetting for paperback, hardcover and eBook. Covers built for the shelf and the thumbnail, with print-ready files and eBook conversion.",
      keywords: [
        "book cover design services",
        "book interior design",
        "book typesetting",
        "eBook conversion",
        "book formatting services",
      ],
    },
    hero: {
      eyebrow: "Cover and interior design",
      title: "Covers and interiors that belong on the",
      em: "shelf.",
      lead: "Book cover design and interior typesetting for print and screen: a cover that works on a shelf and as a thumbnail, and an interior set so the book is comfortable to read from the first page to the last.",
    },
    signals: {
      heading: "Is this the right place to start?",
      intro: "Design is what a reader judges before they read a word, so it is worth getting right.",
      items: [
        "You want a cover that looks like a book in its genre, not a template.",
        "Your interior is a Word document that needs to become a book.",
        "You need print-ready files for paperback or hardcover, and an eBook.",
        "You are relaunching a book with a new cover.",
      ],
    },
    included: {
      heading: "What you get.",
      intro: "Cover and interior can be booked together or separately.",
      items: [
        { title: "Cover and full spread", body: "Front, spine and back designed as one piece, sized to your printer’s specification." },
        { title: "Interior typesetting", body: "Fonts, margins, chapter openers, headers and page numbers chosen for the genre, so it reads like a published book." },
        { title: "Print-ready files", body: "Files prepared to print specification for paperback and hardcover." },
        { title: "eBook conversion", body: "A clean, reflowable eBook that reads well across devices." },
        { title: "Made for the thumbnail", body: "The cover is checked at the size a reader first sees it on a retail page, not only at full size." },
        { title: "Layouts for special books", body: "Workbooks, cookbooks, poetry and illustrated books each need their own interior. We set them to fit." },
      ],
    },
    process: {
      heading: "From the first concept to the final",
      em: "file.",
      intro: "You approve the cover before the interior is set, and the interior before any file is finalised.",
      steps: [
        { title: "Brief and genre research", body: "We read the book and look at what sits on its category shelf, so the cover signals the right genre at a glance." },
        { title: "Cover concepts", body: "You see distinct directions rather than three versions of one idea. Choose one, or tell us what to combine." },
        { title: "Refine the cover", body: "Type, imagery and colour are refined in rounds until you approve the front. Then we build the spine and back." },
        { title: "Typeset the interior", body: "Trim size, fonts and layout are set for your genre and formats. You review proof pages before the whole book is set." },
        { title: "Prepare the final files", body: "Print-ready PDFs for paperback and hardcover, and an eBook file, all checked before you sign off." },
      ],
    },
    begin: {
      heading: "How it starts",
      body: "Send the manuscript, or a summary if it is still in progress, and tell us where the book will be sold. You do not need to know your trim size or format yet.",
      bring: [
        "The manuscript, or a synopsis",
        "The formats you want: paperback, hardcover, eBook",
        "Covers you admire, and covers you do not",
        "Any existing artwork, logo or author photo",
      ],
      send: [
        "A design brief for you to confirm",
        "Concept directions for the cover",
        "A schedule and quote in writing",
      ],
    },
    finish: {
      heading: "How it ends",
      body: "You approve the final cover and interior before anything is submitted. Then you receive every finished file, in every format.",
      receive: [
        "Print-ready cover and interior files",
        "Your eBook file",
        "Web-size cover images for your website and retailer pages",
        "Ownership of every finished file",
      ],
    },
    portfolio: {
      heading: "Covers and interiors we have finished.",
      intro: "A selection of the books we designed. Filter them by genre on the work page.",
      covers: [
        "And So It Is...",
        "The Nanny",
        "Embers",
        "Lucy and the Enchanted Forest",
        "The Rule of Three",
        "The Brangus Rebellion",
        "Facts Are Stubborn Things",
        "Voodoo War",
      ],
      caseIndex: 1,
    },
    faqs: [
      { q: "Can I book the cover without the interior?", a: "Yes. Either can be booked on its own." },
      { q: "Do I get to choose the cover?", a: "Yes. You approve every stage, and nothing goes to print without your sign-off." },
      { q: "Which formats do you prepare?", a: "Paperback, hardcover and eBook, each to its own specification." },
      { q: "Can you redesign a book that is already published?", a: "Yes. A relaunch with a new cover is part of our ‘My Book Is Ready’ journey." },
      { q: "Will the cover work as a thumbnail?", a: "That is part of the brief. We check the design at the size a browser shows it on a retail page." },
    ],
    related: ["book-publishing", "book-marketing"],
    start: {
      title: "Let us design the book they will",
      em: "pick up.",
      body: "Send the manuscript or a summary and tell us the formats you want. We reply within two working days.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "childrens-book-illustration",
    journey: "manuscript",
    stage: "Illustrate",
    road: "Characters and full-colour spreads, developed page by page.",
    seo: {
      title: "Children’s Book Illustration",
      description:
        "Children’s book illustration services: character design, storyboards, full-colour spreads and cover artwork, developed with you page by page. The finished artwork is yours.",
      keywords: [
        "children's book illustrator",
        "children's book illustration services",
        "picture book illustration",
        "character design for children's books",
      ],
    },
    hero: {
      eyebrow: "Children’s book illustration",
      title: "Illustration that gives your characters a life beyond",
      em: "the page.",
      lead: "Children’s book illustration from first sketch to final art: character design, storyboard and full-colour spreads developed with you, page by page. The artwork is yours, and so is the character.",
    },
    signals: {
      heading: "Is this the right place to start?",
      intro: "Illustration is where a picture book is won or lost, and where it helps to have a plan.",
      items: [
        "You have a finished or nearly finished text and no illustrations.",
        "You want a character who could carry a series.",
        "You need a picture book planned to a standard 32-page format.",
        "You want to see sketches before any final art is painted.",
      ],
    },
    included: {
      heading: "What you get.",
      intro: "The whole book, or a single stage of it. Each part can be booked on its own.",
      items: [
        { title: "Character development", body: "A character sheet showing your character in the poses and expressions the story needs, used as the reference for every page." },
        { title: "Storyboard and sketches", body: "A page-by-page plan showing pacing, page turns and where each picture sits, before final art begins." },
        { title: "Full-colour spreads", body: "Finished illustrations developed spread by spread, in a style agreed with you at the start." },
        { title: "Cover artwork", body: "A cover illustration that matches the interior and stands out among its neighbours on the shelf." },
        { title: "Text and image, together", body: "Layout that places your words around the art so the book reads well aloud." },
        { title: "Colour prepared for print", body: "Artwork set up so the printed pages look the way they do on your screen." },
      ],
    },
    process: {
      heading: "From the first sketch to the final",
      em: "spread.",
      intro: "Picture books are planned before they are painted. You see sketches first, when changes are cheap.",
      steps: [
        { title: "Read the text and plan the pages", body: "We fit the story to its format. A picture book is usually 32 pages, so pacing and page turns are planned before anything is drawn." },
        { title: "Develop the characters", body: "You see character sketches and choose the direction. The final character sheet becomes the reference for every page." },
        { title: "Storyboard the book", body: "Thumbnail sketches of every spread, so you can judge pacing and page turns while changes are still easy." },
        { title: "Paint the spreads", body: "Full-colour spreads are developed page by page, with your feedback at each stage." },
        { title: "Finish the cover and files", body: "Cover artwork, interior layout and print-ready files, all checked before you sign off." },
      ],
    },
    begin: {
      heading: "How it starts",
      body: "Send the text and tell us who the book is for and what age. If you already have ideas for the characters, or images you love, send those too.",
      bring: [
        "The finished text, or a near-final draft",
        "The age range you are writing for",
        "Ideas, reference images or characters you like",
        "Your preferred format and trim size, if you know it",
      ],
      send: [
        "A page plan for your story",
        "Character directions to choose from",
        "A schedule and quote in writing",
      ],
    },
    finish: {
      heading: "How it ends",
      body: "You finish with a complete illustrated book, and a character sheet you can use for the next one.",
      receive: [
        "Every finished illustration",
        "The character sheet",
        "Cover artwork",
        "Print-ready files for the interior and the cover",
        "Full ownership of the artwork",
      ],
    },
    portfolio: {
      heading: "From a rhyming text to a character who can carry a series.",
      intro: "Mabel and the Nine Moons began as a finished text with no illustrations and no page plan.",
      covers: ["Lucy and the Enchanted Forest", "Roy Rooster: The Brave Little Soul", "Great Grandma Loves Me!"],
      caseIndex: 1,
    },
    faqs: [
      { q: "Do I own the illustrations?", a: "Yes. The artwork belongs to the author, and the agreement says so before work begins." },
      { q: "Can I see sketches before final art?", a: "Yes. You approve the character designs and the storyboard before any spread is painted." },
      { q: "How many illustrations does a picture book need?", a: "It depends on the format. A standard picture book runs to 32 pages, and we plan the page count with you." },
      { q: "Can you illustrate a book I have already written?", a: "Yes. Starting from a finished text is common, and it is how the Mabel case study began." },
      { q: "Can you also publish the book?", a: "Yes. Illustration, layout, print setup and distribution can run as one project, or you can take the art elsewhere." },
    ],
    related: ["book-marketing"],
    start: {
      title: "Tell us about the story you want to",
      em: "illustrate.",
      body: "Send the text, or a summary of it, and tell us who it is for. We reply within two working days.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "book-publishing",
    journey: "ready",
    stage: "Publish",
    road: "Formats, ISBNs, metadata and retailer setup, all in your name.",
    seo: {
      title: "Book Publishing and Distribution",
      description:
        "Self-publishing services and book distribution: paperback, hardcover and eBook setup, ISBN registration in your name, metadata and retailer setup. You keep every right and every royalty.",
      keywords: [
        "self-publishing company",
        "book distribution services",
        "book publishing services",
        "ISBN registration for authors",
        "publish a book independently",
      ],
    },
    hero: {
      eyebrow: "Publishing and distribution",
      title: "Publish it properly, and keep every",
      em: "right.",
      lead: "Format preparation, ISBNs, metadata and retailer setup for paperback, hardcover and eBook. We do the setup and explain each step in writing before anything is submitted, and you stay the publisher of record.",
    },
    signals: {
      heading: "Is this the right place to start?",
      intro: "Publishing is mostly rules and details. It is easy to get one wrong, and hard to undo.",
      items: [
        "Your book is finished and you are not sure what comes next.",
        "You want to publish independently without learning every retailer’s rules.",
        "You want to be the publisher of record, with your own ISBN.",
        "Your book is already out, and you want it set up properly or relaunched.",
      ],
    },
    included: {
      heading: "What you get.",
      intro: "Everything needed to get a finished book in front of readers, with nothing added to pad the quote.",
      items: [
        { title: "eBook, paperback, hardcover", body: "Each format prepared to its own specification, so you can offer readers a choice." },
        { title: "ISBN and barcode guidance", body: "Identifiers registered in your name, so you remain the publisher of record." },
        { title: "Metadata and categories", body: "Title, description, keywords and subject categories written to help the right readers find the book." },
        { title: "Channel setup", body: "Your book set up with major retailers, with each step explained in writing before anything is submitted." },
        { title: "Approval before release", body: "You sign off the files and every listing detail before anything goes live." },
        { title: "Everything in your name", body: "The ISBN and files are yours, and every royalty is paid to you." },
      ],
    },
    process: {
      heading: "From finished files to a live",
      em: "listing.",
      intro: "Each step is explained in writing first, and nothing is submitted until you have approved it.",
      steps: [
        { title: "Check the files", body: "We review the final manuscript, cover and interior against each format’s requirements, and flag anything that would be rejected." },
        { title: "Register the identifiers", body: "ISBNs and barcodes are set up in your name for each format." },
        { title: "Write the metadata", body: "Description, keywords and categories are drafted for your approval. This is what retailers show to readers." },
        { title: "Set up the channels", body: "We set your book up with major retailers, explaining each step in writing before it is submitted." },
        { title: "Approve and release", body: "You sign off the listing details and files, and then the book goes live." },
      ],
    },
    begin: {
      heading: "How it starts",
      body: "Tell us the formats you want and where the book is now. If the files are not ready, we can prepare them first.",
      bring: [
        "The final manuscript, cover and interior, or the books that still need them",
        "The formats you want",
        "The publishing name or imprint you want to use",
        "Any existing ISBN or retailer listing",
      ],
      send: [
        "A checklist of what the book still needs",
        "A written plan for each format and channel",
        "A quote before anything is submitted",
      ],
    },
    finish: {
      heading: "How it ends",
      body: "Your book is live in the formats you chose, with the details you approved, and everything is in your name.",
      receive: [
        "Live listings for each format",
        "Your ISBNs and barcodes",
        "The final files for every format",
        "A summary of what was set up and where",
      ],
    },
    portfolio: {
      heading: "Books taken all the way to print and eBook.",
      intro: "One case study follows a book from the first conversation to paperback and eBook, and shows what changed on the way.",
      covers: [
        "We All Have a Story! Here's Mine.",
        "Lucy and the Enchanted Forest",
        "The Assassin's Betrayal",
        "Think Big Live",
      ],
      caseIndex: 0,
    },
    faqs: [
      { q: "Do I need an ISBN?", a: "For print books sold through retailers, yes. We can register one in your name so you remain the publisher of record." },
      { q: "Who is the publisher of record?", a: "You are. The ISBN is registered in your name, so the book is yours to publish, and to take elsewhere." },
      { q: "Do you take a share of royalties?", a: "No. You pay for the work once. Every royalty is yours." },
      { q: "Where will my book be sold?", a: "We set it up with major retailers. The channels are agreed in writing before anything is submitted." },
      { q: "Can I take the book elsewhere later?", a: "Yes. The files, the ISBN and the rights are yours, and we will hand over what you need." },
    ],
    related: ["book-cover-design"],
    start: {
      title: "Tell us where the book is, and we will plan the",
      em: "rest.",
      body: "Tell us the formats you want and where the book is now. We reply within two working days.",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "book-marketing",
    journey: "ready",
    stage: "Promote",
    road: "Launch materials and an author presence that fit the book.",
    seo: {
      title: "Book Marketing and Author Branding",
      description:
        "Book marketing services for authors: author one-sheet, launch assets, author page and bio, and a review outreach kit. Practical launch support with no inflated promises.",
      keywords: [
        "book marketing services for authors",
        "author branding",
        "book launch plan",
        "author one-sheet",
        "book review outreach",
      ],
    },
    hero: {
      eyebrow: "Author marketing and branding",
      title: "Launch materials that look and sound like the",
      em: "book.",
      lead: "Book marketing for authors who want a practical launch: the materials, the author page and the outreach kit, all built around the book. We make no promises about sales or rankings, because no one can honestly make them.",
    },
    signals: {
      heading: "Is this the right place to start?",
      intro: "A launch does not need a huge budget. It needs the right materials, ready before release day.",
      items: [
        "The book is done and you do not know how to tell readers about it.",
        "You have no author page, bio or one-sheet that a reviewer could use.",
        "You want a launch plan you can run yourself.",
        "Your book is out, and it never had a proper launch.",
      ],
    },
    included: {
      heading: "What you get.",
      intro: "Practical work, matched to the book. Each part can be booked on its own.",
      items: [
        { title: "Author one-sheet", body: "A single page for reviewers, booksellers and event hosts: the book, the author, and why it matters." },
        { title: "Launch assets", body: "Graphics, copy and announcements sized for the places you will post, ready before launch day." },
        { title: "Author page and bio", body: "A page and a bio that tell readers who you are and where to find the book." },
        { title: "Review outreach kit", body: "The materials you need to approach reviewers: a pitch, a review-copy plan and a short description of the book." },
        { title: "Launch plan", body: "A timeline for the weeks around release, so you know what to do and when." },
      ],
    },
    process: {
      heading: "From the first brief to the launch",
      em: "plan.",
      intro: "Everything is built from the book outwards, so the materials sound like it and not like a template.",
      steps: [
        { title: "Understand the book and its reader", body: "We read the book and agree who it is for, what it offers them and where those readers already are." },
        { title: "Build the core materials", body: "Book description, author bio and one-sheet: the pieces every other asset draws on." },
        { title: "Create the launch assets", body: "Graphics, announcements and posts sized for each place you will use them, in one consistent look." },
        { title: "Prepare the outreach", body: "The review outreach kit: a pitch, a review-copy plan and what a reviewer needs to know." },
        { title: "Hand over the plan", body: "A launch timeline and everything above, handed to you so you can run it and adapt it." },
      ],
    },
    begin: {
      heading: "How it starts",
      body: "Tell us about the book, who you think will read it and when it comes out. If it is already out, tell us what has been tried.",
      bring: [
        "The book, or its final files",
        "Who you think the readers are",
        "Your release date, or where the book is now",
        "Any existing author website, social pages or reviews",
      ],
      send: [
        "An assessment of what the launch needs",
        "A list of materials and a schedule",
        "A quote in writing before work begins",
      ],
    },
    finish: {
      heading: "How it ends",
      body: "You finish with launch materials that look like the book, and a plan you understand well enough to run yourself.",
      receive: [
        "Your author one-sheet",
        "Launch graphics and copy",
        "Your author page and bio",
        "The review outreach kit",
        "A launch timeline",
      ],
    },
    portfolio: {
      heading: "Built around each book.",
      intro: "Launch materials are written for one book and one author, so there is no template to show you.",
      covers: [],
      note: "Ask us and we will talk you through what a launch kit for your kind of book contains. The books we have worked on are on the work page.",
    },
    faqs: [
      { q: "Can you guarantee sales?", a: "No, and be wary of anyone who does. We build materials and a plan that give the book a fair chance, and we are honest about what marketing can and cannot do." },
      { q: "Do you run my social media?", a: "The service covers the materials and the plan rather than day-to-day posting. Ask us if you want something more." },
      { q: "Is it too late if my book is already published?", a: "No. A relaunch with fresh materials, or a new cover, is part of our ‘My Book Is Ready’ journey." },
      { q: "When should I start?", a: "Before the book is finished, ideally. The materials take time to prepare, and reviewers need notice." },
    ],
    related: ["book-cover-design"],
    start: {
      title: "Tell us about the book, and we will plan its",
      em: "launch.",
      body: "Tell us the release date, or where the book stands now. We reply within two working days.",
    },
  },
];

const bySlug = new Map(serviceDetails.map((d) => [d.slug as string, d]));

export const serviceSlugs = serviceDetails.map((d) => d.slug);

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return bySlug.get(slug);
}

/** The service in `services` (title, image, items) that a detail page belongs to. */
export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/** Previous and next stop on the road, in the order the six services appear. */
export function getNeighbours(slug: string) {
  const i = serviceDetails.findIndex((d) => d.slug === slug);
  return {
    index: i,
    total: serviceDetails.length,
    prev: i > 0 ? serviceDetails[i - 1] : undefined,
    next: i >= 0 && i < serviceDetails.length - 1 ? serviceDetails[i + 1] : undefined,
  };
}
