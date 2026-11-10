"use client";

import { useMemo } from "react";

import { FluidSearch } from "@/components/ui/fluid-search";
import { SelectBar, type SelectBarItem } from "@/components/ui/select-bar";
import { cn } from "@/lib/utils";

import { SubmissionCounts, TAB_CONFIG, TABS, TabStatus } from "./types";

const BADGE_CLASSES: Record<TabStatus, string> = {
  all: "border-white/10 bg-white/10 text-zinc-300",
  approved: "border-emerald-500/35 bg-emerald-500/15 text-emerald-400",
  pending: "border-amber-500/35 bg-amber-500/15 text-amber-400",
  rejected: "border-rose-500/35 bg-rose-500/15 text-rose-400",
};

interface StatusTabsProps {
  activeTab: TabStatus;
  counts: SubmissionCounts;
  onSearchChange: (query: string) => void;
  onTabChange: (tab: TabStatus) => void;
  searchQuery: string;
}

export function StatusTabs({
  activeTab,
  counts,
  onSearchChange,
  onTabChange,
  searchQuery,
}: StatusTabsProps) {
  const {
    all: allCount,
    approved: approvedCount,
    pending: pendingCount,
    rejected: rejectedCount,
  } = counts;

  const items: SelectBarItem<TabStatus>[] = useMemo(() => {
    const countMap: SubmissionCounts = {
      all: allCount,
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
    };
    return TABS.map((tab) => {
      const conf = TAB_CONFIG[tab];
      const count = countMap[tab];
      return {
        title: `${conf.label} (${count})`,
        key: tab,
        label: (
          <span className="flex items-center gap-1.5">
            <span>{conf.label}</span>
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 font-mono text-[10px] leading-none font-extrabold tabular-nums",
                BADGE_CLASSES[tab],
              )}
            >
              {count}
            </span>
          </span>
        ),
      };
    });
  }, [allCount, approvedCount, pendingCount, rejectedCount]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <SelectBar<TabStatus>
        items={items}
        value={activeTab}
        onChange={onTabChange}
        size="sm"
        className="font-mono text-xs uppercase"
        ariaLabel="Submission status filter"
      />

      <div className="w-full font-mono sm:w-72">
        <FluidSearch
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={onSearchChange}
          onClear={() => onSearchChange("")}
          className="text-xs"
        />
      </div>
    </div>
  );
}
