import { Container } from "@/components/ui/Container";
import { HorizontalTrack } from "@/components/motion/HorizontalTrack";
import { TextReveal } from "@/components/motion/TextReveal";
import { genres } from "@/lib/site";

/** Twelve genres on a second pinned horizontal track. */
export function Genres() {
  return (
    <section id="genres" className="border-b border-line bg-paper">
      <Container className="py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <TextReveal as="h2" className="max-w-3xl text-h1">
              We have set type for most kinds of book.
            </TextReveal>
          </div>
          <p className="text-eyebrow font-semibold uppercase text-ink-subtle">
            {genres.length} genres
          </p>
        </div>
      </Container>

      <HorizontalTrack className="pb-24 lg:pb-32">
        {genres.map((genre, i) => (
          <article
            key={genre.label}
            data-cursor="read"
            className="flex w-[78vw] shrink-0 flex-col border-t-2 border-ink pt-6 sm:w-[46vw] lg:w-[26vw]"
          >
            <span className="text-eyebrow font-semibold uppercase text-accent tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-h3">{genre.label}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{genre.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {genre.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-pill border border-line px-3 py-1 text-xs text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </HorizontalTrack>
    </section>
  );
}
