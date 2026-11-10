"use client";

import { ArrowRightIcon, ArrowsDownUpIcon, GlobeIcon, XLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { FluidSearch } from "@/components/ui/fluid-search";
import { SelectField } from "@/components/ui/select-field";
import type { AuthorWithResources } from "@/lib/authors";

type AuthorSortBy =
  "categories-desc" | "name-asc" | "name-desc" | "resources-asc" | "resources-desc";

/* eslint-disable perfectionist/sort-arrays */
const AUTHOR_SORT_OPTIONS: { label: string; value: AuthorSortBy }[] = [
  { label: "Most Resources", value: "resources-desc" },
  { label: "Fewest Resources", value: "resources-asc" },
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
  { label: "Most Categories", value: "categories-desc" },
];
/* eslint-enable perfectionist/sort-arrays */

interface AuthorsDirectoryProps {
  authors: AuthorWithResources[];
}

export function AuthorsDirectory({ authors }: AuthorsDirectoryProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<AuthorSortBy>("resources-desc");

  const sortedAuthors = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = q
      ? authors.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.categories.some((c) => c.toLowerCase().includes(q)) ||
            a.resources.some((r) => r.title.toLowerCase().includes(q)),
        )
      : authors;

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "resources-asc":
          return (
            a.count - b.count || a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
          );
        case "name-asc":
          return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
        case "name-desc":
          return b.name.localeCompare(a.name, undefined, { sensitivity: "base" });
        case "categories-desc":
          return (
            b.categories.length - a.categories.length ||
            b.count - a.count ||
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
          );
        case "resources-desc":
        default:
          return (
            b.count - a.count || a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
          );
      }
    });
  }, [authors, search, sortBy]);

  const activeSortLabel =
    AUTHOR_SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Most Resources";

  return (
    <div className="card-body">
      <div className="section-inner w-full">
        {/* Search & Sort Controls */}
        <div className="mb-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FluidSearch
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search authors by name, category, or tool..."
            className="w-full max-w-md font-mono text-xs"
          />

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <ArrowsDownUpIcon weight="bold" className="text-primary size-4 shrink-0" />
            <span className="text-muted-foreground font-mono text-[11px] font-bold tracking-wider uppercase">
              Sort:
            </span>
            <SelectField
              value={sortBy}
              onValueChange={(value) => setSortBy(value as AuthorSortBy)}
              options={AUTHOR_SORT_OPTIONS}
              variant="primary"
              triggerClassName="h-9 min-w-[175px] rounded-full border-white/10 bg-[#18181b] px-3.5 font-mono text-xs text-foreground"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="border-b-line text-muted-foreground mb-6 flex w-full items-center justify-between border-b-[1.5px] pb-3 font-mono text-xs">
          <span>
            SHOWING {sortedAuthors.length} AUTHOR{sortedAuthors.length === 1 ? "" : "S"}
          </span>
          <span className="hidden uppercase sm:inline">SORTED BY {activeSortLabel}</span>
        </div>

        {/* Authors Grid */}
        {sortedAuthors.length === 0 ? (
          <div className="flex min-h-[30vh] w-full flex-col items-center justify-center py-12 text-center font-mono">
            <p className="text-base font-bold uppercase">No authors found</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Try searching with another keyword or name.
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedAuthors.map((author) => (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="group border-ink/20 bg-background hover:border-ink relative flex flex-col justify-between border-[1.5px] p-5 transition-all hover:shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="group-hover:text-foreground text-ink truncate font-mono text-base font-bold tracking-tight uppercase">
                      {author.name}
                    </h2>
                    <span className="border-ink/20 bg-sec-1 shrink-0 border-[1.5px] px-2 py-0.5 font-mono text-[11px] font-bold">
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
                        className="bg-muted/60 text-muted-foreground border-border border-[1.5px] px-1.5 py-0.5 font-mono text-[10px]"
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
                  <div className="text-foreground flex items-center gap-2">
                    {author.links?.website && <GlobeIcon className="size-3.5" />}
                    {author.links?.github && (
                      <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={14}
                        height={14}
                        className="size-3.5"
                      />
                    )}
                    {author.links?.twitter && <XLogoIcon weight="bold" className="size-3.5" />}
                    {author.links?.linkedin && (
                      <Image
                        src="/linkedin.svg"
                        alt="LinkedIn"
                        width={14}
                        height={14}
                        className="size-3.5"
                      />
                    )}
                    {author.links?.youtube && (
                      <Image
                        src="/youtube.svg"
                        alt="YouTube"
                        width={14}
                        height={14}
                        className="size-3.5"
                      />
                    )}
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
