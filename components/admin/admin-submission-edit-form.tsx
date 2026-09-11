"use client";

import {
  ArrowCounterClockwiseIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import {
  AuthorOption,
  AuthorSocialFields,
  AuthorSocialValues,
  DetectedFieldSuggestion,
  FieldCheckmark,
  MediaAssetFields,
  ResourceCardPreview,
  SuggestedAuthorData,
  TagPicker,
} from "@/components/submissions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { Submission } from "@/lib/db/schema";
import { cn, isValidHttpUrl } from "@/lib/utils";

import { AdminAuthorDialog } from "./admin-author-dialog";
import {
  AdminConfirmEditDialog,
  computeFieldChanges,
  FieldDiff,
} from "./admin-confirm-edit-dialog";
import { STATUS_CONFIG, STATUS_OPTIONS, SubmissionStatus } from "./types";

const SUBMISSION_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  adminNotes: "Internal Admin Notes",
  author: "Author / Creator",
  authorGitHub: "Author GitHub",
  authorLinkedIn: "Author LinkedIn",
  authorTwitter: "Author Twitter / X",
  authorWebsite: "Author Website",
  authorYouTube: "Author YouTube",
  category: "Category",
  description: "Description",
  favicon: "Favicon URL",
  github: "GitHub Repository",
  ogImage: "OpenGraph Image",
  status: "Moderation Status",
  subtitle: "Subtitle / Tagline",
  tags: "Canonical Tags",
  url: "Resource URL",
};

interface AdminSubmissionEditFormProps {
  isWorking: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onSave: (
    id: string,
    formData: Partial<Submission>,
    status?: "approved" | "rejected" | "pending",
  ) => void;
  submission: Submission;
}

