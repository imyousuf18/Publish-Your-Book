import Image from "next/image";
import { cn } from "@/lib/utils";
import { covers, heroShelf } from "@/lib/site";

/*
 * Covers floating around the headline — our answer to the large object orionix
 * floats behind its hero. Each drifts against the pointer at its own depth
 * (--mx / --my from ParallaxFrame), so the page has parallax without anything
 * moving on its own. Hover straightens a cover and lifts it toward you.
 *
 * Two arrangements of the same books:
 *   xl and up   scattered in the margins either side of the centred headline
 *   below xl    a small fanned hand of three under the buttons — below 1280px
 *               the display headline fills the width and there are no margins
 *               to scatter into. Left out on short screens (snug), where it
 *               would push the hero past one screen.
 */

type Spot = {
  /** Where it sits on large screens. */
  place: string;
  /** Resting tilt. */
  tilt: string;
  /** How far it drifts with the pointer, in px. Bigger = nearer. */
  depth: number;
};

const SPOTS: Spot[] = [
  { place: "left-[2.5%] top-[22%]", tilt: "-rotate-[9deg]", depth: 22 },
  { place: "right-[2.5%] top-[17%]", tilt: "rotate-[7deg]", depth: 30 },
  { place: "bottom-[15%] right-[11%]", tilt: "-rotate-[4deg]", depth: 14 },
];

function Cover({
  src,
  alt,
  tilt,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  tilt: string;
  sizes: string;
  className?: string;
  /** Above the fold on large screens: load eagerly, or they pop in late. */
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-[3px] bg-book-cover shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-0 group-hover:scale-[1.04]",
        tilt,
        className,
      )}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {/* The crease where a cover hinges, and a little gloss. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgb(0 0 0 / 0.22) 0, rgb(0 0 0 / 0) 6%), linear-gradient(110deg, rgb(255 255 255 / 0.16) 0, rgb(255 255 255 / 0) 40%)",
        }}
      />
    </div>
  );
}

export function FloatingCovers({ layout }: { layout: "scatter" | "hand" }) {
  const books = heroShelf
    .map((title) => covers.find((c) => c.title === title))
    .filter((c): c is (typeof covers)[number] => Boolean(c));

  if (layout === "hand") {
    return (
      <ul aria-hidden className="mt-6 flex items-end justify-center snug:hidden xl:hidden">
        {books.map((b, i) => (
          <li
            key={b.title}
            className={cn("group w-24 sm:w-28", i > 0 && "-ml-5", i === 1 ? "z-10 -translate-y-3" : "")}
          >
            <Cover
              src={b.image}
              alt=""
              tilt={["-rotate-[10deg]", "rotate-0", "rotate-[10deg]"][i]}
              sizes="112px"
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      {books.map((b, i) => {
        const spot = SPOTS[i];
        return (
          <li
            key={b.title}
            className={cn("group pointer-events-auto absolute w-[9rem] 2xl:w-[10rem]", spot.place)}
            style={{
              transform: `translate3d(calc(var(--mx) * ${-spot.depth}px), calc(var(--my) * ${-spot.depth}px), 0)`,
              transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Cover src={b.image} alt="" tilt={spot.tilt} sizes="160px" priority />
          </li>
        );
      })}
    </ul>
  );
}
