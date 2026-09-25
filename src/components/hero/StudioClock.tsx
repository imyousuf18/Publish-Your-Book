"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { heroEditor, site } from "@/lib/site";

/**
 * "Chicago, Illinois · 9:41 AM" — the studio's own local time, like the
 * timezone orionix keeps in its hero corner. A small, true detail that says
 * real people are working somewhere right now.
 *
 * The time only appears after mount: the server cannot know the reader's
 * moment, and rendering it there would not match what the browser draws.
 */
export function StudioClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: heroEditor.timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    const first = setTimeout(tick);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <p className={cn("text-sm text-ink-muted", className)}>
      {site.location}
      {time && (
        <>
          {" · "}
          <time className="tabular-nums text-ink">{time}</time>
        </>
      )}
    </p>
  );
}
