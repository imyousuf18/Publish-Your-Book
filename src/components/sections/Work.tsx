"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";
import { covers, workFilters } from "@/lib/site";

/**
 * Filterable cover gallery. The only client-state section on the page —
 * everything else is a Server Component.
 */
export function Work() {
  const [filter, setFilter] = useState<string>(workFilters[0]);

  const shown = covers.filter((c) => filter === workFilters[0] || c.cat === filter);

  return (
    <section id="work" className="border-b border-line bg-surface-alt py-24 lg:py-32">
      <Container>
        <Eyebrow>Selected work</Eyebrow>
        <TextReveal as="h2" className="mt-5 max-w-3xl text-h1">
            Books we were trusted with.
          </TextReveal>

        <div className="mt-12 flex flex-wrap gap-3">
          {workFilters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                data-cursor="link"
                className={cn(
                  "rounded-pill border-2 border-ink px-4 py-2 text-sm font-medium transition-colors",
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

        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((cover, i) => (
            <Reveal as="li" key={cover.title} delay={(i % 4) * 70}>
              <div data-cursor="view">
                <ImageSlot
                  ratio="2/3"
                  label={`${cover.cat} cover`}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                />
                <h3 className="mt-5 text-h3">{cover.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{cover.meta}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        {shown.length === 0 && (
          <p className="mt-14 text-lead text-ink-muted">Nothing in this category yet.</p>
        )}
      </Container>
    </section>
  );
}
