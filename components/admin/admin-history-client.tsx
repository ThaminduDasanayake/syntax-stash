"use client";

import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  BroadcastIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  ClockCounterClockwiseIcon,
  FoldersIcon,
  PencilSimpleIcon,
  PlusIcon,
  StackIcon,
  TagIcon,
  TrashIcon,
  TrayIcon,
  UserCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface ActivityDiffItem {
  field: string;
  label: string;
  newValue: unknown;
  oldValue: unknown;
}

export interface ActivityLogItem {
  action: "approved" | "created" | "deleted" | "rejected" | "updated";
  actorEmail: null | string;
  createdAt: Date | string;
  diff: null | string;
  entityId: null | string;
  entityTitle: string;
  entityType: "author" | "category" | "resource" | "submission" | "tag";
  id: string;
  metadata: null | string;
}

interface AdminHistoryClientProps {
  initialItems?: ActivityLogItem[];
  initialTotal?: number;
}

const ENTITY_FILTERS = [
  { icon: ClockCounterClockwiseIcon, label: "All Items", value: "all" },
  { icon: FoldersIcon, label: "Categories", value: "category" },
  { icon: StackIcon, label: "Resources", value: "resource" },
  { icon: TagIcon, label: "Tags", value: "tag" },
  { icon: TrayIcon, label: "Submissions", value: "submission" },
  { icon: UserCircleIcon, label: "Authors", value: "author" },
];

