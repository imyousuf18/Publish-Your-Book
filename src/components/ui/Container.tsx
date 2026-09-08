import { cn } from "@/lib/utils";

/** Centred content column. Width comes from the --container-site token. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-site px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}
