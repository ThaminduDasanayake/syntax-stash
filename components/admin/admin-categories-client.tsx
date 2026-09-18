"use client";

import {
  ArrowsClockwiseIcon,
  CheckIcon,
  CircleNotchIcon,
  DownloadSimpleIcon,
  FoldersIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import { SortSelect } from "@/components/admin/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { DuplicateNotice } from "@/components/submissions/duplicate-url-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { InputField } from "@/components/ui/input-field";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, slugify } from "@/lib/utils";

import {
  AdminConfirmEditDialog,
  computeFieldChanges,
  FieldDiff,
} from "./admin-confirm-edit-dialog";

const CATEGORY_FIELD_LABELS: Record<string, string> = {
  name: "Category Name",
};

export interface AdminCategoryItem {
  createdAt?: Date | string;
  id: string;
  name: string;
  slug: string;
  toolCount: number;
  updatedAt?: Date | string;
}

interface AdminCategoriesClientProps {
  initialCategories: AdminCategoryItem[];
}

const SORT_OPTIONS = [
  { label: "Fewest Resources", value: "resources-asc" },
  { label: "Most Resources", value: "resources-desc" },
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
  { label: "Recently Added", value: "created-desc" },
  { label: "Recently Updated", value: "updated-desc" },
];

export function AdminCategoriesClient({ initialCategories = [] }: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadingCategoryId, setDownloadingCategoryId] = useState<string | null>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);

  // Form fields (only name; slug is strictly auto-generated)
  const [formData, setFormData] = useState({
    name: "",
  });

  const duplicateCategory = useMemo(() => {
    const rawName = formData.name.trim();
    if (!rawName) return null;
    const targetSlug = slugify(rawName);
    const targetLower = rawName.toLowerCase();
    return (
      categories.find(
        (c) =>
          c.id !== editingCategory?.id &&
          (c.slug === targetSlug || c.name.toLowerCase() === targetLower),
      ) || null
    );
  }, [categories, editingCategory?.id, formData.name]);

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
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
    } else if (sortBy === "resources-desc") {
      sorted.sort((a, b) => b.toolCount - a.toolCount || a.name.localeCompare(b.name));
    } else if (sortBy === "resources-asc") {
      sorted.sort((a, b) => a.toolCount - b.toolCount || a.name.localeCompare(b.name));
    }

    return sorted;
  }, [categories, searchQuery, sortBy]);

  // Refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && data.categories) {
        setCategories(data.categories);
        toast.info("Categories refreshed successfully.");
      } else {
        toast.error(data.error || "Failed to refresh categories.");
      }
    } catch {
      toast.error("Network error while refreshing categories.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Download Categories JSON
  const handleDownloadJson = () => {
    try {
      const exportData = categories.map((c) => ({
        id: c.id,
        createdAt: c.createdAt,
        name: c.name,
        resourceCount: c.toolCount,
        slug: c.slug,
        updatedAt: c.updatedAt,
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `categories-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Categories downloaded as JSON.");
    } catch {
      toast.error("Failed to download categories JSON.");
    }
  };

  // Download All Resources in a Category
  const handleDownloadCategoryResources = async (cat: AdminCategoryItem) => {
    if (cat.toolCount === 0) {
      toast.info(`No resources in category "${cat.name}".`);
      return;
    }

    try {
      setDownloadingCategoryId(cat.id);
      const res = await fetch(`/api/admin/resources?categoryId=${encodeURIComponent(cat.id)}`);
      const data = await res.json();

      if (!res.ok || !data.resources) {
        toast.error(data.error || `Failed to fetch resources for "${cat.name}".`);
        return;
      }

      if (data.resources.length === 0) {
        toast.info(`No resources found in "${cat.name}".`);
        return;
      }

      const exportData = data.resources.map(
        (r: {
          authors?: string[];
          category?: string;
          createdAt?: string;
          description?: string;
          favicon?: string;
          github?: string;
          iconBg?: string;
          id: string;
          ogImage?: string;
          subtitle?: string;
          tags?: string[];
          title: string;
          updatedAt?: string;
          url: string;
        }) => ({
          id: r.id,
          title: r.title,
          authors: r.authors && r.authors.length > 0 ? r.authors : undefined,
          category: r.category || cat.name,
          createdAt: r.createdAt,
          description: r.description,
          favicon: r.favicon || undefined,
          github: r.github || undefined,
          iconBg: r.iconBg || undefined,
          ogImage: r.ogImage || undefined,
          subtitle: r.subtitle || undefined,
          tags: r.tags && r.tags.length > 0 ? r.tags : undefined,
          updatedAt: r.updatedAt,
          url: r.url,
        }),
      );

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeSlug = cat.slug || slugify(cat.name);
      a.href = url;
      a.download = `${safeSlug}-resources-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        `Downloaded ${data.resources.length} resource${data.resources.length === 1 ? "" : "s"} for "${cat.name}".`,
      );
    } catch {
      toast.error(`Network error while downloading resources for "${cat.name}".`);
    } finally {
      setDownloadingCategoryId(null);
    }
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
    });
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (categoryItem: AdminCategoryItem) => {
    setEditingCategory(categoryItem);
    setFormData({
      name: categoryItem.name,
    });
    setIsDialogOpen(true);
  };

  // Execute Save
  const executeSave = async () => {
    try {
      setIsSubmitting(true);
      const cleanName = formData.name.trim();

      if (editingCategory) {
        // PATCH
        const res = await fetch("/api/admin/categories", {
          body: JSON.stringify({
            id: editingCategory.id,
            name: cleanName,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to update category.");
          return;
        }

        const updatedSlug = slugify(cleanName);
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  name: cleanName,
                  slug: updatedSlug,
                  updatedAt: new Date().toISOString(),
                }
              : c,
          ),
        );
        toast.success(`Category "${cleanName}" updated successfully.`);
        setIsConfirmOpen(false);
        setIsDialogOpen(false);
      } else {
        // POST
        const res = await fetch("/api/admin/categories", {
          body: JSON.stringify({
            name: cleanName,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to create category.");
          return;
        }

        setCategories((prev) => [
          ...prev,
          {
            id: data.id,
            createdAt: new Date().toISOString(),
            name: cleanName,
            slug: data.slug || slugify(cleanName),
            toolCount: 0,
            updatedAt: new Date().toISOString(),
          },
        ]);
        toast.success(`Category "${cleanName}" created successfully.`);
        setIsDialogOpen(false);
      }
    } catch {
      toast.error("Network error while saving category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Add / Edit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (duplicateCategory) {
      toast.error(`Category "${duplicateCategory.name}" already exists.`);
      return;
    }

    if (editingCategory) {
      const diffs = computeFieldChanges(editingCategory, formData, CATEGORY_FIELD_LABELS);
      setPendingChanges(diffs);
      setIsConfirmOpen(true);
    } else {
      await executeSave();
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    const target = deletingCategory;
    const previous = categories;

    setCategories((prev) => prev.filter((c) => c.id !== target.id));
    setDeletingCategory(null);

    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setCategories(previous);
        toast.error(data.error || "Failed to delete category.");
      } else {
        toast.success(`Category "${target.name}" deleted.`);
      }
    } catch {
      setCategories(previous);
      toast.error("Network error. Category restored.");
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
              placeholder="Search categories by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="font-mono text-xs"
            />
          </div>

          {/* Sort Dropdown */}
          <SortSelect value={sortBy} onValueChange={setSortBy} options={SORT_OPTIONS} />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadJson}
              disabled={categories.length === 0}
              className="h-9 text-xs uppercase"
              title="Download all categories as JSON"
            >
              <DownloadSimpleIcon weight="bold" className="text-primary size-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 text-xs uppercase"
              title="Refresh category catalog"
            >
              <ArrowsClockwiseIcon
                weight="bold"
                className={cn("text-brand-green size-4", isRefreshing && "animate-spin")}
              />
              <span className="hidden sm:inline">Sync</span>
            </Button>

            <Button size="sm" onClick={handleOpenAdd} className="h-9 text-xs font-bold uppercase">
              <PlusIcon className="size-3.5" weight="bold" />
              <span>New Category</span>
            </Button>
          </div>
        </div>

        {/* Quick Summary Row */}
        <div className="border-border flex items-center justify-between border-t pt-3 text-[11px]">
          <div className="text-muted-foreground flex items-center gap-2">
            <FoldersIcon className="size-3.5" />
            <span>
              Total Categories:{" "}
              <strong className="text-foreground font-bold">{categories.length}</strong>
            </span>
          </div>
          {searchQuery && (
            <span className="text-muted-foreground">
              Showing {filteredCategories.length} matching results
            </span>
          )}
        </div>
      </div>

      {/* Categories Table */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          variant="card"
          icon={<FoldersIcon className="size-6" />}
          title="No Categories Found"
          description={
            searchQuery
              ? "No categories match the active search query. Try clearing the search filter."
              : "No categories currently exist. Create your first category above."
          }
          action={
            searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs uppercase"
              >
                Reset Search
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} className="text-xs uppercase">
                <PlusIcon className="size-3.5" />
                Add Category
              </Button>
            )
          }
        />
      ) : (
        <div className="border-line overflow-hidden rounded-lg border-[1.5px]">
          <Table className="text-xs">
            <TableHeader className="bg-surface">
              <TableRow className="border-line hover:bg-transparent">
                <TableHead className="w-10 text-center uppercase">#</TableHead>
                <TableHead className="uppercase">Name</TableHead>
                <TableHead className="uppercase">Slug</TableHead>
                <TableHead className="text-center uppercase">Assigned Resources</TableHead>
                <TableHead className="w-24 text-right uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((cat, idx) => {
                return (
                  <TableRow key={cat.id} className="border-line hover:bg-surface/50">
                    {/* Index */}
                    <TableCell className="text-muted-foreground text-center font-bold">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        #{idx + 1}
                      </Badge>
                    </TableCell>

                    {/* Name */}
                    <TableCell className="flex items-center justify-start gap-1.5">
                      <span className="text-foreground font-bold">{cat.name}</span>
                      <CopyButton textToCopy={cat.name} iconOnly size="icon-xs" />
                    </TableCell>

                    {/* Slug */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Badge variant="secondary" className="px-1.5 py-0 text-[11px] font-bold">
                          {cat.slug}
                        </Badge>
                        <CopyButton textToCopy={cat.slug} iconOnly size="icon-xs" />
                      </div>
                    </TableCell>

                    {/* Resource Count */}
                    <TableCell className="text-center">
                      <Badge
                        variant={cat.toolCount > 0 ? "accent" : "secondary"}
                        className="font-mono text-[10px] font-bold"
                      >
                        {cat.toolCount} {cat.toolCount === 1 ? "resource" : "resources"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => handleDownloadCategoryResources(cat)}
                          disabled={cat.toolCount === 0 || downloadingCategoryId === cat.id}
                          title={
                            cat.toolCount === 0
                              ? `No resources in ${cat.name}`
                              : `Download all ${cat.toolCount} resources in ${cat.name}`
                          }
                          className="hover:text-foreground text-muted-foreground"
                        >
                          {downloadingCategoryId === cat.id ? (
                            <CircleNotchIcon weight="bold" className="size-3.5 animate-spin" />
                          ) : (
                            <DownloadSimpleIcon weight="bold" className="text-primary size-3.5" />
                          )}
                        </Button>
                        <CopyButton
                          textToCopy={JSON.stringify(
                            {
                              id: cat.id,
                              createdAt: cat.createdAt,
                              name: cat.name,
                              resourceCount: cat.toolCount,
                              slug: cat.slug,
                              updatedAt: cat.updatedAt,
                            },
                            null,
                            2,
                          )}
                          iconOnly
                          size="icon-xs"
                          title={`Copy JSON for ${cat.name}`}
                        />
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => handleOpenEdit(cat)}
                          title={`Edit ${cat.name}`}
                        >
                          <PencilSimpleIcon className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingCategory(cat)}
                          title={`Delete ${cat.name}`}
                        >
                          <TrashIcon className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-mono sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight uppercase">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingCategory
                ? "Update category name. The routing slug will automatically adjust."
                : "Add a category to the catalog. The routing slug is automatically generated."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4 pt-2 text-xs">
            {/* Name */}
            <div>
              <InputField
                label="Category Name *"
                placeholder="e.g. Artificial Intelligence"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                className="font-mono text-xs"
              />
            </div>

            {/* Auto-Generated Slug (Read-only Preview) */}
            <div className="border-line bg-surface/40 flex items-center justify-between rounded border-[1.5px] px-3 py-2 text-xs">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Generated Route URL:
              </span>
              <span className="text-foreground font-bold">/{slugify(formData.name) || "slug"}</span>
            </div>

            {duplicateCategory && (
              <DuplicateNotice
                type="category"
                title="This category is already added!"
                description={
                  <>
                    Already listed as{" "}
                    <strong className="font-bold underline">{duplicateCategory.name}</strong> (
                    <code>/{duplicateCategory.slug}</code>)
                    {duplicateCategory.toolCount > 0
                      ? ` with ${duplicateCategory.toolCount} assigned resource(s).`
                      : "."}
                  </>
                }
              />
            )}

            {/* Footer Actions */}
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
                    <CheckIcon weight="bold" className="size-3.5" />
                    <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description={
          <>
            Are you sure you want to permanently delete this category{" "}
            <strong className="text-foreground">&quot;{deletingCategory?.name}&quot;</strong>? This
            action cannot be undone.
            {deletingCategory && deletingCategory.toolCount > 0 && (
              <span className="text-destructive mt-2 block font-semibold">
                Warning: {deletingCategory.toolCount} resource(s) are currently assigned to this
                category. Deleting it will fail until those resources are reassigned.
              </span>
            )}
          </>
        }
        confirmLabel="Hold to delete"
      />

      {/* Confirmation Dialog for Category Updates */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Category Updates"
        description="Review the list of changed category properties before saving changes."
        itemTitle={formData.name || editingCategory?.name}
        changes={pendingChanges}
        onConfirm={executeSave}
        isWorking={isSubmitting}
      />
    </div>
  );
}
