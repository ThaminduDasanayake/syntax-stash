"use client";

import { ArticleIcon, GlobeIcon, XLogoIcon } from "@phosphor-icons/react";
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
  DialogFormActions,
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

function AdminAuthorDialogInner({
  author,
  existingAuthors,
  initialData,
  initialName = "",
  onCreated,
  onOpenChange,
  onUpdated,
}: Omit<AdminAuthorDialogProps, "open">) {
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
      <DialogContent className="border-line bg-paper flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 font-mono text-xs sm:max-w-2xl">
        <div className="border-line shrink-0 border-b-[1.5px] p-6 pb-4">
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
          <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs">
            {/* Author Name */}
            <div className="space-y-1.5">
              <Label
                className={cn(
                  "flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-colors",
                  isNameFilled ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                )}
              >
                <span>Creator / Author Name</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={isNameFilled} />
              </Label>
              <InputField
                placeholder="e.g. Lee Robinson or Vercel"
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

            {/* Author Slug Identifier */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-colors",
                    isSlugFilled ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                  )}
                >
                  <span>Slug Identifier</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={isSlugFilled} />
                </Label>
                {!isEdit && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-primary h-auto p-0 font-mono text-[10px] uppercase hover:underline"
                  >
                    {autoSlug ? "Manual Slug" : "Auto-Generate"}
                  </Button>
                )}
              </div>
              <InputField
                placeholder="e.g. lee-robinson"
                value={formData.slug}
                prefix="/authors/"
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

            {/* Section 2: Social Links Grid */}
            <div className="border-line/60 border-t pt-4">
              <span className="text-muted-foreground mb-3 block text-[10px] font-bold uppercase tracking-wider">
                Social Profiles & Links (Optional)
              </span>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -mx-2 space-y-1.5 rounded-md p-2 transition-all duration-150 focus-within:ring-1">
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
                          : "group-focus-within:text-primary",
                      )}
                    />
                    <span>Website / Portfolio</span>
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

                <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -mx-2 space-y-1.5 rounded-md p-2 transition-all duration-150 focus-within:ring-1">
                  <Label
                    className={cn(
                      "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                      isGithubFilled
                        ? "font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-foreground group-focus-within:text-primary",
                    )}
                  >
                    <Image
                      src="/github.svg"
                      alt="GitHub"
                      width={16}
                      height={16}
                      className="opacity-90"
                    />
                    <span>GitHub</span>
                    <FieldCheckmark checked={isGithubFilled} />
                  </Label>
                  <InputField
                    placeholder="username or https://github.com/..."
                    value={formData.github}
                    onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                    className={cn(
                      "font-mono text-xs transition-colors",
                      isGithubFilled &&
                        "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                    )}
                  />
                </div>

                <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -mx-2 space-y-1.5 rounded-md p-2 transition-all duration-150 focus-within:ring-1">
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
                          : "group-focus-within:text-primary",
                      )}
                    />
                    <span>Twitter / X</span>
                    <FieldCheckmark checked={isTwitterFilled} />
                  </Label>
                  <InputField
                    placeholder="@handle or https://x.com/..."
                    value={formData.twitter}
                    onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
                    className={cn(
                      "font-mono text-xs transition-colors",
                      isTwitterFilled &&
                        "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                    )}
                  />
                </div>

                <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -mx-2 space-y-1.5 rounded-md p-2 transition-all duration-150 focus-within:ring-1">
                  <Label
                    className={cn(
                      "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                      isLinkedinFilled
                        ? "font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-foreground group-focus-within:text-primary",
                    )}
                  >
                    <Image
                      src="/linkedin.svg"
                      alt="LinkedIn"
                      width={16}
                      height={16}
                      className="opacity-90"
                    />
                    <span>LinkedIn</span>
                    <FieldCheckmark checked={isLinkedinFilled} />
                  </Label>
                  <InputField
                    placeholder="username or https://linkedin.com/in/..."
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
                    }
                    className={cn(
                      "font-mono text-xs transition-colors",
                      isLinkedinFilled &&
                        "border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
                    )}
                  />
                </div>

                <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -mx-2 space-y-1.5 rounded-md p-2 transition-all duration-150 focus-within:ring-1">
                  <Label
                    className={cn(
                      "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                      isYoutubeFilled
                        ? "font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-foreground group-focus-within:text-primary",
                    )}
                  >
                    <Image
                      src="/youtube.svg"
                      alt="YouTube"
                      width={16}
                      height={16}
                      className="opacity-90"
                    />
                    <span>YouTube Channel</span>
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

                <div className="group focus-within:bg-primary/5 focus-within:ring-primary/30 -mx-2 space-y-1.5 rounded-md p-2 transition-all duration-150 focus-within:ring-1">
                  <Label
                    className={cn(
                      "flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors",
                      isBlogFilled
                        ? "font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-foreground group-focus-within:text-primary",
                    )}
                  >
                    <ArticleIcon
                      weight="bold"
                      className={cn(
                        "size-4 transition-colors",
                        isBlogFilled
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "group-focus-within:text-primary",
                      )}
                    />
                    <span>Blog</span>
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
                !isNameFilled || !isSlugFilled || Boolean(duplicateAuthor) || (isEdit && !hasChanges)
              }
            />
          </div>
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
    </>
  );
}

export function AdminAuthorDialog(props: AdminAuthorDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.open && (
        <AdminAuthorDialogInner
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
