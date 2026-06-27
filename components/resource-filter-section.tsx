"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { DotButton } from "@/components/dot-button";
import ToolCard from "@/components/tool-card";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";
import { Tool } from "@/types";

interface ResourceFilterSectionProps {
  initialCategory?: string;
  resourceLinks: Tool[];
  resourceCategories: string[];
}

export function ResourceFilterSection({
  initialCategory,
  resourceCategories,
  resourceLinks,
}: ResourceFilterSectionProps) {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    initialCategory || null,
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    setSelectedCategory(initialCategory || null);
  }, [initialCategory]);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      router.push("/resources", { scroll: false });
    } else {
      setSelectedCategory(category);
      router.push(`/resources/${slugify(category)}`, { scroll: false });
    }
  };

  const filteredLinks = React.useMemo(() => {
    return resourceLinks.filter((tool) => {
      // Category filter
      if (selectedCategory && tool.category !== selectedCategory) {
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
  }, [resourceLinks, searchQuery, selectedCategory]);

  // Group the filtered links by category
  const groupedResources = React.useMemo(() => {
    return filteredLinks.reduce(
      (acc, resource) => {
        if (!acc[resource.category]) acc[resource.category] = [];
        acc[resource.category].push(resource);
        return acc;
      },
      {} as Record<string, Tool[]>,
    );
  }, [filteredLinks]);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-search-wrap">
            <MagnifyingGlassIcon weight="bold" className="filter-search-icon" />
            <Input
              className="filter-search"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-pills">
            {resourceCategories.map((item, i) => {
              const isActive = selectedCategory === item;
              return (
                <DotButton
                  key={i}
                  isActive={isActive}
                  index={i}
                  label={item}
                  onClick={() => handleCategoryClick(item)}
                />
              );
            })}
          </div>
          <div className="filter-count">
            <span className="filter-count-num">{filteredLinks.length}</span>
            <span> of {resourceLinks.length}</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="section-inner">
          {Object.keys(groupedResources).length === 0 ? (
            <div className="py-12 text-center font-mono text-sm opacity-60">
              No resources found matching your search.
            </div>
          ) : (
            Object.entries(groupedResources).map(([category, items]) => (
              <div key={category} className="cat-section">
                <div className="cat-divider">
                  <h2 className="font-mono text-xl font-extrabold tracking-widest uppercase">
                    {category}
                  </h2>
                  <span className="bg-primary h-0.5 flex-1" />

                  <span className="text-mono-sm">{items.length} Resources</span>
                </div>
                <div className="card-grid">
                  {items.map((resource) => (
                    <ToolCard key={resource.url} tool={resource} />
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
