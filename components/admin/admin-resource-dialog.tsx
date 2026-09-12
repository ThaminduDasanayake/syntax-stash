"use client";

import {
  ArrowsClockwiseIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import {
  AuthorOption,
  AuthorSocialFields,
  AuthorSocialValues,
  CandidateOption,
  DetectedFieldSuggestion,
  FieldCheckmark,
  MediaAssetFields,
  ResourceCardPreview,
  SuggestedAuthorData,
  TagPicker,
} from "@/components/submissions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { isValidHttpUrl } from "@/lib/utils";

import { AdminAuthorDialog } from "./admin-author-dialog";
import {
  AdminConfirmEditDialog,
  computeFieldChanges,
  FieldDiff,
} from "./admin-confirm-edit-dialog";
import { AdminResourceItem } from "./types";

const RESOURCE_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  authorName: "Creator / Author",
  category: "Category",
  description: "Description",
  favicon: "Favicon URL",
  github: "GitHub Repository URL",
  ogImage: "OpenGraph Image",
  subtitle: "Subtitle / Tagline",
  tags: "Canonical Tags",
  url: "Website URL",
};

interface AdminResourceDialogProps {
  isWorking?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<AdminResourceItem>) => Promise<void>;
  open: boolean;
  resource?: AdminResourceItem | null;
}

