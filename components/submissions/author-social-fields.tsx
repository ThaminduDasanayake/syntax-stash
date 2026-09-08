import { PlusIcon } from "@phosphor-icons/react";

import { AuthorCombobox, AuthorOption } from "@/components/submissions/author-combobox";
import { Button } from "@/components/ui/button";
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
  allowCustom?: boolean;
  className?: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  onBatchChange?: (updates: Partial<AuthorSocialValues>) => void;
  onChange: (field: keyof AuthorSocialValues, value: string) => void;
  onRequestCreateAuthor?: (authorName: string) => void;
  onSelectAuthorOption?: (author: AuthorOption) => void;
  values: AuthorSocialValues;
}

export function AuthorSocialFields({
  allowCustom = true,
  className,
  disabled = false,
  onChange,
  onRequestCreateAuthor,
  onSelectAuthorOption,
  values,
}: AuthorSocialFieldsProps) {
  const handleSelectAuthor = (selected: AuthorOption) => {
    onChange("author", selected.name);
    onSelectAuthorOption?.(selected);
  };

  return (
    <div className={cn("border-line space-y-2 font-mono text-xs", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-mono text-xs font-bold uppercase">
          Creator Attribution
        </Label>
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
