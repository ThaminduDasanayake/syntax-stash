"use client";

import { ArrowsClockwiseIcon, CircleNotchIcon } from "@phosphor-icons/react";
import React, { useState } from "react";

import { AuthorDialog } from "@/components/admin/authors/author-dialog";
import {
  AuthorOption,
  AuthorSocialFields,
  AuthorSocialValues,
  CandidateOption,
  DetectedFieldSuggestion,
  DuplicateUrlNotice,
  FieldCheckmark,
  IconBgOption,
  MediaAssetFields,
  ResourceCardPreview,
  SuggestedAuthorData,
  TagPicker,
} from "@/components/submissions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { DetectedFieldUpdates, DuplicateNoticeState } from "@/hooks/use-metadata-scanner";
import { cn, isValidHttpUrl } from "@/lib/utils";

export interface ResourceFormData {
  authorBlog?: string | null;
  authorGithub?: string | null;
  authorId?: string | null;
  authorLinkedin?: string | null;
  authorName?: string | null;
  authorTwitter?: string | null;
  authorWebsite?: string | null;
  authorYoutube?: string | null;
  category: string;
  description: string;
  favicon?: string | null;
  github?: string | null;
  iconBg?: string | null;
  id?: string;
  ogImage?: string | null;
  subtitle?: string | null;
  tags?: string | null;
  title: string;
  url: string;
}

export interface ResourceFormFieldsProps {
  cardMaxWidthClass?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  isEdit?: boolean;
  onAutoDetect: () => Promise<void> | void;
  onChange: <K extends keyof ResourceFormData>(field: K, value: ResourceFormData[K]) => void;
  onDismissSuggestedAuthor?: () => void;
  scanner: {
    detectedUpdates: DetectedFieldUpdates;
    duplicateNotice: DuplicateNoticeState | null;
    faviconOptions: CandidateOption[];
    isDetecting: boolean;
    ogImageOptions: CandidateOption[];
    setDetectedUpdates: React.Dispatch<React.SetStateAction<DetectedFieldUpdates>>;
    suggestedAuthor: SuggestedAuthorData | null;
  };
  values: ResourceFormData;
}

