/**
 * Full content for the Author Guide articles (/author-guide/[slug]).
 *
 * Same rule as site.ts, service-pages.ts and legal.ts: every visible string
 * lives in data, not in components. `ArticlesList` (shown on both the
 * homepage and /author-guide) renders the teaser fields — `tag`, `title`,
 * `dek` — from `articleIndex` below; the full body lives in `articles`,
 * keyed by the same `slug`.
 *
 * Nothing here invents a number, price, timeline or company fact that isn't
 * already established elsewhere on the site (the six services, the six-stage
 * process, the genres list, "quoted per manuscript"). Where a real article
 * would normally cite a statistic, this instead explains the factors that
 * decide the answer — the same "read before we quote" honesty the rest of
 * the site holds to.
 */
import type { ServiceSlug } from "./service-pages";

export type ArticleSection = { heading: string; body: string; list?: string[] };

export type Article = {
  slug: string;
  tag: string;
  title: string;
  /** One-line summary: the teaser body on ArticlesList, and the hero dek. */
  dek: string;
  seo: { description: string; keywords: string[] };
  intro: string;
  sections: ArticleSection[];
  takeaways: string[];
  /** Where this article naturally hands the reader off. */
  related: { service?: ServiceSlug; path?: string; label: string };
  /** Shown in the homepage's shorter "Read this before you spend anything" list. */
  featuredHome: boolean;
};

/** All ten were published the same day; kept as one constant rather than
 *  guessed per-article dates. */
export const publishedDate = { iso: "2026-09-25", label: "September 25, 2026" };

