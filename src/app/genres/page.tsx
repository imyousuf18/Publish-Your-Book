import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { GenresList } from "@/components/sections/GenresList";
import { PageHero } from "@/components/pages/PageHero";
import { Work } from "@/components/sections/Work";
import { pageHeroes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Genres We Publish",
  description:
    "From novels and memoirs to children's books and cookbooks — editing, design and publishing help matched to what your genre actually needs.",
};

export default function GenresPage() {
  return (
    <>
      <PageHero content={pageHeroes.genres} />
      <GenresList />
      <Work />
      <CtaBanner
        title="Tell us what you are"
        em="making."
        body="Send a paragraph or the first three chapters and we will tell you honestly what your genre needs."
      />
    </>
  );
}
