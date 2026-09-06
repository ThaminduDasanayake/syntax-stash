"use client";

import {
  ArrowLeftIcon,
  ArrowsClockwiseIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AuthorSocialFields,
  AuthorSocialValues,
  CandidateOption,
  MediaAssetFields,
  ResourceCardPreview,
  TagPicker,
} from "@/components/submissions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { resourceCategories } from "@/lib/resource-data";

import { AdminResourceItem, CATEGORY_OPTIONS } from "./types";

interface AdminResourceFormProps {
  initialData?: Partial<AdminResourceItem> | null;
  mode?: "create" | "edit";
}

export function AdminResourceForm({
  initialData,
  mode = "create",
}: AdminResourceFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" || Boolean(initialData?.id);

  const defaultCategory =
    initialData?.category &&
    resourceCategories.includes(initialData.category as (typeof resourceCategories)[number])
      ? initialData.category
      : CATEGORY_OPTIONS[0]?.value || "AI & Machine Learning";

  const [formData, setFormData] = useState<Partial<AdminResourceItem>>({
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
    category: defaultCategory,
    description: initialData?.description || "",
    favicon: initialData?.favicon || "",
    github: initialData?.github || "",
    ogImage: initialData?.ogImage || "",
    subtitle: initialData?.subtitle || "",
    tags: initialData?.tags || "",
    url: initialData?.url || "",
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faviconOptions, setFaviconOptions] = useState<CandidateOption[]>([]);
  const [ogImageOptions, setOgImageOptions] = useState<CandidateOption[]>([]);

  const handleAuthorFieldChange = (field: keyof AuthorSocialValues, value: string) => {
    if (field === "author") {
      setFormData((prev) => ({ ...prev, authorName: value }));
    } else if (field === "authorWebsite") {
      setFormData((prev) => ({ ...prev, authorWebsite: value }));
    } else if (field === "authorTwitter") {
      setFormData((prev) => ({ ...prev, authorTwitter: value }));
    } else if (field === "authorGitHub") {
      setFormData((prev) => ({ ...prev, authorGithub: value }));
    } else if (field === "authorYouTube") {
      setFormData((prev) => ({ ...prev, authorYoutube: value }));
    } else if (field === "authorLinkedIn") {
      setFormData((prev) => ({ ...prev, authorLinkedin: value }));
    }
  };

  const handleAuthorBatchChange = (updates: Partial<AuthorSocialValues>) => {
    setFormData((prev) => ({
      ...prev,
      ...(updates.author !== undefined && { authorName: updates.author || "" }),
      ...(updates.authorGitHub !== undefined && { authorGithub: updates.authorGitHub || "" }),
      ...(updates.authorLinkedIn !== undefined && { authorLinkedin: updates.authorLinkedIn || "" }),
      ...(updates.authorTwitter !== undefined && { authorTwitter: updates.authorTwitter || "" }),
      ...(updates.authorWebsite !== undefined && { authorWebsite: updates.authorWebsite || "" }),
      ...(updates.authorYouTube !== undefined && { authorYoutube: updates.authorYouTube || "" }),
    }));
  };

  const handleAutoDetect = async () => {
    const targetUrl = formData.url?.trim();
    if (!targetUrl) {
      toast.warning("Please enter a URL first.");
      return;
    }

    try {
      setIsDetecting(true);
      const res = await fetch(`/api/submissions/metadata?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (res.ok && !data.error) {
        if (data.faviconOptions) setFaviconOptions(data.faviconOptions);
        if (data.ogImageOptions) setOgImageOptions(data.ogImageOptions);

        setFormData((prev) => ({
          ...prev,
          title: prev.title || data.title || "",
          authorGithub: prev.authorGithub || data.authorGitHub || "",
          authorLinkedin: prev.authorLinkedin || data.authorLinkedIn || "",
          authorName: prev.authorName || data.author || "",
          authorTwitter: prev.authorTwitter || data.authorTwitter || "",
          authorWebsite: prev.authorWebsite || data.authorWebsite || "",
          authorYoutube: prev.authorYoutube || data.authorYouTube || "",
          category:
            prev.category &&
            resourceCategories.includes(prev.category as (typeof resourceCategories)[number])
              ? prev.category
              : data.category && resourceCategories.includes(data.category)
                ? data.category
                : defaultCategory,
          description: prev.description || data.description || "",
          favicon: data.favicon || prev.favicon || "",
          github: prev.github || data.github || "",
          ogImage: data.ogImage || prev.ogImage || "",
          subtitle: prev.subtitle || data.subtitle || "",
        }));
        toast.success("Metadata detected successfully!");
      } else {
        toast.error(data.error || "Failed to auto-detect metadata.");
      }
    } catch (err) {
      console.error("Metadata auto-detection failed:", err);
      toast.error("Network error while detecting metadata.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("Tool title is required.");
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
        router.push("/admin/resources");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to save resource.");
      }
    } catch (err) {
      console.error("Save resource error:", err);
      toast.error("Network error while saving resource.");
    } finally {
      setIsSubmitting(false);
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

  const currentTags = formData.tags
    ? formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 font-mono text-xs">
      {/* Header with Navigation */}
      <div className="border-line flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs font-bold uppercase"
            >
              <Link href="/admin/resources">
                <ArrowLeftIcon className="size-3.5" />
                <span>Back to Tools</span>
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground uppercase font-bold text-[11px]">
              {isEdit ? "Edit Tool" : "New Tool"}
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight uppercase">
            {isEdit ? (
              <>
                Edit Tool: <span className="text-primary">{formData.title || initialData?.title}</span>
              </>
            ) : (
              "Add New Tool to Catalog"
            )}
          </h1>
          <p className="text-muted-foreground text-xs font-mono">
            {isEdit
              ? "Update tool details, category assignment, author attributions, and media assets."
              : "Create and publish a new verified tool directly into the live Syntax Stash catalog."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            variant="ghost"
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-bold uppercase"
          >
            <Link href="/admin/resources">Cancel</Link>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-9 gap-1.5 px-5 text-xs font-bold uppercase"
          >
            {isSubmitting ? (
              <>
                <CircleNotchIcon className="size-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEdit ? (
              <>
                <FloppyDiskIcon className="size-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusIcon className="size-4" />
                <span>Publish Tool</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form Layout */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Section: Basic Information */}
            <div className="border-line bg-surface/40 space-y-5 rounded-lg border p-5">
              <h2 className="text-foreground border-line border-b pb-2 text-xs font-bold uppercase tracking-wider">
                1. Basic Information
              </h2>

              {/* Website URL + Auto Detect */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-mono text-xs font-bold uppercase">
                    Website URL *
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
                        <span>Auto-Detect Metadata</span>
                      </>
                    )}
                  </Button>
                </div>
                <InputField
                  placeholder="https://example.com"
                  value={formData.url || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  required
                  className="font-mono text-xs"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-foreground font-mono text-xs font-bold uppercase">
                    Title *
                  </Label>
                  <InputField
                    placeholder="e.g. Radix UI"
                    value={formData.title || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-mono text-xs font-bold uppercase">
                    Subtitle
                  </Label>
                  <InputField
                    placeholder="e.g. Unstyled UI primitives"
                    value={formData.subtitle || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Category *
                </Label>
                <SelectField
                  value={formData.category || CATEGORY_OPTIONS[0].value}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
                  options={CATEGORY_OPTIONS}
                  triggerClassName="h-10 font-mono text-xs"
                  placeholder="Select a category..."
                />
                <p className="text-muted-foreground text-[11px]">
                  Select the primary category where this tool will be listed.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Description *
                </Label>
                <Textarea
                  placeholder="A concise, helpful description of the tool..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  required
                  rows={3}
                  className="font-sans text-xs"
                />
              </div>

              {/* Canonical Tags */}
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Tags (Canonical Catalog)
                </Label>
                <TagPicker
                  allowCustom={false}
                  value={formData.tags || ""}
                  onChange={(val) => setFormData((prev) => ({ ...prev, tags: val }))}
                  placeholder="Type to search and select tags..."
                />
              </div>
            </div>

            {/* Section: Author Attributions */}
            <div className="border-line bg-surface/40 space-y-4 rounded-lg border p-5">
              <h2 className="text-foreground border-line border-b pb-2 text-xs font-bold uppercase tracking-wider">
                2. Creator & Social Links
              </h2>
              <AuthorSocialFields
                values={authorValues}
                onChange={handleAuthorFieldChange}
                onBatchChange={handleAuthorBatchChange}
              />
            </div>

            {/* Section: Media Assets & Repository */}
            <div className="border-line bg-surface/40 space-y-4 rounded-lg border p-5">
              <h2 className="text-foreground border-line border-b pb-2 text-xs font-bold uppercase tracking-wider">
                3. Media Assets & GitHub
              </h2>

              {/* GitHub Repo URL */}
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  GitHub Repository URL
                </Label>
                <InputField
                  placeholder="https://github.com/owner/repo"
                  value={formData.github || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                  prefix={
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={14}
                      height={14}
                      className="size-3.5 dark:invert"
                    />
                  }
                  className="font-mono text-xs"
                />
                <p className="text-muted-foreground text-[11px]">
                  Enables live star badge and direct repository link.
                </p>
              </div>

              <MediaAssetFields
                favicon={formData.favicon || ""}
                faviconOptions={faviconOptions}
                ogImage={formData.ogImage || ""}
                ogImageOptions={ogImageOptions}
                onFaviconChange={(val) => setFormData((prev) => ({ ...prev, favicon: val }))}
                onOgImageChange={(val) => setFormData((prev) => ({ ...prev, ogImage: val }))}
              />
            </div>
          </div>

          {/* Right Column: Live Preview & Quick Actions (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-20 space-y-6">
              {/* Card Preview */}
              <div className="border-line bg-surface/40 space-y-4 rounded-lg border p-5">
                <h2 className="text-foreground border-line border-b pb-2 text-xs font-bold uppercase tracking-wider">
                  Live Catalog Card Preview
                </h2>
                <ResourceCardPreview
                  title={formData.title}
                  author={formData.authorName}
                  category={formData.category}
                  description={formData.description}
                  favicon={formData.favicon}
                  subtitle={formData.subtitle}
                  tags={formData.tags || ""}
                  url={formData.url}
                />
              </div>

              {/* Publishing Controls Box */}
              <div className="border-line bg-surface/40 space-y-4 rounded-lg border p-5">
                <h2 className="text-foreground border-line border-b pb-2 text-xs font-bold uppercase tracking-wider">
                  Publishing Summary
                </h2>

                <div className="space-y-2 text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <strong className="text-foreground">{formData.category || "None"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tags Count:</span>
                    <strong className="text-foreground">{currentTags.length} selected</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Author:</span>
                    <strong className="text-foreground">{formData.authorName || "None"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Repository:</span>
                    <strong className="text-foreground">{formData.github ? "Linked" : "None"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Favicon:</span>
                    <strong className="text-foreground">{formData.favicon ? "Provided" : "Default"}</strong>
                  </div>
                </div>

                <div className="border-line border-t pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 gap-1.5 text-xs font-bold uppercase"
                  >
                    {isSubmitting ? (
                      <>
                        <CircleNotchIcon className="size-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : isEdit ? (
                      <>
                        <FloppyDiskIcon className="size-4" />
                        <span>Save & Update Tool</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="size-4" />
                        <span>Publish Tool to Catalog</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
