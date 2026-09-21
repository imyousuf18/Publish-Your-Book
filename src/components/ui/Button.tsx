import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

/*
 * The label roll, taken from orionix.framer.website.
 *
 * Measured on their live site, a button is:
 *   Button      overflow: clip, border-radius: 100px
 *   Label Wrap  height: 20px  (the height of ONE label)
 *   Label 1     the text
 *   Label 1     the same text again, sitting below the clip line
 *
 * Their markup literally reads "Book a callBook a call" in textContent. On
 * hover the wrap slides up by exactly one label height, so the second copy
 * arrives in the first one's place and the first leaves through the top. It
 * reads as the word rolling over rather than fading.
 *
 * Two details that matter:
 *   - The duplicate is aria-hidden, or every button announces its label twice.
 *   - The roll is driven by `group-hover` AND `group-focus-visible`, so a
 *     keyboard user gets the same feedback as a mouse user.
 */
const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-clip rounded-pill " +
  "font-sans font-normal transition-[filter,background-color,border-color,color] duration-200 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent-bright text-ink hover:brightness-95",
  secondary:
    "border border-line bg-surface text-ink hover:border-ink hover:bg-surface-alt",
  ghost: "text-ink hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

/** The rolling label. `.roll` / `.roll__inner` are defined in globals.css. */
export function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="roll">
      <span className="roll__inner">
        <span className="block">{children}</span>
        <span className="block" aria-hidden>
          {children}
        </span>
      </span>
    </span>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Opt out of the roll — for a label that is an icon, or already animated. */
  roll?: boolean;
  children: React.ReactNode;
};

/** Anchor-styled CTA. Use for anything that navigates. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  roll = true,
  children,
}: ButtonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {roll ? <RollingLabel>{children}</RollingLabel> : children}
    </Link>
  );
}

/** Real button. Use for anything that acts rather than navigates. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  roll = true,
  children,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {roll ? <RollingLabel>{children}</RollingLabel> : children}
    </button>
  );
}
