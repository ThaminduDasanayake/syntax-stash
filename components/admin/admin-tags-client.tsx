"use client";

import {
  ArrowsClockwiseIcon,
  CheckIcon,
  FunnelIcon,
  PencilSimpleIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { SearchInput } from "@/components/ui/search-input";
import { SelectField } from "@/components/ui/select-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeTag } from "@/lib/utils";

import {
  AdminConfirmEditDialog,
  computeFieldChanges,
  FieldDiff,
} from "./admin-confirm-edit-dialog";

const TAG_FIELD_LABELS: Record<string, string> = {
  isFeatured: "Featured Status",
  name: "Tag Name",
  slug: "Tag Slug",
};

export interface AdminTagItem {
  createdAt?: Date | string;
  id: string;
  isFeatured: boolean;
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
  { label: "Featured Only", value: "featured" },
  { label: "Standard (Non-Featured)", value: "standard" },
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    isFeatured: false,
    name: "",
    slug: "",
  });
  const [autoSlug, setAutoSlug] = useState(true);

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

    // Filter by featured
    if (filterMode === "featured") {
      result = result.filter((t) => t.isFeatured);
    } else if (filterMode === "standard") {
      result = result.filter((t) => !t.isFeatured);
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
    setFormData({
      isFeatured: false,
      name: "",
      slug: "",
    });
    setAutoSlug(true);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (tagItem: AdminTagItem) => {
    setEditingTag(tagItem);
    setFormData({
      isFeatured: tagItem.isFeatured,
      name: tagItem.name,
      slug: tagItem.slug,
    });
    setAutoSlug(false);
    setIsDialogOpen(true);
  };

  // Handle Form Name Change (auto slug)
  const handleNameChange = (newName: string) => {
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: autoSlug ? normalizeTag(newName) : prev.slug,
    }));
  };

  // Quick toggle featured status
  const handleToggleFeatured = async (tagItem: AdminTagItem) => {
    const nextFeatured = !tagItem.isFeatured;
    const previous = tags;

    setTags((prev) =>
      prev.map((t) => (t.id === tagItem.id ? { ...t, isFeatured: nextFeatured } : t)),
    );

    try {
      const res = await fetch("/api/admin/tags", {
        body: JSON.stringify({
          id: tagItem.id,
          isFeatured: nextFeatured,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!res.ok) {
        setTags(previous);
        toast.error("Failed to update featured status.");
      } else {
        toast.success(
          nextFeatured ? `"${tagItem.name}" marked as featured.` : `"${tagItem.name}" unfeatured.`,
        );
      }
    } catch {
      setTags(previous);
      toast.error("Network error.");
    }
  };

  // Execute Save
  const executeSave = async () => {
    try {
      setIsSubmitting(true);
      if (editingTag) {
        // PATCH
        const res = await fetch("/api/admin/tags", {
          body: JSON.stringify({
            id: editingTag.id,
            isFeatured: formData.isFeatured,
            name: formData.name.trim(),
            slug: formData.slug.trim() ? normalizeTag(formData.slug) : normalizeTag(formData.name),
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to update tag.");
          return;
        }

        setTags((prev) =>
          prev.map((t) =>
            t.id === editingTag.id
              ? {
                  ...t,
                  isFeatured: formData.isFeatured,
                  name: formData.name.trim(),
                  slug: formData.slug.trim()
                    ? normalizeTag(formData.slug)
                    : normalizeTag(formData.name),
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        );
        toast.success(`Tag "${formData.name}" updated successfully.`);
        setIsConfirmOpen(false);
        setIsDialogOpen(false);
      } else {
        // POST
        const res = await fetch("/api/admin/tags", {
          body: JSON.stringify({
            isFeatured: formData.isFeatured,
            name: formData.name.trim(),
            slug: formData.slug.trim() ? normalizeTag(formData.slug) : normalizeTag(formData.name),
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to create tag.");
          return;
        }

        setTags((prev) => [
          ...prev,
          {
            id: data.id,
            isFeatured: formData.isFeatured,
            name: formData.name.trim(),
            slug: formData.slug.trim() ? normalizeTag(formData.slug) : normalizeTag(formData.name),
            toolCount: 0,
          },
        ]);
        toast.success(`Tag "${formData.name}" created successfully.`);
        setIsDialogOpen(false);
      }
    } catch {
      toast.error("Network error while saving tag.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tag name is required.");
      return;
    }

    if (editingTag) {
      const diffs = computeFieldChanges(editingTag, formData, TAG_FIELD_LABELS);
      setPendingChanges(diffs);
      setIsConfirmOpen(true);
    } else {
      await executeSave();
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingTag) return;
    const target = deletingTag;
    const previous = tags;

    // Optimistic delete
    setTags((prev) => prev.filter((t) => t.id !== target.id));
    setDeletingTag(null);

    try {
      const res = await fetch(`/api/admin/tags?id=${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setTags(previous);
        toast.error(data.error || "Failed to delete tag.");
      } else {
        toast.success(`Tag "${target.name}" deleted.`);
      }
    } catch {
      setTags(previous);
      toast.error("Network error. Tag restored.");
    }
  };

  return (
    <div className="font-mono">
      {/* Control Bar */}
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border p-4 text-xs">
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
              <ArrowsClockwiseIcon className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </Button>

            <Button size="sm" onClick={handleOpenAdd} className="h-9 text-xs font-bold uppercase">
              <PlusIcon className="size-3.5" weight="bold" />
              <span>New Tag</span>
            </Button>
          </div>
        </div>

        {/* Filter and Sort bar */}
        <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <FunnelIcon className="text-muted-foreground size-3.5" />
              <SelectField
                value={filterMode}
                onValueChange={(val) => setFilterMode(val)}
                options={FILTER_OPTIONS}
                triggerClassName="h-8 font-mono text-[11px]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-[11px]">Sort:</span>
              <SelectField
                value={sortBy}
                onValueChange={(val) => setSortBy(val)}
                options={SORT_OPTIONS}
                triggerClassName="h-8 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="text-muted-foreground text-[11px]">
            Displaying <strong className="text-foreground">{filteredAndSortedTags.length}</strong>{" "}
            of {tags.length} tags
          </div>
        </div>
      </div>

      {/* Tags Table */}
      {filteredAndSortedTags.length === 0 ? (
        <div className="border-line bg-surface/30 flex flex-col items-center justify-center rounded-lg border p-12 text-center">
          <TagIcon className="text-muted-foreground/60 mb-3 size-10" />
          <h3 className="text-foreground text-sm font-bold uppercase">No Tags Found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            {searchQuery
              ? `No tags match query "${searchQuery}". Try a different term.`
              : "No tags currently exist. Create your first tag above."}
          </p>
          {searchQuery ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4 text-xs uppercase"
            >
              Clear Search
            </Button>
          ) : (
            <Button size="sm" onClick={handleOpenAdd} className="mt-4 text-xs uppercase">
              <PlusIcon className="size-3.5" />
              Add Tag
            </Button>
          )}
        </div>
      ) : (
        <div className="border-line overflow-hidden rounded-lg border">
          <Table className="text-xs">
            <TableHeader className="bg-surface">
              <TableRow className="border-line hover:bg-transparent">
                <TableHead className="w-12 text-center uppercase">Featured</TableHead>
                <TableHead className="uppercase">Tag Name & Slug</TableHead>
                <TableHead className="text-center uppercase">Usage (Assigned Resources)</TableHead>
                <TableHead className="w-24 text-right uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTags.map((tagItem) => (
                <TableRow key={tagItem.id} className="border-line hover:bg-surface/50">
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(tagItem)}
                      title={tagItem.isFeatured ? "Unmark featured" : "Mark as featured"}
                      className="text-muted-foreground p-1 transition-colors hover:text-amber-500"
                    >
                      <StarIcon
                        weight={tagItem.isFeatured ? "fill" : "regular"}
                        className={`size-4 ${tagItem.isFeatured ? "text-star" : "opacity-40"}`}
                      />
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold">#{tagItem.name}</span>
                      <span className="text-muted-foreground text-[10px] tracking-wide">
                        ({tagItem.slug})
                      </span>
                      {tagItem.isFeatured && (
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
                        >
                          Featured
                        </Badge>
                      )}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-mono sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight uppercase">
              {editingTag ? `Edit Tag: #${editingTag.name}` : "Create New Tag"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingTag
                ? "Update tag name, slug identifier, or featured status."
                : "Add a new tag for categorizing and discovering resources."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            <div>
              <InputField
                label="Tag Name *"
                placeholder="e.g. Next.js, Open Source"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="font-mono text-xs"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-muted-foreground text-xs font-semibold">Slug *</label>
                {!editingTag && (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-primary text-[10px] hover:underline"
                  >
                    {autoSlug ? "Manual Slug" : "Auto Slug"}
                  </button>
                )}
              </div>
              <InputField
                placeholder="e.g. next-js, open-source"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                required
                className="font-mono text-xs"
              />
            </div>

            <div className="border-line bg-surface/50 flex items-center gap-2 rounded border p-3">
              <Checkbox
                id="tag-is-featured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFeatured: Boolean(checked) }))
                }
              />
              <label
                htmlFor="tag-is-featured"
                className="cursor-pointer text-xs font-medium select-none"
              >
                Featured Tag (highlighted prominently in filters and search)
              </label>
            </div>

            <DialogFooter className="mt-4 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-bold uppercase"
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <CheckIcon className="size-3.5" />
                    <span>{editingTag ? "Save Changes" : "Create Tag"}</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deletingTag)}
        onOpenChange={(open) => !open && setDeletingTag(null)}
      >
        <AlertDialogContent className="font-mono text-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-mono uppercase">
              Delete Tag: #{deletingTag?.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-relaxed">
              Are you sure you want to delete tag{" "}
              <strong className="text-foreground">#{deletingTag?.slug}</strong>?
              {deletingTag && deletingTag.toolCount > 0 && (
                <span className="mt-2 block font-semibold text-amber-600 dark:text-amber-400">
                  Note: This tag is currently attached to {deletingTag.toolCount} resource(s).
                  Deleting it will remove the tag association from those resources.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs uppercase">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold uppercase"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Tag Updates */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Tag Updates"
        description="Review the list of changed tag properties before saving changes."
        itemTitle={
          formData.name ? `#${formData.name}` : editingTag ? `#${editingTag.name}` : undefined
        }
        changes={pendingChanges}
        onConfirm={executeSave}
        isWorking={isSubmitting}
      />
    </div>
  );
}
