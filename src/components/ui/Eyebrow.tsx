import { cn } from "@/lib/utils";

/** Small uppercase label that sits above a section heading. */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-eyebrow font-sans font-semibold uppercase text-accent",
        className,
      )}
    >
      {children}
    </p>
  );
}