export function AdminSubmissionEditForm({
  isWorking,
  onCancel,
  onDelete,
  onSave,
  submission: sub,
}: AdminSubmissionEditFormProps) {
  const { categoryOptions } = useCategories();
  const [editForm, setEditForm] = useState<Partial<Submission & { iconBg?: string }>>({
    title: sub.title,
    adminNotes: sub.adminNotes || "",
    author: sub.author || "",
    authorGitHub: sub.authorGitHub || "",
    authorLinkedIn: sub.authorLinkedIn || "",
    authorTwitter: sub.authorTwitter || "",
    authorWebsite: sub.authorWebsite || "",
    authorYouTube: sub.authorYouTube || "",
    category: sub.category,
    description: sub.description,
    favicon: sub.favicon || "",
    github: sub.github || "",
    iconBg: (sub as unknown as { iconBg?: string }).iconBg || "dark",
    notes: sub.notes || "",
    ogImage: sub.ogImage || "",
    pricing: sub.pricing || "Free",
    status: sub.status,
    subtitle: sub.subtitle || "",
    tags: sub.tags || "",
    url: sub.url,
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [faviconOptions, setFaviconOptions] = useState<
    { label: string; type?: string; url: string }[]
  >([]);
  const [ogImageOptions, setOgImageOptions] = useState<
    { label: string; type?: string; url: string }[]
  >([]);
  const [suggestedAuthor, setSuggestedAuthor] = useState<SuggestedAuthorData | null>(null);
  const [detectedUpdates, setDetectedUpdates] = useState<{
    description?: string;
    github?: string;
    subtitle?: string;
    title?: string;
  }>({});

  // Inline Author Creation
  const [isCreateAuthorOpen, setIsCreateAuthorOpen] = useState(false);
  const [createAuthorInitialName, setCreateAuthorInitialName] = useState("");

  // Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);
  const [pendingSaveAction, setPendingSaveAction] = useState<(() => void) | null>(null);

  const handleRequestSave = (status?: "approved" | "rejected" | "pending") => {
    const updatedPayload: Partial<Submission> = {
      ...editForm,
      ...(status ? { status } : {}),
    };
    const diffs = computeFieldChanges(sub, updatedPayload, SUBMISSION_FIELD_LABELS);
    setPendingChanges(diffs);
    setPendingSaveAction(() => () => onSave(sub.id, editForm, status));
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (pendingSaveAction) {
      pendingSaveAction();
    }
    setIsConfirmOpen(false);
  };

  const handleAuthorFieldChange = (field: keyof AuthorSocialValues, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAuthorBatchChange = (updates: Partial<AuthorSocialValues>) => {
    setEditForm((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSelectAuthorOption = (authorOption: AuthorOption) => {
    setEditForm((prev) => ({
      ...prev,
      authorGitHub: authorOption.links?.github || prev.authorGitHub || "",
      authorLinkedIn: authorOption.links?.linkedin || prev.authorLinkedIn || "",
      authorTwitter: authorOption.links?.twitter || prev.authorTwitter || "",
      authorWebsite: authorOption.links?.website || prev.authorWebsite || "",
      authorYouTube: authorOption.links?.youtube || prev.authorYouTube || "",
    }));
  };

  const handleRequestCreateAuthor = (name: string) => {
    setCreateAuthorInitialName(name);
    setIsCreateAuthorOpen(true);
  };

  const handleAcceptSuggestedAuthor = (suggested: SuggestedAuthorData) => {
    setEditForm((prev) => ({
      ...prev,
      author: suggested.name,
      authorGitHub: suggested.github || prev.authorGitHub || "",
      authorLinkedIn: suggested.linkedin || prev.authorLinkedIn || "",
      authorTwitter: suggested.twitter || prev.authorTwitter || "",
      authorWebsite: suggested.website || prev.authorWebsite || "",
      authorYouTube: suggested.youtube || prev.authorYouTube || "",
    }));
    setSuggestedAuthor(null);
  };

  const handleAutoDetect = async () => {
    const targetUrl = editForm.url?.trim();
    if (!targetUrl) return;

    try {
      setIsDetecting(true);
      const res = await fetch(`/api/submissions/metadata?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (res.ok && !data.error) {
        if (data.faviconOptions) setFaviconOptions(data.faviconOptions);
        if (data.ogImageOptions) setOgImageOptions(data.ogImageOptions);

        if (data.author && data.author.trim()) {
          setSuggestedAuthor({
            blog: data.authorBlog || "",
            github: data.authorGitHub || "",
            linkedin: data.authorLinkedIn || "",
            name: data.author.trim(),
            twitter: data.authorTwitter || "",
            website: data.authorWebsite || "",
            youtube: data.authorYouTube || "",
          });
        }

        const newDetected: {
          description?: string;
          github?: string;
          subtitle?: string;
          title?: string;
        } = {};

        setEditForm((prev) => {
          if (
            data.title &&
            prev.title &&
            prev.title.trim().toLowerCase() !== data.title.trim().toLowerCase()
          ) {
            newDetected.title = data.title.trim();
          }

          if (
            data.subtitle &&
            prev.subtitle &&
            prev.subtitle.trim().toLowerCase() !== data.subtitle.trim().toLowerCase()
          ) {
            newDetected.subtitle = data.subtitle.trim();
          }

          if (
            data.description &&
            prev.description &&
            prev.description.trim().toLowerCase() !== data.description.trim().toLowerCase()
          ) {
            newDetected.description = data.description.trim();
          }

          if (
            data.github &&
            prev.github &&
            prev.github.trim().toLowerCase() !== data.github.trim().toLowerCase()
          ) {
            newDetected.github = data.github.trim();
          }

          return {
            ...prev,
            title: prev.title || data.title || "",
            category: prev.category || data.category || sub.category,
            description: prev.description || data.description || "",
            favicon: prev.favicon || data.favicon || "",
            github: prev.github || data.github || "",
            ogImage: prev.ogImage || data.ogImage || "",
            subtitle: prev.subtitle || data.subtitle || "",
          };
        });

        setDetectedUpdates(newDetected);
      }
    } catch (err) {
      console.error("Metadata re-sync failed:", err);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="border-primary/60 bg-paper/60 rounded-lg border-2 p-6 font-mono text-xs shadow-md">
      {/* Edit Header */}
      <div className="border-line/60 mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded font-bold">
            <PencilSimpleIcon weight="bold" className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-base font-bold uppercase">
                Editing: {editForm.title || sub.title}
              </h3>
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                  STATUS_CONFIG[(editForm.status || sub.status) as SubmissionStatus]?.badge ||
                    "bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    STATUS_CONFIG[(editForm.status || sub.status) as SubmissionStatus]?.dotColor ||
                      "bg-muted-foreground",
                  )}
                />
                {editForm.status || sub.status}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Submitted by {sub.submitterName || sub.submitterEmail || "Anonymous"} on{" "}
              {new Date(sub.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground size-8 p-0"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* 2-Column Responsive Layout: Form (7 cols) + Real Card Preview (5 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form Controls Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Resource URL with Live Re-Sync */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Resource URL</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark
                  checked={Boolean(editForm.url?.trim() && isValidHttpUrl(editForm.url.trim()))}
                />
              </Label>
              <span className="text-muted-foreground text-[10px]">
                Scan live site for latest metadata & assets
              </span>
            </div>
            <div className="flex gap-2">
              <div className="h-9 flex-1">
                <InputField
                  type="url"
                  value={editForm.url || ""}
                  onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  placeholder="https://example.com"
                  containerClassName="h-9"
                  className="font-mono text-xs"
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoDetect}
                disabled={isDetecting || !editForm.url?.trim()}
                className="h-8 shrink-0 gap-1.5 font-mono text-xs font-bold uppercase"
              >
                {isDetecting ? (
                  <CircleNotchIcon className="size-3.5 animate-spin" />
                ) : (
                  <ArrowsClockwiseIcon weight="bold" className="text-primary size-3.5" />
                )}
                {isDetecting ? "Syncing..." : "Re-sync Metadata"}
              </Button>
            </div>
          </div>

          {/* Section 2: Title, Subtitle, & Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>Title</span>
                  <span className="text-destructive">*</span>
                  <FieldCheckmark checked={Boolean(editForm.title?.trim())} />
                </Label>
                <DetectedFieldSuggestion
                  currentValue={editForm.title}
                  detectedValue={detectedUpdates.title}
                  onApply={(val) => {
                    setEditForm((prev) => ({ ...prev, title: val }));
                    setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                  }}
                  onDismiss={() => {
                    setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                  }}
                />
              </div>
              <div className="h-9">
                <InputField
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Color Studio"
                  containerClassName="h-9"
                  className="font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Category</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={Boolean(editForm.category?.trim())} />
              </Label>
              <div className="h-9">
                <SelectField
                  value={editForm.category || sub.category}
                  onValueChange={(val) => setEditForm({ ...editForm, category: val })}
                  options={categoryOptions}
                  triggerClassName="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Subtitle / Tagline (Optional)</span>
                <FieldCheckmark checked={Boolean(editForm.subtitle?.trim())} />
              </Label>
              <DetectedFieldSuggestion
                currentValue={editForm.subtitle}
                detectedValue={detectedUpdates.subtitle}
                onApply={(val) => {
                  setEditForm((prev) => ({ ...prev, subtitle: val }));
                  setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                }}
                onDismiss={() => {
                  setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                }}
              />
            </div>
            <div className="h-9">
              <InputField
                value={editForm.subtitle || ""}
                onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                placeholder="e.g. Modern React UI library"
                containerClassName="h-9"
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Description</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={Boolean(editForm.description?.trim())} />
              </Label>
              <DetectedFieldSuggestion
                currentValue={editForm.description}
                detectedValue={detectedUpdates.description}
                onApply={(val) => {
                  setEditForm((prev) => ({ ...prev, description: val }));
                  setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                }}
                onDismiss={() => {
                  setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                }}
              />
            </div>
            <Textarea
              value={editForm.description || ""}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={3}
              className="bg-paper min-h-20 font-mono text-xs leading-relaxed"
              required
            />
          </div>

          {/* Section 4: Visuals & Media */}
          <MediaAssetFields
            favicon={editForm.favicon}
            faviconOptions={faviconOptions}
            iconBg={editForm.iconBg || "dark"}
            onIconBgChange={(val) => setEditForm((prev) => ({ ...prev, iconBg: val }))}
            ogImage={editForm.ogImage}
            ogImageOptions={ogImageOptions}
            onFaviconChange={(val) => setEditForm((prev) => ({ ...prev, favicon: val }))}
            onOgImageChange={(val) => setEditForm((prev) => ({ ...prev, ogImage: val }))}
          />

          {/* Section 5: Creator Attribution */}
          <AuthorSocialFields
            values={{
              author: editForm.author,
              authorGitHub: editForm.authorGitHub,
              authorLinkedIn: editForm.authorLinkedIn,
              authorTwitter: editForm.authorTwitter,
              authorWebsite: editForm.authorWebsite,
              authorYouTube: editForm.authorYouTube,
            }}
            onChange={handleAuthorFieldChange}
            onBatchChange={handleAuthorBatchChange}
            onRequestCreateAuthor={handleRequestCreateAuthor}
            onSelectAuthorOption={handleSelectAuthorOption}
            suggestedAuthor={suggestedAuthor}
            onAcceptSuggestedAuthor={handleAcceptSuggestedAuthor}
            onDismissSuggestedAuthor={() => setSuggestedAuthor(null)}
            allowCustom={false}
            disabled={isWorking}
          />

          {/* Section 6: Repo, Tags & Admin Moderation */}
          <div className="border-line/40 space-y-4 border-t pt-4">
            <div>
              <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                Additional Details & Review Notes
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Repository, tags, and internal moderation notes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                    <span>GitHub Repository (Optional)</span>
                    <FieldCheckmark checked={Boolean(editForm.github?.trim())} />
                  </Label>
                  <DetectedFieldSuggestion
                    currentValue={editForm.github}
                    detectedValue={detectedUpdates.github}
                    onApply={(val) => {
                      setEditForm((prev) => ({ ...prev, github: val }));
                      setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                    }}
                    onDismiss={() => {
                      setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                    }}
                  />
                </div>
                <div className="h-9">
                  <InputField
                    type="url"
                    value={editForm.github || ""}
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    placeholder="https://github.com/owner/repo"
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>Canonical Tags (Select Only)</span>
                  <FieldCheckmark checked={Boolean(editForm.tags?.trim())} />
                </Label>
                <TagPicker
                  value={editForm.tags || ""}
                  onChange={(val) => setEditForm({ ...editForm, tags: val })}
                  allowCustom={false}
                  placeholder="Search and select canonical tags..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Moderation Status
                </Label>
                <div className="h-9">
                  <SelectField
                    value={editForm.status || sub.status}
                    onValueChange={(val) =>
                      setEditForm({
                        ...editForm,
                        status: val as "pending" | "approved" | "rejected",
                      })
                    }
                    options={STATUS_OPTIONS}
                    triggerClassName="h-9 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Internal Admin Notes
                </Label>
                <div className="h-9">
                  <InputField
                    value={editForm.adminNotes || ""}
                    onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                    placeholder="Notes about this review..."
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Real Card Preview Column (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-24 space-y-5">
            <ResourceCardPreview
              author={editForm.author}
              cardMaxWidthClass="max-w-76"
              category={editForm.category || sub.category}
              className="rounded-lg"
              description={editForm.description || sub.description}
              favicon={editForm.favicon}
              iconBg={editForm.iconBg || "dark"}
              ogImage={editForm.ogImage}
              subtitle={editForm.subtitle}
              tags={editForm.tags}
              title={editForm.title || sub.title}
              url={editForm.url}
            />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-line/50 mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          disabled={isWorking}
          className="text-destructive hover:bg-destructive/10 gap-1 text-xs uppercase"
        >
          <TrashIcon className="size-3.5" /> Delete Submission
        </Button>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm" variant="outline" onClick={onCancel} className="text-xs uppercase">
            Cancel
          </Button>

          {sub.status === "rejected" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRequestSave("pending")}
              disabled={isWorking}
              className="gap-1.5 border-amber-500/80 text-xs font-bold text-amber-700 uppercase hover:bg-amber-500/20 dark:text-amber-300"
            >
              <ArrowCounterClockwiseIcon weight="duotone" className="size-4" /> Move to Pending &
              Save
            </Button>
          )}

          {sub.status !== "approved" && (
            <Button
              size="sm"
              onClick={() => handleRequestSave("approved")}
              disabled={isWorking}
              className="gap-1.5 bg-emerald-600 text-xs font-bold text-white uppercase hover:bg-emerald-700"
            >
              <CheckCircleIcon weight="fill" className="size-4" /> Approve & Save
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => handleRequestSave()}
            disabled={isWorking}
            className="gap-1.5 text-xs font-bold uppercase"
          >
            <FloppyDiskIcon className="size-4" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Inline Create Author Modal */}
      <AdminAuthorDialog
        open={isCreateAuthorOpen}
        onOpenChange={setIsCreateAuthorOpen}
        initialName={createAuthorInitialName}
        onCreated={(newAuthor) => {
          setEditForm((prev) => {
            const existing = prev.author
              ? prev.author
                  .split(",")
                  .map((a) => a.trim())
                  .filter(Boolean)
              : [];
            const next = existing.some((a) => a.toLowerCase() === newAuthor.name.toLowerCase())
              ? existing
              : [...existing, newAuthor.name];
            return {
              ...prev,
              author: next.join(", "),
              authorGitHub: newAuthor.github || prev.authorGitHub || "",
              authorLinkedIn: newAuthor.linkedin || prev.authorLinkedIn || "",
              authorTwitter: newAuthor.twitter || prev.authorTwitter || "",
              authorWebsite: newAuthor.website || prev.authorWebsite || "",
              authorYouTube: newAuthor.youtube || prev.authorYouTube || "",
            };
          });
          setIsCreateAuthorOpen(false);
        }}
      />

      {/* Confirmation Dialog for Submission Updates */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Submission Updates"
        description="Review the list of changed submission details before saving changes."
        itemTitle={editForm.title || sub.title}
        changes={pendingChanges}
        onConfirm={handleConfirmSave}
        isWorking={isWorking}
      />
    </div>
  );
}
