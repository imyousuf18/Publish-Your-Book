import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  /** Background band. `alt` and `inverse` map to design tokens. */
  tone?: "default" | "alt" | "inverse";
  className?: string;
  children: React.ReactNode;
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-paper text-ink",
  alt: "bg-surface-alt text-ink",
  inverse: "bg-inverse text-inverse-ink",
};

/** A full-bleed band with consistent vertical rhythm and a centred column. */
export function Section({
  id,
  tone = "default",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-20 lg:py-28",
        toneClasses[tone],
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