export function ResourceFormFields({
  cardMaxWidthClass = "max-w-80",
  children,
  disabled = false,
  isEdit = false,
  onAutoDetect,
  onChange,
  onDismissSuggestedAuthor,
  scanner,
  values,
}: ResourceFormFieldsProps) {
  const { categoryOptions } = useCategories();

  // Inline Author Creation Modal State
  const [isCreateAuthorOpen, setIsCreateAuthorOpen] = useState(false);
  const [createAuthorInitialData, setCreateAuthorInitialData] = useState<
    Partial<SuggestedAuthorData>
  >({});

  const authorValues: AuthorSocialValues = {
    author: values.authorName || "",
    authorBlog: values.authorBlog || "",
    authorGitHub: values.authorGithub || "",
    authorLinkedIn: values.authorLinkedin || "",
    authorTwitter: values.authorTwitter || "",
    authorWebsite: values.authorWebsite || "",
    authorYouTube: values.authorYoutube || "",
  };

  const handleAuthorFieldChange = (field: keyof AuthorSocialValues, value: string) => {
    const fieldMapping: Record<keyof AuthorSocialValues, keyof ResourceFormData> = {
      author: "authorName",
      authorBlog: "authorBlog",
      authorGitHub: "authorGithub",
      authorLinkedIn: "authorLinkedin",
      authorTwitter: "authorTwitter",
      authorWebsite: "authorWebsite",
      authorYouTube: "authorYoutube",
    };
    const mapped = fieldMapping[field];
    if (mapped) {
      onChange(mapped, value);
      if (field === "author") {
        onChange("authorId", null);
      }
    }
  };

  const handleSelectAuthorOption = (authorOption: AuthorOption) => {
    onChange("authorBlog", authorOption.links?.blog || "");
    onChange("authorGithub", authorOption.links?.github || "");
    onChange("authorId", null);
    onChange("authorLinkedin", authorOption.links?.linkedin || "");
    onChange("authorTwitter", authorOption.links?.twitter || "");
    onChange("authorWebsite", authorOption.links?.website || "");
    onChange("authorYoutube", authorOption.links?.youtube || "");
  };

  const handleRequestCreateAuthor = (name: string, initialData?: Partial<SuggestedAuthorData>) => {
    setCreateAuthorInitialData({
      blog: initialData?.blog || "",
      github: initialData?.github || "",
      linkedin: initialData?.linkedin || "",
      name: name || initialData?.name || "",
      twitter: initialData?.twitter || "",
      website: initialData?.website || "",
      youtube: initialData?.youtube || "",
    });
    setIsCreateAuthorOpen(true);
  };

  const handleAcceptSuggestedAuthor = (suggested: SuggestedAuthorData) => {
    onChange("authorName", suggested.name);
    onChange("authorBlog", suggested.blog || values.authorBlog || "");
    onChange("authorGithub", suggested.github || values.authorGithub || "");
    onChange("authorLinkedin", suggested.linkedin || values.authorLinkedin || "");
    onChange("authorTwitter", suggested.twitter || values.authorTwitter || "");
    onChange("authorWebsite", suggested.website || values.authorWebsite || "");
    onChange("authorYoutube", suggested.youtube || values.authorYoutube || "");
    if (onDismissSuggestedAuthor) {
      onDismissSuggestedAuthor();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Resource URL with Auto-Detect */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Resource URL</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark
                  checked={Boolean(values.url?.trim() && isValidHttpUrl(values.url.trim()))}
                />
              </Label>
              <span className="text-muted-foreground text-[10px]">
                Auto-detect title, description, favicon & OG image
              </span>
            </div>

            <div className="flex gap-2">
              <div className="h-9 flex-1">
                <InputField
                  type="url"
                  value={values.url || ""}
                  onChange={(e) => onChange("url", e.target.value)}
                  placeholder="https://example.com"
                  containerClassName="h-9"
                  className="font-mono text-xs"
                  disabled={disabled}
                  required
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onAutoDetect}
                disabled={scanner.isDetecting || !values.url?.trim() || disabled}
                className="border-line hover:bg-surface h-8 shrink-0 gap-1.5 px-3 text-xs font-bold uppercase"
              >
                {scanner.isDetecting ? (
                  <CircleNotchIcon className="size-4 animate-spin" />
                ) : (
                  <ArrowsClockwiseIcon weight="bold" className="text-primary size-4" />
                )}
                <span>
                  {scanner.isDetecting ? "Scanning..." : isEdit ? "Re-sync" : "Auto-Detect"}
                </span>
              </Button>
            </div>

            {scanner.duplicateNotice && (
              <DuplicateUrlNotice
                item={scanner.duplicateNotice.item}
                type={scanner.duplicateNotice.type}
              />
            )}
          </div>

          {/* Section 2: Title, Subtitle, & Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>Title</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={Boolean(values.title?.trim())} />
                </Label>
                {scanner.detectedUpdates.title && (
                  <DetectedFieldSuggestion
                    currentValue={values.title || ""}
                    detectedValue={scanner.detectedUpdates.title}
                    onApply={(val: string) => {
                      onChange("title", val);
                      scanner.setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                    }}
                    onDismiss={() => {
                      scanner.setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                    }}
                  />
                )}
              </div>
              <InputField
                value={values.title || ""}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="Resource Name"
                containerClassName="h-9"
                className="font-mono text-xs font-bold"
                disabled={disabled}
                required
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>Category</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={Boolean(values.category)} />
                </Label>
                <span className="text-muted-foreground text-[10px]">
                  Primary catalog classification
                </span>
              </div>
              <SelectField
                value={values.category || ""}
                onValueChange={(val) => onChange("category", val)}
                options={categoryOptions}
                placeholder="Select category..."
                disabled={disabled}
                triggerClassName="font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Subtitle</span>
                <span className="text-muted-foreground text-[10px] font-normal lowercase">
                  (optional)
                </span>
              </Label>
              {scanner.detectedUpdates.subtitle !== undefined && (
                <DetectedFieldSuggestion
                  currentValue={values.subtitle || ""}
                  detectedValue={scanner.detectedUpdates.subtitle}
                  onApply={(val: string) => {
                    onChange("subtitle", val);
                    scanner.setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                  }}
                  onDismiss={() => {
                    scanner.setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                  }}
                />
              )}
            </div>
            <InputField
              value={values.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              placeholder="Short tagline or purpose"
              containerClassName="h-9"
              className="font-mono text-xs"
              disabled={disabled}
            />
          </div>

          {/* Section 3: Description */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Description</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={Boolean(values.description?.trim())} />
              </Label>
              <div className="flex items-center gap-2">
                {scanner.detectedUpdates.description && (
                  <DetectedFieldSuggestion
                    currentValue={values.description || ""}
                    detectedValue={scanner.detectedUpdates.description}
                    onApply={(val: string) => {
                      onChange("description", val);
                      scanner.setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                    }}
                    onDismiss={() => {
                      scanner.setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                    }}
                  />
                )}
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    (values.description?.length || 0) > 380
                      ? "text-destructive font-bold"
                      : "text-muted-foreground",
                  )}
                >
                  {values.description?.length || 0}/400
                </span>
              </div>
            </div>
            <Textarea
              value={values.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Detailed description of the tool, library, or design asset..."
              rows={3}
              maxLength={400}
              disabled={disabled}
              className="border-line font-mono text-xs!"
              required
            />
          </div>

          {/* Section 4: Canonical Tags */}

          {/* Section 5: Media Asset Fields (Favicon, OG Image & Icon Style) */}
          <MediaAssetFields
            favicon={values.favicon}
            ogImage={values.ogImage}
            iconBg={values.iconBg}
            faviconOptions={scanner.faviconOptions}
            ogImageOptions={scanner.ogImageOptions}
            onFaviconChange={(val) => onChange("favicon", val)}
            onOgImageChange={(val) => onChange("ogImage", val)}
            onIconBgChange={(val: IconBgOption) => onChange("iconBg", val)}
            allowUpload
            disabled={disabled}
          />

          {/* Section 6: GitHub Repository */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>GitHub Repository</span>
                <span className="text-muted-foreground text-[10px] font-normal lowercase">
                  (optional)
                </span>
                <FieldCheckmark
                  checked={Boolean(values.github?.trim() && isValidHttpUrl(values.github.trim()))}
                />
              </Label>
              {scanner.detectedUpdates.github && (
                <DetectedFieldSuggestion
                  currentValue={values.github || ""}
                  detectedValue={scanner.detectedUpdates.github}
                  onApply={(val: string) => {
                    onChange("github", val);
                    scanner.setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                  }}
                  onDismiss={() => {
                    scanner.setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                  }}
                />
              )}
            </div>
            <InputField
              type="url"
              value={values.github || ""}
              onChange={(e) => onChange("github", e.target.value)}
              placeholder="https://github.com/username/repository"
              containerClassName="h-9"
              className="font-mono text-xs"
              disabled={disabled}
            />
          </div>

          {/* Section 7: Author & Creator Attributions */}
          <AuthorSocialFields
            values={authorValues}
            onChange={handleAuthorFieldChange}
            suggestedAuthor={scanner.suggestedAuthor}
            onAcceptSuggestedAuthor={handleAcceptSuggestedAuthor}
            onDismissSuggestedAuthor={onDismissSuggestedAuthor}
            onSelectAuthorOption={handleSelectAuthorOption}
            onRequestCreateAuthor={handleRequestCreateAuthor}
            allowCustom
            disabled={disabled}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Canonical Tags</span>
                <FieldCheckmark checked={Boolean(values.tags?.trim())} />
              </Label>
              <span className="text-muted-foreground text-[10px]">
                Keywords for discoverability & filtering
              </span>
            </div>
            <TagPicker
              value={values.tags || ""}
              onChange={(val) => onChange("tags", val)}
              disabled={disabled}
            />
          </div>

          {/* Extra Custom Children Slots (e.g., Submissions notes, pricing, moderation status) */}
          {children}
        </div>

        {/* Right Column: Live Resource Card Preview (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-20">
            <ResourceCardPreview
              title={values.title}
              subtitle={values.subtitle}
              category={values.category}
              description={values.description}
              url={values.url}
              tags={values.tags}
              favicon={values.favicon}
              ogImage={values.ogImage}
              iconBg={values.iconBg}
              author={values.authorName}
              cardMaxWidthClass={cardMaxWidthClass}
            />
          </div>
        </div>
      </div>

      {/* Author Creation Dialog */}
      <AuthorDialog
        open={isCreateAuthorOpen}
        onOpenChange={setIsCreateAuthorOpen}
        initialData={createAuthorInitialData}
        initialName={createAuthorInitialData.name || ""}
        onCreated={(newAuthor) => {
          onChange("authorName", newAuthor.name);
          onChange("authorId", newAuthor.id);
          onChange("authorBlog", newAuthor.blog || values.authorBlog || "");
          onChange("authorGithub", newAuthor.github || values.authorGithub || "");
          onChange("authorLinkedin", newAuthor.linkedin || values.authorLinkedin || "");
          onChange("authorTwitter", newAuthor.twitter || values.authorTwitter || "");
          onChange("authorWebsite", newAuthor.website || values.authorWebsite || "");
          onChange("authorYoutube", newAuthor.youtube || values.authorYoutube || "");
          setIsCreateAuthorOpen(false);
        }}
      />
    </>
  );
}
