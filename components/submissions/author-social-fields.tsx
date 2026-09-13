"use client";

import {
  CaretDownIcon,
  CaretUpIcon,
  GlobeIcon,
  InfoIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { AuthorCombobox, AuthorOption, fetchAuthorList } from "@/components/submissions/author-combobox";
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
  onRequestCreateAuthor?: (
    authorName: string,
    initialData?: Partial<SuggestedAuthorData>,
  ) => void;
  onSelectAuthorOption?: (author: AuthorOption) => void;
  suggestedAuthor?: SuggestedAuthorData | null;
  values: AuthorSocialValues;
}

interface AuthorEntry {
  blog: string;
  github: string;
  id: string;
  isExpanded?: boolean;
  linkedin: string;
  mode: "catalog" | "new";
  name: string;
  twitter: string;
  website: string;
  youtube: string;
}

export function AuthorSocialFields({
  allowCustom = false,
  className,
  defaultExpanded = false,
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

  useEffect(() => {
    let mounted = true;
    fetchAuthorList().then((list) => {
      if (mounted) setExistingAuthors(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize author sections from values.author
  const parseInitialAuthors = (): AuthorEntry[] => {
    const rawNames = (values.author || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawNames.length === 0) {
      return [
        {
          id: "author-1",
          blog: values.authorBlog || "",
          github: values.authorGitHub || "",
          isExpanded: defaultExpanded,
          linkedin: values.authorLinkedIn || "",
          mode: "catalog",
          name: "",
          twitter: values.authorTwitter || "",
          website: values.authorWebsite || "",
          youtube: values.authorYouTube || "",
        },
      ];
    }

    return rawNames.map((name, index) => {
      const clean = name.toLowerCase();
      const match = existingAuthors.find(
        (a) => a.name.toLowerCase() === clean || a.slug.toLowerCase() === clean,
      );

      return {
        id: `author-${index + 1}-${name}`,
        blog: match?.links?.blog || (index === 0 ? values.authorBlog || "" : ""),
        github: match?.links?.github || (index === 0 ? values.authorGitHub || "" : ""),
        isExpanded: defaultExpanded,
        linkedin: match?.links?.linkedin || (index === 0 ? values.authorLinkedIn || "" : ""),
        mode: match ? ("catalog" as const) : ("new" as const),
        name,
        twitter: match?.links?.twitter || (index === 0 ? values.authorTwitter || "" : ""),
        website: match?.links?.website || (index === 0 ? values.authorWebsite || "" : ""),
        youtube: match?.links?.youtube || (index === 0 ? values.authorYouTube || "" : ""),
      };
    });
  };

  const [authors, setAuthors] = useState<AuthorEntry[]>(parseInitialAuthors);

  // Sync state if values.author changes externally
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const rawNames = (values.author || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const currentNames = authors
      .map((a) => a.name.trim())
      .filter(Boolean);

    const isDifferent =
      rawNames.length !== currentNames.length ||
      rawNames.some((n, i) => n.toLowerCase() !== currentNames[i]?.toLowerCase());

    if (isDifferent) {
      setAuthors(parseInitialAuthors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingAuthors, values.author]);

  const syncToParent = (updatedAuthors: AuthorEntry[]) => {
    isInternalUpdate.current = true;
    const combinedNames = updatedAuthors
      .map((a) => a.name.trim())
      .filter(Boolean)
      .join(", ");

    const primaryAuthor =
      updatedAuthors.find(
        (a) => Boolean(a.blog || a.github || a.linkedin || a.twitter || a.website || a.youtube),
      ) || updatedAuthors[0];

    const updates: Partial<AuthorSocialValues> = {
      author: combinedNames,
      authorBlog: primaryAuthor?.blog || "",
      authorGitHub: primaryAuthor?.github || "",
      authorLinkedIn: primaryAuthor?.linkedin || "",
      authorTwitter: primaryAuthor?.twitter || "",
      authorWebsite: primaryAuthor?.website || "",
      authorYouTube: primaryAuthor?.youtube || "",
    };

    if (onBatchChange) {
      onBatchChange(updates);
    } else {
      onChange("author", combinedNames);
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

  const handleAddAuthor = () => {
    const newEntry: AuthorEntry = {
      id: `author-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      blog: "",
      github: "",
      isExpanded: true,
      linkedin: "",
      mode: "new",
      name: "",
      twitter: "",
      website: "",
      youtube: "",
    };
    const next = [...authors, newEntry];
    setAuthors(next);
    syncToParent(next);
  };

  const handleRemoveAuthor = (id: string) => {
    if (authors.length <= 1) {
      const resetEntry: AuthorEntry = {
        id: "author-1",
        blog: "",
        github: "",
        isExpanded: false,
        linkedin: "",
        mode: "catalog",
        name: "",
        twitter: "",
        website: "",
        youtube: "",
      };
      setAuthors([resetEntry]);
      syncToParent([resetEntry]);
      return;
    }
    const next = authors.filter((a) => a.id !== id);
    setAuthors(next);
    syncToParent(next);
  };

  const handleUpdateAuthor = (id: string, updates: Partial<AuthorEntry>) => {
    const next = authors.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setAuthors(next);
    syncToParent(next);
  };

  const handleSwitchMode = (id: string, newMode: "catalog" | "new") => {
    const next = authors.map((a) => {
      if (a.id === id) {
        if (newMode === "catalog") {
          const clean = a.name.trim().toLowerCase();
          const match = existingAuthors.find(
            (ex) => ex.name.toLowerCase() === clean || ex.slug.toLowerCase() === clean,
          );
          if (match) {
            return {
              ...a,
              blog: match.links?.blog || "",
              github: match.links?.github || "",
              linkedin: match.links?.linkedin || "",
              mode: "catalog" as const,
              name: match.name,
              twitter: match.links?.twitter || "",
              website: match.links?.website || "",
              youtube: match.links?.youtube || "",
            };
          }
          return {
            ...a,
            blog: "",
            github: "",
            linkedin: "",
            mode: "catalog" as const,
            name: "",
            twitter: "",
            website: "",
            youtube: "",
          };
        }
        return {
          ...a,
          mode: "new" as const,
        };
      }
      return a;
    });
    setAuthors(next);
    syncToParent(next);
  };

  const handleSelectCatalogAuthor = (id: string, selected: AuthorOption) => {
    const next = authors.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          blog: selected.links?.blog || a.blog || "",
          github: selected.links?.github || a.github || "",
          linkedin: selected.links?.linkedin || a.linkedin || "",
          mode: "catalog" as const,
          name: selected.name,
          twitter: selected.links?.twitter || a.twitter || "",
          website: selected.links?.website || a.website || "",
          youtube: selected.links?.youtube || a.youtube || "",
        };
      }
      return a;
    });
    setAuthors(next);
    syncToParent(next);
    onSelectAuthorOption?.(selected);
  };

  const hasSuggestion =
    Boolean(suggestedAuthor?.name?.trim()) &&
    !authors.some(
      (a) => a.name.trim().toLowerCase() === suggestedAuthor?.name?.trim().toLowerCase(),
    );

  const handleAcceptSuggestion = (suggested: SuggestedAuthorData) => {
    onAcceptSuggestedAuthor?.(suggested);
    const clean = suggested.name.trim().toLowerCase();
    const isMatch = existingAuthors.find(
      (a) => a.name.toLowerCase() === clean || a.slug.toLowerCase() === clean,
    );

    // If the only author has an empty name, replace it
    if (authors.length === 1 && !authors[0]?.name.trim()) {
      const updated: AuthorEntry = {
        id: authors[0]!.id,
        blog: suggested.blog || "",
        github: suggested.github || "",
        isExpanded: true,
        linkedin: suggested.linkedin || "",
        mode: isMatch ? "catalog" : "new",
        name: suggested.name,
        twitter: suggested.twitter || "",
        website: suggested.website || "",
        youtube: suggested.youtube || "",
      };
      setAuthors([updated]);
      syncToParent([updated]);
    } else {
      // Append as an additional author
      const newEntry: AuthorEntry = {
        id: `author-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        blog: suggested.blog || "",
        github: suggested.github || "",
        isExpanded: true,
        linkedin: suggested.linkedin || "",
        mode: isMatch ? "catalog" : "new",
        name: suggested.name,
        twitter: suggested.twitter || "",
        website: suggested.website || "",
        youtube: suggested.youtube || "",
      };
      const next = [...authors, newEntry];
      setAuthors(next);
      syncToParent(next);
    }
  };

  const hasAnyAuthor = authors.some((a) => Boolean(a.name.trim()));

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

        {onRequestCreateAuthor && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const first = authors[0];
              onRequestCreateAuthor(
                first?.name || "",
                first
                  ? {
                      blog: first.blog,
                      github: first.github,
                      linkedin: first.linkedin,
                      name: first.name,
                      twitter: first.twitter,
                      website: first.website,
                      youtube: first.youtube,
                    }
                  : undefined,
              );
            }}
            disabled={disabled}
            className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[11px] font-bold uppercase"
          >
            <PlusIcon className="size-3" weight="bold" />
            <span>New Author to DB</span>
          </Button>
        )}
      </div>

      {/* Author Section Cards List */}
      <div className="space-y-3.5">
        {authors.map((entry, index) => {
          const isCatalog = entry.mode === "catalog";
          const isKnownInCatalog = existingAuthors.some(
            (a) =>
              a.name.toLowerCase() === entry.name.trim().toLowerCase() ||
              a.slug.toLowerCase() === entry.name.trim().toLowerCase(),
          );

          const filledLinksCount = [
            entry.blog,
            entry.github,
            entry.linkedin,
            entry.twitter,
            entry.website,
            entry.youtube,
          ].filter((v) => Boolean(v?.trim())).length;

          const showLinksSection =
            entry.isExpanded || filledLinksCount > 0 || Boolean(entry.name.trim());

          return (
            <div
              key={entry.id}
              className="border-line/70 bg-paper/30 space-y-3 rounded-lg border-[1.5px] p-4 transition-all duration-200"
            >
              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-bold uppercase">
                    Creator {authors.length > 1 ? `#${index + 1}` : ""}
                  </span>

                  {isCatalog && isKnownInCatalog && (
                    <span className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold">
                      In Catalog
                    </span>
                  )}

                  {!isCatalog && Boolean(entry.name.trim()) && (
                    <span className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold">
                      New Author (Submission)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isCatalog ? (
                    <>
                      {onRequestCreateAuthor && Boolean(entry.name.trim()) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onRequestCreateAuthor(entry.name, {
                              blog: entry.blog,
                              github: entry.github,
                              linkedin: entry.linkedin,
                              name: entry.name,
                              twitter: entry.twitter,
                              website: entry.website,
                              youtube: entry.youtube,
                            })
                          }
                          disabled={disabled}
                          className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                          title="Save this author to catalog database"
                        >
                          <PlusIcon className="size-3" weight="bold" />
                          <span>Create in DB</span>
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSwitchMode(entry.id, "catalog")}
                        className="text-primary hover:text-primary/80 font-mono text-[11px] font-bold underline underline-offset-2 transition-colors"
                      >
                        ← Search catalog
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSwitchMode(entry.id, "new")}
                      className="text-primary hover:text-primary/80 font-mono text-[11px] font-bold underline underline-offset-2 transition-colors"
                    >
                      + Enter new creator
                    </button>
                  )}

                  {authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAuthor(entry.id)}
                      disabled={disabled}
                      className="text-muted-foreground hover:text-destructive flex size-6 items-center justify-center rounded p-0.5 transition-colors"
                      title="Remove this author"
                      aria-label="Remove author"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Author Selector / Input Field */}
              {isCatalog ? (
                <div className="min-h-9">
                  <AuthorCombobox
                    placeholder="Search existing creators in catalog..."
                    value={entry.name}
                    onChange={(val) => handleUpdateAuthor(entry.id, { name: val })}
                    onSelectAuthor={(opt) => handleSelectCatalogAuthor(entry.id, opt)}
                    onRequestCreateAuthor={onRequestCreateAuthor}
                    allowCustom={allowCustom}
                    disabled={disabled}
                    maxAuthors={1}
                    className="font-mono text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="h-9">
                    <InputField
                      placeholder="Enter creator or organization name..."
                      value={entry.name}
                      onChange={(e) => handleUpdateAuthor(entry.id, { name: e.target.value })}
                      disabled={disabled}
                      className="font-mono text-xs"
                    />
                  </div>
                  <p className="text-muted-foreground text-[10px]">
                    New creator details will be submitted for admin verification without creating a
                    database record yet.
                  </p>
                </div>
              )}

              {/* Creator Profile Links Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateAuthor(entry.id, { isExpanded: !entry.isExpanded })
                  }
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase transition-colors"
                >
                  {showLinksSection ? (
                    <CaretUpIcon className="size-3.5" weight="bold" />
                  ) : (
                    <CaretDownIcon className="size-3.5" weight="bold" />
                  )}
                  <span>Creator Profile & Social Links (Optional)</span>
                  {filledLinksCount > 0 && (
                    <span className="border-primary/40 bg-primary/10 text-primary rounded px-1.5 py-0.2 text-[10px]">
                      {filledLinksCount} linked
                    </span>
                  )}
                </button>
              </div>

              {/* Creator Profile Links Grid */}
              {showLinksSection && (
                <div className="animate-in fade-in border-line/60 bg-background/50 space-y-3 rounded border p-3 duration-200">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Website / Portfolio */}
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
                        onChange={(e) => handleUpdateAuthor(entry.id, { website: e.target.value })}
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
                        onChange={(e) => handleUpdateAuthor(entry.id, { github: e.target.value })}
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
                        onChange={(e) => handleUpdateAuthor(entry.id, { twitter: e.target.value })}
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
                        onChange={(e) => handleUpdateAuthor(entry.id, { linkedin: e.target.value })}
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
                        onChange={(e) => handleUpdateAuthor(entry.id, { youtube: e.target.value })}
                        disabled={disabled}
                        className="font-mono text-xs"
                      />
                    </div>

                    {/* Blog / Publication */}
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
                        onChange={(e) => handleUpdateAuthor(entry.id, { blog: e.target.value })}
                        disabled={disabled}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Author Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddAuthor}
          disabled={disabled}
          className="border-primary/40 text-primary hover:bg-primary/10 h-8 gap-1.5 font-mono text-xs font-bold uppercase"
        >
          <PlusIcon weight="bold" className="size-3.5" />
          <span>Add Co-Author / Another Author</span>
        </Button>

        <span className="text-muted-foreground text-[11px]">
          {authors.filter((a) => Boolean(a.name.trim())).length} author(s) attributed
        </span>
      </div>
    </div>
  );
}

