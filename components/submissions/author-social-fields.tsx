"use client";

import {
  GlobeIcon,
  InfoIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  AuthorCombobox,
  AuthorOption,
  fetchAuthorList,
} from "@/components/submissions/author-combobox";
import { FieldCheckmark } from "@/components/submissions/field-checkmark";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { cn, isValidHttpUrl } from "@/lib/utils";

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
  authorBlog?: string | null;
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
  onRequestCreateAuthor?: (authorName: string, initialData?: Partial<SuggestedAuthorData>) => void;
  onSelectAuthorOption?: (author: AuthorOption) => void;
  suggestedAuthor?: SuggestedAuthorData | null;
  values: AuthorSocialValues;
}

interface NewAuthorEntry {
  blog: string;
  github: string;
  id: string;
  linkedin: string;
  name: string;
  twitter: string;
  website: string;
  youtube: string;
}

export function AuthorSocialFields({
  allowCustom = false,
  className,
  disabled = false,
  onAcceptSuggestedAuthor,
  onBatchChange,
  onChange,
  onRequestCreateAuthor,
  onSelectAuthorOption,
  suggestedAuthor,
  values,
}: AuthorSocialFieldsProps) {
  const [existingAuthors, setExistingAuthors] = useState<AuthorOption[]>([]);
  const isInternalUpdate = useRef(false);

  // Catalog selected authors string (e.g. "shadcn, leerob")
  const [catalogAuthorsString, setCatalogAuthorsString] = useState<string>("");

  // New non-catalog author cards (used only for public submit mode when onRequestCreateAuthor is absent)
  const [newAuthors, setNewAuthors] = useState<NewAuthorEntry[]>([]);

  const isAdminMode = Boolean(onRequestCreateAuthor);

  useEffect(() => {
    let mounted = true;
    fetchAuthorList().then((list) => {
      if (mounted) setExistingAuthors(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Parse initial `values.author`
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const rawNames = (values.author || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (isAdminMode) {
      // In Admin mode, all selected authors map cleanly to catalog combobox
      setCatalogAuthorsString(rawNames.join(", "));
      setNewAuthors([]);
      return;
    }

    // In Public Submit mode, partition into catalog vs non-catalog
    const catalogList: string[] = [];
    const nonCatalogList: NewAuthorEntry[] = [];

    rawNames.forEach((name, index) => {
      const clean = name.toLowerCase();
      const match = existingAuthors.find(
        (a) => a.name.toLowerCase() === clean || a.slug.toLowerCase() === clean,
      );

      if (match) {
        catalogList.push(match.name);
      } else {
        nonCatalogList.push({
          id: `new-author-${index + 1}-${name}`,
          blog: index === 0 ? values.authorBlog || "" : "",
          github: index === 0 ? values.authorGitHub || "" : "",
          linkedin: index === 0 ? values.authorLinkedIn || "" : "",
          name,
          twitter: index === 0 ? values.authorTwitter || "" : "",
          website: index === 0 ? values.authorWebsite || "" : "",
          youtube: index === 0 ? values.authorYouTube || "" : "",
        });
      }
    });

    setCatalogAuthorsString(catalogList.join(", "));
    setNewAuthors(nonCatalogList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingAuthors, isAdminMode, values.author]);

  const syncToParent = (catalogStr: string, newAuthList: NewAuthorEntry[]) => {
    isInternalUpdate.current = true;

    const catalogNames = catalogStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newNames = newAuthList
      .map((a) => a.name.trim())
      .filter(Boolean);

    const allNames = [...catalogNames, ...newNames].join(", ");

    // Prioritize new authors who have links if in public mode
    const newAuthorWithLinks = newAuthList.find((a) =>
      Boolean(a.blog || a.github || a.linkedin || a.twitter || a.website || a.youtube),
    );

    const updates: Partial<AuthorSocialValues> = {
      author: allNames,
      authorBlog: newAuthorWithLinks?.blog || values.authorBlog || "",
      authorGitHub: newAuthorWithLinks?.github || values.authorGitHub || "",
      authorLinkedIn: newAuthorWithLinks?.linkedin || values.authorLinkedIn || "",
      authorTwitter: newAuthorWithLinks?.twitter || values.authorTwitter || "",
      authorWebsite: newAuthorWithLinks?.website || values.authorWebsite || "",
      authorYouTube: newAuthorWithLinks?.youtube || values.authorYouTube || "",
    };

    if (onBatchChange) {
      onBatchChange(updates);
    } else {
      onChange("author", allNames);
      if (updates.authorBlog !== undefined) onChange("authorBlog", updates.authorBlog || "");
      if (updates.authorGitHub !== undefined) onChange("authorGitHub", updates.authorGitHub || "");
      if (updates.authorLinkedIn !== undefined)
        onChange("authorLinkedIn", updates.authorLinkedIn || "");
      if (updates.authorTwitter !== undefined)
        onChange("authorTwitter", updates.authorTwitter || "");
      if (updates.authorWebsite !== undefined)
        onChange("authorWebsite", updates.authorWebsite || "");
      if (updates.authorYouTube !== undefined)
        onChange("authorYouTube", updates.authorYouTube || "");
    }
  };

  const handleCatalogAuthorsChange = (newVal: string) => {
    setCatalogAuthorsString(newVal);
    syncToParent(newVal, newAuthors);
  };

  const handleAddNewAuthor = (initialData?: Partial<SuggestedAuthorData>) => {
    if (isAdminMode && onRequestCreateAuthor) {
      onRequestCreateAuthor(initialData?.name || "", initialData);
      return;
    }

    const newEntry: NewAuthorEntry = {
      id: `new-author-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      blog: initialData?.blog || "",
      github: initialData?.github || "",
      linkedin: initialData?.linkedin || "",
      name: initialData?.name || "",
      twitter: initialData?.twitter || "",
      website: initialData?.website || "",
      youtube: initialData?.youtube || "",
    };
    const next = [...newAuthors, newEntry];
    setNewAuthors(next);
    syncToParent(catalogAuthorsString, next);
  };

  const handleRemoveNewAuthor = (id: string) => {
    const next = newAuthors.filter((a) => a.id !== id);
    setNewAuthors(next);
    syncToParent(catalogAuthorsString, next);
  };

  const handleUpdateNewAuthor = (id: string, updates: Partial<NewAuthorEntry>) => {
    const next = newAuthors.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setNewAuthors(next);
    syncToParent(catalogAuthorsString, next);
  };

  const hasSuggestion =
    Boolean(suggestedAuthor?.name?.trim()) &&
    !catalogAuthorsString.toLowerCase().includes(suggestedAuthor!.name.toLowerCase()) &&
    !newAuthors.some(
      (a) => a.name.trim().toLowerCase() === suggestedAuthor?.name?.trim().toLowerCase(),
    );

  const handleAcceptSuggestion = (suggested: SuggestedAuthorData) => {
    onAcceptSuggestedAuthor?.(suggested);
    const clean = suggested.name.trim().toLowerCase();
    const isMatch = existingAuthors.find(
      (a) => a.name.toLowerCase() === clean || a.slug.toLowerCase() === clean,
    );

    if (isMatch) {
      const existing = catalogAuthorsString
        ? catalogAuthorsString
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      if (!existing.some((n) => n.toLowerCase() === isMatch.name.toLowerCase())) {
        const next = [...existing, isMatch.name].join(", ");
        setCatalogAuthorsString(next);
        syncToParent(next, newAuthors);
      }
    } else {
      if (isAdminMode && onRequestCreateAuthor) {
        onRequestCreateAuthor(suggested.name, suggested);
      } else {
        handleAddNewAuthor(suggested);
      }
    }
  };

  const hasAnyAuthor =
    Boolean(catalogAuthorsString.trim()) || newAuthors.some((a) => Boolean(a.name.trim()));

  return (
    <div className={cn("border-line space-y-4 font-mono text-xs", className)}>
      {/* Attribution Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
            <UserIcon className="text-primary size-4" />
            <span>Creator Attribution</span>
            <FieldCheckmark checked={hasAnyAuthor} />
          </Label>

          {hasSuggestion && suggestedAuthor && (
            <button
              type="button"
              onClick={() => handleAcceptSuggestion(suggestedAuthor)}
              className="animate-in fade-in inline-flex cursor-pointer items-center gap-1.5 rounded border-[1.5px] border-blue-500/40 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-500 transition-colors hover:bg-blue-500/20"
              title={`Click to add "${suggestedAuthor.name}" as an author`}
            >
              <InfoIcon weight="duotone" className="size-4 shrink-0 text-blue-500" />
              <span>
                Found:{" "}
                <strong className="underline underline-offset-2">{suggestedAuthor.name}</strong>
              </span>
              <span className="text-[10px] opacity-80">(Click to add)</span>
            </button>
          )}
        </div>

        {isAdminMode ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRequestCreateAuthor?.("")}
            disabled={disabled}
            className="border-primary/40 text-primary hover:bg-primary/10 h-7 gap-1.5 font-mono text-[11px] font-bold uppercase"
          >
            <PlusIcon weight="bold" className="size-3" />
            <span>New Author to DB</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddNewAuthor()}
            disabled={disabled}
            className="border-primary/40 text-primary hover:bg-primary/10 h-7 gap-1.5 font-mono text-[11px] font-bold uppercase"
          >
            <PlusIcon weight="bold" className="size-3" />
            <span>Add Author</span>
          </Button>
        )}
      </div>

      {/* Primary Catalog Search Combobox */}
      <div className="space-y-1.5">
        <AuthorCombobox
          placeholder="Search creators in catalog..."
          value={catalogAuthorsString}
          onChange={handleCatalogAuthorsChange}
          onSelectAuthor={onSelectAuthorOption}
          onRequestCreateAuthor={onRequestCreateAuthor}
          allowCustom={allowCustom}
          disabled={disabled}
          className="font-mono text-xs"
        />
        <p className="text-muted-foreground text-[10px]">
          {isAdminMode
            ? 'Search existing creators in catalog or click "+ New Author to DB" to create a new author record in the database.'
            : 'Search for an author\'s name in the catalog, or click "+ Add Author" to add them with their details if not found.'}
        </p>
      </div>

      {/* New Non-Catalog Author Sections (Rendered only in Public Submit mode when added) */}
      {!isAdminMode && newAuthors.length > 0 && (
        <div className="space-y-3 pt-2">
          {newAuthors.map((entry, index) => (
            <div
              key={entry.id}
              className="border-line/70 bg-paper/40 animate-in fade-in space-y-3 rounded-lg border-[1.5px] p-4 duration-200"
            >
              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-bold uppercase">
                    Author {newAuthors.length > 1 ? `#${index + 1}` : ""}
                  </span>
                  <span className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold">
                    Author (Not in DB)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveNewAuthor(entry.id)}
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive flex size-6 items-center justify-center rounded p-0.5 transition-colors"
                  title="Remove this author section"
                  aria-label="Remove author"
                >
                  <TrashIcon className="size-3.5" />
                </button>
              </div>

              {/* Creator Name Field */}
              <div className="space-y-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <span>Creator / Organization Name</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={Boolean(entry.name.trim())} />
                </Label>
                <div className="h-9">
                  <InputField
                    placeholder="Enter creator or organization name..."
                    value={entry.name}
                    onChange={(e) => handleUpdateNewAuthor(entry.id, { name: e.target.value })}
                    disabled={disabled}
                    className="font-mono text-xs"
                    required
                  />
                </div>
              </div>

              {/* Creator Profile Links Grid */}
              <div className="border-line/60 bg-background/50 space-y-3 rounded-lg border p-3.5">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-wider">
                  Creator Profile & Social Links (Optional)
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Website */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                      <GlobeIcon className="text-muted-foreground size-3.5" />
                      <span>Website / Portfolio</span>
                      <FieldCheckmark
                        checked={Boolean(
                          entry.website?.trim() && isValidHttpUrl(entry.website.trim()),
                        )}
                      />
                    </Label>
                    <InputField
                      placeholder="https://example.com"
                      value={entry.website || ""}
                      onChange={(e) => handleUpdateNewAuthor(entry.id, { website: e.target.value })}
                      disabled={disabled}
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* GitHub */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                      <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={14}
                        height={14}
                        className="opacity-70 dark:invert"
                      />
                      <span>GitHub (Username or URL)</span>
                      <FieldCheckmark checked={Boolean(entry.github?.trim())} />
                    </Label>
                    <InputField
                      placeholder="https://github.com/username"
                      value={entry.github || ""}
                      onChange={(e) => handleUpdateNewAuthor(entry.id, { github: e.target.value })}
                      disabled={disabled}
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Twitter / X */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                      <XLogoIcon weight="bold" className="text-muted-foreground size-3.5" />
                      <span>Twitter / X</span>
                      <FieldCheckmark checked={Boolean(entry.twitter?.trim())} />
                    </Label>
                    <InputField
                      placeholder="@username or https://x.com/..."
                      value={entry.twitter || ""}
                      onChange={(e) => handleUpdateNewAuthor(entry.id, { twitter: e.target.value })}
                      disabled={disabled}
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                      <Image
                        src="/linkedin.svg"
                        alt="LinkedIn"
                        width={14}
                        height={14}
                        className="opacity-70"
                      />
                      <span>LinkedIn</span>
                      <FieldCheckmark checked={Boolean(entry.linkedin?.trim())} />
                    </Label>
                    <InputField
                      placeholder="username or https://linkedin.com/in/..."
                      value={entry.linkedin || ""}
                      onChange={(e) =>
                        handleUpdateNewAuthor(entry.id, { linkedin: e.target.value })
                      }
                      disabled={disabled}
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                      <Image
                        src="/youtube.svg"
                        alt="YouTube"
                        width={14}
                        height={14}
                        className="opacity-70"
                      />
                      <span>YouTube Channel</span>
                      <FieldCheckmark checked={Boolean(entry.youtube?.trim())} />
                    </Label>
                    <InputField
                      placeholder="https://youtube.com/@channel"
                      value={entry.youtube || ""}
                      onChange={(e) => handleUpdateNewAuthor(entry.id, { youtube: e.target.value })}
                      disabled={disabled}
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Blog */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                      <GlobeIcon className="text-muted-foreground size-3.5" />
                      <span>Blog URL</span>
                      <FieldCheckmark
                        checked={Boolean(entry.blog?.trim() && isValidHttpUrl(entry.blog.trim()))}
                      />
                    </Label>
                    <InputField
                      placeholder="https://example.com/blog"
                      value={entry.blog || ""}
                      onChange={(e) => handleUpdateNewAuthor(entry.id, { blog: e.target.value })}
                      disabled={disabled}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