export function AdminResourceDialog({
  isWorking = false,
  onOpenChange,
  onSave,
  open,
  resource,
}: AdminResourceDialogProps) {
  const isEdit = Boolean(resource?.id);
  const { categoryOptions } = useCategories();

  const [formData, setFormData] = useState<Partial<AdminResourceItem>>({
    title: "",
    authorBlog: "",
    authorGithub: "",
    authorId: null,
    authorLinkedin: "",
    authorName: "",
    authorTwitter: "",
    authorWebsite: "",
    authorYoutube: "",
    category: "",
    description: "",
    favicon: "",
    github: "",
    iconBg: "dark",
    ogImage: "",
    subtitle: "",
    tags: "",
    url: "",
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [faviconOptions, setFaviconOptions] = useState<CandidateOption[]>([]);
  const [ogImageOptions, setOgImageOptions] = useState<CandidateOption[]>([]);
  const [suggestedAuthor, setSuggestedAuthor] = useState<SuggestedAuthorData | null>(null);
  const [detectedUpdates, setDetectedUpdates] = useState<{
    description?: string;
    github?: string;
    subtitle?: string;
    title?: string;
  }>({});

  // Author Creation Modal State
  const [isCreateAuthorOpen, setIsCreateAuthorOpen] = useState(false);
  const [createAuthorInitialName, setCreateAuthorInitialName] = useState("");

  // Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);

  useEffect(() => {
    if (resource) {
      setFormData({
        id: resource.id,
        title: resource.title || "",
        authorBlog: resource.authorBlog || "",
        authorGithub: resource.authorGithub || "",
        authorLinkedin: resource.authorLinkedin || "",
        authorName: resource.authorName || "",
        authorTwitter: resource.authorTwitter || "",
        authorWebsite: resource.authorWebsite || "",
        authorYoutube: resource.authorYoutube || "",
        category: resource.category || (categoryOptions[0]?.value ?? ""),
        description: resource.description || "",
        favicon: resource.favicon || "",
        github: resource.github || "",
        iconBg: resource.iconBg || "dark",
        ogImage: resource.ogImage || "",
        subtitle: resource.subtitle || "",
        tags: resource.tags || "",
        url: resource.url || "",
      });
    } else {
      setFormData({
        title: "",
        authorBlog: "",
        authorGithub: "",
        authorLinkedin: "",
        authorName: "",
        authorTwitter: "",
        authorWebsite: "",
        authorYoutube: "",
        category: categoryOptions[0]?.value ?? "",
        description: "",
        favicon: "",
        github: "",
        iconBg: "dark",
        ogImage: "",
        subtitle: "",
        tags: "",
        url: "",
      });
    }
    setFaviconOptions([]);
    setOgImageOptions([]);
    setSuggestedAuthor(null);
    setDetectedUpdates({});
  }, [categoryOptions, open, resource]);

  const handleAuthorFieldChange = (field: keyof AuthorSocialValues, value: string) => {
    if (field === "author") {
      setFormData((prev) => ({
        ...prev,
        authorName: value,
        ...(value ? {} : { authorId: null }),
      }));
    }
  };

  const handleSelectAuthorOption = (authorOption: AuthorOption) => {
    setFormData((prev) => ({
      ...prev,
      authorBlog: authorOption.links?.blog || "",
      authorGithub: authorOption.links?.github || "",
      authorId: authorOption.id || prev.authorId || null,
      authorLinkedin: authorOption.links?.linkedin || "",
      authorTwitter: authorOption.links?.twitter || "",
      authorWebsite: authorOption.links?.website || "",
      authorYoutube: authorOption.links?.youtube || "",
    }));
  };

  const handleRequestCreateAuthor = (name: string) => {
    setCreateAuthorInitialName(name);
    setIsCreateAuthorOpen(true);
  };

  const handleAcceptSuggestedAuthor = (suggested: SuggestedAuthorData) => {
    setFormData((prev) => ({
      ...prev,
      authorBlog: suggested.blog || prev.authorBlog || "",
      authorGithub: suggested.github || prev.authorGithub || "",
      authorLinkedin: suggested.linkedin || prev.authorLinkedin || "",
      authorName: suggested.name,
      authorTwitter: suggested.twitter || prev.authorTwitter || "",
      authorWebsite: suggested.website || prev.authorWebsite || "",
      authorYoutube: suggested.youtube || prev.authorYoutube || "",
    }));
    setSuggestedAuthor(null);
  };

  const handleAutoDetect = async () => {
    const targetUrl = formData.url?.trim();
    if (!targetUrl) return;

    try {
      setIsDetecting(true);
      const res = await fetch(`/api/submissions/metadata?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (res.ok && !data.error) {
        if (data.faviconOptions) setFaviconOptions(data.faviconOptions);
        if (data.ogImageOptions) setOgImageOptions(data.ogImageOptions);

        if (data.author && data.author.trim()) {
          setSuggestedAuthor({
            blog: data.authorBlog || "",
            github: data.authorGitHub || "",
            linkedin: data.authorLinkedIn || "",
            name: data.author.trim(),
            twitter: data.authorTwitter || "",
            website: data.authorWebsite || "",
            youtube: data.authorYouTube || "",
          });
        }

        const newDetected: {
          description?: string;
          github?: string;
          subtitle?: string;
          title?: string;
        } = {};

        setFormData((prev) => {
          if (resource) {
            // In edit mode: keep all existing fields untouched; suggest detected values if different
            if (
              data.title &&
              prev.title &&
              prev.title.trim().toLowerCase() !== data.title.trim().toLowerCase()
            ) {
              newDetected.title = data.title.trim();
            }

            if (
              data.subtitle &&
              prev.subtitle &&
              prev.subtitle.trim().toLowerCase() !== data.subtitle.trim().toLowerCase()
            ) {
              newDetected.subtitle = data.subtitle.trim();
            } else if (!data.subtitle && prev.subtitle && prev.subtitle.trim()) {
              newDetected.subtitle = "";
            }

            if (
              data.description &&
              prev.description &&
              prev.description.trim().toLowerCase() !== data.description.trim().toLowerCase()
            ) {
              newDetected.description = data.description.trim();
            }

            if (
              data.github &&
              prev.github &&
              prev.github.trim().toLowerCase() !== data.github.trim().toLowerCase()
            ) {
              newDetected.github = data.github.trim();
            }

            return {
              ...prev,
              title: prev.title || data.title || "",
              category: prev.category || data.category || (categoryOptions[0]?.value ?? ""),
              description: prev.description || data.description || "",
              favicon: prev.favicon || data.favicon || "",
              github: prev.github || data.github || "",
              ogImage: prev.ogImage || data.ogImage || "",
              subtitle: prev.subtitle || data.subtitle || "",
            };
          }

          // In create mode: populate empty fields or suggest updates
          const nextTitle = prev.title || data.title || "";
          if (
            prev.title &&
            data.title &&
            prev.title.trim().toLowerCase() !== data.title.trim().toLowerCase()
          ) {
            newDetected.title = data.title.trim();
          }

          const nextSubtitle = prev.subtitle || data.subtitle || "";
          if (
            prev.subtitle &&
            data.subtitle &&
            prev.subtitle.trim().toLowerCase() !== data.subtitle.trim().toLowerCase()
          ) {
            newDetected.subtitle = data.subtitle.trim();
          } else if (!data.subtitle && prev.subtitle && prev.subtitle.trim()) {
            newDetected.subtitle = "";
          }

          const nextDescription = prev.description || data.description || "";
          if (
            prev.description &&
            data.description &&
            prev.description.trim().toLowerCase() !== data.description.trim().toLowerCase()
          ) {
            newDetected.description = data.description.trim();
          }

          const nextGithub = prev.github || data.github || "";
          if (
            prev.github &&
            data.github &&
            prev.github.trim().toLowerCase() !== data.github.trim().toLowerCase()
          ) {
            newDetected.github = data.github.trim();
          }

          return {
            ...prev,
            title: nextTitle,
            category: prev.category || data.category || (categoryOptions[0]?.value ?? ""),
            description: nextDescription,
            favicon: prev.favicon || data.favicon || "",
            github: nextGithub,
            ogImage: prev.ogImage || data.ogImage || "",
            subtitle: nextSubtitle,
          };
        });

        setDetectedUpdates(newDetected);
      }
    } catch (err) {
      console.error("Metadata auto-detection failed:", err);
    } finally {
      setIsDetecting(false);
    }
  };

  const executeSave = async () => {
    await onSave(formData);
    setIsConfirmOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title?.trim() ||
      !formData.url?.trim() ||
      !formData.category ||
      !formData.description?.trim()
    ) {
      return;
    }

    if (isEdit && resource) {
      const diffs = computeFieldChanges(resource, formData, RESOURCE_FIELD_LABELS);
      setPendingChanges(diffs);
      setIsConfirmOpen(true);
    } else {
      await executeSave();
    }
  };

  const authorValues: AuthorSocialValues = {
    author: formData.authorName || "",
    authorGitHub: formData.authorGithub || "",
    authorLinkedIn: formData.authorLinkedin || "",
    authorTwitter: formData.authorTwitter || "",
    authorWebsite: formData.authorWebsite || "",
    authorYouTube: formData.authorYoutube || "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0 font-mono text-xs sm:max-w-4xl">
        <div className="border-line border-b p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-tight uppercase">
              {isEdit ? (
                <>
                  <span>Edit Tool:</span>
                  <span className="text-primary truncate">{formData.title || resource?.title}</span>
                </>
              ) : (
                <>
                  <PlusIcon className="size-5" />
                  <span>Add New Tool to Catalog</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-mono text-xs">
              {isEdit
                ? "Update tool details, category, author attributions, and media assets."
                : "Create and publish a new tool directly into the live Syntax Stash catalog."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Form Inputs (7 cols on large) */}
            <div className="space-y-5 lg:col-span-7">
              {/* URL & Auto-detect */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                    <span>Website URL</span>
                    <span className="text-destructive">*</span>
                    <FieldCheckmark
                      checked={Boolean(
                        formData.url?.trim() && isValidHttpUrl(formData.url.trim()),
                      )}
                    />
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleAutoDetect}
                    disabled={isDetecting || !formData.url?.trim()}
                    className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[11px]"
                  >
                    {isDetecting ? (
                      <>
                        <CircleNotchIcon className="size-3 animate-spin" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <ArrowsClockwiseIcon className="size-3" />
                        <span>Auto-Detect</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                    required
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                      <span>Title</span>
                      <span className="text-destructive">*</span>
                      <FieldCheckmark checked={Boolean(formData.title?.trim())} />
                    </Label>
                    <DetectedFieldSuggestion
                      currentValue={formData.title}
                      detectedValue={detectedUpdates.title}
                      onApply={(val) => {
                        setFormData((prev) => ({ ...prev, title: val }));
                        setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                      }}
                      onDismiss={() => {
                        setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                      }}
                    />
                  </div>
                  <div className="h-9">
                    <InputField
                      placeholder="e.g. Next.js"
                      value={formData.title || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      containerClassName="h-9"
                      className="font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                      <span>Subtitle</span>
                      <FieldCheckmark checked={Boolean(formData.subtitle?.trim())} />
                    </Label>
                    <DetectedFieldSuggestion
                      currentValue={formData.subtitle}
                      detectedValue={detectedUpdates.subtitle}
                      onApply={(val) => {
                        setFormData((prev) => ({ ...prev, subtitle: val }));
                        setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                      }}
                      onDismiss={() => {
                        setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                      }}
                    />
                  </div>
                  <div className="h-9">
                    <InputField
                      placeholder="e.g. The React Framework"
                      value={formData.subtitle || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                      }
                      containerClassName="h-9"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Category & GitHub Repo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                    <span>Category</span>
                    <span className="text-destructive">*</span>
                    <FieldCheckmark checked={Boolean(formData.category?.trim())} />
                  </Label>
                  <SelectField
                    value={formData.category || (categoryOptions[0]?.value ?? "")}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
                    options={categoryOptions}
                    triggerClassName="h-9 font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                      <span>GitHub Repo URL</span>
                      <FieldCheckmark checked={Boolean(formData.github?.trim())} />
                    </Label>
                    <DetectedFieldSuggestion
                      currentValue={formData.github}
                      detectedValue={detectedUpdates.github}
                      onApply={(val) => {
                        setFormData((prev) => ({ ...prev, github: val }));
                        setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                      }}
                      onDismiss={() => {
                        setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                      }}
                    />
                  </div>
                  <div className="h-9">
                    <InputField
                      type="url"
                      placeholder="https://github.com/org/repo"
                      value={formData.github || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                      containerClassName="h-9"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                    <span>Description</span>
                    <span className="text-destructive">*</span>
                    <FieldCheckmark checked={Boolean(formData.description?.trim())} />
                  </Label>
                  <DetectedFieldSuggestion
                    currentValue={formData.description}
                    detectedValue={detectedUpdates.description}
                    onApply={(val) => {
                      setFormData((prev) => ({ ...prev, description: val }));
                      setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                    }}
                    onDismiss={() => {
                      setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                    }}
                  />
                </div>
                <Textarea
                  placeholder="Describe the tool, its core features, and use case..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  required
                  rows={3}
                  className="resize-none font-mono text-xs"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>Canonical Tags (Select Only)</span>
                  <FieldCheckmark checked={Boolean(formData.tags?.trim())} />
                </Label>
                <TagPicker
                  value={formData.tags || ""}
                  onChange={(val) => setFormData((prev) => ({ ...prev, tags: val }))}
                  disabled={isWorking}
                  allowCustom={false}
                  placeholder="Search and select canonical tags..."
                />
              </div>

              {/* Author Attribution */}
              <AuthorSocialFields
                values={authorValues}
                onChange={handleAuthorFieldChange}
                onRequestCreateAuthor={handleRequestCreateAuthor}
                onSelectAuthorOption={handleSelectAuthorOption}
                suggestedAuthor={suggestedAuthor}
                onAcceptSuggestedAuthor={handleAcceptSuggestedAuthor}
                onDismissSuggestedAuthor={() => setSuggestedAuthor(null)}
                allowCustom={false}
                disabled={isWorking}
              />

              {/* Media Asset Fields */}
              <MediaAssetFields
                favicon={formData.favicon}
                iconBg={formData.iconBg || "dark"}
                onIconBgChange={(val) => setFormData((prev) => ({ ...prev, iconBg: val }))}
                ogImage={formData.ogImage}
                faviconOptions={faviconOptions}
                ogImageOptions={ogImageOptions}
                onFaviconChange={(val) => setFormData((prev) => ({ ...prev, favicon: val }))}
                onOgImageChange={(val) => setFormData((prev) => ({ ...prev, ogImage: val }))}
                disabled={isWorking}
              />
            </div>

            {/* Live Preview Panel (5 cols on large) */}
            <div className="space-y-4 lg:col-span-5">
              <div className="sticky top-4">
                <ResourceCardPreview
                  title={formData.title || "Tool Title"}
                  subtitle={formData.subtitle || "Tool Subtitle"}
                  category={formData.category || "Generators"}
                  description={
                    formData.description || "A concise description of the tool will appear here..."
                  }
                  favicon={formData.favicon}
                  iconBg={formData.iconBg || "dark"}
                  tags={formData.tags}
                  author={formData.authorName}
                  url={formData.url || "https://example.com"}
                  cardMaxWidthClass="w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isWorking}
              className="border-line hover:bg-surface h-9 gap-1.5 px-4 text-xs font-bold uppercase"
            >
              <XIcon className="size-4" />
              <span>Cancel</span>
            </Button>

            <Button
              type="submit"
              disabled={isWorking || !formData.title?.trim() || !formData.url?.trim()}
              className="h-9 gap-1.5 px-5 text-xs font-bold uppercase"
            >
              {isWorking ? (
                <>
                  <CircleNotchIcon className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FloppyDiskIcon className="size-4" />
                  <span>{isEdit ? "Update Tool" : "Create & Publish"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Inline Create Author Modal */}
      <AdminAuthorDialog
        open={isCreateAuthorOpen}
        onOpenChange={setIsCreateAuthorOpen}
        initialName={createAuthorInitialName}
        onCreated={(newAuthor) => {
          setFormData((prev) => {
            const existing = prev.authorName
              ? prev.authorName
                  .split(",")
                  .map((a) => a.trim())
                  .filter(Boolean)
              : [];
            const next = existing.some((a) => a.toLowerCase() === newAuthor.name.toLowerCase())
              ? existing
              : [...existing, newAuthor.name];
            return {
              ...prev,
              authorBlog: newAuthor.blog || prev.authorBlog || "",
              authorGithub: newAuthor.github || prev.authorGithub || "",
              authorId: newAuthor.id || prev.authorId,
              authorLinkedin: newAuthor.linkedin || prev.authorLinkedin || "",
              authorName: next.join(", "),
              authorTwitter: newAuthor.twitter || prev.authorTwitter || "",
              authorWebsite: newAuthor.website || prev.authorWebsite || "",
              authorYoutube: newAuthor.youtube || prev.authorYoutube || "",
            };
          });
          setIsCreateAuthorOpen(false);
        }}
      />

      {/* Confirmation Dialog for Edits */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Resource Updates"
        description="Review the list of changed properties below before saving changes to this resource."
        itemTitle={formData.title || resource?.title}
        changes={pendingChanges}
        onConfirm={executeSave}
        isWorking={isWorking}
      />
    </Dialog>
  );
}
