"use client";

import {
  CheckIcon,
  GithubLogoIcon,
  GlobeIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AuthorOption,
  fetchAuthorList,
  invalidateAuthorCache,
  registerNewAuthorLocally,
} from "@/components/submissions/author-combobox";
import { DuplicateNotice } from "@/components/submissions/duplicate-url-notice";
import { FieldCheckmark } from "@/components/submissions/field-checkmark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { cn, isValidHttpUrl, slugifyAuthor } from "@/lib/utils";

import { AdminAuthorItem } from "./admin-authors-client";
import {
  AdminConfirmEditDialog,
  computeFieldChanges,
  FieldDiff,
} from "./admin-confirm-edit-dialog";

const AUTHOR_FIELD_LABELS: Record<string, string> = {
  blog: "Blog URL",
  github: "GitHub URL",
  linkedin: "LinkedIn Profile",
  name: "Author Name",
  slug: "Author Slug",
  twitter: "Twitter / X Profile",
  website: "Website / Portfolio URL",
  youtube: "YouTube Channel",
};

export interface AdminAuthorDialogProps {
  author?: AdminAuthorItem | Partial<AdminAuthorItem> | null;
  existingAuthors?: Array<{ id?: string; name: string; slug: string }>;
  initialData?:
    | Partial<AdminAuthorItem>
    | {
        blog?: string | null;
        github?: string | null;
        linkedin?: string | null;
        name?: string | null;
        slug?: string | null;
        twitter?: string | null;
        website?: string | null;
        youtube?: string | null;
      }
    | null;
  initialName?: string;
  onCreated?: (newAuthor: AdminAuthorItem) => void;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (updatedAuthor: AdminAuthorItem) => void;
  open: boolean;
}

