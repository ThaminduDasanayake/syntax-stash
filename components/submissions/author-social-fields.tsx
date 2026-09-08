import { CheckIcon, PlusIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";

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
  onAcceptSuggestedAuthor,
  onBatchChange,
  onChange,
  onDismissSuggestedAuthor,
  onRequestCreateAuthor,
  onSelectAuthorOption,
  suggestedAuthor,
  values,
}: AuthorSocialFieldsProps) {
  const handleSelectAuthor = (selected: AuthorOption) => {
    onChange("author", selected.name);
    onSelectAuthorOption?.(selected);
  };

  const hasSuggestion =
    Boolean(suggestedAuthor?.name?.trim()) &&
    suggestedAuthor?.name?.trim().toLowerCase() !== (values.author || "").trim().toLowerCase();

  const handleApplySuggestion = () => {
    if (!suggestedAuthor) return;
    if (onAcceptSuggestedAuthor) {
      onAcceptSuggestedAuthor(suggestedAuthor);
    } else {
      onChange("author", suggestedAuthor.name);
      if (onBatchChange) {
        onBatchChange({
          author: suggestedAuthor.name,
          authorGitHub: suggestedAuthor.github || values.authorGitHub,
          authorLinkedIn: suggestedAuthor.linkedin || values.authorLinkedIn,
          authorTwitter: suggestedAuthor.twitter || values.authorTwitter,
          authorWebsite: suggestedAuthor.website || values.authorWebsite,
          authorYouTube: suggestedAuthor.youtube || values.authorYouTube,
        });
      }
    }
    onDismissSuggestedAuthor?.();
  };

  return (
    <div className={cn("border-line space-y-2 font-mono text-xs", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-foreground font-mono text-xs font-bold uppercase">
            Creator Attribution
          </Label>

          {hasSuggestion && suggestedAuthor && (
            <div className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-mono animate-in fade-in duration-200">
              <SparkleIcon weight="fill" className="text-amber-500 size-3 shrink-0" />
              <span>
                Found: <strong className="font-bold underline underline-offset-2">{suggestedAuthor.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleApplySuggestion}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 ml-1 inline-flex cursor-pointer items-center gap-0.5 rounded px-1.5 py-0.2 text-[10px] font-bold uppercase transition-colors"
                title={`Apply suggested creator "${suggestedAuthor.name}"`}
              >
                <CheckIcon weight="bold" className="size-2.5" />
                <span>Apply</span>
              </button>
              {onDismissSuggestedAuthor && (
                <button
                  type="button"
                  onClick={onDismissSuggestedAuthor}
                  className="text-amber-700/60 hover:text-amber-800 dark:text-amber-300/60 dark:hover:text-amber-200 ml-0.5 cursor-pointer p-0.5"
                  title="Dismiss suggestion"
                >
                  <XIcon className="size-2.5" />
                </button>
              )}
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
