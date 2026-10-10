"use client";

import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CompassIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useBookmarks } from "@/hooks/use-bookmarks";
import { getCategoryTheme, THEME_CONFIG } from "@/lib/utils";
import { Resource } from "@/types";

interface HeroResourceShowcaseProps {
  featuredResources?: Resource[];
}

const FALLBACK_RESOURCES: Array<{
  category: string;
  description: string;
  id: string;
  ogImage?: string;
  tags: string[];
  title: string;
  url: string;
}> = [
  {
    id: "biome",
    title: "Biome",
    category: "Developer Tools & Utilities",
    description: "One toolchain for your web project: format, lint, and more in a fraction of a second.",
    tags: ["formatter", "linter", "rust", "tooling"],
    url: "https://biomejs.dev",
  },
  {
    id: "lucide",
    title: "Lucide Icons",
    category: "Icons & Glyphs",
    description: "Beautiful & consistent icons made by the community. Fork of Feather Icons.",
    ogImage: "https://lucide.dev/og.png",
    tags: ["icons", "svg", "ui"],
    url: "https://lucide.dev",
  },
  {
    id: "motion",
    title: "Motion",
    category: "Animation & Motion",
    description: "A production-ready motion library for React. Formerly Framer Motion.",
    ogImage: "https://motion.dev/images/og.png",
    tags: ["animation", "motion", "react"],
    url: "https://motion.dev",
  },
  {
    id: "shadcn-ui",
    title: "shadcn/ui",
    category: "Design Systems",
    description: "Beautifully designed components that you can copy and paste into your apps.",
    ogImage: "https://ui.shadcn.com/og.jpg",
    tags: ["components", "radix", "tailwind", "ui"],
    url: "https://ui.shadcn.com",
  },
  {
    id: "vercel-ai-sdk",
    title: "Vercel AI SDK",
    category: "AI & Machine Learning",
    description: "The AI SDK is the TypeScript toolkit designed to help developers build AI apps.",
    tags: ["ai", "llm", "streaming", "typescript"],
    url: "https://sdk.vercel.ai",
  },
];

const SHOWCASE_TABS = [
  { id: "AI & Machine Learning", icon: CompassIcon, label: "AI & ML" },
  { id: "all", icon: SparkleIcon, label: "All Curated" },
  { id: "Animation & Motion", icon: CompassIcon, label: "Animation" },
  { id: "Design Systems", icon: CompassIcon, label: "UI & Design" },
  { id: "Developer Tools & Utilities", icon: CompassIcon, label: "Dev Tools" },
];

export function HeroResourceShowcase({ featuredResources = [] }: HeroResourceShowcaseProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const { bookmarkedSet, toggleBookmark } = useBookmarks();

  const items = useMemo(() => {
    const list = featuredResources.length > 0 ? featuredResources : FALLBACK_RESOURCES;
    let filtered = list;

    if (activeTab !== "all") {
      filtered = filtered.filter(
        (r) => r.category.toLowerCase() === activeTab.toLowerCase() || r.category.includes(activeTab),
      );
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return filtered.slice(0, 4);
  }, [activeTab, featuredResources, searchFilter]);

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="from-brand-orange/20 via-brand-purple/20 to-brand-green/15 pointer-events-none absolute -inset-4 rounded-3xl bg-linear-to-tr opacity-60 blur-2xl transition-all duration-700"
      />

      {/* Main Window */}
      <div className="border-white/12 bg-[#121214]/95 shadow-[0_24px_70px_rgba(0,0,0,0.75)] relative overflow-hidden rounded-2xl border-[1.5px] backdrop-blur-2xl">
        {/* Title Bar */}
        <div className="border-white/8 bg-[#141416] flex items-center justify-between border-b-[1.5px] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full border-[1.5px] border-red-500 bg-red-500/80" />
            <span className="size-3 rounded-full border-[1.5px] border-amber-500 bg-amber-500/80" />
            <span className="size-3 rounded-full border-[1.5px] border-emerald-500 bg-emerald-500/80" />
            <span className="text-muted-foreground ml-2 hidden font-mono text-[11px] font-semibold sm:inline-block">
              syntaxstash.com/resources
            </span>
          </div>

          <div className="border-primary/25 bg-primary/10 text-primary flex items-center gap-1.5 rounded-full border-[1.5px] px-2.5 py-0.5 font-mono text-[10px] font-bold">
            <SparkleIcon weight="fill" className="size-3" />
            <span>1,481+ Stashed</span>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="border-white/8 bg-[#161619] flex flex-col gap-2 border-b-[1.5px] p-2.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-0.5">
            {SHOWCASE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-white/12 text-white shadow-xs border border-white/15"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mini Search input */}
          <div className="border-white/8 bg-white/4 focus-within:border-primary/50 relative flex h-7.5 w-full items-center rounded-lg border px-2 sm:w-40">
            <MagnifyingGlassIcon className="text-muted-foreground mr-1.5 size-3 shrink-0" />
            <input
              type="text"
              placeholder="Filter preview..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="text-foreground placeholder:text-muted-foreground/60 h-full w-full bg-transparent font-mono text-[11px] outline-none"
            />
          </div>
        </div>

        {/* Resource Cards Grid Preview */}
        <div className="grid grid-cols-1 gap-2.5 p-3 sm:grid-cols-2 sm:p-3.5">
          {items.length === 0 ? (
            <div className="col-span-full py-12 text-center font-mono text-xs text-zinc-500">
              No matching resources found in preview
            </div>
          ) : (
            items.map((item) => {
              const theme = getCategoryTheme(item.category);
              const themeConfig = THEME_CONFIG[theme];
              const isSaved = bookmarkedSet.has(item.id || item.url);

              return (
                <div
                  key={item.id || item.url}
                  className="group border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/4 relative flex flex-col justify-between rounded-xl border-[1.5px] p-3 transition-all duration-200"
                >
                  <div>
                    {/* Header: Category Dot + Title + Bookmark */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={`size-1.5 shrink-0 rounded-full ${themeConfig.dot}`}
                        />
                        <span className="text-muted-foreground truncate font-mono text-[10px] uppercase">
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(item.id || item.url);
                        }}
                        className={`cursor-pointer rounded-md p-1 transition-colors ${
                          isSaved
                            ? "text-primary bg-primary/10"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/6"
                        }`}
                        title={isSaved ? "Saved in stash" : "Save resource"}
                      >
                        <BookmarkSimpleIcon
                          weight={isSaved ? "fill" : "bold"}
                          className="size-3.5"
                        />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-foreground group-hover:text-primary mt-1 font-mono text-sm font-bold transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mt-1 line-clamp-2 font-mono text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer: Tags */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2">
                    <div className="no-scrollbar flex flex-wrap gap-1">
                      {item.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="border-white/6 bg-white/4 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[9px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 flex items-center gap-0.5 font-mono text-[10px] font-semibold"
                    >
                      <span>Visit</span>
                      <ArrowRightIcon weight="bold" className="size-2.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner Footer */}
        <div className="border-white/8 bg-[#141416] flex items-center justify-between border-t-[1.5px] px-4 py-2.5 font-mono text-xs">
          <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
            <span className="bg-emerald-500 inline-block size-1.5 rounded-full" />
            <span>1,481 resources live</span>
          </div>

          <Link
            href="/resources"
            className="text-primary hover:text-primary/80 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors"
          >
            <span>Explore all 1,481</span>
            <ArrowRightIcon weight="bold" className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
