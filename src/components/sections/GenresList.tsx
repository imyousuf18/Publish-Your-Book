import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { genres } from "@/lib/site";

/**
 * ALTERNATIVE to Genres (horizontal track).
 *
 * Two reasons this exists. Services already owns the pinned-horizontal-track
 * layout, and reusing it here made two long stretches of the page read
 * identically. And twelve cards is a lot of furniture for what is really a
 * list of labels: as a typographic index it takes a third of the height and
 * the reader can scan all twelve at once instead of dragging through them.
 */
export function GenresList() {
  return (
    <section id="genres" className="border-b border-line bg-paper py-24 lg:py-32">
      <Container>
        <div className="max-w-3xl">
          <TextReveal as="h2" className="text-h1">
            We have set type for most kinds of book.
          </TextReveal>
        </div>

        <ul className="mt-16 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((genre, i) => (
            <Reveal as="li" key={genre.label} delay={(i % 3) * 60}>
              <div
                className="group border-t border-line py-6 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-xs tabular-nums text-ink-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 id={genre.id} className="scroll-mt-32 text-h3 transition-colors group-hover:text-accent">
                    {genre.label}
                  </h3>
                </div>
                <p className="mt-2 pl-8 text-sm leading-relaxed text-ink-muted">
                  {genre.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
