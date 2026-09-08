"use client";

import {
  ArrowsClockwiseIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  FoldersIcon,
  MagnifyingGlassIcon,
  PaletteIcon,
  PencilSimpleIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import React, { useMemo, useState } from "react";
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
import { SelectField } from "@/components/ui/select-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, slugify, type Theme, THEME_CONFIG, THEMES } from "@/lib/utils";

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

export const CATEGORY_THEMES: {
  description: string;
  hex: string;
  name: string;
  oklch: string;
  textColor: "text-ink" | "text-paper";
  theme: Theme;
}[] = [
  {
    description: "1st: AI & Machine Learning",
    hex: "#9B111E",
    name: "Cardinal Red",
    oklch: "oklch(42% 0.21 27)",
    textColor: "text-paper",
    theme: "red",
  },
  {
    description: "2nd: Animations & Motion",
    hex: "#E8A52B",
    name: "Amber Honey",
    oklch: "oklch(75% 0.16 70)",
    textColor: "text-ink",
    theme: "orange",
  },
  {
    description: "3rd: Backend & Databases",
    hex: "#FFF064",
    name: "Lemon Sun",
    oklch: "oklch(93.5% 0.16 102)",
    textColor: "text-ink",
    theme: "yellow",
  },
  {
    description: "4th: Components & UI",
    hex: "#88CB02",
    name: "Fresh Grass",
    oklch: "oklch(76% 0.20 135)",
    textColor: "text-ink",
    theme: "green",
  },
  {
    description: "5th: CSS & Styling",
    hex: "#9DD6FA",
    name: "Blue Slush",
    oklch: "oklch(84% 0.09 232)",
    textColor: "text-ink",
    theme: "cyan",
  },
  {
    description: "6th: Documentation & DevOps",
    hex: "#2A47B8",
    name: "Cobalt Electric",
    oklch: "oklch(42% 0.19 265)",
    textColor: "text-paper",
    theme: "blue",
  },
  {
    description: "7th: Icons & Logos",
    hex: "#683557",
    name: "Berry Plum",
    oklch: "oklch(43% 0.11 348)",
    textColor: "text-paper",
    theme: "purple",
  },
  {
    description: "8th: Testing & QA",
    hex: "#C9A4F0",
    name: "Cyber Lilac",
    oklch: "oklch(75% 0.14 310)",
    textColor: "text-ink",
    theme: "pink",
  },
];

/**
 * Computes a category's theme deterministically from its alphabetical sequence.
 */
export function getAlphabeticalTheme(catName: string, allCategories: AdminCategoryItem[]): Theme {
  if (!catName.trim()) return THEMES[0];
  const sorted = [...allCategories].sort((a, b) => a.name.localeCompare(b.name));
  const idx = sorted.findIndex((c) => c.name.toLowerCase().trim() === catName.toLowerCase().trim());
  if (idx !== -1) {
    return THEMES[idx % THEMES.length];
  }

  // Calculate projected position for a new category
  const projected = [...sorted, { name: catName } as AdminCategoryItem].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const projectedIdx = projected.findIndex(
    (c) => c.name.toLowerCase().trim() === catName.toLowerCase().trim(),
  );
  return THEMES[(projectedIdx !== -1 ? projectedIdx : sorted.length) % THEMES.length];
}

export function AdminCategoriesClient({ initialCategories = [] }: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<Theme | "all">("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);

  // Form fields (only name; slug and theme are strictly auto-generated)
  const [formData, setFormData] = useState({
    name: "",
  });

  // Active theme computed dynamically from alphabetical position
  const currentFormTheme: Theme = getAlphabeticalTheme(formData.name || "A", categories);
  const currentFormThemeMeta = CATEGORY_THEMES.find((t) => t.theme === currentFormTheme);

  // Canonical alphabetical sequence for deterministic theme assignment
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (selectedThemeFilter !== "all") {
      result = result.filter(
        (c) => getAlphabeticalTheme(c.name, sortedCategories) === selectedThemeFilter,
      );
    }

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
  }, [categories, searchQuery, selectedThemeFilter, sortBy, sortedCategories]);

  // Copy to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} "${text}" to clipboard.`);
  };

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
      {/* Control Bar & Theme Overview */}
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border p-4 text-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <InputField
              placeholder="Search categories by name or slug..."
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontalIcon className="text-muted-foreground size-3.5" />
            <span className="text-muted-foreground text-[11px] font-bold uppercase">Sort:</span>
            <SelectField
              value={sortBy}
              onValueChange={setSortBy}
              options={SORT_OPTIONS}
              triggerClassName="h-9 font-mono text-xs min-w-[170px]"
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

        {/* Theme Palette & Quick Filter Tabs */}
        <div className="border-border space-y-2 border-t pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
              <PaletteIcon className="size-3.5" />
              <span>Category Theme Palette</span>
            </div>
            <span className="text-muted-foreground text-[10px]">
              Themes cycle sequentially through the 8 colors in alphabetical order
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-9">
            <button
              type="button"
              onClick={() => setSelectedThemeFilter("all")}
              className={cn(
                "flex items-center justify-between rounded border px-2 py-1.5 text-left font-mono text-[10px] font-bold uppercase transition-colors",
                selectedThemeFilter === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-surface hover:border-ink/50 text-foreground",
              )}
            >
              <span>All Categories</span>
              <span className="font-normal opacity-75">({categories.length})</span>
            </button>

            {CATEGORY_THEMES.map((item) => {
              const count = sortedCategories.filter(
                (c) => getAlphabeticalTheme(c.name, sortedCategories) === item.theme,
              ).length;
              const isSelected = selectedThemeFilter === item.theme;

              return (
                <button
                  key={item.theme}
                  type="button"
                  onClick={() => setSelectedThemeFilter(isSelected ? "all" : item.theme)}
                  className={cn(
                    "flex items-center justify-between rounded border px-2 py-1.5 text-left font-mono text-[10px] font-bold uppercase transition-colors",
                    isSelected
                      ? cn("border-ink ring-ink shadow-xs ring-2", THEME_CONFIG[item.theme].bg)
                      : "border-line bg-surface hover:border-ink/50 text-foreground",
                  )}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="size-2 rounded-full border border-black/20"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="truncate">{item.theme}</span>
                  </div>
                  <span className="font-normal opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories Table */}
      {filteredCategories.length === 0 ? (
        <div className="border-line bg-surface/30 flex flex-col items-center justify-center rounded-lg border p-12 text-center">
          <FoldersIcon className="text-muted-foreground/60 mb-3 size-10" />
          <h3 className="text-foreground text-sm font-bold uppercase">No Categories Found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            {searchQuery || selectedThemeFilter !== "all"
              ? "No categories match the active filter criteria. Try clearing search or theme filters."
              : "No categories currently exist. Create your first category above."}
          </p>
          {searchQuery || selectedThemeFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedThemeFilter("all");
              }}
              className="mt-4 text-xs uppercase"
            >
              Reset Filters
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
                <TableHead className="w-10 text-center uppercase">#</TableHead>
                <TableHead className="uppercase">Name</TableHead>
                <TableHead className="uppercase">Slug</TableHead>
                <TableHead className="uppercase">Theme</TableHead>
                <TableHead className="text-center uppercase">Assigned Resources</TableHead>
                <TableHead className="w-24 text-right uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((cat, idx) => {
                const assignedTheme = getAlphabeticalTheme(cat.name, sortedCategories);
                const themeMeta = CATEGORY_THEMES.find((t) => t.theme === assignedTheme);

                return (
                  <TableRow key={cat.id} className="border-line hover:bg-surface/50">
                    {/* Index */}
                    <TableCell className="text-muted-foreground text-center font-bold">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        #{idx + 1}
                      </Badge>
                    </TableCell>

                    {/* Name */}
                    <TableCell>
                      <span className="text-foreground font-bold">{cat.name}</span>
                    </TableCell>

                    {/* Slug */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Badge variant="secondary" className="px-1.5 py-0 text-[11px] font-normal">
                          {cat.slug}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => handleCopy(cat.slug, "Slug")}
                          className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 opacity-60 hover:opacity-100"
                          title="Copy slug"
                        >
                          <CopyIcon className="size-3" />
                        </button>
                      </div>
                    </TableCell>

                    {/* Theme */}
                    <TableCell>
                      <span
                        className={cn(
                          "border-ink inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-bold uppercase shadow-2xs",
                          THEME_CONFIG[assignedTheme].bg,
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        <span>{themeMeta?.name || assignedTheme}</span>
                      </span>
                    </TableCell>

                    {/* Resource Count */}
                    <TableCell className="text-center">
                      <Badge
                        variant={cat.toolCount > 0 ? "default" : "secondary"}
                        className="font-mono text-[10px]"
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
                ? "Update category name. Routing slug and theme will automatically adjust."
                : "Add a category to the catalog. Routing slug and theme are automatically calculated."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
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
            <div className="border-line bg-surface/40 flex items-center justify-between rounded border px-3 py-2 text-xs">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Generated Route URL:
              </span>
              <span className="text-foreground font-bold">/{slugify(formData.name) || "slug"}</span>
            </div>

            {/* Auto-Assigned Theme Preview */}
            <div className="border-line bg-surface/30 space-y-2 rounded-lg border p-3">
              <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
                <EyeIcon className="size-3.5" />
                <span>Assigned Theme</span>
              </div>

              <div className="border-ink bg-bg space-y-2 border-2 p-3">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "border-ink border px-2 py-0.5 text-[10px] font-bold uppercase",
                      THEME_CONFIG[currentFormTheme].bg,
                    )}
                  >
                    {formData.name || "Category Name"}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    {currentFormThemeMeta?.name} ({currentFormTheme.toUpperCase()})
                  </span>
                </div>

                <p className="text-foreground text-xs font-bold">
                  {formData.name || "Untitled Category"} Sample Resource Card
                </p>
              </div>
            </div>

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
