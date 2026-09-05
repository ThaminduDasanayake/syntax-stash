"use client";

import { GlobeIcon, XLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";

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
  disabled?: boolean;
  onChange: (field: keyof AuthorSocialValues, value: string) => void;
  values: AuthorSocialValues;
}

export function AuthorSocialFields({
  className,
  disabled = false,
  onChange,
  values,
}: AuthorSocialFieldsProps) {
  return (
    <div className={cn("border-line space-y-4 border-t pt-4 font-mono text-xs", className)}>
      <div>
        <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
          Creator Attribution & Links
        </h4>
        <p className="text-muted-foreground text-[11px]">
          Give credit to the author, designer, or organization who built it with their social
          profiles.
        </p>
      </div>

      <div className="space-y-4">
        {/* Row 1: Name and Website / Portfolio side-by-side */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Author Name */}
          <div className="space-y-2">
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              Creator / Author Name
            </Label>
            <div className="h-9">
              <InputField
                placeholder="e.g. Jane Doe"
                value={values.author || ""}
                onChange={(e) => onChange("author", e.target.value)}
                disabled={disabled}
                containerClassName="h-9"
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Website / Portfolio */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
              <GlobeIcon className="text-muted-foreground size-3.5" /> Website / Portfolio
            </Label>
            <div className="h-9">
              <InputField
                type="url"
                placeholder="https://janedoe.com"
                value={values.authorWebsite || ""}
                onChange={(e) => onChange("authorWebsite", e.target.value)}
                disabled={disabled}
                containerClassName="h-9"
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Row 2: X / Twitter (Separate Line) */}
        <div className="space-y-2">
          <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
            <XLogoIcon weight="bold" className="text-muted-foreground size-3.5" /> X / Twitter
            Profile
          </Label>
          <div className="h-9">
            <InputField
              type="url"
              placeholder="https://x.com/janedoe"
              value={values.authorTwitter || ""}
              onChange={(e) => onChange("authorTwitter", e.target.value)}
              disabled={disabled}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
          </div>
        </div>

        {/* Row 3: GitHub (Separate Line) */}
        <div className="space-y-2">
          <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
            <Image
              src="/github.svg"
              alt="GitHub"
              width={14}
              height={14}
              className="size-3.5 dark:invert"
            />
            <span>GitHub Profile</span>
          </Label>
          <div className="h-9">
            <InputField
              type="url"
              placeholder="https://github.com/janedoe"
              value={values.authorGitHub || ""}
              onChange={(e) => onChange("authorGitHub", e.target.value)}
              disabled={disabled}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
          </div>
        </div>

        {/* Row 4: YouTube (Separate Line) */}
        <div className="space-y-2">
          <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
            <Image src="/youtube.svg" alt="YouTube" width={14} height={14} className="size-3.5" />
            <span>YouTube Channel</span>
          </Label>
          <div className="h-9">
            <InputField
              type="url"
              placeholder="https://youtube.com/@janedoe"
              value={values.authorYouTube || ""}
              onChange={(e) => onChange("authorYouTube", e.target.value)}
              disabled={disabled}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
          </div>
        </div>

        {/* Row 5: LinkedIn (Separate Line) */}
        <div className="space-y-2">
          <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
            <Image src="/linkedin.svg" alt="LinkedIn" width={14} height={14} className="size-3.5" />
            <span>LinkedIn Profile</span>
          </Label>
          <div className="h-9">
            <InputField
              type="url"
              placeholder="https://linkedin.com/in/janedoe"
              value={values.authorLinkedIn || ""}
              onChange={(e) => onChange("authorLinkedIn", e.target.value)}
              disabled={disabled}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
