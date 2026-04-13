"use client";

import { useMemo, useState } from "react";

import FilterPills from "@/components/FilterPills";
import SpotlightSearch from "@/components/SpotlightSearch";
import ToolGrid from "@/components/ToolGrid";
import { ToolDashboardProps } from "@/types";

export default function ToolDashboard({ tools, categories }: ToolDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tools.filter((tool) => {
      const matchesSearch =
        !q || tool.title.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, tools]);

  return (
    <>
      <SpotlightSearch value={searchQuery} onChangeAction={setSearchQuery} />
      <FilterPills
        categories={categories}
        active={activeCategory}
        onSelectAction={setActiveCategory}
      />
      <ToolGrid tools={filtered} />
    </>
  );
}
