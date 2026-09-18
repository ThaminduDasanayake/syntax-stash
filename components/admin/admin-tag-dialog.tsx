"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DuplicateNotice } from "@/components/submissions/duplicate-url-notice";
import { FieldCheckmark } from "@/components/submissions/field-checkmark";
import { invalidateTagCache } from "@/components/submissions/tag-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFormActions,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { cn, normalizeTag } from "@/lib/utils";

import {
  AdminConfirmEditDialog,
  computeFieldChanges,
  FieldDiff,
} from "./admin-confirm-edit-dialog";
import { AdminTagItem } from "./admin-tags-client";

const TAG_FIELD_LABELS: Record<string, string> = {
  name: "Tag Name",
  slug: "Tag Slug",
};

export interface AdminTagDialogProps {
  existingTags?: AdminTagItem[];
  onCreated?: (newTag: AdminTagItem) => void;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (updatedTag: AdminTagItem) => void;
  open: boolean;
  tag?: AdminTagItem | Partial<AdminTagItem> | null;
}

export function AdminTagDialog({
  existingTags = [],
  onCreated,
  onOpenChange,
  onUpdated,
  open,
  tag,
}: AdminTagDialogProps) {
  const isEdit = Boolean(tag?.id);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);

  useEffect(() => {
    if (open) {
      setFormData({
        name: tag?.name || "",
        slug: tag?.slug || "",
      });
      setAutoSlug(!tag?.slug);
    } else {
      setFormData({
        name: "",
        slug: "",
      });
      setAutoSlug(true);
      setIsConfirmOpen(false);
      setPendingChanges([]);
    }
  }, [open, tag]);

  const duplicateTag = useMemo(() => {
    const rawName = formData.name.trim();
    const rawSlug = formData.slug.trim();
    if (!rawName && !rawSlug) return null;
    const targetSlug = rawSlug ? normalizeTag(rawSlug) : normalizeTag(rawName);
    const targetLower = rawName.toLowerCase();
    return (
      existingTags.find(
        (t) =>
          t.id !== tag?.id &&
          (t.slug === targetSlug || (targetLower && t.name.toLowerCase() === targetLower)),
      ) || null
    );
  }, [existingTags, formData.name, formData.slug, tag?.id]);

  const handleNameChange = (newName: string) => {
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: autoSlug ? normalizeTag(newName) : prev.slug,
    }));
  };

  const executeSave = async () => {
    try {
      setIsWorking(true);
      const cleanName = formData.name.trim();
      const cleanSlug = formData.slug.trim()
        ? normalizeTag(formData.slug)
        : normalizeTag(cleanName);

      if (isEdit && tag?.id) {
        // PATCH
        const res = await fetch("/api/admin/tags", {
          body: JSON.stringify({
            id: tag.id,
            name: cleanName,
            slug: cleanSlug,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to update tag.");
          return;
        }

        const updatedTag: AdminTagItem = {
          ...tag,
          id: tag.id,
          name: cleanName,
          slug: cleanSlug,
          toolCount: tag.toolCount ?? 0,
          updatedAt: new Date().toISOString(),
        };

        invalidateTagCache();
        toast.success(`Tag "${cleanName}" updated successfully.`);
        onUpdated?.(updatedTag);
        setIsConfirmOpen(false);
        onOpenChange(false);
      } else {
        // POST
        const res = await fetch("/api/admin/tags", {
          body: JSON.stringify({
            name: cleanName,
            slug: cleanSlug,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to create tag.");
          return;
        }

        const newTag: AdminTagItem = {
          id: data.id,
          createdAt: new Date().toISOString(),
          name: cleanName,
          slug: data.slug || cleanSlug,
          toolCount: 0,
          updatedAt: new Date().toISOString(),
        };

        invalidateTagCache();
        toast.success(`Tag "${cleanName}" created successfully.`);
        onCreated?.(newTag);
        setFormData({ name: "", slug: "" });
        onOpenChange(false);
      }
    } catch {
      toast.error("Network error while saving tag.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tag name is required.");
      return;
    }

    if (duplicateTag) {
      toast.error(`Tag "${duplicateTag.name}" already exists.`);
      return;
    }

    if (isEdit && tag) {
      const diffs = computeFieldChanges(tag, formData, TAG_FIELD_LABELS);
      setPendingChanges(diffs);
      setIsConfirmOpen(true);
    } else {
      await executeSave();
    }
  };

  const isNameFilled = Boolean(formData.name.trim());
  const isSlugFilled = Boolean(formData.slug.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0 font-mono text-xs sm:max-w-lg">
        <div className="border-line shrink-0 border-b-[1.5px] p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold uppercase">
              {isEdit ? `Edit Tag: #${tag?.name || formData.name}` : "Create New Tag"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              {isEdit
                ? "Update tag name or slug identifier."
                : "Add a tag for categorizing and discovering resources."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-6 text-xs">
            {/* Tag Name */}
            <div className="space-y-1.5">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-colors",
                  isNameFilled ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                )}
              >
                <span>Tag Name</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={isNameFilled} />
              </Label>
              <InputField
                placeholder="e.g. Next.js, Open Source"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className={cn(
                  "font-mono text-xs transition-colors",
                  isNameFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            {/* Tag Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-colors",
                    isSlugFilled ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                  )}
                >
                  <span>Tag Slug</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={isSlugFilled} />
                </Label>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-primary text-[10px] uppercase hover:underline"
                  >
                    {autoSlug ? "Manual Slug" : "Auto Slug"}
                  </button>
                )}
              </div>
              <InputField
                placeholder="e.g. next-js, open-source"
                value={formData.slug}
                prefix="#"
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                required
                className={cn(
                  "font-mono text-xs transition-colors",
                  isSlugFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            {duplicateTag && (
              <DuplicateNotice
                type="tag"
                title="This tag is already added!"
                description={
                  <>
                    Already listed as{" "}
                    <strong className="font-bold underline">#{duplicateTag.name}</strong> (
                    <code>#{duplicateTag.slug}</code>)
                    {duplicateTag.toolCount > 0
                      ? ` with ${duplicateTag.toolCount} assigned resource(s).`
                      : "."}
                  </>
                }
              />
            )}
          </div>

          {/* Fixed Footer Actions */}
          <div className="border-line bg-surface/30 shrink-0 border-t-[1.5px] p-4 sm:px-6">
            <DialogFormActions
              onCancel={() => onOpenChange(false)}
              isWorking={isWorking}
              isEdit={isEdit}
              createLabel="Create Tag"
              editLabel="Save Changes"
            />
          </div>
        </form>
      </DialogContent>

      {/* Confirmation Dialog for Tag Updates */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Tag Updates"
        description="Review the list of changed tag properties before saving changes."
        itemTitle={formData.name ? `#${formData.name}` : tag?.name ? `#${tag.name}` : undefined}
        changes={pendingChanges}
        onConfirm={executeSave}
        isWorking={isWorking}
      />
    </Dialog>
  );
}
