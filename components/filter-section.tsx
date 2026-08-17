"use client";

import { ArrowsCounterClockwiseIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useDeferredValue, useMemo, useRef, useState } from "react";

import { DotButton } from "@/components/dot-button";
import { TagFilterPopover, TagOption } from "@/components/tag-filter-popover";
import ToolCard from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tool } from "@/types";

interface FilterSectionProps {
  initialCategory?: string;
  items: Tool[];
  categories: string[];
  searchPlaceholder?: string;
  itemLabel?: string;
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

  // Read initial params from URL if present
  const initialTags = useMemo(() => {
    const tagParam = searchParams.get("tag");
    return tagParam ? tagParam.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const initialMode = useMemo(() => {
    return searchParams.get("mode") === "all" ? "all" : "any";
  }, [searchParams]);

  const initialQuery = useMemo(() => {
    return searchParams.get("q") || "";
  }, [searchParams]);

  const initialCat = useMemo(() => {
    return searchParams.get("category") || initialCategory || null;
  }, [initialCategory, searchParams]);

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCat);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [matchMode, setMatchMode] = useState<"any" | "all">(initialMode);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Defer heavy list filtering so typing input response is instantaneous (0ms lag)
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Sync state to URL without full page reload
  const syncUrl = useCallback(
    (cat: string | null, tags: string[], mode: "any" | "all", query: string) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);

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
    },
    [initialCategory, pathname],
  );

  // Calculate available tags and their counts scoped to current category
  const availableTags: TagOption[] = useMemo(() => {
    const scopedItems = activeCategory
      ? items.filter((tool) => tool.category === activeCategory)
      : items;

    const counts = new Map<string, number>();
    for (const tool of scopedItems) {
      if (tool.tags) {
        for (const tag of tool.tags) {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        }
      }
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ count, name }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [activeCategory, items]);

  const handleCategoryClick = (category: string) => {
    const nextCategory = activeCategory === category ? null : category;
    setActiveCategory(nextCategory);
    syncUrl(nextCategory, selectedTags, matchMode, searchQuery);
  };

  const handleToggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
    syncUrl(activeCategory, next, matchMode, searchQuery);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
    syncUrl(activeCategory, [], matchMode, searchQuery);
  };

  const handleMatchModeChange = (mode: "any" | "all") => {
    setMatchMode(mode);
    syncUrl(activeCategory, selectedTags, mode, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      syncUrl(activeCategory, selectedTags, matchMode, value);
    }, 200);
  };

  const handleClearSearch = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setSearchQuery("");
    syncUrl(activeCategory, selectedTags, matchMode, "");
  };

  const handleResetAll = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setActiveCategory(initialCategory || null);
    setSelectedTags([]);
    setMatchMode("any");
    setSearchQuery("");
    syncUrl(initialCategory || null, [], "any", "");
  };

  const filteredItems = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase().trim();

    return items.filter((tool) => {
      // Category filter
      if (activeCategory && tool.category !== activeCategory) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const toolTags = tool.tags || [];
        if (matchMode === "all") {
          const matchesAll = selectedTags.every((t) => toolTags.includes(t));
          if (!matchesAll) return false;
        } else {
          const matchesAny = selectedTags.some((t) => toolTags.includes(t));
          if (!matchesAny) return false;
        }
      }

      // Search filter
      if (!query) return true;
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.author?.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.subtitle?.toLowerCase().includes(query) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        tool.category.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, deferredSearchQuery, items, matchMode, selectedTags]);

  // Group the filtered items by category
  const groupedItems = useMemo(() => {
    return filteredItems.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, Tool[]>,
    );
  }, [filteredItems]);

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
          ) : (
            Object.entries(groupedItems).map(([category, catItems]) => (
              <div key={category} className="cat-section">
                <div className="cat-divider flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1 sm:flex-row sm:items-center sm:gap-4">
                    <h2 className="font-mono text-lg font-extrabold tracking-widest uppercase sm:text-xl">
                      {category}
                    </h2>
                    <span className="bg-primary hidden h-0.5 flex-1 sm:block" />
                  </div>

                  <div className="flex w-full items-center gap-3 sm:w-auto">
                    <span className="text-mono-xs sm:text-mono-sm text-ink-mute shrink-0 font-mono">
                      {catItems.length} {itemLabel}
                    </span>
                    <span className="bg-primary h-0.5 flex-1 sm:hidden" />
                  </div>
                </div>
                <div className="card-grid">
                  {catItems.map((tool) => (
                    <ToolCard
                      key={tool.url || tool.slug}
                      tool={tool}
                      onTagClick={handleToggleTag}
                    />
                  ))}
                </div>
              </div>
            ))
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
