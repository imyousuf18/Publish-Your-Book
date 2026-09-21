import { ImageSlot } from "@/components/ui/ImageSlot";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { cn } from "@/lib/utils";

/**
 * The hero's 3D piece: the service's photograph on a stack of sheets, with the
 * things you get floating in front of it at different depths.
 *
 * Depth is real. The back sheets sit behind the photo on negative Z, the chips
 * and the number in front of it on positive Z, and Tilt3D turns the scene, so
 * near layers travel further than far ones as it moves. That parallax is the
 * whole effect; nothing here is animated by itself.
 *
 * The chips repeat the deliverables listed further down the page, so they are
 * aria-hidden rather than read out twice.
 */
const CHIP_SPOTS = [
  { pos: "left-2 top-[9%] sm:-left-5", z: 74 },
  { pos: "right-2 top-[30%] sm:-right-6", z: 108 },
  { pos: "bottom-[16%] left-2 sm:-left-7", z: 92 },
  { pos: "bottom-[2%] right-[18%]", z: 60 },
] as const;

export function ServiceObject({
  image,
  alt,
  chips,
  number,
}: {
  image: string;
  alt: string;
  chips: readonly string[];
  number: string;
}) {
  return (
    <Tilt3D className="mx-auto w-full max-w-[34rem] pb-8 lg:mx-0 lg:ml-auto">
      <div className="stage3d relative">
        <div
          aria-hidden
          className="absolute inset-0 rounded-panel bg-accent-soft"
          style={{ transform: "translate3d(-7%, 8%, -80px)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-panel border border-inverse-ink/10 bg-inverse"
          style={{ transform: "translate3d(-3.5%, 4%, -40px)" }}
        />
        <ImageSlot
          ratio="4/3"
          src={image}
          alt={alt}
          priority
          sizes="(min-width: 1024px) 34rem, 92vw"
          className="rounded-panel shadow-lift"
        />

        {chips.slice(0, CHIP_SPOTS.length).map((chip, i) => (
          <span
            key={chip}
            aria-hidden
            className={cn(
              "absolute whitespace-nowrap rounded-pill border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-lift",
              CHIP_SPOTS[i].pos,
            )}
            style={{ transform: `translateZ(${CHIP_SPOTS[i].z}px)` }}
          >
            {chip}
          </span>
        ))}

        <span
          aria-hidden
          className="absolute -bottom-5 right-0 grid h-20 w-20 place-items-center rounded-full bg-accent-bright font-display text-h2 tabular-nums text-ink shadow-lift sm:-right-5"
          style={{ transform: "translateZ(130px)" }}
        >
          {number}
        </span>
      </div>
    </Tilt3D>
  );
}
