"use client";

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { DotButton } from "@/components/dot-button";
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

export function FilterSection({
  categories,
  initialCategory,
  itemLabel = "Items",
  items,
  searchPlaceholder = "Search...",
}: FilterSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((tool) => {
      // Category filter
      if (activeCategory && tool.category !== activeCategory) {
        return false;
      }
      // Search filter
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.subtitle?.toLowerCase().includes(query) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        tool.category.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, items, searchQuery]);

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="filter-search-clear">
              <XIcon weight="bold" />
            </button>
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
      </div>

      <div className="card-body">
        <div className="section-inner">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="py-12 text-center font-mono text-sm opacity-60">
              No {itemLabel.toLowerCase()} found matching your search.
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
                    <ToolCard key={tool.url || tool.slug || tool.title} tool={tool} />
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
