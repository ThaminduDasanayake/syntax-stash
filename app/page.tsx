"use client";

import { useState, useMemo } from "react";
import SpotlightSearch from "@/components/SpotlightSearch";
import FilterPills from "@/components/FilterPills";
import ToolGrid from "@/components/ToolGrid";
import { tools, categories } from "@/lib/data";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tools.filter((tool) => {
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="hacker-grid min-h-screen">
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 md:py-32 flex flex-col gap-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
            syntax<span className="text-orange-500">-</span>stash
          </h1>
          <p className="text-zinc-400 text-base md:text-lg">
            Your curated stash of developer tools and resources
          </p>
        </div>

        <SpotlightSearch value={searchQuery} onChange={setSearchQuery} />

        <FilterPills
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        <ToolGrid tools={filtered} />
      </div>
    </div>
  );
}
