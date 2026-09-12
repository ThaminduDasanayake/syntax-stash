"use client";

import { CheckIcon, GlobeIcon, XLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
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
import { isValidHttpUrl, slugifyAuthor } from "@/lib/utils";

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
  initialName?: string;
  onCreated?: (newAuthor: AdminAuthorItem) => void;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (updatedAuthor: AdminAuthorItem) => void;
  open: boolean;
}

export function AdminAuthorDialog({
  author,
  existingAuthors,
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

  const authorPool = (existingAuthors && existingAuthors.length > 0
    ? existingAuthors
    : loadedAuthors) as Array<{
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
      if (author) {
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
        const nameVal = initialName.trim();
        setFormData({
          blog: "",
          github: "",
          linkedin: "",
          name: nameVal,
          slug: nameVal ? slugifyAuthor(nameVal) : "",
          twitter: "",
          website: "",
          youtube: "",
        });
        setAutoSlug(true);
      }
    }
  }, [author, initialName, open]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper max-h-[90vh] min-w-2xl overflow-y-auto font-mono text-xs">
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {/* Row 1: Name and Slug Side-by-Side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Author / Creator Name</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={Boolean(formData.name.trim())} />
              </Label>
              <InputField
                placeholder="e.g. Vercel or Lee Robinson"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>Slug</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={Boolean(formData.slug.trim())} />
                </Label>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-primary text-[10px] hover:underline"
                  >
                    {autoSlug ? "Manual Slug" : "Auto Slug"}
                  </button>
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
                className="font-mono text-xs"
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
          <div className="border-line/60 space-y-3.5 border-t pt-3">
            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                <GlobeIcon className="text-muted-foreground size-4" />
                <span>Website / Portfolio URL</span>
                <FieldCheckmark
                  checked={Boolean(
                    formData.website.trim() &&
                      (formData.website.trim().startsWith("/") ||
                        isValidHttpUrl(formData.website.trim())),
                  )}
                />
              </Label>
              <InputField
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                <Image src="/github.svg" alt="GitHub" width={16} height={16} />
                <span>GitHub (Username or URL)</span>
                <FieldCheckmark checked={Boolean(formData.github.trim())} />
              </Label>
              <InputField
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                <XLogoIcon weight="bold" className="text-muted-foreground size-4" />
                <span>Twitter / X (@username or URL)</span>
                <FieldCheckmark checked={Boolean(formData.twitter.trim())} />
              </Label>
              <InputField
                placeholder="@username or https://x.com/..."
                value={formData.twitter}
                onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                <Image src="/linkedin.svg" alt="LinkedIn" width={16} height={16} />
                <span>LinkedIn (Username or URL)</span>
                <FieldCheckmark checked={Boolean(formData.linkedin.trim())} />
              </Label>
              <InputField
                placeholder="username or https://linkedin.com/in/..."
                value={formData.linkedin}
                onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                <Image src="/youtube.svg" alt="YouTube" width={16} height={16} />
                <span>YouTube Channel URL</span>
                <FieldCheckmark checked={Boolean(formData.youtube.trim())} />
              </Label>
              <InputField
                placeholder="https://youtube.com/@channel"
                value={formData.youtube}
                onChange={(e) => setFormData((prev) => ({ ...prev, youtube: e.target.value }))}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                <GlobeIcon className="text-muted-foreground size-4" />
                <span>Blog URL</span>
                <FieldCheckmark
                  checked={Boolean(
                    formData.blog.trim() &&
                      (formData.blog.trim().startsWith("/") ||
                        isValidHttpUrl(formData.blog.trim())),
                  )}
                />
              </Label>
              <InputField
                placeholder="https://example.com/blog"
                value={formData.blog}
                onChange={(e) => setFormData((prev) => ({ ...prev, blog: e.target.value }))}
                className="font-mono text-xs"
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
