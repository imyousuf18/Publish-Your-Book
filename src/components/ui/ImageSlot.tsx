import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageSlotProps = {
  /** Leave undefined to render the labelled placeholder. */
  src?: string;
  alt?: string;
  /** CSS aspect-ratio, e.g. "3/4" for a book cover. */
  ratio?: string;
  /** Shown inside the placeholder so it is obvious what belongs here. */
  label?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /**
   * Scale the image up slightly while the nearest `.group` ancestor is
   * hovered. Orionix does this on every project tile: a "Thumnail Wrap" at
   * `overflow: hidden; border-radius: 24px` holding an image that grows, so
   * the picture moves inside a corner that stays put. The card itself never
   * moves, which is what keeps a grid of them calm.
   */
  zoom?: boolean;
};

/**
 * Mirrors the image slots in the design file: a fixed-ratio box that renders a
 * real optimised image once `src` is set, and a labelled placeholder until then.
 * This keeps layout stable while artwork is still being produced.
 */
export function ImageSlot({
  src,
  alt = "",
  ratio = "4/3",
  label = "Image",
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  zoom = false,
}: ImageSlotProps) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn(
        "relative w-full overflow-hidden rounded-card bg-surface-alt",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover",
            zoom &&
              "transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center border border-dashed border-line">
          <span className="text-eyebrow font-sans font-semibold uppercase text-ink-subtle">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
