"use client";

import {
  ArrowsCounterClockwiseIcon,
  BookmarkSimpleIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { DotButton } from "@/components/dot-button";
import { ResourceDialog } from "@/components/resource-dialog";
import StashCard from "@/components/stash-card";
import { TagFilterPopover, TagOption } from "@/components/tag-filter-popover";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { getCategoryTheme, getResourceId } from "@/lib/utils";
import { isResource, Resource, StashItem } from "@/types";

interface FilterSectionProps {
  initialCategory?: string;
  items: StashItem[];
  categories: string[];
  searchPlaceholder?: string;
  itemLabel?: string;
}

const BATCH_SIZE = 36;

function formatItemCountLabel(count: number, label: string): string {
  if (count === 1) {
    if (label.endsWith("ies")) return label.slice(0, -3) + "y";
    if (label.endsWith("s") || label.endsWith("S")) return label.slice(0, -1);
    return label;
  }
  if (!label.endsWith("s") && !label.endsWith("S")) {
    return label + "s";
  }
  return label;
}

function FilterSectionInner({
  categories,
  initialCategory,
  itemLabel = "Items",
  items,
  searchPlaceholder = "Search...",
}: FilterSectionProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [visibleLimit, setVisibleLimit] = useState(BATCH_SIZE);
  const [activeDialogResource, setActiveDialogResource] = useState<Resource | null>(null);

  const { bookmarkedSet } = useBookmarks();

  // Derive filter state directly from searchParams for instant navigation sync
  const savedOnly = searchParams.get("saved") === "true";
  const catParam = searchParams.get("category");
  const activeCategory = catParam || initialCategory || null;
  const tagParam = searchParams.get("tag");
  const selectedTags = useMemo(() => {
    return tagParam ? tagParam.split(",").filter(Boolean) : [];
  }, [tagParam]);
  const matchMode = searchParams.get("mode") === "all" ? "all" : "any";

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");

  // Defer heavy list filtering so typing input response is instantaneous (0ms lag)
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Sync state to URL without full page reload
  const syncUrl = useCallback(
    (
      cat: string | null,
      tags: string[],
      mode: "any" | "all",
      query: string,
      saved?: boolean,
      dispatchPopstate: boolean = true,
    ) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const isSaved = saved !== undefined ? saved : savedOnly;

      if (isSaved) {
        params.set("saved", "true");
      } else {
        params.delete("saved");
      }

      if (cat && !initialCategory) {
        params.set("category", cat);
      } else {
        params.delete("category");
      }

      if (tags.length > 0) {
        params.set("tag", tags.join(","));
      } else {
        params.delete("tag");
      }

      if (mode === "all" && tags.length > 1) {
        params.set("mode", "all");
      } else {
        params.delete("mode");
      }

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, "", newUrl);
      if (dispatchPopstate) {
        window.dispatchEvent(new Event("popstate"));
      }
    },
    [initialCategory, pathname, savedOnly],
  );

  // Calculate available tags and their counts scoped to current category
  const availableTags: TagOption[] = useMemo(() => {
    let scopedItems = activeCategory
      ? items.filter((tool) => tool.category === activeCategory)
      : items;

    if (savedOnly) {
      scopedItems = scopedItems.filter((tool) => bookmarkedSet.has(getResourceId(tool)));
    }

    const counts = new Map<string, number>();
    for (const tool of scopedItems) {
      if ("tags" in tool && tool.tags) {
        for (const tag of tool.tags) {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        }
      }
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ count, name }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [activeCategory, bookmarkedSet, items, savedOnly]);

  const handleCategoryClick = (category: string) => {
    const nextCategory = activeCategory === category ? null : category;
    syncUrl(nextCategory, selectedTags, matchMode, searchQuery, savedOnly);
  };

  const handleToggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    syncUrl(activeCategory, next, matchMode, searchQuery, savedOnly);
  };

  const handleClearTags = () => {
    syncUrl(activeCategory, [], matchMode, searchQuery, savedOnly);
  };

  const handleMatchModeChange = (mode: "any" | "all") => {
    syncUrl(activeCategory, selectedTags, mode, searchQuery, savedOnly);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      syncUrl(activeCategory, selectedTags, matchMode, value, savedOnly, false);
    }, 300);
  };

  const handleClearSearch = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setSearchQuery("");
    syncUrl(activeCategory, selectedTags, matchMode, "", savedOnly);
  };

  const handleResetAll = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setSearchQuery("");
    setVisibleLimit(BATCH_SIZE);
    syncUrl(initialCategory || null, [], "any", "", false);
  };

  const filteredItems = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase().trim();

    return items.filter((tool) => {
      // Saved filter
      if (savedOnly) {
        const id = getResourceId(tool);
        if (!bookmarkedSet.has(id)) return false;
      }

      // Category filter
      if (activeCategory && tool.category !== activeCategory) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const itemTags = ("tags" in tool ? tool.tags : undefined) || [];
        if (matchMode === "all") {
          const matchesAll = selectedTags.every((t) => itemTags.includes(t));
          if (!matchesAll) return false;
        } else {
          const matchesAny = selectedTags.some((t) => itemTags.includes(t));
          if (!matchesAny) return false;
        }
      }

      // Search filter
      if (!query) return true;
      const author = "author" in tool ? tool.author : undefined;
      const subtitle = "subtitle" in tool ? tool.subtitle : undefined;
      const tags = "tags" in tool ? tool.tags : undefined;

      const authorMatches = Array.isArray(author)
        ? author.some((a) => a.toLowerCase().includes(query))
        : author?.toLowerCase().includes(query);

      return (
        tool.title.toLowerCase().includes(query) ||
        authorMatches ||
        tool.description?.toLowerCase().includes(query) ||
        subtitle?.toLowerCase().includes(query) ||
        tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
        tool.category.toLowerCase().includes(query)
      );
    });
  }, [
    activeCategory,
    bookmarkedSet,
    deferredSearchQuery,
    items,
    matchMode,
    savedOnly,
    selectedTags,
  ]);

  // Reset pagination limit during render when search or filter parameters change
  const currentFilterKey = `${deferredSearchQuery}|${activeCategory}|${tagParam}|${matchMode}|${savedOnly}|${items.length}`;
  const [prevFilterKey, setPrevFilterKey] = useState(currentFilterKey);

  if (currentFilterKey !== prevFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleLimit(BATCH_SIZE);
  }

  const hasMore = visibleLimit < filteredItems.length;

  const handleLoadMore = useCallback(() => {
    setVisibleLimit((prev) => Math.min(prev + BATCH_SIZE, filteredItems.length));
  }, [filteredItems.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore]);

  // Precompute category totals from full filteredItems
  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const tool of filteredItems) {
      totals.set(tool.category, (totals.get(tool.category) || 0) + 1);
    }
    return totals;
  }, [filteredItems]);

  // Only slice items up to visibleLimit for DOM rendering
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleLimit);
  }, [filteredItems, visibleLimit]);

  // Group ONLY the visible items by category
  const groupedItems = useMemo(() => {
    return visibleItems.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, StashItem[]>,
    );
  }, [visibleItems]);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-search-wrap">
            <MagnifyingGlassIcon weight="bold" className="filter-search-icon" />
            <Input
              className="filter-search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="filter-search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <XIcon weight="bold" />
              </button>
            )}
          </div>

          <div className="filter-pills">
            {categories.map((item, i) => {
              const isActive = activeCategory === item;
              return (
                <DotButton
                  key={item}
                  isActive={isActive}
                  theme={getCategoryTheme(item, itemLabel === "Tools" ? "tool" : "resource")}
                  index={i}
                  label={item}
                  onClick={() => handleCategoryClick(item)}
                />
              );
            })}
          </div>

          <div className="filter-count">
            <span className="filter-count-num">{filteredItems.length}</span>
            <span> of {items.length}</span>
          </div>
        </div>

        {/* Active Tag Chips Bar */}
        {selectedTags.length > 0 && (
          <div className="border-t-ink/15 mx-auto mt-2 max-w-7xl border-t px-4 pt-2 sm:px-6 md:px-8">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5 sm:flex-wrap sm:gap-2">
              <span className="text-mono-2xs text-ink-mute shrink-0 font-bold tracking-wider uppercase">
                Active:
              </span>
              {selectedTags.map((tag) => (
                <Button
                  key={tag}
                  size="xs"
                  variant="outline"
                  className="group text-mono-2xs shrink-0 px-2 py-0.5"
                  onClick={() => handleToggleTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  <span>#{tag}</span>
                  <XIcon weight="bold" className="group-hover:text-destructive" />
                </Button>
              ))}

              {selectedTags.length > 1 && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleMatchModeChange(matchMode === "any" ? "all" : "any")}
                  className="text-mono-2xs shrink-0 px-2 py-0.5"
                  title="Click to toggle match mode"
                >
                  <ArrowsCounterClockwiseIcon weight="bold" />
                  Mode: <span className="text-ink font-bold">{matchMode.toUpperCase()}</span>
                </Button>
              )}

              <Button
                variant="clear"
                size="xs"
                onClick={handleClearTags}
                className="text-mono-2xs text-destructive shrink-0 font-mono font-semibold hover:underline sm:ml-auto"
              >
                Clear all ({selectedTags.length})
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="section-inner">
          {Object.keys(groupedItems).length === 0 ? (
            savedOnly ? (
              <div className="py-16 text-center">
                <BookmarkSimpleIcon
                  weight="fill"
                  className="text-ink/40 dark:text-paper/40 mx-auto mb-3 size-10"
                />
                <p className="font-mono text-base font-bold uppercase">No saved resources yet</p>

                <p className="mx-auto mt-1 max-w-sm font-mono text-xs opacity-60">
                  Click the bookmark icon on any resource card to save it here for fast offline
                  access.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    syncUrl(activeCategory, selectedTags, matchMode, searchQuery, false)
                  }
                  className="mt-4 font-mono text-xs"
                >
                  View all resources
                </Button>
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="font-mono text-sm opacity-60">
                  No {itemLabel.toLowerCase()} found matching your filters.
                </p>
                {(selectedTags.length > 0 || searchQuery || activeCategory) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetAll}
                    className="mt-4 font-mono text-xs"
                  >
                    Reset all filters
                  </Button>
                )}
              </div>
            )
          ) : (
            Object.entries(groupedItems).map(([category, catItems]) => {
              const count = categoryTotals.get(category) ?? catItems.length;

              return (
                <div key={category} className="cat-section w-full">
                  <div className="cat-divider flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1 sm:flex-row sm:items-center sm:gap-4">
                      <h2 className="font-mono text-lg font-extrabold tracking-widest uppercase sm:text-xl">
                        {category}
                      </h2>
                      <span className="bg-primary hidden h-0.5 flex-1 sm:block" />
                    </div>

                    <div className="flex w-full items-center gap-3 sm:w-auto">
                      <span className="text-mono-xs sm:text-mono-sm text-ink-mute shrink-0 font-mono">
                        {count} {formatItemCountLabel(count, itemLabel)}
                      </span>
                      <span className="bg-primary h-0.5 flex-1 sm:hidden" />
                    </div>
                  </div>
                  <div className="card-grid">
                    {catItems.map((item) => (
                      <StashCard
                        key={"url" in item ? item.url : item.slug}
                        item={item}
                        onTagClickAction={handleToggleTag}
                        onCardClick={(clickedItem) => {
                          if (isResource(clickedItem)) {
                            setActiveDialogResource(clickedItem);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {hasMore && (
            <div ref={sentinelRef} className="flex flex-col items-center justify-center py-10">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                className="font-mono text-xs tracking-wider uppercase transition-all"
              >
                Load more ({filteredItems.length - visibleLimit} remaining)
              </Button>
            </div>
          )}
        </div>
      </div>

      {availableTags.length > 0 && (
        <TagFilterPopover
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          onClearTags={handleClearTags}
          matchMode={matchMode}
          onMatchModeChange={handleMatchModeChange}
        />
      )}

      <Dialog
        open={!!activeDialogResource}
        onOpenChange={(open) => {
          if (!open) setActiveDialogResource(null);
        }}
      >
        {activeDialogResource && (
          <ResourceDialog
            key={activeDialogResource.url || activeDialogResource.title}
            resource={activeDialogResource}
            onTagClickAction={(tag) => {
              setActiveDialogResource(null);
              handleToggleTag(tag);
            }}
          />
        )}
      </Dialog>
    </>
  );
}

export function FilterSection(props: FilterSectionProps) {
  return (
    <Suspense>
      <FilterSectionInner {...props} />
    </Suspense>
  );
}
