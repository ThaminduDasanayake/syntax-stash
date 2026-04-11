"use client";

import { useState, useMemo } from "react";
import SpotlightSearch from "@/components/SpotlightSearch";
import FilterPills from "@/components/FilterPills";
import ToolGrid from "@/components/ToolGrid";
import type { Tool } from "@/lib/data";

type Props = {
  tools: Tool[];
  categories: string[];
};

export default function ToolDashboard({ tools, categories }: Props) {
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
  }, [searchQuery, activeCategory, tools]);

  return (
    <>
      <SpotlightSearch value={searchQuery} onChange={setSearchQuery} />
      <FilterPills
        categories={categories}
        active={activeCategory}
        onSelect={setActiveCategory}
      />
      <ToolGrid tools={filtered} />
    </>
  );
}