const ACTION_FILTERS = [
  { label: "All Actions", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Created", value: "created" },
  { label: "Deleted", value: "deleted" },
  { label: "Rejected", value: "rejected" },
  { label: "Updated", value: "updated" },
];

function formatTimeAgo(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

function formatDiffValue(val: unknown): string {
  if (val === null || val === undefined || val === "") {
    return "— (None)";
  }
  if (typeof val === "boolean") {
    return val ? "Yes" : "No";
  }
  if (typeof val === "object") {
    return JSON.stringify(val);
  }
  return String(val).trim();
}

function getActionBadgeStyle(action: ActivityLogItem["action"]) {
  switch (action) {
    case "created":
      return {
        bg: "bg-emerald-500/15 text-emerald-700 border-emerald-600/40 dark:text-emerald-400",
        dot: "bg-emerald-500",
        icon: PlusIcon,
        label: "Created",
      };
    case "updated":
      return {
        bg: "bg-sky-500/15 text-sky-700 border-sky-600/40 dark:text-sky-400",
        dot: "bg-sky-500",
        icon: PencilSimpleIcon,
        label: "Updated",
      };
    case "approved":
      return {
        bg: "bg-emerald-600/20 text-emerald-800 border-emerald-600/60 dark:text-emerald-300",
        dot: "bg-emerald-600",
        icon: CheckCircleIcon,
        label: "Approved",
      };
    case "rejected":
      return {
        bg: "bg-rose-500/15 text-rose-700 border-rose-600/40 dark:text-rose-400",
        dot: "bg-rose-500",
        icon: XCircleIcon,
        label: "Rejected",
      };
    case "deleted":
      return {
        bg: "bg-red-500/15 text-red-700 border-red-600/40 dark:text-red-400",
        dot: "bg-red-500",
        icon: TrashIcon,
        label: "Deleted",
      };
  }
}

function getEntityTypeBadgeStyle(type: ActivityLogItem["entityType"]) {
  switch (type) {
    case "resource":
      return {
        icon: StackIcon,
        label: "Resource",
      };
    case "submission":
      return {
        icon: TrayIcon,
        label: "Submission",
      };
    case "category":
      return {
        icon: FoldersIcon,
        label: "Category",
      };
    case "author":
      return {
        icon: UserCircleIcon,
        label: "Author",
      };
    case "tag":
      return {
        icon: TagIcon,
        label: "Tag",
      };
  }
}

export function AdminHistoryClient({
  initialItems = [],
  initialTotal = 0,
}: AdminHistoryClientProps) {
  const [items, setItems] = useState<ActivityLogItem[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [entityFilter, setEntityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [isScanning, setIsScanning] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (entityFilter !== "all") params.set("entityType", entityFilter);
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("limit", "100");

      const res = await fetch(`/api/admin/history?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setItems(data.items || []);
        setTotal(data.total || 0);
      } else {
        toast.error(data.error || "Failed to load activity logs.");
      }
    } catch {
      toast.error("Network error while fetching activity logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanCatalog = async () => {
    try {
      setIsScanning(true);
      toast.info("Starting live metadata & health scan across catalog resources...");

      const res = await fetch("/api/admin/history/scan", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          `Scan complete: Scanned ${data.scanned} resources. Found ${data.drifts} remote drift(s), ${data.redirects} redirect(s), and ${data.broken} broken link(s).`,
        );
        await fetchHistory();
      } else {
        toast.error(data.error || "Failed to complete catalog scan.");
      }
    } catch {
      toast.error("Network error while running catalog scan.");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, entityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const stats = useMemo(() => {
    return {
      approvedCount: items.filter((i) => i.action === "approved").length,
      createdCount: items.filter((i) => i.action === "created").length,
      deletedCount: items.filter((i) => i.action === "deleted").length,
      totalCount: total,
      updatedCount: items.filter((i) => i.action === "updated").length,
    };
  }, [items, total]);

  return (
    <div className="font-mono text-xs">
      {/* Filter Toolbar */}
      <div className="border-line bg-paper/40 mb-6 space-y-4 rounded-lg border-[1.5px] p-4 shadow-xs">
        {/* Top Row: Search and Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 sm:max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or admin..."
              containerClassName="h-9"
              className="font-mono text-xs"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleScanCatalog}
              disabled={isScanning || isLoading}
              className="border-line hover:bg-surface h-9 gap-1.5 font-mono text-xs font-bold uppercase"
            >
              {isScanning ? (
                <>
                  <CircleNotchIcon className="size-3.5 animate-spin" />
                  <span>Scanning Live Sites...</span>
                </>
              ) : (
                <>
                  <BroadcastIcon weight="bold" className="text-primary size-3.5" />
                  <span>Scan Catalog for Changes</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchHistory}
              disabled={isLoading || isScanning}
              className="border-line hover:bg-surface h-9 gap-1.5 font-mono text-xs font-bold uppercase"
            >
              {isLoading ? (
                <CircleNotchIcon className="size-3.5 animate-spin" />
              ) : (
                <ArrowsClockwiseIcon weight="bold" className="size-3.5" />
              )}
              <span>Refresh Log</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: Entity and Action Chip Filters */}
        <div className="border-line/60 flex flex-wrap items-center justify-between gap-4 border-t pt-3">
          {/* Entity Type Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground mr-1 text-[11px] font-bold uppercase">Type:</span>
            {ENTITY_FILTERS.map((filter) => {
              const Icon = filter.icon;
              const active = entityFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setEntityFilter(filter.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-bold uppercase transition-all duration-150",
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border-line bg-surface/60 text-muted-foreground hover:bg-surface hover:text-foreground border",
                  )}
                >
                  <Icon weight={active ? "fill" : "bold"} className="size-3.5" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground mr-1 text-[11px] font-bold uppercase">
              Action:
            </span>
            {ACTION_FILTERS.map((filter) => {
              const active = actionFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActionFilter(filter.value)}
                  className={cn(
                    "rounded px-2.5 py-1 text-[11px] font-bold uppercase transition-all duration-150",
                    active
                      ? "bg-foreground text-background shadow-xs"
                      : "border-line bg-surface/60 text-muted-foreground hover:bg-surface hover:text-foreground border",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">Total Logged</div>
          <div className="text-foreground text-xl font-black">{stats.totalCount}</div>
        </div>
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">Updates</div>
          <div className="text-sky-600 text-xl font-black dark:text-sky-400">
            {stats.updatedCount}
          </div>
        </div>
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">Creations</div>
          <div className="text-emerald-600 text-xl font-black dark:text-emerald-400">
            {stats.createdCount}
          </div>
        </div>
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">Approvals</div>
          <div className="text-emerald-700 text-xl font-black dark:text-emerald-300">
            {stats.approvedCount}
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      {isLoading ? (
        <div className="border-line bg-paper flex min-h-[300px] flex-col items-center justify-center rounded-lg border-[1.5px] p-12 text-center">
          <CircleNotchIcon className="text-primary size-8 animate-spin" />
          <p className="text-muted-foreground mt-3 font-mono text-xs font-bold uppercase">
            Loading Activity Timeline...
          </p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ClockCounterClockwiseIcon className="size-6" />}
          title="No Activity Logged Yet"
          description={
            searchQuery || entityFilter !== "all" || actionFilter !== "all"
              ? "No administrative events match your active filters. Try adjusting the search query or filters."
              : "Administrative actions, resource edits, and approvals will automatically appear here as they occur."
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const actionStyle = getActionBadgeStyle(item.action);
            const entityStyle = getEntityTypeBadgeStyle(item.entityType);
            const ActionIcon = actionStyle.icon;
            const EntityIcon = entityStyle.icon;

            let diffs: ActivityDiffItem[] = [];
            if (item.diff) {
              try {
                diffs = JSON.parse(item.diff);
              } catch {
                diffs = [];
              }
            }

            let metadata: Record<string, unknown> | null = null;
            if (item.metadata) {
              try {
                metadata = JSON.parse(item.metadata);
              } catch {
                metadata = null;
              }
            }

            const isExpanded = Boolean(expandedItems[item.id]);

            return (
              <div
                key={item.id}
                className="border-line bg-paper/60 hover:border-primary/40 rounded-lg border-[1.5px] p-4 transition-all duration-150 shadow-xs"
              >
                {/* Item Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Entity Type Tag */}
                    <span className="border-line bg-surface/80 text-muted-foreground inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase">
                      <EntityIcon weight="bold" className="size-3" />
                      <span>{entityStyle.label}</span>
                    </span>

                    {/* Action Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase",
                        actionStyle.bg,
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", actionStyle.dot)} />
                      <ActionIcon weight="bold" className="size-3" />
                      <span>{actionStyle.label}</span>
                    </span>

                    {/* Entity Title Link */}
                    <span className="text-foreground text-xs font-black">
                      {item.entityType === "resource" && item.entityId ? (
                        <Link
                          href={`/admin/resources/${item.entityId}`}
                          className="hover:text-primary hover:underline"
                        >
                          {item.entityTitle}
                        </Link>
                      ) : (
                        item.entityTitle
                      )}
                    </span>
                  </div>

                  {/* Actor and Timestamp */}
                  <div className="text-muted-foreground flex items-center gap-2.5 text-[11px]">
                    {item.actorEmail && (
                      <span className="bg-surface/60 rounded px-1.5 py-0.5 text-[10px]">
                        by <strong className="text-foreground">{item.actorEmail}</strong>
                      </span>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default font-mono underline decoration-dotted">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="font-mono text-xs">
                        {new Date(item.createdAt).toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Diff Viewer / Changes Preview */}
                {diffs.length > 0 && (
                  <div className="mt-3">
                    <div className="border-line/60 bg-surface/30 rounded-md border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-muted-foreground text-[10px] font-bold uppercase">
                          {diffs.length} Changed Property{diffs.length === 1 ? "" : "ies"}
                        </span>
                        {diffs.length > 2 && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(item.id)}
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-[10px] font-bold uppercase"
                          >
                            <span>{isExpanded ? "Collapse" : "Show All Diffs"}</span>
                            {isExpanded ? (
                              <CaretUpIcon weight="bold" className="size-3" />
                            ) : (
                              <CaretDownIcon weight="bold" className="size-3" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Diff Entries */}
                      <div className="space-y-2">
                        {(isExpanded ? diffs : diffs.slice(0, 2)).map((diff, idx) => (
                          <div
                            key={idx}
                            className="bg-background/80 border-line/40 grid grid-cols-1 gap-2 rounded border p-2 text-[11px] sm:grid-cols-12 sm:items-center"
                          >
                            <span className="text-foreground font-bold uppercase sm:col-span-3">
                              {diff.label || diff.field}:
                            </span>
                            <div className="flex flex-wrap items-center gap-2 sm:col-span-9">
                              <span className="bg-rose-500/10 text-rose-700 border-rose-500/20 max-w-xs truncate rounded border px-1.5 py-0.5 text-[10px] line-through dark:text-rose-400">
                                {formatDiffValue(diff.oldValue)}
                              </span>
                              <ArrowRightIcon weight="bold" className="text-muted-foreground size-3 shrink-0" />
                              <span className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 max-w-xs truncate rounded border px-1.5 py-0.5 text-[10px] font-bold dark:text-emerald-400">
                                {formatDiffValue(diff.newValue)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Metadata Context Tags (if available) */}
                {metadata && Object.keys(metadata).length > 0 && diffs.length === 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px]">
                    {Object.entries(metadata).map(([k, v]) => (
                      <span
                        key={k}
                        className="bg-surface/60 border-line text-muted-foreground rounded border px-1.5 py-0.5"
                      >
                        <strong className="text-foreground uppercase">{k}:</strong> {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
