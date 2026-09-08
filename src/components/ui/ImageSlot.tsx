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
          className="object-cover"
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
