"use client";

import {
  ArrowLeftIcon,
  CircleNotchIcon,
  EraserIcon,
  FloppyDiskIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  ResourceFormData,
  ResourceFormFields,
} from "@/components/admin/shared/resource-form-fields";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { mergeScannedMetadata, useMetadataScanner } from "@/hooks/use-metadata-scanner";

import { computeFieldChanges, ConfirmEditDialog, FieldDiff } from "../shared/confirm-edit-dialog";
import { ResourceItem } from "../shared/types";

const RESOURCE_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  authorName: "Creator / Author",
  category: "Category",
  description: "Description",
  favicon: "Favicon URL",
  github: "GitHub Repository URL",
  iconBg: "Icon Background / Style",
  ogImage: "OpenGraph Image",
  subtitle: "Subtitle / Tagline",
  tags: "Canonical Tags",
  url: "Website URL",
};

interface ResourceFormProps {
  initialData?: Partial<ResourceItem> | null;
  mode?: "create" | "edit";
}

function ResourceFormContent({ initialData, mode = "create" }: ResourceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const returnUrl = `/admin/resources${searchString ? `?${searchString}` : ""}`;

  const isEdit = mode === "edit" || Boolean(initialData?.id);
  const { categoryOptions } = useCategories();
  const defaultCategory = initialData?.category || categoryOptions[0]?.value || "";

  const [formData, setFormData] = useState<ResourceFormData>({
    id: initialData?.id || undefined,
    title: initialData?.title || "",
    authorBlog: initialData?.authorBlog || "",
    authorGithub: initialData?.authorGithub || "",
    authorId: initialData?.authorId || null,
    authorLinkedin: initialData?.authorLinkedin || "",
    authorName: initialData?.authorName || "",
    authorTwitter: initialData?.authorTwitter || "",
    authorWebsite: initialData?.authorWebsite || "",
    authorYoutube: initialData?.authorYoutube || "",
    category: initialData?.category || defaultCategory,
    description: initialData?.description || "",
    favicon: initialData?.favicon || "",
    github: initialData?.github || "",
    iconBg: initialData?.iconBg || "dark",
    ogImage: initialData?.ogImage || "",
    subtitle: initialData?.subtitle || "",
    tags: initialData?.tags || "",
    url: initialData?.url || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, startTransition] = useTransition();

  // Confirmation Dialogs
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);

  const scanner = useMetadataScanner();

  const handleFieldChange = <K extends keyof ResourceFormData>(
    field: K,
    value: ResourceFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearAll = () => {
    setFormData({
      id: isEdit ? initialData?.id : undefined,
      title: "",
      authorBlog: "",
      authorGithub: "",
      authorId: null,
      authorLinkedin: "",
      authorName: "",
      authorTwitter: "",
      authorWebsite: "",
      authorYoutube: "",
      category: defaultCategory,
      description: "",
      favicon: "",
      github: "",
      iconBg: "dark",
      ogImage: "",
      subtitle: "",
      tags: "",
      url: "",
    });
    scanner.resetScanner();
    toast.info("All form fields have been cleared.");
  };

  const handleAutoDetect = async () => {
    const data = await scanner.scanUrl(
      formData.url,
      {
        title: formData.title,
        currentId: formData.id,
        description: formData.description,
        github: formData.github,
        subtitle: formData.subtitle,
      },
      isEdit,
    );

    if (data) {
      setFormData((prev) => mergeScannedMetadata(prev, data, defaultCategory));
    }
  };

  const executeSave = async () => {
    try {
      setIsSubmitting(true);
      const endpoint = "/api/admin/resources";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
        method,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          isEdit
            ? `"${formData.title}" updated successfully.`
            : `"${formData.title}" published to live catalog!`,
        );
        startTransition(() => {
          router.push(returnUrl);
          router.refresh();
        });
        return;
      } else {
        toast.error(data.error || "Failed to save resource.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Network error while saving resource.");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("Resource title is required.");
      return;
    }
    if (!formData.url?.trim()) {
      toast.error("Website URL is required.");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required.");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (isEdit) {
      const diffs = computeFieldChanges(initialData, formData, RESOURCE_FIELD_LABELS);
      setPendingChanges(diffs);
      setIsConfirmOpen(true);
    } else {
      await executeSave();
    }
  };

  const hasChanges = isEdit
    ? computeFieldChanges(initialData, formData, RESOURCE_FIELD_LABELS).length > 0
    : true;

  return (
    <div className="mx-auto max-w-6xl space-y-8 font-mono text-xs">
      {/* Header with Navigation & Actions */}
      <div className="border-line flex flex-col gap-4 border-b-[1.5px] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs font-bold uppercase"
            >
              <Link href={returnUrl}>
                <ArrowLeftIcon weight="bold" />
                <span>Back to Resources</span>
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground text-[11px] font-bold uppercase">
              {isEdit ? "Edit Resource" : "New Resource"}
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight uppercase">
            {isEdit ? (
              <>
                Edit Resource:{" "}
                <span className="text-primary">{formData.title || initialData?.title}</span>
              </>
            ) : (
              "Add New Resource to Catalog"
            )}
          </h1>
          <p className="text-muted-foreground font-mono text-xs">
            {isEdit
              ? "Update resource details, category assignment, author attributions, and media assets."
              : "Create and publish a new verified resource directly into the live Syntax Stash catalog."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsClearConfirmOpen(true)}
            disabled={isSubmitting}
            className="border-line hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 h-9 gap-1.5 px-3 text-xs font-bold uppercase transition-colors"
          >
            <EraserIcon weight="duotone" className="size-4" />
            <span>Clear All</span>
          </Button>

          <Button
            asChild
            size="sm"
            variant="ghost"
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-bold uppercase"
          >
            <Link href={returnUrl}>Cancel</Link>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || (isEdit && !hasChanges)}
            className="h-9 gap-1.5 px-5 text-xs font-bold uppercase"
          >
            {isSubmitting ? (
              <>
                <CircleNotchIcon weight="bold" className="size-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEdit ? (
              <>
                <FloppyDiskIcon weight="duotone" className="size-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusIcon weight="bold" className="size-4" />
                <span>Publish Resource</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form + Live Preview */}
      <form onSubmit={handleSubmit}>
        <ResourceFormFields
          values={formData}
          onChange={handleFieldChange}
          onAutoDetect={handleAutoDetect}
          scanner={scanner}
          onDismissSuggestedAuthor={() => scanner.setSuggestedAuthor(null)}
          isEdit={isEdit}
          disabled={isSubmitting}
        />
      </form>

      {/* Sticky Bottom Action Bar */}
      <div className="border-line bg-background/95 sticky bottom-0 z-10 flex items-center justify-between border-t-[1.5px] py-4 backdrop-blur-sm">
        <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
          {isEdit ? (
            hasChanges ? (
              <span className="text-amber-500 font-bold">• Unsaved changes pending</span>
            ) : (
              <span>No modifications made</span>
            )
          ) : (
            <span>Fill in details to publish a new resource</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsClearConfirmOpen(true)}
            disabled={isSubmitting}
            className="border-line hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 h-8 gap-1.5 px-3 text-xs font-bold uppercase transition-colors"
          >
            <EraserIcon weight="duotone" className="size-3.5" />
            <span>Clear All</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || (isEdit && !hasChanges)}
            className="h-8 gap-1.5 px-4 text-xs font-bold uppercase"
          >
            {isSubmitting ? (
              <>
                <CircleNotchIcon weight="bold" className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEdit ? (
              <>
                <FloppyDiskIcon weight="duotone" className="size-3.5" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusIcon weight="bold" className="size-3.5" />
                <span>Publish Resource</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        open={isClearConfirmOpen}
        onOpenChange={setIsClearConfirmOpen}
        title="Clear All Form Fields"
        description="Are you sure you want to clear all entered fields? Any unsaved progress will be lost."
        confirmLabel="Clear All Fields"
        onConfirm={handleClearAll}
      />

      {/* Diff Confirmation Dialog */}
      <ConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Resource Updates"
        itemTitle={formData.title || initialData?.title || "Resource"}
        changes={pendingChanges}
        isWorking={isSubmitting || isNavigating}
        onConfirm={executeSave}
        confirmLabel="Confirm & Save Resource"
      />
    </div>
  );
}

export function ResourceForm(props: ResourceFormProps) {
  return (
    <Suspense
      fallback={
        <div className="border-line flex h-64 items-center justify-center border-[1.5px] p-8 font-mono text-xs">
          <div className="text-muted-foreground flex items-center gap-2">
            <CircleNotchIcon className="size-4 animate-spin" />
            <span>Loading editor...</span>
          </div>
        </div>
      }
    >
      <ResourceFormContent {...props} />
    </Suspense>
  );
}
