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

export function AdminResourceForm({ initialData, mode = "create" }: AdminResourceFormProps) {
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

  const handleAuthorFieldChange = (_field: keyof AuthorSocialValues, value: string) => {
    setFormData((prev) => ({ ...prev, authorName: value }));
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

      {/* Main Form Layout: Form (7 cols) + Real Card Preview (5 cols) */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Section 1: Resource URL with Auto-Detect */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Resource URL <span className="text-destructive">*</span>
                </Label>
                <span className="text-muted-foreground text-[10px]">
                  Scan live site for latest metadata & assets
                </span>
              </div>
              <div className="flex gap-2">
                <div className="h-9 flex-1">
                  <InputField
                    type="url"
                    value={formData.url || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                    containerClassName="h-9"
                    className="font-mono text-xs"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutoDetect}
                  disabled={isDetecting || !formData.url?.trim()}
                  className="h-8 shrink-0 gap-1.5 font-mono text-xs font-bold uppercase"
                >
                  {isDetecting ? (
                    <CircleNotchIcon weight="bold" className="size-3.5 animate-spin" />
                  ) : (
                    <ArrowsClockwiseIcon weight="bold" className="text-primary size-3.5" />
                  )}
                  {isDetecting ? "Detecting..." : "Auto-Detect"}
                </Button>
              </div>
            </div>

            {/* Section 2: Title, Category, & Subtitle */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Title <span className="text-destructive">*</span>
                </Label>
                <div className="h-9">
                  <InputField
                    value={formData.title || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Radix UI"
                    containerClassName="h-9"
                    className="font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Category <span className="text-destructive">*</span>
                </Label>
                <div className="h-9">
                  <SelectField
                    value={formData.category || defaultCategory}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
                    options={CATEGORY_OPTIONS}
                    triggerClassName="h-9 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Subtitle / Tagline (Optional)
              </Label>
              <div className="h-9">
                <InputField
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Unstyled, accessible UI components for React"
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Section 3: Description */}
            <div className="space-y-2">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="bg-paper min-h-20 font-mono text-xs leading-relaxed"
                placeholder="A concise, helpful description of the resource..."
                required
              />
            </div>

            {/* Section 4: Visuals & Media Assets */}
            <MediaAssetFields
              favicon={formData.favicon || ""}
              faviconOptions={faviconOptions}
              ogImage={formData.ogImage || ""}
              ogImageOptions={ogImageOptions}
              onFaviconChange={(val) => setFormData((prev) => ({ ...prev, favicon: val }))}
              onOgImageChange={(val) => setFormData((prev) => ({ ...prev, ogImage: val }))}
            />

            {/* Section 5: GitHub Repository URL */}
            <div className="space-y-2">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                GitHub Repository URL (Optional)
              </Label>
              <div className="h-9">
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
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
              <p className="text-muted-foreground text-[10px]">
                Enables live star badge and direct repository link.
              </p>
            </div>

            {/* Section 6: Creator Attribution */}
            <AuthorSocialFields
              values={authorValues}
              onChange={handleAuthorFieldChange}
            />

            {/* Section 7: Canonical Tags */}
            <div className="space-y-2">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Canonical Tags
              </Label>
              <TagPicker
                allowCustom={false}
                value={formData.tags || ""}
                onChange={(val) => setFormData((prev) => ({ ...prev, tags: val }))}
                placeholder="Type to search and select tags..."
              />
            </div>
          </div>

          {/* Right Column: Live Preview & Quick Actions (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-20 space-y-6">
              {/* Card Preview */}
              <div className="border-line bg-surface/40 space-y-4 rounded-lg border p-5">
                <h2 className="text-foreground border-line border-b pb-2 text-xs font-bold tracking-wider uppercase">
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

              {/* Publishing Summary Box */}
              <div className="border-line bg-surface/40 space-y-4 rounded-lg border p-5">
                <h2 className="text-foreground border-line border-b pb-2 text-xs font-bold tracking-wider uppercase">
                  Publishing Summary
                </h2>

                <div className="text-muted-foreground space-y-2 text-[11px]">
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
                    <strong className="text-foreground">
                      {formData.github ? "Linked" : "None"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Favicon:</span>
                    <strong className="text-foreground">
                      {formData.favicon ? "Provided" : "Default"}
                    </strong>
                  </div>
                </div>

                <div className="border-line border-t pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 w-full gap-1.5 text-xs font-bold uppercase"
                  >
                    {isSubmitting ? (
                      <>
                        <CircleNotchIcon weight="bold" className="size-4 animate-spin" />
                        <span>Saving to Database...</span>
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
