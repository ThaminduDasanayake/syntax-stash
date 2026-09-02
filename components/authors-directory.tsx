"use client";

import {
  ArrowRightIcon,
  GithubLogoIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { AuthorWithResources } from "@/lib/authors";

interface AuthorsDirectoryProps {
  authors: AuthorWithResources[];
}

export function AuthorsDirectory({ authors }: AuthorsDirectoryProps) {
  const [search, setSearch] = useState("");

  const filteredAuthors = useMemo(() => {
    if (!search.trim()) return authors;
    const q = search.toLowerCase().trim();
    return authors.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.categories.some((c) => c.toLowerCase().includes(q)) ||
        a.resources.some((r) => r.title.toLowerCase().includes(q)),
    );
  }, [authors, search]);

  return (
    <div className="card-body">
      <div className="section-inner w-full">
        {/* Search Bar */}
        <div className="relative mb-10 w-full max-w-md">
          <MagnifyingGlassIcon className="text-ink-2 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search authors by name, category, or tool..."
            className="border-ink/40 bg-background pl-9 font-mono text-xs"
          />
        </div>

        {/* Results Counter */}
        <div className="border-b-line text-muted-foreground mb-6 flex w-full items-center justify-between border-b pb-3 font-mono text-xs">
          <span>
            SHOWING {filteredAuthors.length} AUTHOR{filteredAuthors.length === 1 ? "" : "S"}
          </span>
          <span className="hidden sm:inline">SORTED BY RESOURCE COUNT</span>
        </div>

        {/* Authors Grid */}
        {filteredAuthors.length === 0 ? (
          <div className="flex min-h-[30vh] w-full flex-col items-center justify-center py-12 text-center font-mono">
            <p className="text-base font-bold uppercase">No authors found</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Try searching with another keyword or name.
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAuthors.map((author) => (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="group border-ink/20 bg-background hover:border-ink relative flex flex-col justify-between border p-5 transition-all hover:shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="group-hover:text-foreground text-ink truncate font-mono text-base font-bold tracking-tight uppercase">
                      {author.name}
                    </h2>
                    <span className="border-ink/20 bg-sec-1 shrink-0 border px-2 py-0.5 font-mono text-[11px] font-bold">
                      {author.count}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-1 font-mono text-xs">
                    {author.count} curated tool{author.count === 1 ? "" : "s"}
                  </p>

                  {/* Category Chips */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {author.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="bg-muted/60 text-muted-foreground border-border border px-1.5 py-0.5 font-mono text-[10px]"
                      >
                        {cat}
                      </span>
                    ))}
                    {author.categories.length > 3 && (
                      <span className="text-muted-foreground/80 self-center font-mono text-[10px]">
                        +{author.categories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer with links and view action */}
                <div className="border-t-line/60 mt-5 flex items-center justify-between border-t pt-3 font-mono text-[11px]">
                  <div className="text-muted-foreground flex items-center gap-2">
                    {author.links?.website && <GlobeIcon className="size-3.5" />}
                    {author.links?.github && <GithubLogoIcon weight="fill" className="size-3.5" />}
                    {author.links?.twitter && <XLogoIcon weight="bold" className="size-3.5" />}
                  </div>

                  <span className="group-hover:text-ink text-muted-foreground inline-flex items-center gap-1 font-semibold transition-colors">
                    Explore{" "}
                    <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
