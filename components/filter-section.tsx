"use client";

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

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
    setSelectedTags((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      syncUrl(activeCategory, next, matchMode, searchQuery);
      return next;
    });
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
    syncUrl(activeCategory, selectedTags, matchMode, value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    syncUrl(activeCategory, selectedTags, matchMode, "");
  };

  const handleResetAll = () => {
    setActiveCategory(initialCategory || null);
    setSelectedTags([]);
    setMatchMode("any");
    setSearchQuery("");
    syncUrl(initialCategory || null, [], "any", "");
  };

  const filteredItems = useMemo(() => {
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
      const query = searchQuery.toLowerCase().trim();
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
  }, [activeCategory, items, matchMode, searchQuery, selectedTags]);

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
          <div className="flex flex-1 items-center gap-2 sm:max-w-96 sm:min-w-80">
            <div className="filter-search-wrap flex-1">
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
          <div className="border-t-ink/15 mx-auto mt-2.5 max-w-7xl border-t px-5 pt-2.5 md:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-mono-2xs text-ink-mute font-bold uppercase tracking-wider">
                Active tags:
              </span>
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="text-mono-2xs bg-primary/10 border-primary/40 text-ink hover:bg-primary/20 group inline-flex items-center gap-1.5 border px-2 py-1 font-mono transition-colors"
                  aria-label={`Remove tag ${tag}`}
                >
                  <span>#{tag}</span>
                  <XIcon
                    weight="bold"
                    className="text-ink-mute group-hover:text-destructive size-3"
                  />
                </button>
              ))}

              {selectedTags.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleMatchModeChange(matchMode === "any" ? "all" : "any")}
                  className="text-mono-2xs border-ink/20 bg-background text-ink-mute hover:text-ink hover:border-ink/50 inline-flex items-center gap-1 border px-2 py-1 font-mono uppercase transition-colors"
                  title="Click to toggle match mode"
                >
                  Mode: <span className="text-ink font-bold">{matchMode.toUpperCase()}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClearTags}
                className="text-mono-2xs text-ink-mute hover:text-destructive ml-auto font-mono underline underline-offset-2 transition-colors"
              >
                Clear all tags ({selectedTags.length})
              </button>
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
                <div className="cat-divider">
                  <h2 className="font-mono text-xl font-extrabold tracking-widest uppercase">
                    {category}
                  </h2>
                  <span className="bg-primary h-0.5 flex-1" />

                  <span className="text-mono-sm">
                    {catItems.length} {itemLabel}
                  </span>
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
