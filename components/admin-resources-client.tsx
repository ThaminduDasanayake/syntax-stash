"use client";

import {
  ArrowsClockwiseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
  TableIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { adminItemToResource, AdminResourceCard, AdminResourceItem } from "@/components/admin";
import { ResourceDialog } from "@/components/resource-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { useCategories } from "@/hooks/use-categories";
import { cn, getCategoryTheme, THEME_CONFIG } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Oldest First", value: "oldest" },
  { label: "Recently Added", value: "newest" },
  { label: "Title (A → Z)", value: "title-asc" },
  { label: "Title (Z → A)", value: "title-desc" },
];

interface AdminResourcesClientProps {
  _initialCategoryCounts?: Record<string, number>;
  initialResources: AdminResourceItem[];
}

export function AdminResourcesClient({
  _initialCategoryCounts = {},
  initialResources = [],
}: AdminResourcesClientProps) {
  const router = useRouter();
  const { categories } = useCategories();
  const [resources, setResources] = useState<AdminResourceItem[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview & Deletion state
  const [previewResource, setPreviewResource] = useState<AdminResourceItem | null>(null);
  const [deletingResource, setDeletingResource] = useState<AdminResourceItem | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic pagination: 24 for visual cards, 50 for text data table
  const itemsPerPage = viewMode === "cards" ? 24 : 50;

  // Filter & Sort
  const filteredAndSortedResources = useMemo(() => {
    let result = resources;

    // Filter by Category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((r) => r.category === selectedCategory);
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
    } else if (sortBy === "title-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    return sorted;
  }, [resources, searchQuery, selectedCategory, sortBy]);

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
  };

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  // Copy JSON handler
  const handleCopyJson = (item: AdminResourceItem) => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
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
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border p-4 font-mono text-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <InputField
              placeholder="Search live resources by name, description, tags, author, URL..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              prefix={<MagnifyingGlassIcon className="text-muted-foreground size-4" />}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 p-0.5"
                title="Clear search"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle Switcher */}
            <div className="border-line bg-surface/80 flex items-center rounded-md border p-0.5">
              <button
                type="button"
                onClick={() => handleViewModeChange("cards")}
                className={cn(
                  "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold uppercase transition-colors",
                  viewMode === "cards"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Visual Cards View (24 per page)"
              >
                <SquaresFourIcon className="size-3.5" />
                <span className="hidden sm:inline">Cards (24)</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("table")}
                className={cn(
                  "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold uppercase transition-colors",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Text Data Table (50 per page)"
              >
                <TableIcon className="size-3.5" />
                <span className="hidden sm:inline">Grid (50)</span>
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-line hover:bg-surface h-9 gap-1.5 px-3 text-xs font-bold uppercase"
              title="Refresh catalog from database"
            >
              <ArrowsClockwiseIcon className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button asChild size="sm" className="h-9 gap-1.5 px-3.5 text-xs font-bold uppercase">
              <Link href="/admin/resources/new">
                <PlusIcon className="size-4" />
                <span>Add New Resource</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns & Stats */}
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Select */}
            <div className="flex items-center gap-1.5">
              <FunnelIcon className="text-muted-foreground size-3.5" />
              <span className="text-muted-foreground text-[11px] font-bold uppercase">
                Category:
              </span>
              <SelectField
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                options={categoryFilterOptions}
                triggerClassName="h-8 font-mono text-xs min-w-[180px]"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontalIcon className="text-muted-foreground size-3.5" />
              <span className="text-muted-foreground text-[11px] font-bold uppercase">Sort:</span>
              <SelectField
                value={sortBy}
                onValueChange={handleSortChange}
                options={SORT_OPTIONS}
                triggerClassName="h-8 font-mono text-xs min-w-[150px]"
              />
            </div>
          </div>

          {/* Result Counts */}
          <div className="text-muted-foreground text-[11px]">
            Showing <strong className="text-foreground">{filteredAndSortedResources.length}</strong>{" "}
            of <strong className="text-foreground">{resources.length}</strong> resources
            {searchQuery && (
              <span>
                {" "}
                matching &quot;<span className="text-primary">{searchQuery}</span>&quot;
              </span>
            )}
          </div>
        </div>
      </div>

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
                  onEdit={() => router.push(`/admin/resources/${item.id}`)}
                  onDelete={() => setDeletingResource(item)}
                  isWorking={isWorking}
                />
              ))}
            </div>
          ) : (
            /* Text-Only Data Table Mode (50 per page, zero images requested) */
            <div className="border-line bg-surface/30 overflow-hidden rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-mono text-xs">
                  <thead>
                    <tr className="border-line bg-surface/80 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Resource</th>
                      <th className="px-4 py-3">Author</th>
                      <th className="px-4 py-3">URL</th>
                      <th className="px-4 py-3">Tags</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-line divide-y">
                    {paginatedResources.map((item) => {
                      const theme = getCategoryTheme(item.category);
                      const themeStyles = THEME_CONFIG[theme];
                      const isCopied = copiedId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-surface/60 group transition-colors">
                          {/* Category Badge with Theme Styling */}
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                                themeStyles.soft,
                                themeStyles.label,
                                themeStyles.border,
                              )}
                            >
                              <span
                                className={cn(
                                  "size-1.5 rounded-full",
                                  themeStyles.dotActive || themeStyles.dot,
                                )}
                              />
                              {item.category}
                            </span>
                          </td>

                          {/* Title & Subtitle */}
                          <td className="min-w-[200px] px-4 py-2.5">
                            <div className="flex flex-col">
                              <span className="text-foreground group-hover:text-primary text-xs leading-snug font-bold transition-colors">
                                {item.title}
                              </span>
                              {item.subtitle && (
                                <span className="text-muted-foreground line-clamp-1 text-[11px]">
                                  {item.subtitle}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Author */}
                          <td className="text-muted-foreground px-4 py-2.5 text-[11px] whitespace-nowrap">
                            {item.authorName ? (
                              <span className="text-foreground font-medium">{item.authorName}</span>
                            ) : (
                              <span className="opacity-40">—</span>
                            )}
                          </td>

                          {/* URL */}
                          <td className="max-w-[200px] px-4 py-2.5">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary block truncate text-[11px] hover:underline"
                              title={item.url}
                            >
                              {item.url.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                          </td>

                          {/* Tags */}
                          <td className="max-w-[180px] px-4 py-2.5">
                            {item.tags ? (
                              <div className="flex flex-wrap gap-1">
                                {item.tags
                                  .split(",")
                                  .slice(0, 2)
                                  .map((tag) => (
                                    <span
                                      key={tag.trim()}
                                      className="border-line bg-surface/70 text-muted-foreground py-0.2 rounded border px-1.5 text-[9px]"
                                    >
                                      #{tag.trim()}
                                    </span>
                                  ))}
                                {item.tags.split(",").length > 2 && (
                                  <span className="text-muted-foreground/70 text-[9px]">
                                    +{item.tags.split(",").length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="opacity-40">—</span>
                            )}
                          </td>

                          {/* Created Date */}
                          <td className="text-muted-foreground px-4 py-2.5 text-[11px] whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-4 py-2.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPreviewResource(item)}
                                className="text-foreground hover:bg-surface-elevated size-7 p-0"
                                title="Preview Full ResourceDialog"
                              >
                                <EyeIcon className="text-primary size-3.5" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyJson(item)}
                                className="text-muted-foreground hover:text-foreground size-7 p-0"
                                title="Copy JSON"
                              >
                                {isCopied ? (
                                  <CheckCircleIcon className="size-3.5 text-emerald-600" />
                                ) : (
                                  <ClipboardTextIcon className="size-3.5" />
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/admin/resources/${item.id}`)}
                                className="border-line hover:bg-surface size-7 p-0"
                                title="Edit Resource"
                              >
                                <PencilSimpleIcon className="size-3" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeletingResource(item)}
                                className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive size-7 p-0"
                                title="Delete Resource"
                              >
                                <TrashIcon className="size-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-4 font-mono text-xs">
              <div className="text-muted-foreground text-[11px]">
                Page <strong className="text-foreground">{currentPage}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong> ({itemsPerPage} per page)
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs"
                >
                  <CaretLeftIcon className="size-3.5" />
                  <span>Prev</span>
                </Button>

                {/* Page number indicators */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    let pageNum = idx + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = Math.min(currentPage - 2 + idx, totalPages - 4 + idx);
                    }
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`size-8 rounded border text-xs font-bold transition-colors ${
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-line bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs"
                >
                  <span>Next</span>
                  <CaretRightIcon className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="border-line bg-surface/20 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center font-mono">
          <MagnifyingGlassIcon className="text-muted-foreground/60 size-10" />
          <h3 className="text-foreground mt-3 text-sm font-bold uppercase">
            No Live Resources Found
          </h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            {searchQuery || selectedCategory !== "all"
              ? "No resources matched your active filters or search criteria."
              : "The live catalog is currently empty. Click 'Add New Resource' to publish one."}
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="border-line hover:bg-surface mt-4 h-8 text-xs font-bold uppercase"
            >
              Clear All Filters
            </Button>
          )}
        </div>
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

      {/* Deletion Confirmation AlertDialog */}
      <AlertDialog
        open={Boolean(deletingResource)}
        onOpenChange={(open) => !open && setDeletingResource(null)}
      >
        <AlertDialogContent className="font-mono text-xs sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-mono text-base font-bold uppercase">
              Delete Resource from Live Catalog?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-mono text-xs leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">&quot;{deletingResource?.title}&quot;</strong>?
              <br />
              <br />
              This will permanently remove the resource from the database and instantly purge the
              edge cache.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="border-line font-mono text-xs font-bold uppercase">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono text-xs font-bold uppercase"
            >
              Delete Resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