export const articles: Article[] = [
  {
    slug: "how-to-publish-a-book-for-the-first-time",
    tag: "Getting started",
    title: "How to Publish a Book for the First Time",
    dek: "The decisions that come before the writing: format, budget, timeline and the help you actually need.",
    seo: {
      description:
        "A first-time author's guide to publishing a book: the decisions to make before you write a word, what self-publishing actually involves, and how to decide what help you need.",
      keywords: ["how to publish a book for the first time", "self publishing guide", "first time author"],
    },
    intro:
      "Every first book runs into the same question before the writing even starts: what does \"publishing a book\" actually involve? Not the mechanics of uploading a file — the decisions that come before that, which shape everything after.",
    sections: [
      {
        heading: "Decide what \"finished\" means for your book",
        body: "A finished book is not just a finished draft. It is an edited manuscript, a cover and interior built for its genre, a format or three, and a way for readers to find and buy it. Knowing this upfront stops a common trap: treating the manuscript as the whole project, then discovering editing, design and distribution are each their own piece of work with their own timeline.",
      },
      {
        heading: "Work out your starting point, honestly",
        body: "First-time authors usually sit in one of three places: an idea with no manuscript, a manuscript with no edit, or a finished book with no plan to publish it. Each one needs a different first step. If you are not sure which describes you, that uncertainty is itself useful information — it usually means an outside read of where the project actually stands is worth more than guessing.",
      },
      {
        heading: "Set a real budget before you set a deadline",
        body: "Cost is driven by length, condition and how many services the book needs — not by a flat industry rate, because there isn't one. Before you commit to a launch date, get a sense of what your specific manuscript will need. Our guide to what moves a quote up or down is a reasonable place to start.",
      },
      {
        heading: "Choose independence or the traditional route early",
        body: "Self-publishing and traditional publishing are different businesses, not just different processes, and the choice affects your budget, timeline and how much control you keep. It's worth deciding this before you invest heavily in either direction — see our comparison of what actually changes between the two.",
      },
      {
        heading: "Get one honest read before you spend anything",
        body: "The fastest way to a wasted quarter is guessing what your manuscript needs and buying the wrong service first. A short, specific read of your first three chapters — what stage the book is at, what it needs, what it doesn't — costs you nothing and saves you from paying for work you didn't need yet.",
      },
    ],
    takeaways: [
      "\"Finished\" means edited, designed and distributable — not just drafted.",
      "Know honestly whether you have an idea, a manuscript, or a finished book.",
      "Budget for what your manuscript specifically needs, not an industry average.",
      "Decide self-publishing vs. traditional before investing heavily in either.",
    ],
    related: { path: "/services", label: "See all six services" },
    featuredHome: true,
  },

  {
    slug: "do-you-keep-the-rights-to-your-book",
    tag: "Rights and ownership",
    title: "Do You Keep the Rights to Your Book When You Hire a Publishing Company?",
    dek: "What \"you keep every right and every royalty\" means in practice, and the questions to ask before you sign any publishing agreement.",
    seo: {
      description:
        "Who owns your book after you hire a publishing services company? What rights and royalties actually mean, and the exact questions to ask before signing any agreement.",
      keywords: [
        "do I keep the rights to my self-published book",
        "who owns the rights when you hire a ghostwriter",
        "book publishing rights",
      ],
    },
    intro:
      "This is the single most important question to ask before you hire anyone to help publish your book, and it's the one authors ask least often — usually because they assume the answer is obviously yes.",
    sections: [
      {
        heading: "\"Rights\" means more than one thing",
        body: "Copyright is the legal ownership of the work itself. Royalties are the income the book earns. The ISBN determines who is recorded as the book's publisher of record. A service provider can hold any combination of these without saying so plainly, so ask about all three separately, not just \"do I own my book.\"",
      },
      {
        heading: "Read the agreement before you read the pitch",
        body: "A sales conversation can promise anything. The agreement is what actually governs the relationship. Before you pay anything, get the ownership terms in writing: who holds copyright, who is the publisher of record on the ISBN, and what happens to your files if you decide to leave.",
      },
      {
        heading: "Watch for language about \"exclusive\" rights",
        body: "Some publishing agreements ask for exclusive rights to distribute or license your work, sometimes for a fixed term, sometimes indefinitely. That is a materially different arrangement from a service provider simply doing work you own outright. Neither is automatically wrong, but you should know which one you are signing.",
      },
      {
        heading: "Ask what happens if you want to leave",
        body: "A fair test of any publishing relationship: can you take your files, your ISBN and your manuscript elsewhere if you're not happy? If the honest answer is no, or it's unclear, that tells you more about the arrangement than anything in the sales material.",
      },
      {
        heading: "How this works with us",
        body: "You keep every right and every royalty, at every stage, and it's written into the agreement before any work begins — not as a policy we mention, but as a term you can hold us to. If you ever want to take your book and its files elsewhere, we hand over what you need to do it.",
      },
    ],
    takeaways: [
      "Copyright, royalties and publisher-of-record status are three separate things — ask about each.",
      "Get ownership terms from the written agreement, not the sales conversation.",
      "\"Exclusive rights\" clauses are a real, different arrangement — read for them specifically.",
      "A fair publisher lets you leave with your files if you want to.",
    ],
    related: { path: "/about", label: "Read how we work" },
    featuredHome: true,
  },

  {
    slug: "what-type-of-editing-does-your-manuscript-need",
    tag: "Editing",
    title: "What Type of Editing Does Your Manuscript Need?",
    dek: "Developmental, line, copyediting and proofreading: what each one changes, and the order they belong in.",
    seo: {
      description:
        "The four levels of book editing explained: what developmental editing, line editing, copyediting and proofreading each actually change, and the order to do them in.",
      keywords: [
        "what type of editing does my manuscript need",
        "developmental editing vs line editing",
        "line editing vs copyediting",
      ],
    },
    intro:
      "\"Editing\" is not one service. It's four, and they do different jobs in a specific order — which is why paying for the wrong one first is the most common way authors waste money on their manuscript.",
    sections: [
      {
        heading: "Developmental editing: does the book work?",
        body: "This is structural: plot, pacing, argument, point of view, whether the chapters are in the right order. It happens first, because there is no point polishing sentences in a chapter you later decide to cut. A developmental edit usually comes back as a written report plus notes, not a line-by-line markup.",
      },
      {
        heading: "Line editing: does it read well?",
        body: "Once the structure holds, line editing works sentence by sentence on style, rhythm and clarity — the difference between a sentence that's technically correct and one that actually reads well. This is where a manuscript starts to sound like a finished book rather than a strong draft.",
      },
      {
        heading: "Copyediting: is it consistent and correct?",
        body: "Grammar, punctuation, consistency and fact-checking. A copyeditor works from a style sheet built for your specific book, so a character's eye colour or a timeline detail doesn't quietly change halfway through.",
      },
      {
        heading: "Proofreading: is the final file clean?",
        body: "The last pass, done on the typeset pages after design — not before. Proofreading catches what every earlier stage cannot see, because it's the first read of the book in its actual final layout.",
      },
      {
        heading: "You probably don't need all four",
        body: "Most manuscripts need some of these levels, not all of them, and the order matters more than the number. A manuscript with a strong structure but rough prose needs line editing, not another developmental pass. This is exactly why we read before we quote — see what's included in editing and proofreading.",
      },
    ],
    takeaways: [
      "Structure first: developmental editing, before any sentence-level work.",
      "Line editing is style and flow; copyediting is grammar and consistency.",
      "Proofreading happens last, on the final typeset pages, not the manuscript.",
      "Most books need some of the four levels, not all of them.",
    ],
    related: { service: "book-editing", label: "See what's included in editing" },
    featuredHome: false,
  },

  {
    slug: "self-publishing-vs-traditional-publishing",
    tag: "Getting started",
    title: "Self-Publishing vs. Traditional Publishing: What Actually Changes",
    dek: "Who owns the rights, who is paid first, how long each route takes and how to choose the one that fits your book.",
    seo: {
      description:
        "Self-publishing vs. traditional publishing, compared honestly: who owns the rights, who gets paid and when, how long each route takes, and how to choose.",
      keywords: [
        "self publishing vs traditional publishing",
        "should I self publish or find a publisher",
        "independent publishing vs traditional",
      ],
    },
    intro:
      "This decision gets treated as a referendum on whether your book is good enough for a \"real\" publisher. It isn't. It's a practical choice between two different businesses, with different trade-offs that have nothing to do with the quality of your writing.",
    sections: [
      {
        heading: "Who owns what, and who decides",
        body: "Traditionally published authors typically license rights to a publisher for a term, in exchange for an advance and a smaller royalty percentage; the publisher controls cover, title, release date and pricing. Self-published (or independently published) authors keep their rights and royalties outright, and keep control of every creative decision — in exchange for funding and managing the work themselves.",
      },
      {
        heading: "Money moves in opposite directions",
        body: "Traditional publishing pays you an advance, then royalties once the advance earns out — you're paid first, and paid less per copy after that. Independent publishing has no advance: you pay for the editing, design and production, and you keep a far larger share of what the book actually earns.",
      },
      {
        heading: "Timelines are not close",
        body: "Traditional publishing runs through agent submission, an acquisition process, and typically a year or more from signed deal to release. Independent publishing moves at the pace of the work itself — the manuscript's condition and the services it needs, not a publisher's seasonal catalogue.",
      },
      {
        heading: "Access is the real dividing line",
        body: "Traditional publishers are selective, and getting an offer is genuinely difficult regardless of how strong the manuscript is. Independent publishing has no gatekeeper to get past — which is a benefit and a responsibility at once, since the quality bar doesn't disappear, it just becomes yours to hold.",
      },
      {
        heading: "There is no universally right answer",
        body: "A business book meant to establish authority fast usually favours independent publishing's speed and control. A novel aiming for major bookstore placement and traditional review coverage may be better served chasing a traditional deal, patience permitting. The honest answer depends on your book and your goals, which is a conversation worth having before you commit to either path.",
      },
    ],
    takeaways: [
      "Traditional: an advance, a smaller royalty share, and the publisher decides.",
      "Independent: no advance, you fund the work, you keep the rights and the royalties.",
      "Traditional timelines run a year or more; independent moves at the manuscript's pace.",
      "The right choice depends on your book's goals, not on which route is more prestigious.",
    ],
    related: { service: "book-publishing", label: "See publishing and distribution" },
    featuredHome: false,
  },

  {
    slug: "paperback-vs-hardcover",
    tag: "Production",
    title: "Paperback vs. Hardcover: Which Should You Choose?",
    dek: "Print costs, reader expectations by genre, and when producing both formats is worth it.",
    seo: {
      description:
        "Paperback vs. hardcover: how print costs differ, what readers expect by genre, and when it's worth producing both formats for your book.",
      keywords: ["paperback vs hardcover", "should I print my book as hardcover", "book format choice"],
    },
    intro:
      "This looks like a simple preference question. It's actually a genre-and-budget question, and getting it wrong is an easy way to make a book feel like the wrong kind of object for its readers.",
    sections: [
      {
        heading: "What each format signals",
        body: "Hardcover reads as a gift, a keepsake, or a serious work — literary fiction, memoir, illustrated children's books and reference titles lean hardcover for exactly this reason. Paperback reads as accessible and disposable in the best sense: genre fiction, self-help and most nonfiction that people expect to read once and pass along leans paperback.",
      },
      {
        heading: "Cost runs in both directions",
        body: "Hardcover print costs more per unit, which either raises the cover price or narrows your margin. It usually reads as more premium to a browsing reader, which can support that higher price — but only if the genre expectation supports a hardcover in the first place.",
      },
      {
        heading: "Match the format to how the book will be used",
        body: "A workbook or a cookbook that will be opened flat and written in behaves differently in hardcover versus paperback binding. A book meant to travel in a bag every day has different durability needs than one that sits on a shelf. Think about the reader's actual use of the object, not just its cover.",
      },
      {
        heading: "eBook changes the calculation, not the decision",
        body: "Almost every book benefits from an eBook edition regardless of its print format — it's a different reader, a different price point, and a different way to distribute. The paperback-versus-hardcover choice still matters for the print edition; the eBook question is a separate, near-universal yes.",
      },
      {
        heading: "When both formats earn their cost",
        body: "Producing both is worth it when the genre supports a hardcover's premium positioning and there's also demand for an accessible, lower-cost paperback — literary fiction and memoir are common cases. For a straightforward genre novel or a practical nonfiction title, one well-chosen format is usually the better use of the budget.",
      },
    ],
    takeaways: [
      "Hardcover signals keepsake and premium; paperback signals accessible and portable.",
      "Hardcover costs more per unit — make sure the genre supports that price.",
      "Match the format to how a reader will actually use the physical book.",
      "An eBook edition is almost always worth adding, regardless of the print format.",
    ],
    related: { service: "book-cover-design", label: "See cover and interior design" },
    featuredHome: false,
  },

  {
    slug: "how-much-does-it-cost-to-publish-a-book",
    tag: "Pricing",
    title: "How Much Does It Cost to Publish a Book?",
    dek: "What moves a quote up or down: length, condition, illustration and format, explained plainly.",
    seo: {
      description:
        "What actually drives the cost of publishing a book: manuscript length and condition, illustration, formats, and how to get a quote that reflects what your book needs.",
      keywords: [
        "how much does it cost to publish a book",
        "book publishing pricing",
        "self publishing cost breakdown",
      ],
    },
    intro:
      "There's no honest flat number for this, and anyone who gives you one before reading your manuscript is guessing. What follows is what actually moves the number, so you can reason about your own book instead of hunting for an average.",
    sections: [
      {
        heading: "Length sets the baseline",
        body: "Editing and typesetting are generally priced against word count or page count, because both scale with how much text there actually is to work through. A 40,000-word novella and a 120,000-word novel are different jobs at every stage, not just at printing.",
      },
      {
        heading: "Condition matters more than length",
        body: "A clean, well-structured manuscript needs a lighter edit than an early draft with structural issues — and that difference in condition can move the cost more than a difference in length does. This is the whole reason a real quote comes after a read, not before one.",
      },
      {
        heading: "Illustration changes the math entirely",
        body: "Full-colour and illustrated books — children's books especially — take considerably more design and production time than text-only manuscripts, because every spread is its own piece of original art rather than a layout template applied to text.",
      },
      {
        heading: "Formats each need their own setup",
        body: "Paperback, hardcover, eBook and audiobook are not variations on one file — each needs its own preparation, from typesetting to file specification to distribution setup. Producing more formats is more work, not just more printing.",
      },
      {
        heading: "The only honest way to get a real number",
        body: "We quote per manuscript, after we've read it, for exactly this reason: two books of the same length can need genuinely different work. If you want a number that means something, send us the first three chapters and we'll tell you what your specific book needs.",
      },
    ],
    takeaways: [
      "Length sets a baseline; the manuscript's condition moves the number more.",
      "Illustrated and full-colour books take significantly more production time.",
      "Every format — paperback, hardcover, eBook, audiobook — needs its own setup work.",
      "A real quote comes after someone has actually read your manuscript.",
    ],
    related: { path: "/pricing", label: "See how pricing works" },
    featuredHome: true,
  },

  {
    slug: "how-to-find-and-hire-a-ghostwriter",
    tag: "Ghostwriting",
    title: "How to Find and Hire a Ghostwriter (Without Losing Your Story)",
    dek: "What a ghostwriter actually does, the questions worth asking before you hire one, and how to keep the book sounding like you.",
    seo: {
      description:
        "How to find and hire a ghostwriter: what the role actually involves, the questions to ask before you commit, and how to make sure the finished book still sounds like you.",
      keywords: ["how to find a ghostwriter", "hire a ghostwriter for a book", "book ghostwriting services"],
    },
    intro:
      "The fear underneath this whole decision is usually the same one: will the finished book actually sound like me, or like a stranger's idea of me? That's a fair worry, and it's answerable with the right process.",
    sections: [
      {
        heading: "A ghostwriter is not a stenographer or a co-author",
        body: "The job is to take what's in your head — the story, the argument, the expertise — and draft it in a structure and voice that reads as you, even though you didn't type every sentence. That's different from dictation, and different from a collaborator who adds their own ideas to the book.",
      },
      {
        heading: "Voice comes from interviews, not instructions",
        body: "A good ghostwriter captures how you actually talk — your phrasing, your rhythm, the things you circle back to — from real conversation, not from a style brief. If a ghostwriter isn't proposing to interview you at length before drafting, that's worth asking about directly.",
      },
      {
        heading: "Ask about the plan before the price",
        body: "Is there an outline or chapter plan you approve before drafting starts? Do you see the manuscript in sections, so you can catch a wrong turn early rather than at the end? Ask these before asking what it costs — the answers tell you far more about whether the process will actually protect your voice.",
      },
      {
        heading: "Settle ownership before you say yes",
        body: "You should be the credited author, and the agreement should say plainly that the manuscript and its rights are yours. If that's unclear, get it clarified in writing before any work begins — see our guide on keeping the rights to your book for what to look for.",
      },
      {
        heading: "The genre changes what a good fit looks like",
        body: "A memoir ghostwriter works differently from a business-book ghostwriter — one is drawing out a personal narrative from interviews, the other is structuring expertise into a legible argument. Ask whether the writer you're considering has actually worked in your genre, not just \"has ghostwritten before.\"",
      },
    ],
    takeaways: [
      "A ghostwriter drafts in your voice from real interviews — it isn't dictation.",
      "Ask about the process (outline, review rounds) before asking about price.",
      "Get authorship and ownership confirmed in writing before work begins.",
      "Match the writer to your genre — memoir and business books need different skills.",
    ],
    related: { service: "book-ghostwriting", label: "See writing and ghostwriting" },
    featuredHome: false,
  },

  {
    slug: "how-long-does-it-take-to-publish-a-book",
    tag: "Timelines",
    title: "How Long Does It Take to Publish a Book?",
    dek: "What actually drives a book's timeline, stage by stage, and how to get a schedule you can plan around.",
    seo: {
      description:
        "How long it takes to publish a book, stage by stage: what drives the timeline for editing, design, illustration and distribution, and how to get a realistic schedule.",
      keywords: [
        "how long does it take to publish a book",
        "book publishing timeline",
        "how long does book editing take",
      ],
    },
    intro:
      "\"It depends\" is the honest answer, and also not a useful one on its own. Here is what it actually depends on, so you can estimate your own book's timeline instead of guessing at an industry average.",
    sections: [
      {
        heading: "The manuscript's starting condition sets the floor",
        body: "A polished, structurally sound manuscript moves through editing faster than an early draft that needs developmental work first. This is the single biggest timeline variable, and it's exactly why a real schedule comes after an assessment, not before one.",
      },
      {
        heading: "Each stage has its own rhythm",
        body: "Developmental editing, line editing, copyediting, design and proofreading each take their own time, and most run in sequence rather than in parallel, because each stage depends on the one before it being settled. Illustrated books add real time here — full-colour spreads are slower to produce than typeset text.",
      },
      {
        heading: "Review rounds are part of the timeline, not outside it",
        body: "The time you take to review a draft and send feedback is part of the schedule, not a pause in it. A fast, clear round of feedback keeps a project moving at its planned pace; a slow one pushes every stage after it back by the same amount.",
      },
      {
        heading: "Distribution has its own clock",
        body: "Once files are final, retailer setup and platform review add their own time on top of production — and that part isn't fully within any service provider's control, since it depends on the platform's own process.",
      },
      {
        heading: "What a real schedule looks like",
        body: "You should get a stage-by-stage timeline with your quote, based on your specific manuscript, before you agree to anything — not a generic \"a few months\" estimate. See our six-stage process for what that actually looks like end to end.",
      },
    ],
    takeaways: [
      "The manuscript's starting condition is the biggest driver of the timeline.",
      "Editing stages usually run in sequence, each depending on the last.",
      "Your own review speed is part of the schedule, not separate from it.",
      "A real timeline is quoted stage by stage, specific to your manuscript.",
    ],
    related: { path: "/process", label: "See our six-stage process" },
    featuredHome: false,
  },

  {
    slug: "vanity-press-vs-publishing-services-company",
    tag: "Rights and ownership",
    title: "Vanity Press vs. Publishing Services Company: What's the Real Difference?",
    dek: "How a vanity press actually makes money, and the questions that tell the two apart before you sign anything.",
    seo: {
      description:
        "Vanity press vs. publishing services company: how each actually makes money, and the specific questions that tell them apart before you sign an agreement.",
      keywords: [
        "vanity press vs publishing services company",
        "is self publishing legit",
        "hidden fees book publishing packages",
      ],
    },
    intro:
      "The two can look identical from the outside — a website, a services list, testimonials — because the difference isn't in what's offered. It's in how the business actually makes its money, which is a question worth asking directly.",
    sections: [
      {
        heading: "The business model is the real difference",
        body: "A vanity press earns primarily from the author paying, regardless of whether the book ever sells — which changes its incentives around what it sells you and how much. A publishing services company earns from doing defined work well, and has no structural reason to sell you services your book doesn't need.",
      },
      {
        heading: "Watch how a package is priced",
        body: "A vanity press often bundles everything into one large package with no itemization, which makes it hard to tell what you're actually paying for or to decline what you don't need. A transparent provider can tell you what each service costs and let you take only the ones your manuscript requires.",
      },
      {
        heading: "Check who holds the rights",
        body: "This is often where the real difference surfaces. Ask directly: who holds copyright, who is the publisher of record, and what royalty share do you keep. If the answers are vague or the split favours the company more than you'd expect, that's a meaningful signal — see our full guide on keeping your rights.",
      },
      {
        heading: "Listen for promises about sales",
        body: "Confident claims about guaranteed bestseller status or specific sales numbers are a reliable tell, because no legitimate publisher — traditional or independent — can honestly promise that. Marketing services can build real, practical launch support; they cannot promise an outcome that depends on the book, the market and the reader.",
      },
      {
        heading: "The plain-language test",
        body: "Ask what happens if you're not happy partway through, whether you can leave with your files, and what changes at each price tier. A publisher confident in its own work answers these plainly. Vague or defensive answers to direct questions are the clearest signal of all.",
      },
    ],
    takeaways: [
      "The real difference is the business model: paid-to-publish vs. paid-for-defined-work.",
      "Itemized pricing lets you see and decline what you don't need; bundles hide it.",
      "Ask directly who holds copyright and the publisher-of-record status.",
      "No legitimate publisher can honestly guarantee sales or bestseller status.",
    ],
    related: { path: "/about", label: "Read how we work" },
    featuredHome: false,
  },

  {
    slug: "what-to-look-for-in-a-childrens-book-illustrator",
    tag: "Illustration",
    title: "What to Look for in a Children's Book Illustrator",
    dek: "Style fit, process and character development: what actually makes a children's book illustrator the right match for your story.",
    seo: {
      description:
        "What to look for in a children's book illustrator: matching style to your story, what a real process looks like, and how character development shapes a book that can carry a series.",
      keywords: [
        "children's book illustrator for hire",
        "how to choose a children's book illustrator",
        "children's book illustration process",
      ],
    },
    intro:
      "A picture book lives or dies on its illustrations as much as its text, which makes this hire higher-stakes than it first appears. Here's what actually separates a good fit from a mismatched one.",
    sections: [
      {
        heading: "Style should fit the story, not just look nice",
        body: "A soft watercolour style suits a gentle bedtime story; a bold, graphic style suits an adventure book. Look at an illustrator's portfolio and ask specifically whether their style fits your story's tone, not just whether you like their work in general — those are different questions.",
      },
      {
        heading: "A real process starts with sketches, not final art",
        body: "You should see character sketches and a page-by-page storyboard before any final, full-colour spread is painted. That sequence is what lets you catch a wrong direction while changes are still cheap, rather than after the art is finished.",
      },
      {
        heading: "Character development is the foundation, not a step",
        body: "A character sheet — your character in the poses and expressions the story actually needs — becomes the reference for every single page. A character that's inconsistent from spread to spread is one of the fastest ways a picture book reads as unfinished, and it traces back to skipping this step.",
      },
      {
        heading: "Page count is a format decision, not a creative one",
        body: "A standard picture book runs to 32 pages, which shapes pacing and how the story is broken into spreads well before a single illustration is painted. Planning to this constraint early, rather than discovering it late, is what keeps a manuscript from needing an awkward last-minute cut.",
      },
      {
        heading: "Ask who owns the finished art",
        body: "You should own the character and the artwork outright once the project is paid for — worth confirming plainly before work begins, especially if you're hoping this character could carry a series. Our Mabel and the Nine Moons case study shows what that looks like in practice.",
      },
    ],
    takeaways: [
      "Match illustration style to your story's actual tone, not just general taste.",
      "A real process shows sketches and a storyboard before any final art.",
      "Character sheets keep a character consistent across every spread.",
      "Confirm you own the finished character and artwork before work begins.",
    ],
    related: { service: "childrens-book-illustration", label: "See children's book illustration" },
    featuredHome: false,
  },
];

const bySlug = new Map(articles.map((a) => [a.slug, a]));

export function getArticle(slug: string) {
  return bySlug.get(slug);
}

export function getNeighbourArticles(slug: string) {
  const i = articles.findIndex((a) => a.slug === slug);
  return {
    prev: i > 0 ? articles[i - 1] : undefined,
    next: i >= 0 && i < articles.length - 1 ? articles[i + 1] : undefined,
  };
}

/** ~200 words a minute, counting the intro, every section and its list. */
export function readingTime(article: Article): number {
  const words = [
    article.intro,
    ...article.sections.flatMap((s) => [s.heading, s.body, ...(s.list ?? [])]),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
