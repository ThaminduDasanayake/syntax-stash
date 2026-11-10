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
import { LabelInput } from "@/components/ui/label-input";
import { LabelSelect } from "@/components/ui/label-select";
import { LabelTextarea } from "@/components/ui/label-textarea";
import { useCategories } from "@/hooks/use-categories";
import { DetectedFieldUpdates, DuplicateNoticeState } from "@/hooks/use-metadata-scanner";
import { isValidHttpUrl } from "@/lib/utils";

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
  ogImageBg?: string | null;
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
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <LabelInput
                  type="url"
                  label="Resource URL"
                  value={values.url || ""}
                  onChange={(e) => onChange("url", e.target.value)}
                  placeholder="https://example.com"
                  disabled={disabled}
                  required
                  suffix={
                    <FieldCheckmark
                      checked={Boolean(values.url?.trim() && isValidHttpUrl(values.url.trim()))}
                    />
                  }
                />
              </div>
              <Button
                variant="outline"
                type="button"
                onClick={onAutoDetect}
                disabled={scanner.isDetecting || !values.url?.trim() || disabled}
                className="border-line hover:bg-surface mt-2 h-[52px] shrink-0 gap-1.5 rounded-[20px] px-4 font-mono text-xs uppercase"
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
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              {scanner.detectedUpdates.title && (
                <div className="flex justify-end pb-0.5">
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
                </div>
              )}
              <LabelInput
                label="Title"
                value={values.title || ""}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="e.g. Next.js, Radix UI"
                disabled={disabled}
                required
                suffix={<FieldCheckmark checked={Boolean(values.title?.trim())} />}
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-1">
              <LabelSelect
                label="Category"
                value={values.category || ""}
                onValueChange={(val) => onChange("category", val)}
                options={categoryOptions}
                placeholder="Select category..."
                disabled={disabled}
                required
                suffix={<FieldCheckmark checked={Boolean(values.category)} />}
              />
            </div>
          </div>

          <div className="space-y-1">
            {scanner.detectedUpdates.subtitle !== undefined && (
              <div className="flex justify-end pb-0.5">
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
              </div>
            )}
            <LabelInput
              label="Subtitle"
              value={values.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              placeholder="Short tagline or purpose"
              disabled={disabled}
              suffix={<FieldCheckmark checked={Boolean(values.subtitle?.trim())} />}
            />
          </div>

          {/* Section 3: Description */}
          <div className="space-y-1">
            {scanner.detectedUpdates.description && (
              <div className="flex justify-end pb-0.5">
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
              </div>
            )}
            <LabelTextarea
              label="Description"
              value={values.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Detailed description of the tool, library, or design asset..."
              maxLength={800}
              disabled={disabled}
              required
            />
          </div>

          {/* Section 4: Canonical Tags */}

          {/* Section 5: Media Asset Fields (Favicon, OG Image & Icon Style) */}
          <MediaAssetFields
            favicon={values.favicon}
            ogImage={values.ogImage}
            ogImageBg={values.ogImageBg}
            iconBg={values.iconBg}
            faviconOptions={scanner.faviconOptions}
            ogImageOptions={scanner.ogImageOptions}
            onFaviconChange={(val) => onChange("favicon", val)}
            onOgImageChange={(val) => onChange("ogImage", val)}
            onOgImageBgChange={(val) => onChange("ogImageBg", val)}
            onIconBgChange={(val: IconBgOption) => onChange("iconBg", val)}
            allowUpload
            disabled={disabled}
          />

          {/* Section 6: GitHub Repository */}
          <div className="space-y-1">
            {scanner.detectedUpdates.github && (
              <div className="flex justify-end pb-0.5">
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
              </div>
            )}
            <LabelInput
              type="url"
              label="GitHub Repository"
              value={values.github || ""}
              onChange={(e) => onChange("github", e.target.value)}
              placeholder="https://github.com/username/repository"
              disabled={disabled}
              suffix={
                <FieldCheckmark
                  checked={Boolean(values.github?.trim() && isValidHttpUrl(values.github.trim()))}
                />
              }
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

          {/* Section 8: Canonical Tags */}
          <div className="space-y-1">
            <TagPicker
              label="Canonical Tags"
              value={values.tags || ""}
              onChange={(val) => onChange("tags", val)}
              disabled={disabled}
              suffix={<FieldCheckmark checked={Boolean(values.tags?.trim())} />}
            />
            <p className="text-muted-foreground px-2 pt-0.5 text-[10px]">
              Keywords for discoverability & filtering
            </p>
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
              ogImageBg={values.ogImageBg}
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
