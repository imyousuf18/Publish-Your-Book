import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { aboutStory, site } from "@/lib/site";

/** The company story: the stacked logo on one side, three paragraphs on the other. */
export function AboutStory() {
  return (
    <section className="border-b border-line py-24 lg:py-32">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
        <Reveal className="flex items-center justify-center rounded-card bg-surface-alt p-12 lg:p-16">
          <Image
            src="/Assets/PublishYourBook_US_Stacked_Logo.png"
            alt={site.name}
            width={1254}
            height={1254}
            className="h-auto w-full max-w-[16rem]"
          />
        </Reveal>

        <div>
          <Eyebrow>Our story</Eyebrow>
          <TextReveal as="h2" className="mt-5 text-h1">
            {aboutStory.heading}
          </TextReveal>
          <div className="mt-8 space-y-5">
            {aboutStory.paragraphs.map((p) => (
              <Reveal key={p.slice(0, 24)}>
                <p className="text-lead text-ink-muted">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
