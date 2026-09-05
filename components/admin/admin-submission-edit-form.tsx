"use client";

import {
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
  AuthorSocialFields,
  AuthorSocialValues,
  MediaAssetFields,
  ResourceCardPreview,
} from "@/components/submissions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { Submission } from "@/lib/db/schema";
import { resourceCategories } from "@/lib/resource-data";

import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "./types";

interface AdminSubmissionEditFormProps {
  isWorking: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onSave: (id: string, formData: Partial<Submission>, status?: "approved" | "rejected" | "pending") => void;
  submission: Submission;
}

export function AdminSubmissionEditForm({
  isWorking,
  onCancel,
  onDelete,
  onSave,
  submission: sub,
}: AdminSubmissionEditFormProps) {
  const [editForm, setEditForm] = useState<Partial<Submission>>({
    title: sub.title,
    adminNotes: sub.adminNotes || "",
    author: sub.author || "",
    authorGitHub: sub.authorGitHub || "",
    authorLink: sub.authorLink || "",
    authorLinkedIn: sub.authorLinkedIn || "",
    authorTwitter: sub.authorTwitter || "",
    authorWebsite: sub.authorWebsite || sub.authorLink || "",
    authorYouTube: sub.authorYouTube || "",
    category: sub.category,
    description: sub.description,
    favicon: sub.favicon || "",
    gitHubLink: sub.gitHubLink || "",
    notes: sub.notes || "",
    ogImage: sub.ogImage || "",
    pricing: sub.pricing || "Free",
    status: sub.status,
    subtitle: sub.subtitle || "",
    tags: sub.tags || "",
    url: sub.url,
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [faviconOptions, setFaviconOptions] = useState<{ label: string; type?: string; url: string }[]>([]);
  const [ogImageOptions, setOgImageOptions] = useState<{ label: string; type?: string; url: string }[]>([]);

  const handleAuthorFieldChange = (field: keyof AuthorSocialValues, value: string) => {
    if (field === "authorWebsite") {
      setEditForm((prev) => ({
        ...prev,
        authorLink: value,
        authorWebsite: value,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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

        setEditForm((prev) => ({
          ...prev,
          title: prev.title || data.title,
          author: prev.author || data.author,
          authorGitHub: prev.authorGitHub || data.authorGitHub,
          authorLinkedIn: prev.authorLinkedIn || data.authorLinkedIn,
          authorTwitter: prev.authorTwitter || data.authorTwitter,
          authorWebsite: prev.authorWebsite || data.authorWebsite,
          authorYouTube: prev.authorYouTube || data.authorYouTube,
          category:
            prev.category ||
            (data.category && resourceCategories.includes(data.category)
              ? data.category
              : prev.category),
          description: prev.description || data.description,
          favicon: data.favicon || prev.favicon,
          gitHubLink: prev.gitHubLink || data.gitHubLink,
          ogImage: data.ogImage || prev.ogImage,
          subtitle: prev.subtitle || data.subtitle,
        }));
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
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                  editForm.status === "approved"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : editForm.status === "rejected"
                      ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                }`}
              >
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
          {/* Section 1: Tool URL with Live Re-Sync */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Tool URL <span className="text-destructive">*</span>
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
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Title <span className="text-destructive">*</span>
              </Label>
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
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="h-9">
                <SelectField
                  value={editForm.category || sub.category}
                  onValueChange={(val) => setEditForm({ ...editForm, category: val })}
                  options={CATEGORY_OPTIONS}
                  triggerClassName="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              Subtitle / Tagline (Optional)
            </Label>
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
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              Description <span className="text-destructive">*</span>
            </Label>
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
              authorWebsite: editForm.authorWebsite || editForm.authorLink,
              authorYouTube: editForm.authorYouTube,
            }}
            onChange={handleAuthorFieldChange}
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
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  GitHub Repository (Optional)
                </Label>
                <div className="h-9">
                  <InputField
                    type="url"
                    value={editForm.gitHubLink || ""}
                    onChange={(e) => setEditForm({ ...editForm, gitHubLink: e.target.value })}
                    placeholder="https://github.com/owner/repo"
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Tags / Keywords (comma separated)
                </Label>
                <div className="h-9">
                  <InputField
                    value={editForm.tags || ""}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="react, tailwind, ui"
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
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

          {sub.status !== "approved" && (
            <Button
              size="sm"
              onClick={() => onSave(sub.id, editForm, "approved")}
              disabled={isWorking}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold uppercase"
            >
              <CheckCircleIcon weight="fill" className="size-4" /> Approve & Save
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => onSave(sub.id, editForm)}
            disabled={isWorking}
            className="gap-1.5 text-xs font-bold uppercase"
          >
            <FloppyDiskIcon className="size-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
