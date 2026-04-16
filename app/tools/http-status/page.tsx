"use client";

import { Globe2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";

import { HTTP_STATUS_CODES, STATUS_CATEGORIES, STATUS_CATEGORY_LABELS, StatusCategory } from "./data";

const CATEGORY_STYLES: Record<StatusCategory, { card: string; code: string; badge: string }> = {
  "1xx": {
    card: "border-border hover:border-border/80",
    code: "text-muted-foreground",
    badge: "border-border/50 bg-muted/50 text-muted-foreground",
  },
  "2xx": {
    card: "border-green-500/20 hover:border-green-500/40",
    code: "text-green-400",
    badge: "border-green-500/20 bg-green-500/10 text-green-400",
  },
  "3xx": {
    card: "border-blue-500/20 hover:border-blue-500/40",
    code: "text-blue-400",
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },
  "4xx": {
    card: "border-yellow-500/20 hover:border-yellow-500/40",
    code: "text-yellow-400",
    badge: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },
  "5xx": {
    card: "border-red-500/20 hover:border-red-500/40",
    code: "text-red-400",
    badge: "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

export default function HttpStatusPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return HTTP_STATUS_CODES.filter((entry) => {
      const matchesCategory =
        activeCategory === "All" || entry.category === activeCategory;
      const matchesSearch =
        !q ||
        String(entry.code).includes(q) ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.useCase.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  function copyCode(code: number) {
    navigator.clipboard.writeText(String(code));
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }

  return (
    <ToolLayout
      icon={Globe2}
      title="HTTP Status"
      highlight="Reference"
      description="Every standard HTTP status code with descriptions and real-world use cases. Click any card to copy the code."
      maxWidth="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Search + filter */}
        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, or description (e.g. 404, redirect, rate limit)…"
            className="h-11"
          />
          <div className="flex flex-wrap gap-2">
            {STATUS_CATEGORIES.map((cat) => {
              const isAll = cat === "All";
              const label = isAll ? "All" : STATUS_CATEGORY_LABELS[cat as StatusCategory];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result count */}
        <p className="text-muted-foreground text-xs">
          Showing <span className="text-foreground font-semibold">{filtered.length}</span> of {HTTP_STATUS_CODES.length} codes
        </p>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">
            No codes found for &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((entry) => {
              const styles = CATEGORY_STYLES[entry.category];
              const isCopied = copiedCode === entry.code;
              return (
                <button
                  key={entry.code}
                  onClick={() => copyCode(entry.code)}
                  className={`bg-card border rounded-xl p-4 text-left transition-all hover:shadow-sm ${styles.card}`}
                >
                  {/* Code + badge */}
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className={`font-mono text-2xl font-bold tabular-nums ${isCopied ? "text-primary" : styles.code}`}>
                      {isCopied ? "Copied!" : entry.code}
                    </span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
                      {entry.category}
                    </span>
                  </div>

                  {/* Name */}
                  <p className="text-foreground mb-1 text-sm font-semibold leading-snug">{entry.name}</p>

                  {/* Description */}
                  <p className="text-muted-foreground mb-3 text-xs leading-relaxed line-clamp-3">{entry.description}</p>

                  {/* Use case */}
                  <div className="border-border border-t pt-2">
                    <p className="text-muted-foreground/70 text-xs leading-relaxed line-clamp-2">
                      {entry.useCase}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-muted-foreground text-xs">
          Click any card to copy the status code. Descriptions based on RFC 7231 and related standards.
        </p>
      </div>
    </ToolLayout>
  );
}
