"use client";

import { CheckIcon } from "@phosphor-icons/react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DuplicateNotice } from "@/components/submissions/duplicate-url-notice";
import { FieldCheckmark } from "@/components/submissions/field-checkmark";
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
import { Label } from "@/components/ui/label";
import { cn, slugify } from "@/lib/utils";

import { AdminCategoryItem } from "./admin-categories-client";
import {
  AdminConfirmEditDialog,
  computeFieldChanges,
  FieldDiff,
} from "./admin-confirm-edit-dialog";

const CATEGORY_FIELD_LABELS: Record<string, string> = {
  name: "Category Name",
};

export interface AdminCategoryDialogProps {
  category?: AdminCategoryItem | Partial<AdminCategoryItem> | null;
  existingCategories?: AdminCategoryItem[];
  onCreated?: (newCategory: AdminCategoryItem) => void;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (updatedCategory: AdminCategoryItem) => void;
  open: boolean;
}

export function AdminCategoryDialog({
  category,
  existingCategories = [],
  onCreated,
  onOpenChange,
  onUpdated,
  open,
}: AdminCategoryDialogProps) {
  const isEdit = Boolean(category?.id);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [isWorking, setIsWorking] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);

  useEffect(() => {
    if (open) {
      setFormData({
        name: category?.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
      setIsConfirmOpen(false);
      setPendingChanges([]);
    }
  }, [category, open]);

  const duplicateCategory = useMemo(() => {
    const rawName = formData.name.trim();
    if (!rawName) return null;
    const targetSlug = slugify(rawName);
    const targetLower = rawName.toLowerCase();
    return (
      existingCategories.find(
        (c) =>
          c.id !== category?.id && (c.slug === targetSlug || c.name.toLowerCase() === targetLower),
      ) || null
    );
  }, [category?.id, existingCategories, formData.name]);

  const executeSave = async () => {
    try {
      setIsWorking(true);
      const cleanName = formData.name.trim();

      if (isEdit && category?.id) {
        // PATCH
        const res = await fetch("/api/admin/categories", {
          body: JSON.stringify({
            id: category.id,
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

        const updatedCategory: AdminCategoryItem = {
          ...category,
          id: category.id,
          name: cleanName,
          slug: slugify(cleanName),
          toolCount: category.toolCount ?? 0,
          updatedAt: new Date().toISOString(),
        };

        toast.success(`Category "${cleanName}" updated successfully.`);
        onUpdated?.(updatedCategory);
        setIsConfirmOpen(false);
        onOpenChange(false);
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

        const newCategory: AdminCategoryItem = {
          id: data.id,
          createdAt: new Date().toISOString(),
          name: cleanName,
          slug: data.slug || slugify(cleanName),
          toolCount: 0,
          updatedAt: new Date().toISOString(),
        };

        toast.success(`Category "${cleanName}" created successfully.`);
        onCreated?.(newCategory);
        setFormData({ name: "" });
        onOpenChange(false);
      }
    } catch {
      toast.error("Network error while saving category.");
    } finally {
      setIsWorking(false);
    }
  };

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

    if (isEdit && category) {
      const diffs = computeFieldChanges(category, formData, CATEGORY_FIELD_LABELS);
      setPendingChanges(diffs);
      setIsConfirmOpen(true);
    } else {
      await executeSave();
    }
  };

  const isNameFilled = Boolean(formData.name.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0 font-mono text-xs sm:max-w-lg">
        <div className="border-line shrink-0 border-b-[1.5px] p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold uppercase">
              {isEdit ? `Edit Category: ${category?.name || formData.name}` : "Create New Category"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              {isEdit
                ? "Update category name. The routing slug will automatically adjust."
                : "Add a category to the catalog. The routing slug is automatically generated."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-6 text-xs">
            {/* Category Name */}
            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded-md p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-colors",
                  isNameFilled
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <span>Category Name</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={isNameFilled} />
              </Label>
              <InputField
                placeholder="e.g. Artificial Intelligence or Fonts & Typography"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                className={cn(
                  "font-mono text-xs transition-colors",
                  isNameFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
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
          </div>

          {/* Fixed Footer Actions */}
          <div className="border-line bg-surface/30 shrink-0 border-t-[1.5px] p-4 sm:px-6">
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isWorking}
                className="font-mono text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isWorking}
                className="font-mono text-xs font-bold uppercase"
              >
                {isWorking ? (
                  "Saving..."
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckIcon weight="bold" className="size-3.5" />
                    <span>Create Category</span>
                  </span>
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>

      {/* Confirmation Dialog for Category Updates */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Category Updates"
        description="Review the list of changed category properties before saving changes."
        itemTitle={formData.name || (typeof category?.name === "string" ? category.name : "")}
        changes={pendingChanges}
        onConfirm={executeSave}
        isWorking={isWorking}
      />
    </Dialog>
  );
}
