"use client";

import { ArticleIcon, GlobeIcon, XLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  computeFieldChanges,
  ConfirmEditDialog,
  FieldDiff,
} from "@/components/admin/shared/confirm-edit-dialog";
import { AuthorItem } from "@/components/admin/shared/types";
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
  DialogFormActions,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LabelInput } from "@/components/ui/label-input";
import { isValidHttpUrl, slugifyAuthor } from "@/lib/utils";

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

export interface AuthorDialogProps {
  author?: AuthorItem | Partial<AuthorItem> | null;
  existingAuthors?: Array<{ id?: string; name: string; slug: string }>;
  initialData?:
    | Partial<AuthorItem>
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
  onCreated?: (newAuthor: AuthorItem) => void;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (updatedAuthor: AuthorItem) => void;
  open: boolean;
}

function AuthorDialogInner({
  author,
  existingAuthors,
  initialData,
  initialName = "",
  onCreated,
  onOpenChange,
  onUpdated,
}: Omit<AuthorDialogProps, "open">) {
  const isEdit = Boolean(author?.id);

  const initialNameVal = (author?.name || initialData?.name || initialName || "").trim();
  const initialSlugVal = (
    author?.slug ||
    initialData?.slug ||
    (initialNameVal ? slugifyAuthor(initialNameVal) : "")
  ).trim();

  const [formData, setFormData] = useState({
    blog: author?.blog || initialData?.blog || "",
    github: author?.github || initialData?.github || "",
    linkedin: author?.linkedin || initialData?.linkedin || "",
    name: initialNameVal,
    slug: initialSlugVal,
    twitter: author?.twitter || initialData?.twitter || "",
    website: author?.website || initialData?.website || "",
    youtube: author?.youtube || initialData?.youtube || "",
  });
  const [autoSlug, setAutoSlug] = useState(!author?.slug && !initialData?.slug);
  const [isWorking, setIsWorking] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);
  const [loadedAuthors, setLoadedAuthors] = useState<AuthorOption[]>([]);

  useEffect(() => {
    if (!existingAuthors || existingAuthors.length === 0) {
      fetchAuthorList().then((list) => {
        setLoadedAuthors(list);
      });
    }
  }, [existingAuthors]);

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

  const handleNameChange = (val: string) => {
    const isCleared = val.trim() === "";
    if (isCleared) {
      setAutoSlug(true);
    }
    const shouldAutoSlug = autoSlug || isCleared;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: shouldAutoSlug ? slugifyAuthor(val) : prev.slug,
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
          const updatedItem: AuthorItem = {
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
          return;
        } else {
          toast.error(data.error || "Failed to update author.");
          setIsWorking(false);
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
          setAutoSlug(true);
          onCreated?.(data.author);
          onOpenChange(false);
          return;
        } else {
          toast.error(data.error || "Failed to create author.");
          setIsWorking(false);
        }
      }
    } catch {
      toast.error("Network error while saving author.");
      setIsWorking(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

    // Validate social links if provided
    if (formData.website && !isValidHttpUrl(formData.website)) {
      toast.error("Website must be a valid URL starting with http:// or https://");
      return;
    }
    if (formData.blog && !isValidHttpUrl(formData.blog)) {
      toast.error("Blog must be a valid URL starting with http:// or https://");
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
  const isWebsiteFilled = Boolean(formData.website.trim());
  const isTwitterFilled = Boolean(formData.twitter.trim());
  const isGithubFilled = Boolean(formData.github.trim());
  const isLinkedinFilled = Boolean(formData.linkedin.trim());
  const isYoutubeFilled = Boolean(formData.youtube.trim());
  const isBlogFilled = Boolean(formData.blog.trim());

  const hasChanges = isEdit
    ? computeFieldChanges(author, formData, AUTHOR_FIELD_LABELS).length > 0
    : true;

  return (
    <>
      <DialogContent className="border-border/60 bg-paper/95 text-popover-foreground flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden rounded-[28px] p-0 font-mono text-xs shadow-2xl backdrop-blur-xl sm:max-w-2xl">
        <div className="border-line/60 shrink-0 border-b-[1.5px] p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold uppercase">
              {isEdit ? `Edit Creator: ${author?.name || formData.name}` : "Create New Author"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              {isEdit
                ? "Update creator profile, social links, and author slug."
                : "Add a verified creator profile with social handles and personal website."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-6 text-xs">
            {/* Row 1: Author Name and Slug in 2-column grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Author Name */}
              <LabelInput
                label="Author Name"
                placeholder="e.g. Lee Robinson or Vercel"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                suffix={<FieldCheckmark checked={isNameFilled} />}
              />

              {/* Author Slug Identifier */}
              <LabelInput
                label="Slug Identifier"
                placeholder="e.g. lee-robinson"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                required
                suffix={
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        const nextAuto = !autoSlug;
                        setAutoSlug(nextAuto);
                        if (nextAuto && formData.name) {
                          setFormData((prev) => ({ ...prev, slug: slugifyAuthor(prev.name) }));
                        }
                      }}
                      className="text-primary hover:bg-primary/10 h-6 rounded-full px-2 font-mono text-[10px] font-bold uppercase transition-colors"
                    >
                      {autoSlug ? "Manual" : "Auto"}
                    </Button>
                    <FieldCheckmark checked={isSlugFilled} />
                  </div>
                }
              />
            </div>

            {duplicateAuthor && (
              <DuplicateNotice
                type="author"
                title="This author profile already exists!"
                description={
                  <>
                    Already registered as{" "}
                    <strong className="font-bold underline">{duplicateAuthor.name}</strong> (
                    <code>/authors/{duplicateAuthor.slug}</code>).
                  </>
                }
              />
            )}

            {/* Section 2: Social Profiles & Links (2-column responsive grid) */}
            <div className="border-line/60 border-t-[1.5px] pt-4">
              <span className="text-muted-foreground mb-3 block px-1 text-[10px] font-bold tracking-wider uppercase">
                Social Profiles & Links (Optional)
              </span>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Website / Portfolio */}
                <LabelInput
                  label="Website / Portfolio"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  prefix={<GlobeIcon weight="bold" className="size-4 text-zinc-400" />}
                  suffix={<FieldCheckmark checked={isWebsiteFilled} />}
                />

                {/* GitHub */}
                <LabelInput
                  label="GitHub"
                  placeholder="username or https://github.com/..."
                  value={formData.github}
                  onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                  prefix={
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={16}
                      height={16}
                      className="opacity-70 dark:invert"
                    />
                  }
                  suffix={<FieldCheckmark checked={isGithubFilled} />}
                />

                {/* Twitter / X */}
                <LabelInput
                  label="Twitter / X"
                  placeholder="@handle or https://x.com/..."
                  value={formData.twitter}
                  onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
                  prefix={<XLogoIcon weight="bold" className="size-4 text-zinc-400" />}
                  suffix={<FieldCheckmark checked={isTwitterFilled} />}
                />

                {/* LinkedIn */}
                <LabelInput
                  label="LinkedIn"
                  placeholder="username or https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                  prefix={
                    <Image
                      src="/linkedin.svg"
                      alt="LinkedIn"
                      width={16}
                      height={16}
                      className="opacity-70"
                    />
                  }
                  suffix={<FieldCheckmark checked={isLinkedinFilled} />}
                />

                {/* YouTube */}
                <LabelInput
                  label="YouTube Channel"
                  placeholder="https://youtube.com/@channel"
                  value={formData.youtube}
                  onChange={(e) => setFormData((prev) => ({ ...prev, youtube: e.target.value }))}
                  prefix={
                    <Image
                      src="/youtube.svg"
                      alt="YouTube"
                      width={16}
                      height={16}
                      className="opacity-70"
                    />
                  }
                  suffix={<FieldCheckmark checked={isYoutubeFilled} />}
                />

                {/* Blog */}
                <LabelInput
                  label="Blog URL"
                  placeholder="https://example.com/blog"
                  value={formData.blog}
                  onChange={(e) => setFormData((prev) => ({ ...prev, blog: e.target.value }))}
                  prefix={<ArticleIcon weight="bold" className="size-4 text-zinc-400" />}
                  suffix={<FieldCheckmark checked={isBlogFilled} />}
                />
              </div>
            </div>
          </div>

          <div className="border-line bg-surface/30 shrink-0 border-t-[1.5px] p-4 sm:px-6">
            <DialogFormActions
              onCancel={() => onOpenChange(false)}
              isWorking={isWorking}
              isEdit={isEdit}
              createLabel="Create Author"
              editLabel="Save Changes"
              disabled={
                !isNameFilled ||
                !isSlugFilled ||
                Boolean(duplicateAuthor) ||
                (isEdit && !hasChanges)
              }
            />
          </div>
        </form>
      </DialogContent>

      {/* Confirmation Dialog for Edits */}
      <ConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Author Updates"
        description="Review the list of changed author properties before saving changes to this creator profile."
        itemTitle={formData.name || (typeof author?.name === "string" ? author.name : "")}
        changes={pendingChanges}
        onConfirm={executeSave}
        isWorking={isWorking}
      />
    </>
  );
}

export function AuthorDialog(props: AuthorDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.open && (
        <AuthorDialogInner
          key={props.author?.id || props.initialName || "new"}
          author={props.author}
          existingAuthors={props.existingAuthors}
          initialData={props.initialData}
          initialName={props.initialName}
          onCreated={props.onCreated}
          onOpenChange={props.onOpenChange}
          onUpdated={props.onUpdated}
        />
      )}
    </Dialog>
  );
}