export function AdminAuthorDialog({
  author,
  existingAuthors,
  initialData,
  initialName = "",
  onCreated,
  onOpenChange,
  onUpdated,
  open,
}: AdminAuthorDialogProps) {
  const isEdit = Boolean(author?.id);

  const [formData, setFormData] = useState({
    blog: "",
    github: "",
    linkedin: "",
    name: "",
    slug: "",
    twitter: "",
    website: "",
    youtube: "",
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);
  const [loadedAuthors, setLoadedAuthors] = useState<AuthorOption[]>([]);

  useEffect(() => {
    if (open && (!existingAuthors || existingAuthors.length === 0)) {
      fetchAuthorList().then((list) => {
        setLoadedAuthors(list);
      });
    }
  }, [existingAuthors, open]);

  const authorPool = (
    existingAuthors && existingAuthors.length > 0 ? existingAuthors : loadedAuthors
  ) as Array<{
    id?: string;
    name: string;
    slug: string;
  }>;

  const duplicateAuthor = useMemo(() => {
    const rawName = formData.name.trim();
    const rawSlug = formData.slug.trim();
    if (!rawName && !rawSlug) return null;
    const targetSlug = rawSlug ? slugifyAuthor(rawSlug) : slugifyAuthor(rawName);
    const targetLower = rawName.toLowerCase();
    return (
      authorPool.find(
        (a) =>
          a.id !== author?.id &&
          (a.slug === targetSlug || (targetLower && a.name.toLowerCase() === targetLower)),
      ) || null
    );
  }, [author?.id, authorPool, formData.name, formData.slug]);

  useEffect(() => {
    if (open) {
      if (author && author.id) {
        setFormData({
          blog: author.blog || "",
          github: author.github || "",
          linkedin: author.linkedin || "",
          name: author.name || "",
          slug: author.slug || (author.name ? slugifyAuthor(author.name) : ""),
          twitter: author.twitter || "",
          website: author.website || "",
          youtube: author.youtube || "",
        });
        setAutoSlug(!author.slug);
      } else {
        const nameVal = (initialData?.name || initialName || "").trim();
        const slugVal = (initialData?.slug || (nameVal ? slugifyAuthor(nameVal) : "")).trim();
        setFormData({
          blog: initialData?.blog || "",
          github: initialData?.github || "",
          linkedin: initialData?.linkedin || "",
          name: nameVal,
          slug: slugVal,
          twitter: initialData?.twitter || "",
          website: initialData?.website || "",
          youtube: initialData?.youtube || "",
        });
        setAutoSlug(!initialData?.slug);
      }
    } else {
      setFormData({
        blog: "",
        github: "",
        linkedin: "",
        name: "",
        slug: "",
        twitter: "",
        website: "",
        youtube: "",
      });
      setAutoSlug(true);
      setIsConfirmOpen(false);
      setPendingChanges([]);
    }
  }, [author, initialData, initialName, open]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: autoSlug ? slugifyAuthor(val) : prev.slug,
    }));
  };

  const executeSave = async () => {
    try {
      setIsWorking(true);
      if (isEdit && author?.id) {
        // PATCH
        const res = await fetch("/api/admin/authors", {
          body: JSON.stringify({
            id: author.id,
            blog: formData.blog,
            github: formData.github,
            linkedin: formData.linkedin,
            name: formData.name,
            slug: formData.slug,
            twitter: formData.twitter,
            website: formData.website,
            youtube: formData.youtube,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          const updatedItem: AdminAuthorItem = {
            ...author,
            id: author.id,
            blog: formData.blog.trim() || null,
            github: formData.github.trim() || null,
            linkedin: formData.linkedin.trim() || null,
            name: formData.name.trim(),
            resourceCount: author.resourceCount ?? 0,
            slug: formData.slug.trim(),
            twitter: formData.twitter.trim() || null,
            updatedAt: new Date().toISOString(),
            website: formData.website.trim() || null,
            youtube: formData.youtube.trim() || null,
          };
          toast.success(`"${formData.name}" updated successfully.`);
          invalidateAuthorCache();
          onUpdated?.(updatedItem);
          setIsConfirmOpen(false);
          onOpenChange(false);
        } else {
          toast.error(data.error || "Failed to update author.");
        }
      } else {
        // POST
        const res = await fetch("/api/admin/authors", {
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const data = await res.json();

        if (res.ok && data.success && data.author) {
          toast.success(`"${formData.name}" created successfully.`);
          registerNewAuthorLocally(data.author);
          setFormData({
            blog: "",
            github: "",
            linkedin: "",
            name: "",
            slug: "",
            twitter: "",
            website: "",
            youtube: "",
          });
          setAutoSlug(true);
          onCreated?.(data.author);
          onOpenChange(false);
        } else {
          toast.error(data.error || "Failed to create author.");
        }
      }
    } catch {
      toast.error("Network error while saving author.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Author name is required.");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Author slug is required.");
      return;
    }

    if (duplicateAuthor) {
      toast.error(`Author "${duplicateAuthor.name}" already exists.`);
      return;
    }

    if (isEdit && author) {
      const diffs = computeFieldChanges(author, formData, AUTHOR_FIELD_LABELS);
      setPendingChanges(diffs);
      setIsConfirmOpen(true);
    } else {
      await executeSave();
    }
  };

  const isNameFilled = Boolean(formData.name.trim());
  const isSlugFilled = Boolean(formData.slug.trim());
  const isWebsiteFilled = Boolean(
    formData.website.trim() &&
    (formData.website.trim().startsWith("/") || isValidHttpUrl(formData.website.trim())),
  );
  const isGithubFilled = Boolean(formData.github.trim());
  const isTwitterFilled = Boolean(formData.twitter.trim());
  const isLinkedinFilled = Boolean(formData.linkedin.trim());
  const isYoutubeFilled = Boolean(formData.youtube.trim());
  const isBlogFilled = Boolean(
    formData.blog.trim() &&
    (formData.blog.trim().startsWith("/") || isValidHttpUrl(formData.blog.trim())),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper max-h-[90vh] overflow-y-auto font-mono text-xs sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-base font-bold uppercase">
            {isEdit ? `Edit Author: ${author?.name || formData.name}` : "Create New Author"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            {isEdit
              ? "Update author name, slug, website, and linked social profiles."
              : "Add a new creator to the Syntax Stash directory before linking them to a tool."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4 pt-2 text-xs">
          {/* Row 1: Name and Slug Side-by-Side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-colors",
                  isNameFilled
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <span>Author / Creator Name</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={isNameFilled} />
              </Label>
              <InputField
                placeholder="e.g. Vercel or Lee Robinson"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className={cn(
                  "font-mono text-xs transition-colors",
                  isNameFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <div className="flex items-center justify-between">
                <Label
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-colors",
                    isSlugFilled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground group-focus-within:text-primary",
                  )}
                >
                  <span>Slug</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={isSlugFilled} />
                </Label>
                {!isEdit && (
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-primary h-auto p-0 font-mono text-[10px] hover:underline"
                  >
                    {autoSlug ? "Manual Slug" : "Auto Slug"}
                  </Button>
                )}
              </div>
              <InputField
                placeholder="e.g. vercel"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                required
                className={cn(
                  "font-mono text-xs transition-colors",
                  isSlugFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>
          </div>

          {duplicateAuthor && (
            <DuplicateNotice
              type="author"
              title="This author is already added!"
              description={
                <>
                  Already listed as{" "}
                  <strong className="font-bold underline">{duplicateAuthor.name}</strong> (
                  <code>/{duplicateAuthor.slug}</code>).
                </>
              }
            />
          )}

          {/* URLs Sequentially One After the Other with Icons in Labels */}
          <div className="border-line/60 border-t-[1.5px] pt-3">
            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                  isWebsiteFilled
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <GlobeIcon
                  weight="bold"
                  className={cn(
                    "size-4 transition-colors",
                    isWebsiteFilled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground group-focus-within:text-primary",
                  )}
                />
                <span>Website / Portfolio URL</span>
                <FieldCheckmark checked={isWebsiteFilled} />
              </Label>
              <InputField
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className={cn(
                  "font-mono text-xs transition-colors",
                  isWebsiteFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                  isGithubFilled
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <GithubLogoIcon
                  weight="bold"
                  className={cn(
                    "size-4 transition-colors",
                    isGithubFilled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground group-focus-within:text-primary",
                  )}
                />
                <span>GitHub (Username or URL)</span>
                <FieldCheckmark checked={isGithubFilled} />
              </Label>
              <InputField
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                className={cn(
                  "font-mono text-xs transition-colors",
                  isGithubFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                  isTwitterFilled
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <XLogoIcon
                  weight="bold"
                  className={cn(
                    "size-4 transition-colors",
                    isTwitterFilled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground group-focus-within:text-primary",
                  )}
                />
                <span>Twitter / X (@username or URL)</span>
                <FieldCheckmark checked={isTwitterFilled} />
              </Label>
              <InputField
                placeholder="@username or https://x.com/..."
                value={formData.twitter}
                onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
                className={cn(
                  "font-mono text-xs transition-colors",
                  isTwitterFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                  isLinkedinFilled
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <LinkedinLogoIcon
                  weight="bold"
                  className={cn(
                    "size-4 transition-colors",
                    isLinkedinFilled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground group-focus-within:text-primary",
                  )}
                />
                <span>LinkedIn (Username or URL)</span>
                <FieldCheckmark checked={isLinkedinFilled} />
              </Label>
              <InputField
                placeholder="username or https://linkedin.com/in/..."
                value={formData.linkedin}
                onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                className={cn(
                  "font-mono text-xs transition-colors",
                  isLinkedinFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                  isYoutubeFilled
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <YoutubeLogoIcon
                  weight="bold"
                  className={cn(
                    "size-4 transition-colors",
                    isYoutubeFilled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground group-focus-within:text-primary",
                  )}
                />
                <span>YouTube Channel URL</span>
                <FieldCheckmark checked={isYoutubeFilled} />
              </Label>
              <InputField
                placeholder="https://youtube.com/@channel"
                value={formData.youtube}
                onChange={(e) => setFormData((prev) => ({ ...prev, youtube: e.target.value }))}
                className={cn(
                  "font-mono text-xs transition-colors",
                  isYoutubeFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>

            <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -m-2 space-y-1.5 rounded p-2 transition-all duration-150 focus-within:ring-1">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                  isBlogFilled
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "text-foreground group-focus-within:text-primary",
                )}
              >
                <GlobeIcon
                  weight="bold"
                  className={cn(
                    "size-4 transition-colors",
                    isBlogFilled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground group-focus-within:text-primary",
                  )}
                />
                <span>Blog URL</span>
                <FieldCheckmark checked={isBlogFilled} />
              </Label>
              <InputField
                placeholder="https://example.com/blog"
                value={formData.blog}
                onChange={(e) => setFormData((prev) => ({ ...prev, blog: e.target.value }))}
                className={cn(
                  "font-mono text-xs transition-colors",
                  isBlogFilled &&
                    "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                )}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isWorking}
              className="font-mono text-xs uppercase"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isWorking}
              className="font-mono text-xs font-bold uppercase"
            >
              {isWorking ? (
                "Saving..."
              ) : isEdit ? (
                "Save Changes"
              ) : (
                <span className="flex items-center gap-1">
                  <CheckIcon weight="bold" className="size-3.5" />
                  <span>Create Author</span>
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Confirmation Dialog for Edits */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Author Updates"
        description="Review the list of changed author properties before saving changes to this creator profile."
        itemTitle={formData.name || (typeof author?.name === "string" ? author.name : "")}
        changes={pendingChanges}
        onConfirm={executeSave}
        isWorking={isWorking}
      />
    </Dialog>
  );
}
