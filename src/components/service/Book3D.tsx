import Image from "next/image";

/**
 * A standing book made of real faces: cover, back, spine and page block.
 * The geometry and the hover live in globals.css (.book3d), sized in container
 * units so it scales with whatever column it sits in. Wrap it in an element
 * with `.group` and it squares up toward the reader on hover or focus.
 *
 * Purely visual: the title and category are printed under it by the caller,
 * so the image alt describes the cover, not the surrounding text.
 */
export function Book3D({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  /** Load eagerly. Set for books above the fold — lazily loaded covers left
   *  blank gaps in the hero while the browser got round to fetching them. */
  priority?: boolean;
}) {
  return (
    <div className="book3d">
      <div className="book3d__body">
        <div className="book3d__face book3d__back" />
        <div className="book3d__face book3d__spine" />
        <div className="book3d__face book3d__pages" />
        <div className="book3d__face book3d__front">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 44vw"}
            className="object-cover"
          />
        </div>
      </div>
      <div className="book3d__shadow" aria-hidden />
    </div>
  );
}
