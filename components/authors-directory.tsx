"use client";

import { ArrowRightIcon, ArrowsDownUpIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AuthorSocialLinks } from "@/components/author-social-links";
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
                className="group hover:border-primary/40 relative flex flex-col justify-between rounded-2xl border-[1.5px] border-white/8 bg-[#18181b] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-[transform,border-color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)] active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <h2 className="min-w-0 truncate font-mono text-base font-bold tracking-tight text-white uppercase">
                      <span className="after:bg-primary relative inline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none">
                        {author.name}
                      </span>
                    </h2>
                    <span className="group-hover:border-primary/40 group-hover:bg-primary/15 group-hover:text-primary shrink-0 rounded-full border-[1.5px] border-white/10 bg-white/4 px-2.5 py-0.5 font-mono text-[11px] font-bold text-zinc-300 tabular-nums transition-colors">
                      {author.count}
                    </span>
                  </div>

                  <p className="mt-1 font-sans text-xs text-zinc-400">
                    {author.count} curated resource{author.count === 1 ? "" : "s"}
                  </p>

                  {/* Category Chips */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {author.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border-[1.5px] border-white/8 bg-white/4 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-400"
                      >
                        {cat}
                      </span>
                    ))}
                    {author.categories.length > 3 && (
                      <span className="self-center font-mono text-[10px] text-zinc-500">
                        +{author.categories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer with links and view action */}
                <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-3.5 font-mono text-[11px]">
                  <AuthorSocialLinks links={author.links} interactive={false} size="xs" />

                  <span className="text-muted-foreground group-hover:text-primary inline-flex items-center gap-1 font-semibold transition-colors">
                    Explore{" "}
                    <ArrowRightIcon
                      weight="bold"
                      className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
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
