"use client";

import {
  ArrowsClockwiseIcon,
  PencilSimpleIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminTagDialog } from "@/components/admin/admin-tag-dialog";
import { FilterSelect } from "@/components/admin/filter-select";
import { SortSelect } from "@/components/admin/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { invalidateTagCache } from "@/components/submissions/tag-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface AdminTagItem {
  createdAt?: Date | string;
  id: string;
  name: string;
  slug: string;
  toolCount: number;
  updatedAt?: Date | string;
}

interface AdminTagsClientProps {
  initialTags: AdminTagItem[];
}

const FILTER_OPTIONS = [
  { label: "All Tags", value: "all" },
  { label: "Unused (0 Tools)", value: "unused" },
  { label: "Used in Catalog", value: "used" },
];

const SORT_OPTIONS = [
  { label: "Least Used", value: "usage-asc" },
  { label: "Most Used", value: "usage-desc" },
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
  { label: "Recently Added", value: "created-desc" },
  { label: "Recently Updated", value: "updated-desc" },
];

export function AdminTagsClient({ initialTags = [] }: AdminTagsClientProps) {
  const [tags, setTags] = useState<AdminTagItem[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("usage-desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<AdminTagItem | null>(null);
  const [deletingTag, setDeletingTag] = useState<AdminTagItem | null>(null);

  // Filter & Sort
  const filteredAndSortedTags = useMemo(() => {
    let result = tags;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q),
      );
    }

    // Filter by usage
    if (filterMode === "used") {
      result = result.filter((t) => t.toolCount > 0);
    } else if (filterMode === "unused") {
      result = result.filter((t) => t.toolCount === 0);
    }

    // Sort
    const sorted = [...result];
    if (sortBy === "usage-desc") {
      sorted.sort((a, b) => b.toolCount - a.toolCount || a.name.localeCompare(b.name));
    } else if (sortBy === "usage-asc") {
      sorted.sort((a, b) => a.toolCount - b.toolCount || a.name.localeCompare(b.name));
    } else if (sortBy === "updated-desc") {
      sorted.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA || a.name.localeCompare(b.name);
      });
    } else if (sortBy === "created-desc") {
      sorted.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA || a.name.localeCompare(b.name);
      });
    } else if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [filterMode, searchQuery, sortBy, tags]);

  // Refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      if (res.ok && data.tags) {
        setTags(data.tags);
        toast.info("Tags refreshed.");
      } else {
        toast.error(data.error || "Failed to refresh tags.");
      }
    } catch {
      toast.error("Network error while refreshing tags.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingTag(null);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (tagItem: AdminTagItem) => {
    setEditingTag(tagItem);
    setIsDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingTag) return;
    const target = deletingTag;
    const previous = tags;

    // Optimistic delete
    setTags((prev) => prev.filter((t) => t.id !== target.id));
    invalidateTagCache();
    setDeletingTag(null);

    try {
      const res = await fetch(`/api/admin/tags?id=${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setTags(previous);
        invalidateTagCache();
        toast.error(data.error || "Failed to delete tag.");
      } else {
        toast.success(`Tag "${target.name}" deleted.`);
      }
    } catch {
      setTags(previous);
      invalidateTagCache();
      toast.error("Network error. Tag restored.");
    }
  };

  return (
    <div className="font-mono">
      {/* Control Bar */}
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border-[1.5px] p-4 text-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="flex-1">
            <SearchInput
              placeholder="Search tags by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="font-mono text-xs"
            />
          </div>

          <FilterSelect
            label="Tag:"
            value={filterMode}
            onValueChange={(val) => setFilterMode(val)}
            options={FILTER_OPTIONS}
          />

          <SortSelect
            value={sortBy}
            onValueChange={(val) => setSortBy(val)}
            options={SORT_OPTIONS}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 text-xs uppercase"
              title="Refresh tags catalog"
            >
              <ArrowsClockwiseIcon
                weight="bold"
                className={cn("text-brand-green size-4", isRefreshing && "animate-spin")}
              />
              <span className="hidden sm:inline">Sync</span>
            </Button>

            <Button size="sm" onClick={handleOpenAdd} className="h-9 text-xs font-bold uppercase">
              <PlusIcon className="size-3.5" weight="bold" />
              <span>New Tag</span>
            </Button>
          </div>
        </div>

        {/* Filter and Sort bar */}
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] pt-3">
          <div className="flex flex-wrap items-center gap-5"></div>

          <div className="text-muted-foreground text-[11px]">
            Displaying <strong className="text-foreground">{filteredAndSortedTags.length}</strong>{" "}
            of {tags.length} tags
          </div>
        </div>
      </div>

      {/* Tags Table */}
      {filteredAndSortedTags.length === 0 ? (
        <EmptyState
          variant="card"
          icon={<TagIcon className="size-6" />}
          title="No Tags Found"
          description={
            searchQuery
              ? `No tags match query "${searchQuery}". Try a different term.`
              : "No tags currently exist. Create your first tag above."
          }
          action={
            searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs uppercase"
              >
                Clear Search
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} className="text-xs uppercase">
                <PlusIcon className="size-3.5" />
                Add Tag
              </Button>
            )
          }
        />
      ) : (
        <div className="border-line overflow-hidden rounded-lg border-[1.5px]">
          <Table className="text-xs">
            <TableHeader className="bg-surface">
              <TableRow className="border-line hover:bg-transparent">
                <TableHead className="uppercase">Tag Name & Slug</TableHead>
                <TableHead className="text-center uppercase">Usage (Assigned Resources)</TableHead>
                <TableHead className="w-24 text-right uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTags.map((tagItem) => (
                <TableRow key={tagItem.id} className="border-line hover:bg-surface/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold">#{tagItem.name}</span>
                      <span className="text-muted-foreground text-[10px] tracking-wide">
                        ({tagItem.slug})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={tagItem.toolCount > 0 ? "default" : "secondary"}
                      className="font-mono text-[10px]"
                    >
                      {tagItem.toolCount} {tagItem.toolCount === 1 ? "resource" : "resources"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleOpenEdit(tagItem)}
                        title={`Edit #${tagItem.name}`}
                      >
                        <PencilSimpleIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingTag(tagItem)}
                        title={`Delete #${tagItem.name}`}
                      >
                        <TrashIcon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Tag Dialog */}
      <AdminTagDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tag={editingTag}
        existingTags={tags}
        onCreated={(newTag) => setTags((prev) => [newTag, ...prev])}
        onUpdated={(updatedTag) =>
          setTags((prev) => prev.map((t) => (t.id === updatedTag.id ? updatedTag : t)))
        }
      />

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmDialog
        open={Boolean(deletingTag)}
        onOpenChange={(open) => !open && setDeletingTag(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Tag: #${deletingTag?.name}`}
        description={
          <>
            Are you sure you want to delete tag{" "}
            <strong className="text-foreground">#{deletingTag?.slug}</strong>?
            {deletingTag && deletingTag.toolCount > 0 && (
              <span className="mt-2 block font-semibold text-amber-600 dark:text-amber-400">
                Note: This tag is currently attached to {deletingTag.toolCount} resource(s).
                Deleting it will remove the tag association from those resources.
              </span>
            )}
          </>
        }
        confirmLabel="Hold to delete"
      />
    </div>
  );
}
