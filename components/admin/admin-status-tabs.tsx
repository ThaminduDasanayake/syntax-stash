"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { SubmissionCounts, TAB_CONFIG, TABS, TabStatus } from "./types";

interface AdminStatusTabsProps {
  activeTab: TabStatus;
  counts: SubmissionCounts;
  onSearchChange: (query: string) => void;
  onTabChange: (tab: TabStatus) => void;
  searchQuery: string;
}

export function AdminStatusTabs({
  activeTab,
  counts,
  onSearchChange,
  onTabChange,
  searchQuery,
}: AdminStatusTabsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 border-b pb-3 sm:border-b-0 sm:pb-0 font-mono">
        {TABS.map((tab) => {
          const conf = TAB_CONFIG[tab];
          const isActive = activeTab === tab;
          return (
            <Button
              key={tab}
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => onTabChange(tab)}
              className={cn(
                "h-8 gap-2 rounded-md font-mono text-xs font-bold uppercase transition-all duration-150 active:scale-95",
                isActive ? conf.activeClasses : conf.inactiveClasses,
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full transition-opacity",
                  conf.dotColor,
                  isActive ? "opacity-100 ring-1 ring-current" : "opacity-80",
                )}
              />
              <span>{conf.label}</span>
              <span
                className={cn(
                  "min-w-4.5 rounded px-1.5 py-0.2 text-center text-[10px] font-extrabold font-mono",
                  isActive ? conf.badgeActive : conf.badgeInactive,
                )}
              >
                {counts[tab]}
              </span>
            </Button>
          );
        })}
      </div>

      <div className="w-full sm:w-64 font-mono">
        <Input
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-xs"
        />
      </div>
    </div>
  );
}
