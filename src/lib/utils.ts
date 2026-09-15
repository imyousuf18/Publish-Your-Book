import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom font-size names defined in globals.css under @theme (--text-*).
 *
 * tailwind-merge has to be told about these. Without it, `text-lead` and
 * `text-ink-muted` look like the same kind of utility, so merging drops the
 * size and only the colour survives. Keep this list in sync with the --text-*
 * tokens in globals.css.
 */
const fontSizes = ["mega", "display", "h1", "h2", "h3", "lead", "eyebrow"];

/**
 * Same trap for custom radius and shadow tokens (--radius-*, --shadow-*).
 * Unregistered, `rounded-card` and an override like `rounded-[3px]` both
 * survive the merge and CSS source order silently decides the winner, which
 * is how the book covers kept 12px corners despite asking for 3px.
 */
const radii = ["card", "pill"];
const shadows = ["card", "lift"];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: fontSizes }],
      rounded: [{ rounded: radii }],
      shadow: [{ shadow: shadows }],
    },
  },
});

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
