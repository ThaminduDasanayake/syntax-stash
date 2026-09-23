"use client";

import {
  ArrowsClockwiseIcon,
  HeartbeatIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SquaresFourIcon,
  TableIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  adminItemToResource,
  AdminPagination,
  AdminResourceCard,
  AdminResourceItem,
  AdminResourceTable,
  AdminToolbar,
  FilterSelect,
  SortSelect,
} from "@/components/admin";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { ResourceDialog } from "@/components/resource-dialog";
import { AddButton } from "@/components/ui/add-button";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { SelectField } from "@/components/ui/select-field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Oldest First", value: "oldest" },
  { label: "Recently Added", value: "newest" },
  { label: "Recently Updated", value: "updated-desc" },
  { label: "Title (A → Z)", value: "title-asc" },
  { label: "Title (Z → A)", value: "title-desc" },
];

interface AdminResourcesClientProps {
  _initialCategoryCounts?: Record<string, number>;
  initialResources: AdminResourceItem[];
}

function AdminResourcesClientContent({
  _initialCategoryCounts = {},
  initialResources = [],
}: AdminResourcesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const paramSort = searchParams.get("sort") || "newest";
  const paramCategory = searchParams.get("category") || "all";
  const paramHealth = searchParams.get("health") || "all";
  const paramView = searchParams.get("view") === "table" ? "table" : "cards";
  const paramPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const paramQ = searchParams.get("q") || "";

  const { categories } = useCategories();
  const [resources, setResources] = useState<AdminResourceItem[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState(paramQ);
  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory);
  const [healthFilter, setHealthFilter] = useState<string>(paramHealth);
  const [sortBy, setSortBy] = useState<string>(paramSort);
  const [viewMode, setViewMode] = useState<"cards" | "table">(paramView);
  const [currentPage, setCurrentPage] = useState(paramPage);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync resources if server props change (e.g. after router.refresh() on return from edit/create)
  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  // Sync state with URL params when URL changes externally (e.g. back/forward navigation)
  useEffect(() => {
    setSearchQuery((prev) => (prev.trim() === paramQ.trim() ? prev : paramQ));
    setSelectedCategory(paramCategory);
    setHealthFilter(paramHealth);
    setSortBy(paramSort);
    setViewMode(paramView);
    setCurrentPage(paramPage);
  }, [paramCategory, paramHealth, paramPage, paramQ, paramSort, paramView]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const syncUrl = useCallback(
    (
      newSort: string,
      newCategory: string,
      newHealth: string,
      newView: "cards" | "table",
      newPage: number,
      newQ: string,
    ) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams();

      if (newSort && newSort !== "newest") {
        params.set("sort", newSort);
      }
      if (newCategory && newCategory !== "all") {
        params.set("category", newCategory);
      }
      if (newHealth && newHealth !== "all") {
        params.set("health", newHealth);
      }
      if (newView && newView !== "cards") {
        params.set("view", newView);
      }
      if (newPage > 1) {
        params.set("page", String(newPage));
      }
      if (newQ && newQ.trim()) {
        params.set("q", newQ.trim());
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [pathname],
  );

  // Preview & Deletion state
  const [previewResource, setPreviewResource] = useState<AdminResourceItem | null>(null);
  const [deletingResource, setDeletingResource] = useState<AdminResourceItem | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checkingHealthId, setCheckingHealthId] = useState<string | null>(null);
  const [applyingRedirectId, setApplyingRedirectId] = useState<string | null>(null);

  // Dynamic pagination: 24 for visual cards, 50 for text data table
  const itemsPerPage = viewMode === "cards" ? 24 : 50;

  // Compute Missing Data Metrics scoped to the selected category
  const missingStats = useMemo(() => {
    let missingOg = 0;
    let missingAuthor = 0;
    let missingGithub = 0;
    let missingFavicon = 0;
    let missingTags = 0;
    let missingSubtitle = 0;
    let missingDescription = 0;
    let anyMissing = 0;

    const scopedResources =
      selectedCategory && selectedCategory !== "all"
        ? resources.filter((r) => r.category === selectedCategory)
        : resources;

    for (const r of scopedResources) {
      const hasNoOg = !r.ogImage || !r.ogImage.trim();
      const hasNoAuthor = !r.authorName || !r.authorName.trim();
      const hasNoGithub = !r.github || !r.github.trim();
      const hasNoFavicon = !r.favicon || !r.favicon.trim();
      const hasNoTags = !r.tags || !r.tags.trim();
      const hasNoSubtitle = !r.subtitle || !r.subtitle.trim();
      const hasNoDesc = !r.description || !r.description.trim();

      if (hasNoOg) missingOg++;
      if (hasNoAuthor) missingAuthor++;
      if (hasNoGithub) missingGithub++;
      if (hasNoFavicon) missingFavicon++;
      if (hasNoTags) missingTags++;
      if (hasNoSubtitle) missingSubtitle++;
      if (hasNoDesc) missingDescription++;

      if (hasNoOg || hasNoAuthor || hasNoFavicon || hasNoTags || hasNoDesc) {
        anyMissing++;
      }
    }

    return {
      anyMissing,
      missingAuthor,
      missingDescription,
      missingFavicon,
      missingGithub,
      missingOg,
      missingSubtitle,
      missingTags,
    };
  }, [resources, selectedCategory]);

  // Compute URL Health Metrics (Broken, Redirect, Blocked, Healthy, Unchecked)
  const urlHealthStats = useMemo(() => {
    let broken = 0;
    let redirect = 0;
    let blocked = 0;
    let healthy = 0;
    let unchecked = 0;

    const scopedResources =
      selectedCategory && selectedCategory !== "all"
        ? resources.filter((r) => r.category === selectedCategory)
        : resources;

    for (const r of scopedResources) {
      const status = r.healthStatus || "unknown";
      if (status === "broken") broken++;
      else if (status === "redirect") redirect++;
      else if (status === "blocked") blocked++;
      else if (status === "healthy") healthy++;
      else unchecked++;
    }

    return { blocked, broken, healthy, redirect, unchecked };
  }, [resources, selectedCategory]);

  // Dynamically generate health & missing data filter options
  const healthFilterOptions = useMemo(() => {
    const options: { label: string; value: string }[] = [
      { label: "Health / Data: All", value: "all" },
    ];

    if (urlHealthStats.broken > 0 || healthFilter === "broken") {
      options.push({
        label: `🚨 Broken URLs (${urlHealthStats.broken})`,
        value: "broken",
      });
    }

    if (urlHealthStats.redirect > 0 || healthFilter === "redirect") {
      options.push({
        label: `🔄 Redirects (${urlHealthStats.redirect})`,
        value: "redirect",
      });
    }

    if (urlHealthStats.blocked > 0 || healthFilter === "blocked") {
      options.push({
        label: `⚠️ Blocked / Cloudflare (${urlHealthStats.blocked})`,
        value: "blocked",
      });
    }

    if (urlHealthStats.healthy > 0 || healthFilter === "healthy") {
      options.push({
        label: `🟢 Healthy URLs (${urlHealthStats.healthy})`,
        value: "healthy",
      });
    }

    if (urlHealthStats.unchecked > 0 || healthFilter === "unchecked") {
      options.push({
        label: `⚪️ Unchecked URLs (${urlHealthStats.unchecked})`,
        value: "unchecked",
      });
    }

    if (missingStats.anyMissing > 0 || healthFilter === "any-missing") {
      options.push({
        label: `⚠️ Any Missing Data (${missingStats.anyMissing})`,
        value: "any-missing",
      });
    }

    if (missingStats.missingOg > 0 || healthFilter === "missing-og") {
      options.push({
        label: `Missing OG Image (${missingStats.missingOg})`,
        value: "missing-og",
      });
    }

    if (missingStats.missingAuthor > 0 || healthFilter === "missing-author") {
      options.push({
        label: `Missing Author (${missingStats.missingAuthor})`,
        value: "missing-author",
      });
    }

    if (missingStats.missingTags > 0 || healthFilter === "missing-tags") {
      options.push({
        label: `Missing Tags (${missingStats.missingTags})`,
        value: "missing-tags",
      });
    }

    if (missingStats.missingFavicon > 0 || healthFilter === "missing-favicon") {
      options.push({
        label: `Missing Favicon (${missingStats.missingFavicon})`,
        value: "missing-favicon",
      });
    }

    if (missingStats.missingGithub > 0 || healthFilter === "missing-github") {
      options.push({
        label: `Missing GitHub (${missingStats.missingGithub})`,
        value: "missing-github",
      });
    }

    if (missingStats.missingSubtitle > 0 || healthFilter === "missing-subtitle") {
      options.push({
        label: `Missing Subtitle (${missingStats.missingSubtitle})`,
        value: "missing-subtitle",
      });
    }

    if (missingStats.missingDescription > 0 || healthFilter === "missing-description") {
      options.push({
        label: `Missing Description (${missingStats.missingDescription})`,
        value: "missing-description",
      });
    }

    return options;
  }, [healthFilter, missingStats, urlHealthStats]);

  // Live URL Diagnostic Handler
  const handleCheckHealth = useCallback(async (item: AdminResourceItem) => {
    setCheckingHealthId(item.id);
    try {
      const res = await fetch("/api/admin/resources/health", {
        body: JSON.stringify({ resourceId: item.id }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to check health");
        return;
      }
      const { health } = data;
      setResources((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? {
                ...r,
                healthErrorMessage: health.errorMessage,
                healthLastCheckedAt: health.lastCheckedAt,
                healthRedirectUrl: health.redirectUrl,
                healthStatus: health.status,
                healthStatusCode: health.statusCode,
              }
            : r,
        ),
      );
      if (health.status === "healthy") {
        toast.success(`"${item.title}" is healthy (${health.statusCode || 200} OK)`);
      } else if (health.status === "redirect") {
        toast.warning(`"${item.title}" moved to ${health.redirectUrl} (${health.statusCode})`);
      } else if (health.status === "blocked") {
        toast.info(`"${item.title}" is protected / anti-bot (${health.statusCode || 403})`);
      } else {
        toast.error(`"${item.title}" is unreachable (${health.errorMessage || "Error"})`);
      }
    } catch {
      toast.error("Health check network error");
    } finally {
      setCheckingHealthId(null);
    }
  }, []);

  // 1-Click Apply Redirect Handler
  const handleApplyRedirect = useCallback(async (item: AdminResourceItem) => {
    if (!item.healthRedirectUrl) return;
    setApplyingRedirectId(item.id);
    try {
      const res = await fetch("/api/admin/resources/health", {
        body: JSON.stringify({ applyRedirect: true, resourceId: item.id }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to apply redirect");
        return;
      }
      const { health, updatedUrl } = data;
      setResources((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? {
                ...r,
                healthErrorMessage: health.errorMessage,
                healthLastCheckedAt: health.lastCheckedAt,
                healthRedirectUrl: health.redirectUrl,
                healthStatus: health.status,
                healthStatusCode: health.statusCode,
                url: updatedUrl || r.url,
              }
            : r,
        ),
      );
      toast.success(`Updated URL for "${item.title}" to ${updatedUrl}`);
    } catch {
      toast.error("Failed to apply redirect URL");
    } finally {
      setApplyingRedirectId(null);
    }
  }, []);

  // Filter & Sort
  const filteredAndSortedResources = useMemo(() => {
    let result = resources;

    // Filter by Category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // Filter by Health / Missing Data
    if (healthFilter === "broken") {
      result = result.filter((r) => r.healthStatus === "broken");
    } else if (healthFilter === "redirect") {
      result = result.filter((r) => r.healthStatus === "redirect");
    } else if (healthFilter === "blocked") {
      result = result.filter((r) => r.healthStatus === "blocked");
    } else if (healthFilter === "healthy") {
      result = result.filter((r) => r.healthStatus === "healthy");
    } else if (healthFilter === "unchecked") {
      result = result.filter((r) => !r.healthStatus || r.healthStatus === "unknown");
    } else if (healthFilter === "missing-og") {
      result = result.filter((r) => !r.ogImage || !r.ogImage.trim());
    } else if (healthFilter === "missing-author") {
      result = result.filter((r) => !r.authorName || !r.authorName.trim());
    } else if (healthFilter === "missing-tags") {
      result = result.filter((r) => !r.tags || !r.tags.trim());
    } else if (healthFilter === "missing-favicon") {
      result = result.filter((r) => !r.favicon || !r.favicon.trim());
    } else if (healthFilter === "missing-github") {
      result = result.filter((r) => !r.github || !r.github.trim());
    } else if (healthFilter === "missing-subtitle") {
      result = result.filter((r) => !r.subtitle || !r.subtitle.trim());
    } else if (healthFilter === "missing-description") {
      result = result.filter((r) => !r.description || !r.description.trim());
    } else if (healthFilter === "any-missing") {
      result = result.filter(
        (r) =>
          !r.ogImage?.trim() ||
          !r.authorName?.trim() ||
          !r.favicon?.trim() ||
          !r.tags?.trim() ||
          !r.description?.trim(),
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle?.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.url.toLowerCase().includes(q) ||
          r.authorName?.toLowerCase().includes(q) ||
          r.tags?.toLowerCase().includes(q),
      );
    }

    // Sort
    const sorted = [...result];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "updated-desc") {
      sorted.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA || a.title.localeCompare(b.title);
      });
    } else if (sortBy === "title-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    return sorted;
  }, [healthFilter, resources, searchQuery, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedResources.length / itemsPerPage) || 1;
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedResources.slice(start, start + itemsPerPage);
  }, [currentPage, filteredAndSortedResources, itemsPerPage]);

  // View Mode Switcher
  const handleViewModeChange = (mode: "cards" | "table") => {
    setViewMode(mode);
    setCurrentPage(1);
    syncUrl(sortBy, selectedCategory, healthFilter, mode, 1, searchQuery);
  };

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!val.trim()) {
      syncUrl(sortBy, selectedCategory, healthFilter, viewMode, 1, "");
    } else {
      searchDebounceRef.current = setTimeout(() => {
        syncUrl(sortBy, selectedCategory, healthFilter, viewMode, 1, val);
      }, 300);
    }
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
    syncUrl(sortBy, val, healthFilter, viewMode, 1, searchQuery);
  };

  const handleHealthFilterChange = (val: string) => {
    setHealthFilter(val);
    setCurrentPage(1);
    syncUrl(sortBy, selectedCategory, val, viewMode, 1, searchQuery);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
    syncUrl(val, selectedCategory, healthFilter, viewMode, 1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    syncUrl(sortBy, selectedCategory, healthFilter, viewMode, newPage, searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setHealthFilter("all");
    setCurrentPage(1);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    syncUrl(sortBy, "all", "all", viewMode, 1, "");
  };

  // Background refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/resources");
      const data = await res.json();
      if (res.ok && data.resources) {
        setResources(data.resources);
        toast.info("Live catalog synchronized.");
      } else {
        toast.error(data.error || "Failed to refresh resources.");
      }
    } catch {
      toast.error("Network error while refreshing.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Delete Handler with optimistic UI
  const handleConfirmDelete = async () => {
    if (!deletingResource) return;
    const target = deletingResource;
    const previousResources = resources;

    // Optimistically remove
    setResources((prev) => prev.filter((r) => r.id !== target.id));
    setDeletingResource(null);

    toast.success(`"${target.title}" deleted from catalog.`);

    try {
      setIsWorking(true);
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setResources(previousResources);
        toast.error(data.error || "Failed to delete resource. Restoring.");
      }
    } catch {
      setResources(previousResources);
      toast.error("Network error. Resource restoration applied.");
    } finally {
      setIsWorking(false);
    }
  };

  // Category filter options
  const allCategoryNames = useMemo(() => {
    const fromResources = Array.from(new Set(resources.map((r) => r.category))).filter(Boolean);
    const dbCatNames = categories.map((c) => c.name);
    const combined = Array.from(new Set([...dbCatNames, ...fromResources]));
    return combined.sort((a, b) => a.localeCompare(b));
  }, [categories, resources]);

  const categoryFilterOptions = [
    { label: `All Categories (${resources.length})`, value: "all" },
    ...allCategoryNames.map((cat) => ({
      label: `${cat} (${resources.filter((r) => r.category === cat).length})`,
      value: cat,
    })),
  ];

  return (
    <div>
      {/* Control Bar: Search, View Switcher, Category Filter, Sort, Add Resource */}
      <AdminToolbar
        search={
          <SearchInput
            placeholder="Search live resources by name, description, tags, author, URL..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => handleSearchChange("")}
            className="font-mono text-xs"
          />
        }
        actions={
          <>
            {/* View Mode Toggle Switcher */}
            <Tabs
              value={viewMode}
              onValueChange={(val) => handleViewModeChange(val as "cards" | "table")}
            >
              <TabsList className="border-line bg-surface/80 h-9 rounded-md border-[1.5px] p-0.5 font-mono">
                <TabsTrigger
                  value="cards"
                  className="data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground gap-1.5 rounded px-2.5 py-1 font-mono text-xs font-bold uppercase transition-colors"
                  title="Visual Cards View (24 per page)"
                >
                  <SquaresFourIcon className="size-3.5" />
                  <span className="hidden sm:inline">Cards (24)</span>
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground gap-1.5 rounded px-2.5 py-1 font-mono text-xs font-bold uppercase transition-colors"
                  title="Text Data Table (50 per page)"
                >
                  <TableIcon className="size-3.5" />
                  <span className="hidden sm:inline">Grid (50)</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-line hover:bg-surface h-9 gap-1.5 px-3 text-xs font-bold uppercase"
              title="Refresh catalog from database"
            >
              <ArrowsClockwiseIcon
                weight="bold"
                className={cn("text-brand-green size-4", isRefreshing && "animate-spin")}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <AddButton asChild className="h-9">
              <Link
                href={
                  searchParams.toString()
                    ? `/admin/resources/new?${searchParams.toString()}`
                    : "/admin/resources/new"
                }
              >
                <PlusIcon weight="bold" className="size-4" />
                <span>Add New Resource</span>
              </Link>
            </AddButton>
          </>
        }
        footer={
          <>
            <div className="flex flex-wrap items-center gap-5">
              {/* Category Select */}
              <FilterSelect
                label="Category:"
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                options={categoryFilterOptions}
                triggerClassName="min-w-[180px]"
              />

              {/* Dynamic Health & Missing Data Filter */}
              {healthFilterOptions.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <HeartbeatIcon weight="duotone" className="size-8 text-rose-500" />
                  <span className="text-muted-foreground text-[11px] font-bold whitespace-nowrap uppercase">
                    Health & Data:
                  </span>
                  <SelectField
                    value={healthFilter}
                    onValueChange={handleHealthFilterChange}
                    options={healthFilterOptions}
                    triggerClassName="h-8 font-mono text-xs min-w-[200px]"
                    variant="rose"
                  />
                </div>
              )}

              {/* Sort Select */}
              <SortSelect value={sortBy} onValueChange={handleSortChange} options={SORT_OPTIONS} />
            </div>

            {/* Result Counts */}
            <div className="text-muted-foreground text-[11px]">
              Showing{" "}
              <strong className="text-foreground">{filteredAndSortedResources.length}</strong> of{" "}
              <strong className="text-foreground">{resources.length}</strong> resources
              {searchQuery && (
                <span>
                  {" "}
                  matching &quot;<span className="text-primary">{searchQuery}</span>&quot;
                </span>
              )}
            </div>
          </>
        }
      />
      {/* Main Catalog Display: Cards vs Text Data Table */}
      {paginatedResources.length > 0 ? (
        <div className="space-y-4">
          {viewMode === "cards" ? (
            /* Visual Cards Mode (24 per page, 4 per row matching public site) */
            <div className="card-grid">
              {paginatedResources.map((item) => (
                <AdminResourceCard
                  key={item.id}
                  resource={item}
                  onPreview={() => setPreviewResource(item)}
                  onEdit={() =>
                    router.push(
                      searchParams.toString()
                        ? `/admin/resources/${item.id}?${searchParams.toString()}`
                        : `/admin/resources/${item.id}`,
                    )
                  }
                  onDelete={() => setDeletingResource(item)}
                  onCheckHealth={() => handleCheckHealth(item)}
                  onApplyRedirect={() => handleApplyRedirect(item)}
                  isCheckingHealth={checkingHealthId === item.id}
                  isApplyingRedirect={applyingRedirectId === item.id}
                  isWorking={isWorking}
                />
              ))}
            </div>
          ) : (
            /* Text-Only Data Table Mode (50 per page, zero images requested) */
            <AdminResourceTable
              resources={paginatedResources}
              onPreview={(item) => setPreviewResource(item)}
              onEdit={(item) =>
                router.push(
                  searchParams.toString()
                    ? `/admin/resources/${item.id}?${searchParams.toString()}`
                    : `/admin/resources/${item.id}`,
                )
              }
              onDelete={(item) => setDeletingResource(item)}
              onCheckHealth={(item) => handleCheckHealth(item)}
              onApplyRedirect={(item) => handleApplyRedirect(item)}
              checkingHealthId={checkingHealthId}
              applyingRedirectId={applyingRedirectId}
              isWorking={isWorking}
            />
          )}

          {/* Pagination Controls */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedResources.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            className="border-line flex flex-wrap items-center justify-between gap-3 border-t bg-transparent p-0 pt-4 font-mono text-xs"
          />
        </div>
      ) : (
        /* Empty State */
        <EmptyState
          variant="dashed"
          icon={<MagnifyingGlassIcon className="size-6" />}
          title="No Live Resources Found"
          description={
            searchQuery || selectedCategory !== "all" || healthFilter !== "all"
              ? "No resources matched your active filters or search criteria."
              : "The live catalog is currently empty. Click 'Add New Resource' to publish one."
          }
          action={
            searchQuery || selectedCategory !== "all" || healthFilter !== "all" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFilters}
                className="border-line hover:bg-surface h-8 text-xs font-bold uppercase"
              >
                Clear All Filters
              </Button>
            ) : (
              <AddButton asChild size="sm" className="h-8">
                <Link href="/admin/resources/new">
                  <PlusIcon className="size-3.5" />
                  <span>Add New Resource</span>
                </Link>
              </AddButton>
            )
          }
        />
      )}
      {/* Live Resource Dialog Preview Modal */}
      <Dialog
        open={Boolean(previewResource)}
        onOpenChange={(open) => {
          if (!open) setPreviewResource(null);
        }}
      >
        {previewResource && (
          <ResourceDialog
            key={previewResource.id || previewResource.url}
            resource={adminItemToResource(previewResource)}
            allResources={resources.map(adminItemToResource)}
          />
        )}
      </Dialog>
      <ConfirmDialog
        open={Boolean(deletingResource)}
        onOpenChange={(open) => !open && setDeletingResource(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this resource?"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">&quot;{deletingResource?.title}&quot;</strong>? This
            will permanently remove the resource.
          </>
        }
        confirmLabel="Hold to delete"
      />
    </div>
  );
}

export function AdminResourcesClient(props: AdminResourcesClientProps) {
  return (
    <Suspense>
      <AdminResourcesClientContent {...props} />
    </Suspense>
  );
}
