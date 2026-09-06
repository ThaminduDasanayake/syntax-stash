"use client";

import {
  ArrowsClockwiseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AdminResourceCard,
  AdminResourceItem,
  CATEGORY_OPTIONS,
} from "@/components/admin";
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
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";

const ITEMS_PER_PAGE = 24;

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
  const [resources, setResources] = useState<AdminResourceItem[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Deletion state
  const [deletingResource, setDeletingResource] = useState<AdminResourceItem | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  const totalPages = Math.ceil(filteredAndSortedResources.length / ITEMS_PER_PAGE) || 1;
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedResources.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredAndSortedResources]);

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
        toast.error(data.error || "Failed to delete tool. Restoring.");
      }
    } catch {
      setResources(previousResources);
      toast.error("Network error. Tool restoration applied.");
    } finally {
      setIsWorking(false);
    }
  };

  // Category filter options
  const categoryFilterOptions = [
    { label: `All Categories (${resources.length})`, value: "all" },
    ...CATEGORY_OPTIONS.map((opt) => ({
      label: `${opt.label} (${resources.filter((r) => r.category === opt.value).length})`,
      value: opt.value,
    })),
  ];

  return (
    <div>
      {/* Control Bar: Search, Category Filter, Sort, Add Tool */}
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border p-4 font-mono text-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <InputField
              placeholder="Search live tools by name, description, tags, author, URL..."
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
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

            <Button
              asChild
              size="sm"
              className="h-9 gap-1.5 px-3.5 text-xs font-bold uppercase"
            >
              <Link href="/admin/resources/new">
                <PlusIcon className="size-4" />
                <span>Add New Tool</span>
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
              <span className="text-muted-foreground text-[11px] font-bold uppercase">Category:</span>
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
            Showing{" "}
            <strong className="text-foreground">{filteredAndSortedResources.length}</strong> of{" "}
            <strong className="text-foreground">{resources.length}</strong> tools
            {searchQuery && (
              <span>
                {" "}
                matching &quot;<span className="text-primary">{searchQuery}</span>&quot;
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      {paginatedResources.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {paginatedResources.map((item) => (
              <AdminResourceCard
                key={item.id}
                resource={item}
                onEdit={() => router.push(`/admin/resources/${item.id}`)}
                onDelete={() => setDeletingResource(item)}
                isWorking={isWorking}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-4 font-mono text-xs">
              <div className="text-muted-foreground text-[11px]">
                Page <strong className="text-foreground">{currentPage}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong>
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
            No Live Tools Found
          </h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            {searchQuery || selectedCategory !== "all"
              ? "No tools matched your active filters or search criteria."
              : "The live catalog is currently empty. Click 'Add New Tool' to publish one."}
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

      {/* Deletion Confirmation AlertDialog */}
      <AlertDialog
        open={Boolean(deletingResource)}
        onOpenChange={(open) => !open && setDeletingResource(null)}
      >
        <AlertDialogContent className="font-mono text-xs sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-mono text-base font-bold uppercase">
              Delete Tool from Live Catalog?
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
              Delete Tool
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

