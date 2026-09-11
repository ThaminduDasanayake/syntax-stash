import { InfoIcon, PlusIcon } from "@phosphor-icons/react";

import { AuthorCombobox, AuthorOption } from "@/components/submissions/author-combobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SuggestedAuthorData {
  blog?: string;
  github?: string;
  linkedin?: string;
  name: string;
  twitter?: string;
  website?: string;
  youtube?: string;
}

export interface AuthorSocialValues {
  author?: string | null;
  authorGitHub?: string | null;
  authorLinkedIn?: string | null;
  authorTwitter?: string | null;
  authorWebsite?: string | null;
  authorYouTube?: string | null;
}

export interface AuthorSocialFieldsProps {
  allowCustom?: boolean;
  className?: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  onAcceptSuggestedAuthor?: (authorData: SuggestedAuthorData) => void;
  onBatchChange?: (updates: Partial<AuthorSocialValues>) => void;
  onChange: (field: keyof AuthorSocialValues, value: string) => void;
  onDismissSuggestedAuthor?: () => void;
  onRequestCreateAuthor?: (authorName: string) => void;
  onSelectAuthorOption?: (author: AuthorOption) => void;
  suggestedAuthor?: SuggestedAuthorData | null;
  values: AuthorSocialValues;
}

export function AuthorSocialFields({
  allowCustom = true,
  className,
  disabled = false,
  onChange,
  onRequestCreateAuthor,
  onSelectAuthorOption,
  suggestedAuthor,
  values,
}: AuthorSocialFieldsProps) {
  const handleSelectAuthor = (selected: AuthorOption) => {
    onSelectAuthorOption?.(selected);
  };

  const hasSuggestion =
    Boolean(suggestedAuthor?.name?.trim()) &&
    suggestedAuthor?.name?.trim().toLowerCase() !== (values.author || "").trim().toLowerCase();

  return (
    <div className={cn("border-line space-y-2 font-mono text-xs", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-foreground font-mono text-xs font-bold uppercase">
            Creator Attribution
          </Label>

          {hasSuggestion && suggestedAuthor && (
            <div className="animate-in fade-in inline-flex items-center gap-1.5 rounded border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-500 duration-200">
              <InfoIcon weight="duotone" className="size-4 shrink-0 text-blue-500" />
              <span>
                Found:{" "}
                <strong className="underline underline-offset-2">{suggestedAuthor.name}</strong>
              </span>
            </div>
          )}
        </div>

        {onRequestCreateAuthor ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRequestCreateAuthor("")}
            disabled={disabled}
            className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[11px] font-bold uppercase"
          >
            <PlusIcon className="size-3" weight="bold" />
            <span>New Author</span>
          </Button>
        ) : (
          <span className="text-muted-foreground text-[10px]">
            Credit one or more authors / organizations
          </span>
        )}
      </div>

      {/* Author Combobox */}
      <div className="min-h-9">
        <AuthorCombobox
          placeholder="Search creators or type a name..."
          value={values.author || ""}
          onChange={(value) => onChange("author", value)}
          onSelectAuthor={handleSelectAuthor}
          onRequestCreateAuthor={onRequestCreateAuthor}
          allowCustom={allowCustom}
          disabled={disabled}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}
