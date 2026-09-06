"use client";

import {
  CaretDownIcon,
  CaretUpIcon,
  GlobeIcon,
  PencilSimpleIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import { AuthorCombobox, AuthorOption } from "@/components/submissions/author-combobox";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface AuthorSocialValues {
  author?: string | null;
  authorGitHub?: string | null;
  authorLinkedIn?: string | null;
  authorTwitter?: string | null;
  authorWebsite?: string | null;
  authorYouTube?: string | null;
}

export interface AuthorSocialFieldsProps {
  className?: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  onBatchChange?: (updates: Partial<AuthorSocialValues>) => void;
  onChange: (field: keyof AuthorSocialValues, value: string) => void;
  values: AuthorSocialValues;
}

export function AuthorSocialFields({
  className,
  defaultExpanded = false,
  disabled = false,
  onBatchChange,
  onChange,
  values,
}: AuthorSocialFieldsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleSelectAuthor = (selected: AuthorOption) => {
    const updates: Partial<AuthorSocialValues> = {
      author: selected.name,
      authorGitHub: selected.links?.github || "",
      authorLinkedIn: selected.links?.linkedin || "",
      authorTwitter: selected.links?.twitter || "",
      authorWebsite: selected.links?.website || "",
      authorYouTube: selected.links?.youtube || "",
    };

    if (onBatchChange) {
      onBatchChange(updates);
    } else {
      for (const [key, val] of Object.entries(updates)) {
        onChange(key as keyof AuthorSocialValues, val ?? "");
      }
    }
  };

  const hasAnySocialLinks = Boolean(
    values.authorWebsite?.trim() ||
      values.authorTwitter?.trim() ||
      values.authorGitHub?.trim() ||
      values.authorLinkedIn?.trim() ||
      values.authorYouTube?.trim(),
  );

  return (
    <div className={cn("border-line space-y-3 font-mono text-xs", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-mono text-xs font-bold uppercase">
          Creator Attribution
        </Label>
        <span className="text-muted-foreground text-[10px]">
          Credit the author or organization
        </span>
      </div>

      {/* Author Combobox */}
      <div className="h-9">
        <AuthorCombobox
          placeholder="Search creator or type a new name..."
          value={values.author || ""}
          onChange={(value) => onChange("author", value)}
          onSelectAuthor={handleSelectAuthor}
          disabled={disabled}
          containerClassName="h-9"
          className="font-mono text-xs"
        />
      </div>

      {/* Connected Author Summary & Social Expand Toggle */}
      {values.author?.trim() && (
        <div className="border-line bg-surface/40 space-y-2.5 rounded border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[11px]">Active Links:</span>
              <div className="flex items-center gap-1.5">
                {values.authorWebsite?.trim() && (
                  <a
                    href={values.authorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line bg-paper text-muted-foreground hover:text-primary flex size-5 items-center justify-center rounded border"
                    title={`Website: ${values.authorWebsite}`}
                  >
                    <GlobeIcon className="size-3" />
                  </a>
                )}
                {values.authorGitHub?.trim() && (
                  <a
                    href={
                      values.authorGitHub.startsWith("http")
                        ? values.authorGitHub
                        : `https://github.com/${values.authorGitHub}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line bg-paper text-muted-foreground hover:text-primary flex size-5 items-center justify-center rounded border"
                    title={`GitHub: ${values.authorGitHub}`}
                  >
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={10}
                      height={10}
                      className="size-2.5 dark:invert opacity-70"
                    />
                  </a>
                )}
                {values.authorTwitter?.trim() && (
                  <a
                    href={
                      values.authorTwitter.startsWith("http")
                        ? values.authorTwitter
                        : `https://x.com/${values.authorTwitter.replace(/^@/, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line bg-paper text-muted-foreground hover:text-primary flex size-5 items-center justify-center rounded border"
                    title={`Twitter: ${values.authorTwitter}`}
                  >
                    <XLogoIcon className="size-2.5" />
                  </a>
                )}
                {values.authorLinkedIn?.trim() && (
                  <a
                    href={
                      values.authorLinkedIn.startsWith("http")
                        ? values.authorLinkedIn
                        : `https://linkedin.com/in/${values.authorLinkedIn}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line bg-paper text-muted-foreground hover:text-primary flex size-5 items-center justify-center rounded border text-[9px] font-bold"
                    title={`LinkedIn: ${values.authorLinkedIn}`}
                  >
                    in
                  </a>
                )}
                {values.authorYouTube?.trim() && (
                  <a
                    href={
                      values.authorYouTube.startsWith("http")
                        ? values.authorYouTube
                        : `https://youtube.com/${values.authorYouTube}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line bg-paper text-muted-foreground hover:text-primary flex size-5 items-center justify-center rounded border text-[9px] font-bold"
                    title={`YouTube: ${values.authorYouTube}`}
                  >
                    yt
                  </a>
                )}
                {!hasAnySocialLinks && (
                  <span className="text-muted-foreground text-[10px] italic">No social links</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-[11px] font-bold uppercase transition-colors"
            >
              <PencilSimpleIcon className="size-3" />
              <span>{isExpanded ? "Collapse Links" : "Edit Social Links"}</span>
              {isExpanded ? (
                <CaretUpIcon className="size-3" />
              ) : (
                <CaretDownIcon className="size-3" />
              )}
            </button>
          </div>

          {/* Expandable Social Profile Inputs */}
          {isExpanded && (
            <div className="border-line/60 space-y-3 border-t pt-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                    <GlobeIcon className="size-3" /> Website / Portfolio
                  </Label>
                  <InputField
                    type="url"
                    placeholder="https://creator.com"
                    value={values.authorWebsite || ""}
                    onChange={(e) => onChange("authorWebsite", e.target.value)}
                    disabled={disabled}
                    containerClassName="h-8"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                    <XLogoIcon className="size-3" /> X / Twitter
                  </Label>
                  <InputField
                    placeholder="@username or https://x.com/..."
                    value={values.authorTwitter || ""}
                    onChange={(e) => onChange("authorTwitter", e.target.value)}
                    disabled={disabled}
                    containerClassName="h-8"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={12}
                      height={12}
                      className="size-3 dark:invert opacity-70"
                    />
                    <span>GitHub Profile</span>
                  </Label>
                  <InputField
                    placeholder="username or https://github.com/..."
                    value={values.authorGitHub || ""}
                    onChange={(e) => onChange("authorGitHub", e.target.value)}
                    disabled={disabled}
                    containerClassName="h-8"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                    <Image src="/linkedin.svg" alt="LinkedIn" width={12} height={12} className="size-3" />
                    <span>LinkedIn Profile</span>
                  </Label>
                  <InputField
                    placeholder="username or https://linkedin.com/in/..."
                    value={values.authorLinkedIn || ""}
                    onChange={(e) => onChange("authorLinkedIn", e.target.value)}
                    disabled={disabled}
                    containerClassName="h-8"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                  <Image src="/youtube.svg" alt="YouTube" width={12} height={12} className="size-3" />
                  <span>YouTube Channel</span>
                </Label>
                <InputField
                  placeholder="https://youtube.com/@channel"
                  value={values.authorYouTube || ""}
                  onChange={(e) => onChange("authorYouTube", e.target.value)}
                  disabled={disabled}
                  containerClassName="h-8"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
