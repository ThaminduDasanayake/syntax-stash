"use client";

import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  ArrowSquareOutIcon,
  BroadcastIcon,
  CaretDownIcon,
  CaretUpIcon,
  CircleNotchIcon,
  PencilSimpleIcon,
  ShieldCheckIcon,
  TrashIcon,
  WarningCircleIcon,
  WarningOctagonIcon,
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
  action:
    | "approved"
    | "created"
    | "deleted"
    | "drift_detected"
    | "health_alert"
    | "redirect_detected"
    | "rejected"
    | "updated";
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

const ALERT_TYPE_FILTERS = [
  { label: "All Alerts", value: "all" },
  { label: "Broken Links", value: "health_alert" },
  { label: "Metadata Drift", value: "drift_detected" },
  { label: "URL Redirects", value: "redirect_detected" },
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

function getAlertBadgeStyle(action: ActivityLogItem["action"]) {
  switch (action) {
    case "drift_detected":
      return {
        bg: "bg-amber-500/15 border-amber-600/40 ",
        dot: "bg-amber-500",
        icon: WarningCircleIcon,
        label: "Metadata Drift",
      };
    case "redirect_detected":
      return {
        bg: "bg-sky-500/15 border-sky-600/40 ",
        dot: "bg-sky-500",
        icon: ArrowRightIcon,
        label: "URL Redirect",
      };
    case "health_alert":
      return {
        bg: "bg-rose-500/15 border-rose-600/40 ",
        dot: "bg-rose-500",
        icon: WarningOctagonIcon,
        label: "Broken Link",
      };
    default:
      return {
        bg: "bg-muted/40 text-muted-foreground border-line",
        dot: "bg-muted-foreground",
        icon: WarningCircleIcon,
        label: "Observed Change",
      };
  }
}

export function AdminHistoryClient({
  initialItems = [],
  initialTotal = 0,
}: AdminHistoryClientProps) {
  const [items, setItems] = useState<ActivityLogItem[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [alertFilter, setAlertFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (alertFilter !== "all") params.set("action", alertFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("limit", "100");

      const res = await fetch(`/api/admin/history?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setItems(data.items || []);
        setTotal(data.total || 0);
      } else {
        toast.error(data.error || "Failed to load change monitor alerts.");
      }
    } catch {
      toast.error("Network error while fetching monitor alerts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanCatalog = async () => {
    try {
      setIsScanning(true);
      toast.info("Scanning live website URLs for title/description drift and link health...");

      const res = await fetch("/api/admin/history/scan", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          `Scan complete: Scanned ${data.scanned} resources. Found ${data.drifts} remote drift(s), ${data.redirects} redirect(s), and ${data.broken} broken link(s). Catalog resources were not modified.`,
        );
        await fetchAlerts();
      } else {
        toast.error(data.error || "Failed to complete catalog scan.");
      }
    } catch {
      toast.error("Network error while running catalog scan.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDismissAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/history?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Alert dismissed.");
        setItems((prev) => prev.filter((item) => item.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        toast.error(data.error || "Failed to dismiss alert.");
      }
    } catch {
      toast.error("Network error while dismissing alert.");
    }
  };

  const handleClearAllAlerts = async () => {
    if (!window.confirm("Are you sure you want to clear all change alerts?")) {
      return;
    }

    try {
      setIsClearing(true);
      const res = await fetch("/api/admin/history?all=true", {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("All change monitor alerts cleared.");
        setItems([]);
        setTotal(0);
      } else {
        toast.error(data.error || "Failed to clear alerts.");
      }
    } catch {
      toast.error("Network error while clearing alerts.");
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAlerts();
  };

  const stats = useMemo(() => {
    return {
      brokenCount: items.filter((i) => i.action === "health_alert").length,
      driftCount: items.filter((i) => i.action === "drift_detected").length,
      redirectCount: items.filter((i) => i.action === "redirect_detected").length,
      totalCount: total,
    };
  }, [items, total]);

  return (
    <div className="font-mono text-xs">
      {/* Filter Toolbar */}
      <div className="border-line bg-paper/40 mb-6 space-y-4 rounded-lg border-[1.5px] p-4 shadow-xs">
        {/* Top Row: Search and Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 sm:max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts by resource title..."
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
              onClick={fetchAlerts}
              disabled={isLoading || isScanning}
              className="border-line hover:bg-surface h-9 gap-1.5 font-mono text-xs font-bold uppercase"
            >
              {isLoading ? (
                <CircleNotchIcon className="size-3.5 animate-spin" />
              ) : (
                <ArrowsClockwiseIcon weight="bold" className="size-3.5" />
              )}
              <span>Refresh</span>
            </Button>

            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllAlerts}
                disabled={isClearing || isLoading}
                className="border-line h-9 gap-1.5 font-mono text-xs font-bold text-rose-600 uppercase hover:bg-rose-500/10"
              >
                {isClearing ? (
                  <CircleNotchIcon className="size-3.5 animate-spin" />
                ) : (
                  <TrashIcon weight="bold" className="size-3.5" />
                )}
                <span>Clear All Alerts</span>
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Row: Alert Type Filter Chips */}
        <div className="border-line/60 flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-muted-foreground mr-1 text-[11px] font-bold uppercase">
            Filter:
          </span>
          {ALERT_TYPE_FILTERS.map((filter) => {
            const active = alertFilter === filter.value;
            return (
              <Button
                key={filter.value}
                type="button"
                size="xs"
                variant={active ? "default" : "outline"}
                onClick={() => setAlertFilter(filter.value)}
                className={cn(
                  "h-6 px-2.5 text-[11px] font-bold uppercase transition-all duration-150",
                  !active &&
                    "border-line bg-surface/60 text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">Total Alerts</div>
          <div className="text-foreground text-xl font-black">{stats.totalCount}</div>
        </div>
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">
            Metadata Drifts
          </div>
          <div className="text-xl font-black text-amber-600">{stats.driftCount}</div>
        </div>
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">URL Redirects</div>
          <div className="text-xl font-black text-sky-600">{stats.redirectCount}</div>
        </div>
        <div className="border-line bg-surface/30 rounded-lg border-[1.5px] p-3 text-center">
          <div className="text-muted-foreground text-[10px] font-bold uppercase">Broken Links</div>
          <div className="text-xl font-black text-rose-600">{stats.brokenCount}</div>
        </div>
      </div>

      {/* Alerts Timeline List */}
      {isLoading ? (
        <div className="border-line bg-paper flex min-h-[300px] flex-col items-center justify-center rounded-lg border-[1.5px] p-12 text-center">
          <CircleNotchIcon className="text-primary size-8 animate-spin" />
          <p className="text-muted-foreground mt-3 font-mono text-xs font-bold uppercase">
            Loading Change Monitor Alerts...
          </p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ShieldCheckIcon className="size-6 text-emerald-500" />}
          title="No Change Alerts Found"
          description={
            searchQuery || alertFilter !== "all"
              ? "No alerts match your active filters. Try resetting search or filter options."
              : "All catalog resources match their live websites. Click 'Scan Catalog for Changes' above to check for updates."
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const badgeStyle = getAlertBadgeStyle(item.action);
            const BadgeIcon = badgeStyle.icon;

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

            const liveUrl = (metadata?.url as string) || (metadata?.redirectUrl as string) || null;
            const isExpanded = Boolean(expandedItems[item.id]);

            return (
              <div
                key={item.id}
                className="border-line bg-paper/60 hover:border-primary/40 rounded-lg border-[1.5px] p-4 shadow-xs transition-all duration-150"
              >
                {/* Item Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Alert Type Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase",
                        badgeStyle.bg,
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", badgeStyle.dot)} />
                      <BadgeIcon weight="bold" className="size-3" />
                      <span>{badgeStyle.label}</span>
                    </span>

                    {/* Entity Title */}
                    <span className="text-foreground text-xs font-black">{item.entityTitle}</span>
                  </div>

                  {/* Timestamp & Actions */}
                  <div className="flex items-center gap-2.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground cursor-default font-mono text-[11px] underline decoration-dotted">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="font-mono text-xs">
                        {new Date(item.createdAt).toLocaleString()}
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDismissAlert(item.id)}
                      className="text-muted-foreground hover:text-foreground size-7"
                      title="Dismiss Alert"
                    >
                      <TrashIcon weight="bold" className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Diff Viewer / Observed Changes */}
                {diffs.length > 0 && (
                  <div className="mt-3">
                    <div className="border-line/60 bg-surface/30 rounded-md border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-muted-foreground text-[10px] font-bold uppercase">
                          Observed Remote Changes ({diffs.length})
                        </span>
                        {diffs.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => toggleExpand(item.id)}
                            className="text-primary hover:text-primary/80 h-auto p-0 text-[10px] font-bold uppercase"
                          >
                            <span>{isExpanded ? "Collapse" : "Show All Diffs"}</span>
                            {isExpanded ? (
                              <CaretUpIcon weight="bold" className="size-3" />
                            ) : (
                              <CaretDownIcon weight="bold" className="size-3" />
                            )}
                          </Button>
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
                              <span className="max-w-xs truncate rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-700">
                                <strong className="font-semibold opacity-75">Stored:</strong>{" "}
                                {formatDiffValue(diff.oldValue)}
                              </span>
                              <ArrowRightIcon
                                weight="bold"
                                className="text-muted-foreground size-3 shrink-0"
                              />
                              <span className="max-w-xs truncate rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                <strong className="font-semibold opacity-75">Live:</strong>{" "}
                                {formatDiffValue(diff.newValue)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div className="border-line/40 mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-2.5">
                  <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                    <span className="bg-surface/80 border-line rounded border px-1.5 py-0.5">
                      Status: <strong className="text-foreground">Catalog Unchanged</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-line bg-surface text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-bold uppercase transition-colors"
                      >
                        <ArrowSquareOutIcon weight="bold" className="size-3" />
                        <span>Visit Site</span>
                      </a>
                    )}

                    {item.entityId && (
                      <Link
                        href={`/admin/resources/${item.entityId}`}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold uppercase transition-colors"
                      >
                        <PencilSimpleIcon weight="bold" className="size-3" />
                        <span>Edit Resource</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
