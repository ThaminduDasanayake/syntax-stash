import type { Metadata } from "next";

import { AuthorsDirectory } from "@/components/authors-directory";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { getAllAuthors } from "@/lib/authors";
import { getAllResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Authors & Creators — Syntax Stash",
  alternates: { canonical: "/authors" },
  description:
    "Browse the prolific designers, engineers, and teams behind the tools in Syntax Stash.",
  openGraph: {
    title: "Authors & Creators — Syntax Stash",
    description:
      "Browse the prolific designers, engineers, and teams behind the tools in Syntax Stash.",
    url: "/authors",
  },
};

export default async function AuthorsPage() {
  const resources = await getAllResources();
  const authors = getAllAuthors(resources);

  return (
    <div className="lib-page">
      <header className="lib-header">
        <div className="section-inner">
          <div className="hero-eyebrow">
            <HeroEyebrowDots />
          </div>
          <h1 className="lib-headline">AUTHORS & CREATORS</h1>
          <p className="lib-sub">
            Browse the designers, developers, and open-source teams behind the curated tools in
            Syntax Stash.
          </p>
        </div>
      </header>

      <AuthorsDirectory authors={authors} />
    </div>
  );
}
