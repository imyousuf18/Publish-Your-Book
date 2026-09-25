import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntroStudio } from "./IntroStudio";

/**
 * Development only: renders the homepage intro video from the 3D book.
 * Driven by scripts/render-intro.mjs (see docs/INTERACTIONS.md §1). In a
 * production build this route is a 404.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function IntroStudioPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <IntroStudio />;
}
