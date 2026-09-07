"use client";

import {
  ArrowsClockwiseIcon,
  CheckIcon,
  FoldersIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { slugify } from "@/lib/utils";

export interface AdminCategoryItem {
  createdAt?: Date | string;
  description: string | null;
  icon: string | null;
  id: string;
  name: string;
  order: number;
  slug: string;
  themeColor: string | null;
  toolCount: number;
  updatedAt?: Date | string;
}

interface AdminCategoriesClientProps {
  initialCategories: AdminCategoryItem[];
}

export function AdminCategoriesClient({ initialCategories = [] }: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    description: "",
    icon: "",
    name: "",
    order: 0,
    slug: "",
    themeColor: "",
  });
  const [autoSlug, setAutoSlug] = useState(true);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.icon?.toLowerCase().includes(q),
    );
  }, [categories, searchQuery]);

  // Refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && data.categories) {
        setCategories(data.categories);
        toast.info("Categories refreshed.");
      } else {
        toast.error(data.error || "Failed to refresh categories.");
      }
    } catch {
      toast.error("Network error while refreshing categories.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      description: "",
      icon: "",
      name: "",
      order: categories.length + 1,
      slug: "",
      themeColor: "#6366F1",
    });
    setAutoSlug(true);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (categoryItem: AdminCategoryItem) => {
    setEditingCategory(categoryItem);
    setFormData({
      description: categoryItem.description || "",
      icon: categoryItem.icon || "",
      name: categoryItem.name,
      order: categoryItem.order,
      slug: categoryItem.slug,
      themeColor: categoryItem.themeColor || "",
    });
    setAutoSlug(false);
    setIsDialogOpen(true);
  };

  // Handle Form Name Change (auto slug)
  const handleNameChange = (newName: string) => {
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: autoSlug ? slugify(newName) : prev.slug,
    }));
  };

  // Submit Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        // PATCH
        const res = await fetch("/api/admin/categories", {
          body: JSON.stringify({
            id: editingCategory.id,
            description: formData.description.trim() || null,
            icon: formData.icon.trim() || null,
            name: formData.name.trim(),
            order: Number(formData.order) || 0,
            slug: formData.slug.trim() || slugify(formData.name),
            themeColor: formData.themeColor.trim() || null,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to update category.");
          return;
        }

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  description: formData.description.trim() || null,
                  icon: formData.icon.trim() || null,
                  name: formData.name.trim(),
                  order: Number(formData.order) || 0,
                  slug: formData.slug.trim() || slugify(formData.name),
                  themeColor: formData.themeColor.trim() || null,
                }
              : c,
          ),
        );
        toast.success(`Category "${formData.name}" updated successfully.`);
      } else {
        // POST
        const res = await fetch("/api/admin/categories", {
          body: JSON.stringify({
            description: formData.description.trim() || null,
            icon: formData.icon.trim() || null,
            name: formData.name.trim(),
            order: Number(formData.order) || 0,
            slug: formData.slug.trim() || slugify(formData.name),
            themeColor: formData.themeColor.trim() || null,
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
            description: formData.description.trim() || null,
            icon: formData.icon.trim() || null,
            name: formData.name.trim(),
            order: Number(formData.order) || 0,
            slug: formData.slug.trim() || slugify(formData.name),
            themeColor: formData.themeColor.trim() || null,
            toolCount: 0,
          },
        ]);
        toast.success(`Category "${formData.name}" created successfully.`);
      }

      setIsDialogOpen(false);
    } catch {
      toast.error("Network error while saving category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    const target = deletingCategory;
    const previous = categories;

    // Optimistic delete
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
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border p-4 text-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <InputField
              placeholder="Search categories by name, slug, description, or icon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<MagnifyingGlassIcon className="text-muted-foreground size-4" />}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
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
              className="h-9 text-xs uppercase"
              title="Refresh category catalog"
            >
              <ArrowsClockwiseIcon className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </Button>

            <Button size="sm" onClick={handleOpenAdd} className="h-9 text-xs font-bold uppercase">
              <PlusIcon className="size-3.5" weight="bold" />
              <span>New Category</span>
            </Button>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="text-muted-foreground border-border/40 flex items-center justify-between border-t pt-2 text-[11px]">
          <span>
            Displaying <strong className="text-foreground">{filteredCategories.length}</strong> of{" "}
            {categories.length} categories
          </span>
          {searchQuery && (
            <span className="text-primary text-[10px] tracking-wider uppercase">
              Filtered by: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>
      </div>

      {/* Categories Table */}
      {filteredCategories.length === 0 ? (
        <div className="border-line bg-surface/30 flex flex-col items-center justify-center rounded-lg border p-12 text-center">
          <FoldersIcon className="text-muted-foreground/60 mb-3 size-10" />
          <h3 className="text-foreground text-sm font-bold uppercase">No Categories Found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            {searchQuery
              ? `No categories match query "${searchQuery}". Try a different term.`
              : "No categories currently exist. Create your first category above."}
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
              Add Category
            </Button>
          )}
        </div>
      ) : (
        <div className="border-line overflow-hidden rounded-lg border">
          <Table className="text-xs">
            <TableHeader className="bg-surface">
              <TableRow className="border-line hover:bg-transparent">
                <TableHead className="w-12 text-center uppercase">Order</TableHead>
                <TableHead className="uppercase">Name & Slug</TableHead>
                <TableHead className="uppercase">Description</TableHead>
                <TableHead className="uppercase">Theme / Icon</TableHead>
                <TableHead className="text-center uppercase">Assigned Resources</TableHead>
                <TableHead className="w-24 text-right uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((cat) => (
                <TableRow key={cat.id} className="border-line hover:bg-surface/50">
                  <TableCell className="text-center font-bold">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {cat.order}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground font-bold">{cat.name}</span>
                      <span className="text-muted-foreground text-[10px] tracking-wide">
                        /{cat.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {cat.description || <span className="italic opacity-50">No description</span>}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cat.themeColor ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-3 rounded-full border border-black/20 dark:border-white/20"
                            style={{ backgroundColor: cat.themeColor }}
                          />
                          <span className="text-muted-foreground text-[10px]">
                            {cat.themeColor}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[10px] opacity-60">None</span>
                      )}
                      {cat.icon && (
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                          {cat.icon}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={cat.toolCount > 0 ? "default" : "secondary"}
                      className="font-mono text-[10px]"
                    >
                      {cat.toolCount} {cat.toolCount === 1 ? "resource" : "resources"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-mono sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight uppercase">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingCategory
                ? "Update the category's display metadata, slug, and styling."
                : "Add a new first-class category for grouping resources."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            <div>
              <InputField
                label="Category Name *"
                placeholder="e.g. AI & Machine Learning"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="font-mono text-xs"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-muted-foreground text-xs font-semibold">Slug *</label>
                {!editingCategory && (
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
                placeholder="e.g. ai"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                required
                className="font-mono text-xs"
              />
            </div>

            <div>
              <InputField
                label="Description"
                placeholder="Short summary of resources in this category..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputField
                  label="Icon (Identifier)"
                  placeholder="e.g. Robot, Code, Palette"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <InputField
                  label="Theme Color"
                  placeholder="e.g. #3B82F6"
                  value={formData.themeColor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, themeColor: e.target.value }))}
                  prefix={
                    formData.themeColor ? (
                      <span
                        className="size-3 rounded-full border border-black/20"
                        style={{ backgroundColor: formData.themeColor }}
                      />
                    ) : undefined
                  }
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <InputField
                label="Display Order Index"
                type="number"
                placeholder="0"
                value={String(formData.order)}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))
                }
                className="font-mono text-xs"
              />
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
                    <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent className="font-mono text-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-mono uppercase">
              Delete Category: {deletingCategory?.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-relaxed">
              Are you sure you want to delete category{" "}
              <strong className="text-foreground">/{deletingCategory?.slug}</strong>?
              {deletingCategory && deletingCategory.toolCount > 0 && (
                <span className="text-destructive mt-2 block font-semibold">
                  Warning: {deletingCategory.toolCount} resource(s) are currently assigned to this
                  category. Deleting it will fail until those resources are reassigned.
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
    </div>
  );
}
