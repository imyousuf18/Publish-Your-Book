"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";
import { covers, homeCovers, workFilters } from "@/lib/site";

/**
 * Filterable cover gallery on `/work` and `/genres`. The only client-state
 * section on those pages — everything else is a Server Component.
 *
 * `preview` is the homepage's version: three covers (`homeCovers` in site.ts),
 * no filter row, and a "See all our work" link instead of the full 28-book
 * grid. The whole portfolio belongs on its own page, not stacked into the
 * homepage under everything else.
 */
export function Work({ preview = false }: { preview?: boolean } = {}) {
  const [filter, setFilter] = useState<string>(workFilters[0]);

  const shown = preview
    ? homeCovers
        .map((title) => covers.find((c) => c.title === title))
        .filter((c): c is (typeof covers)[number] => Boolean(c))
    : covers.filter((c) => filter === workFilters[0] || c.cat === filter);

  return (
    <section id="work" className="border-b border-line bg-surface-alt py-24 lg:py-32">
      <Container>
        <Eyebrow>Selected work</Eyebrow>
        <TextReveal as="h2" className="mt-5 max-w-3xl text-h1">
            Books we were trusted with.
          </TextReveal>

        {!preview && (
          <div className="mt-12 flex flex-wrap gap-3">
            {workFilters.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-pill border-2 border-ink px-4 text-sm font-medium transition-colors",
                    active
                      ? "bg-ink text-inverse-ink"
                      : "bg-transparent text-ink hover:bg-ink/5",
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>
        )}

        <ul
          className={cn(
            "mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2",
            preview ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {shown.map((cover, i) => (
            <Reveal as="li" key={cover.title} delay={(i % 4) * 70}>
              <div className="group">
                <ImageSlot
                  ratio="2/3"
                  src={cover.image}
                  alt={cover.alt}
                  label={`${cover.cat} cover`}
                  className="rounded-[3px] shadow-lift"
                  sizes={preview ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"}
                  zoom
                />
                <h3 className="mt-5 text-h3 transition-colors duration-200 group-hover:text-accent">
                  {cover.title}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{cover.meta}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        {shown.length === 0 && (
          <p className="mt-14 text-lead text-ink-muted">Nothing in this category yet.</p>
        )}

        {preview ? (
          <div className="mt-14 flex flex-wrap items-center gap-6">
            <ButtonLink href="/work">See all our work</ButtonLink>
            <Link
              href="/work"
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
            >
              {covers.length} books and counting
              <ArrowRight
                size={14}
                weight="bold"
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
