/* eslint-disable perfectionist/sort-objects, perfectionist/sort-arrays */
"use client";

import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  FoldersIcon,
  MagnifyingGlassIcon,
  PaletteIcon,
  PencilSimpleIcon,
  PlusIcon,
  SparkleIcon,
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
import {
  cn,
  getCategoryTheme,
  slugify,
  type Theme,
  THEME_CONFIG,
  THEMES,
} from "@/lib/utils";

export interface AdminCategoryItem {
  createdAt?: Date | string;
  description: string | null;
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

const RAINBOW_THEMES: {
  theme: Theme;
  name: string;
  hex: string;
  oklch: string;
  textColor: "text-ink" | "text-paper";
  description: string;
}[] = [
  {
    theme: "red",
    name: "Cardinal Red",
    hex: "#9B111E",
    oklch: "oklch(42% 0.21 27)",
    textColor: "text-paper",
    description: "1st: AI & Machine Learning",
  },
  {
    theme: "orange",
    name: "Amber Honey",
    hex: "#E8A52B",
    oklch: "oklch(75% 0.16 70)",
    textColor: "text-ink",
    description: "2nd: Animations & Motion",
  },
  {
    theme: "yellow",
    name: "Lemon Sun",
    hex: "#FFF064",
    oklch: "oklch(93.5% 0.16 102)",
    textColor: "text-ink",
    description: "3rd: Backend & Databases",
  },
  {
    theme: "green",
    name: "Fresh Grass",
    hex: "#88CB02",
    oklch: "oklch(76% 0.20 135)",
    textColor: "text-ink",
    description: "4th: Components & UI",
  },
  {
    theme: "cyan",
    name: "Blue Slush",
    hex: "#9DD6FA",
    oklch: "oklch(84% 0.09 232)",
    textColor: "text-ink",
    description: "5th: CSS & Styling",
  },
  {
    theme: "blue",
    name: "Cobalt Electric",
    hex: "#2A47B8",
    oklch: "oklch(42% 0.19 265)",
    textColor: "text-paper",
    description: "6th: Documentation & DevOps",
  },
  {
    theme: "purple",
    name: "Berry Plum",
    hex: "#683557",
    oklch: "oklch(43% 0.11 348)",
    textColor: "text-paper",
    description: "7th: Icons & Logos",
  },
  {
    theme: "pink",
    name: "Cyber Lilac",
    hex: "#C9A4F0",
    oklch: "oklch(75% 0.14 310)",
    textColor: "text-ink",
    description: "8th: Testing & QA",
  },
];

function resolveCategoryTheme(
  themeColor: string | null | undefined,
  categoryName: string,
): Theme {
  if (themeColor) {
    const clean = themeColor.toLowerCase().trim();
    if (THEMES.includes(clean as Theme)) {
      return clean as Theme;
    }
    const match = RAINBOW_THEMES.find((t) => t.hex.toLowerCase() === clean);
    if (match) return match.theme;
  }
  return getCategoryTheme(categoryName);
}

export function AdminCategoriesClient({
  initialCategories = [],
}: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<Theme | "all">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    description: "",
    name: "",
    order: 0,
    slug: "",
    themeColor: "red",
  });
  const [autoSlug, setAutoSlug] = useState(true);

  // Active theme in form
  const currentFormTheme: Theme = resolveCategoryTheme(formData.themeColor, formData.name);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    let result = categories;

    if (selectedThemeFilter !== "all") {
      result = result.filter(
        (c) => resolveCategoryTheme(c.themeColor, c.name) === selectedThemeFilter,
      );
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase().trim();
    return result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q),
    );
  }, [categories, searchQuery, selectedThemeFilter]);

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
    const nextOrder = categories.length + 1;
    const defaultTheme = THEMES[categories.length % THEMES.length];
    setFormData({
      description: "",
      name: "",
      order: nextOrder,
      slug: "",
      themeColor: defaultTheme,
    });
    setAutoSlug(true);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (categoryItem: AdminCategoryItem) => {
    setEditingCategory(categoryItem);
    setFormData({
      description: categoryItem.description || "",
      name: categoryItem.name,
      order: categoryItem.order,
      slug: categoryItem.slug,
      themeColor: categoryItem.themeColor || resolveCategoryTheme(null, categoryItem.name),
    });
    setAutoSlug(false);
    setIsDialogOpen(true);
  };

  // Handle Form Name Change (auto slug)
  const handleNameChange = (newName: string) => {
    const slug = autoSlug ? slugify(newName) : formData.slug;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug,
    }));
  };

  // Auto detect rainbow theme based on alphabetical position / category name
  const handleAutoDetectTheme = () => {
    const detected = resolveCategoryTheme(null, formData.name || "category");
    setFormData((prev) => ({ ...prev, themeColor: detected }));
    toast.info(`Assigned ${detected.toUpperCase()} theme based on alphabetical sequence.`);
  };

  // Submit Add / Edit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const cleanSlug = formData.slug.trim() || slugify(formData.name);

      if (editingCategory) {
        // PATCH
        const res = await fetch("/api/admin/categories", {
          body: JSON.stringify({
            id: editingCategory.id,
            description: formData.description.trim() || null,
            name: formData.name.trim(),
            order: Number(formData.order) || 0,
            slug: cleanSlug,
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
                  name: formData.name.trim(),
                  order: Number(formData.order) || 0,
                  slug: cleanSlug,
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
            name: formData.name.trim(),
            order: Number(formData.order) || 0,
            slug: cleanSlug,
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
            name: formData.name.trim(),
            order: Number(formData.order) || 0,
            slug: cleanSlug,
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
      {/* Control Bar & Palette Overview */}
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border p-4 text-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <InputField
              placeholder="Search categories by name, slug, or description..."
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

        {/* Rainbow Theme Filter Tabs */}
        <div className="border-border/40 border-t pt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
              <PaletteIcon className="size-3.5" />
              <span>Rainbow Theme Filter:</span>
            </span>
            <span className="text-muted-foreground text-[10px]">
              {filteredCategories.length} of {categories.length} displayed
            </span>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
            <Button
              size="xs"
              variant={selectedThemeFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedThemeFilter("all")}
              className="h-7 text-[11px] uppercase font-bold"
            >
              All ({categories.length})
            </Button>

            {RAINBOW_THEMES.map((item) => {
              const count = categories.filter(
                (c) => resolveCategoryTheme(c.themeColor, c.name) === item.theme,
              ).length;
              const isSelected = selectedThemeFilter === item.theme;

              return (
                <button
                  key={item.theme}
                  type="button"
                  onClick={() =>
                    setSelectedThemeFilter(isSelected ? "all" : item.theme)
                  }
                  className={cn(
                    "flex h-7 items-center gap-1.5 rounded border px-2 font-mono text-[11px] font-bold uppercase transition-all",
                    isSelected
                      ? cn("border-ink scale-105 shadow-xs ring-1 ring-ink", THEME_CONFIG[item.theme].bg)
                      : "bg-surface border-line hover:border-ink/50 text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full border border-black/25",
                      THEME_CONFIG[item.theme].bg,
                    )}
                  />
                  <span>{item.name.split(" ")[0]}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
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
                <TableHead className="w-12 text-center uppercase">Order</TableHead>
                <TableHead className="uppercase">Name & Slug</TableHead>
                <TableHead className="uppercase">Description</TableHead>
                <TableHead className="uppercase">Theme & Contrast</TableHead>
                <TableHead className="text-center uppercase">Assigned Resources</TableHead>
                <TableHead className="w-24 text-right uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((cat) => {
                const assignedTheme = resolveCategoryTheme(cat.themeColor, cat.name);
                const themeMeta = RAINBOW_THEMES.find((t) => t.theme === assignedTheme);

                return (
                  <TableRow key={cat.id} className="border-line hover:bg-surface/50">
                    {/* Order */}
                    <TableCell className="text-center font-bold">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        #{cat.order}
                      </Badge>
                    </TableCell>

                    {/* Name & Slug */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground font-bold">{cat.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-[10px] tracking-wide">
                            /{cat.slug}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(cat.slug, "Slug")}
                            className="text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
                            title="Copy slug"
                          >
                            <CopyIcon className="size-3" />
                          </button>
                        </div>
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="max-w-xs">
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {cat.description || <span className="italic opacity-50">No description</span>}
                      </p>
                    </TableCell>

                    {/* Theme & Contrast */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "border-ink inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-bold uppercase shadow-2xs",
                              THEME_CONFIG[assignedTheme].bg,
                            )}
                          >
                            <span className="size-1.5 rounded-full bg-current" />
                            <span>{themeMeta?.name || assignedTheme}</span>
                          </span>

                          <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-0.5 text-[10px] font-bold">
                            <CheckCircleIcon weight="fill" className="size-3" />
                            <span>AAA</span>
                          </span>
                        </div>
                      </div>
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
        <DialogContent className="font-mono sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight uppercase">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingCategory
                ? "Update display metadata, rainbow theme assignments, and URL routing."
                : "Add a first-class catalog category with automatic rainbow spectrum theme."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            {/* Name */}
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

            {/* Slug */}
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

            {/* Description */}
            <div>
              <InputField
                label="Description"
                placeholder="Short summary of resources in this category..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="font-mono text-xs"
              />
            </div>

            {/* 8-Color Rainbow Theme Selector */}
            <div className="border-line bg-surface/40 space-y-2.5 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <label className="text-foreground text-xs font-bold uppercase tracking-wide">
                  Rainbow Theme Assignment
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAutoDetectTheme}
                  className="h-6 text-[10px] uppercase font-bold"
                >
                  <SparkleIcon className="size-3" />
                  <span>Auto-Detect</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RAINBOW_THEMES.map((themeItem) => {
                  const isSelected = currentFormTheme === themeItem.theme;

                  return (
                    <button
                      key={themeItem.theme}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, themeColor: themeItem.theme }))
                      }
                      className={cn(
                        "flex flex-col items-start rounded border p-2 text-left font-mono text-[10px] transition-all",
                        isSelected
                          ? cn("border-ink scale-102 shadow-xs ring-2 ring-ink", THEME_CONFIG[themeItem.theme].bg)
                          : "bg-surface border-line hover:border-ink/50 text-foreground",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-bold">{themeItem.name}</span>
                        {isSelected && <CheckIcon weight="bold" className="size-3" />}
                      </div>
                      <span className="opacity-75">{themeItem.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Order */}
            <div>
              <InputField
                label="Display Order Index"
                type="number"
                placeholder="0"
                value={String(formData.order)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="font-mono text-xs"
              />
            </div>

            {/* Live Card Preview */}
            <div className="border-line bg-surface/30 space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                <EyeIcon className="size-3.5" />
                <span>Live Component Preview</span>
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
                    Theme: {currentFormTheme.toUpperCase()}
                  </span>
                </div>

                <p className="text-foreground text-xs font-bold">
                  {formData.name || "Untitled Category"} Sample Resource
                </p>
                <p className="text-muted-foreground line-clamp-2 text-[11px]">
                  {formData.description ||
                    "This is how items under this category will render on the catalog."}
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
    </div>
  );
}
