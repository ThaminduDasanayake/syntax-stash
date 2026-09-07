"use client";

import { AuthorCombobox, AuthorOption } from "@/components/submissions/author-combobox";
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
  disabled = false,
  onChange,
  values,
}: AuthorSocialFieldsProps) {
  const handleSelectAuthor = (selected: AuthorOption) => {
    onChange("author", selected.name);
  };

  return (
    <div className={cn("border-line space-y-2 font-mono text-xs", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-mono text-xs font-bold uppercase">
          Creator Attribution
        </Label>
        <span className="text-muted-foreground text-[10px]">
          Credit one or more authors / organizations
        </span>
      </div>

      {/* Author Combobox */}
      <div className="min-h-9">
        <AuthorCombobox
          placeholder="Search creators or type a name..."
          value={values.author || ""}
          onChange={(value) => onChange("author", value)}
          onSelectAuthor={handleSelectAuthor}
          disabled={disabled}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}

