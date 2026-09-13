"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  LightningIcon,
  TrashIcon,
  UserIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AuthorOption,
  AuthorSocialFields,
  AuthorSocialValues,
  CandidateOption,
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
  authorBlog: "Author Blog URL",
  authorGitHub: "Author GitHub",
  authorLinkedIn: "Author LinkedIn",
  authorTwitter: "Author Twitter / X",
  authorWebsite: "Author Website",
  authorYouTube: "Author YouTube",
  category: "Category",
  description: "Description",
  favicon: "Favicon URL",
  github: "GitHub Repository",
  iconBg: "Icon Background / Style",
  ogImage: "OpenGraph Image",
  status: "Moderation Status",
  subtitle: "Subtitle / Tagline",
  tags: "Canonical Tags",
  url: "Resource URL",
};

interface AdminSubmissionInspectViewProps {
  submission: Submission;
}

export function AdminSubmissionInspectView({ submission: sub }: AdminSubmissionInspectViewProps) {
  const router = useRouter();
  const { categoryOptions } = useCategories();

  // Inspect mode starts with empty destination fields so the admin inspects and syncs intentionally
  const [editForm, setEditForm] = useState<Partial<Submission & { iconBg?: string }>>({
    title: "",
    adminNotes: sub.adminNotes || "",
    author: "",
    authorBlog: "",
    authorGitHub: "",
    authorLinkedIn: "",
    authorTwitter: "",
    authorWebsite: "",
    authorYouTube: "",
    category: "",
    description: "",
    favicon: "",
    github: "",
    iconBg: "dark",
    notes: sub.notes || "",
    ogImage: "",
    pricing: "Free",
    status: sub.status,
    subtitle: "",
    tags: "",
    url: "",
  });

  const [isWorking, setIsWorking] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faviconOptions, setFaviconOptions] = useState<CandidateOption[]>([]);
  const [ogImageOptions, setOgImageOptions] = useState<CandidateOption[]>([]);
  const [suggestedAuthor, setSuggestedAuthor] = useState<SuggestedAuthorData | null>(null);
  const [detectedUpdates, setDetectedUpdates] = useState<{
    description?: string;
    github?: string;
    subtitle?: string;
    title?: string;
  }>({});

  // Inline Author Creation Dialog
  const [isCreateAuthorOpen, setIsCreateAuthorOpen] = useState(false);
  const [createAuthorInitialData, setCreateAuthorInitialData] = useState<
    Partial<SuggestedAuthorData>
  >({});

  // Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // Field-by-Field Sync Handlers
  const handleSyncField = (field: keyof Submission | "visuals" | "authorAll" | "all") => {
    if (field === "all") {
      setEditForm({
        title: sub.title || "",
        adminNotes: editForm.adminNotes || sub.adminNotes || "",
        author: sub.author || "",
        authorBlog: sub.authorBlog || "",
        authorGitHub: sub.authorGitHub || "",
        authorLinkedIn: sub.authorLinkedIn || "",
        authorTwitter: sub.authorTwitter || "",
        authorWebsite: sub.authorWebsite || "",
        authorYouTube: sub.authorYouTube || "",
        category: sub.category || editForm.category,
        description: sub.description || "",
        favicon: sub.favicon || "",
        github: sub.github || "",
        iconBg: (sub as unknown as { iconBg?: string }).iconBg || "dark",
        notes: sub.notes || "",
        ogImage: sub.ogImage || "",
        pricing: sub.pricing || "Free",
        status: editForm.status || sub.status,
        subtitle: sub.subtitle || "",
        tags: sub.tags || "",
        url: sub.url || "",
      });
      toast.success("Synchronized all submission data into resource form.");
      return;
    }

    if (field === "visuals") {
      setEditForm((prev) => ({
        ...prev,
        favicon: sub.favicon || "",
        iconBg: (sub as unknown as { iconBg?: string }).iconBg || "dark",
        ogImage: sub.ogImage || "",
      }));
      toast.success("Synchronized media and icon styles.");
      return;
    }

    if (field === "authorAll") {
      setEditForm((prev) => ({
        ...prev,
        author: sub.author || "",
        authorBlog: sub.authorBlog || "",
        authorGitHub: sub.authorGitHub || "",
        authorLinkedIn: sub.authorLinkedIn || "",
        authorTwitter: sub.authorTwitter || "",
        authorWebsite: sub.authorWebsite || "",
        authorYouTube: sub.authorYouTube || "",
      }));
      toast.success("Synchronized author details and social links.");
      return;
    }

    const val = sub[field];
    if (val !== undefined) {
      setEditForm((prev) => ({
        ...prev,
        [field]: val,
      }));
      toast.success(`Synchronized ${SUBMISSION_FIELD_LABELS[field] || field}.`);
    }
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
      authorBlog: authorOption.links?.blog || prev.authorBlog || "",
      authorGitHub: authorOption.links?.github || prev.authorGitHub || "",
      authorLinkedIn: authorOption.links?.linkedin || prev.authorLinkedIn || "",
      authorTwitter: authorOption.links?.twitter || prev.authorTwitter || "",
      authorWebsite: authorOption.links?.website || prev.authorWebsite || "",
      authorYouTube: authorOption.links?.youtube || prev.authorYouTube || "",
    }));
  };

  const handleRequestCreateAuthor = (
    name: string,
    initialData?: Partial<SuggestedAuthorData>,
  ) => {
    setCreateAuthorInitialData({
      blog: initialData?.blog || editForm.authorBlog || sub.authorBlog || "",
      github: initialData?.github || editForm.authorGitHub || sub.authorGitHub || "",
      linkedin: initialData?.linkedin || editForm.authorLinkedIn || sub.authorLinkedIn || "",
      name: name || initialData?.name || editForm.author || sub.author || "",
      twitter: initialData?.twitter || editForm.authorTwitter || sub.authorTwitter || "",
      website: initialData?.website || editForm.authorWebsite || sub.authorWebsite || "",
      youtube: initialData?.youtube || editForm.authorYouTube || sub.authorYouTube || "",
    });
    setIsCreateAuthorOpen(true);
  };

  const handleAcceptSuggestedAuthor = (suggested: SuggestedAuthorData) => {
    setEditForm((prev) => ({
      ...prev,
      author: suggested.name,
      authorBlog: suggested.blog || prev.authorBlog || "",
      authorGitHub: suggested.github || prev.authorGitHub || "",
      authorLinkedIn: suggested.linkedin || prev.authorLinkedIn || "",
      authorTwitter: suggested.twitter || prev.authorTwitter || "",
      authorWebsite: suggested.website || prev.authorWebsite || "",
      authorYouTube: suggested.youtube || prev.authorYouTube || "",
    }));
    setSuggestedAuthor(null);
  };

  const handleAutoDetect = async () => {
    const targetUrl = editForm.url?.trim() || sub.url?.trim();
    if (!targetUrl) {
      toast.warning("Please enter or sync a URL first.");
      return;
    }

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
          } else if (!data.subtitle && prev.subtitle && prev.subtitle.trim()) {
            newDetected.subtitle = "";
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
            url: prev.url || targetUrl,
          };
        });

        setDetectedUpdates(newDetected);
        toast.success("Refreshed metadata from live URL.");
      }
    } catch (err) {
      console.error("Metadata re-sync failed:", err);
      toast.error("Failed to fetch metadata from URL.");
    } finally {
      setIsDetecting(false);
    }
  };

  const executeSave = async (statusOverride?: "approved" | "rejected" | "pending") => {
    if (statusOverride === "approved") {
      if (!editForm.title?.trim()) {
        toast.error("Title is required to approve and publish.");
        return;
      }
      if (!editForm.url?.trim()) {
        toast.error("Resource URL is required to approve and publish.");
        return;
      }
      if (!editForm.category?.trim()) {
        toast.error("Category is required to approve and publish.");
        return;
      }
      if (!editForm.description?.trim()) {
        toast.error("Description is required to approve and publish.");
        return;
      }
    }

    try {
      setIsWorking(true);
      const payload = {
        ...editForm,
        id: sub.id,
        ...(statusOverride ? { status: statusOverride } : {}),
      };

      const res = await fetch("/api/admin/submissions", {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsConfirmOpen(false);
        const actionLabel =
          statusOverride === "approved"
            ? "approved & published to catalog"
            : statusOverride === "rejected"
              ? "marked as rejected"
              : "saved";
        toast.success(`Submission "${editForm.title || sub.title}" ${actionLabel}!`);
        router.push("/admin/submissions");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to update submission.");
      }
    } catch (err) {
      console.error("Failed to update submission:", err);
      toast.error("Network error while updating submission.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleRequestSave = (statusOverride?: "approved" | "rejected" | "pending") => {
    const targetPayload: Partial<Submission> = {
      ...editForm,
      ...(statusOverride ? { status: statusOverride } : {}),
    };
    const diffs = computeFieldChanges(sub, targetPayload, SUBMISSION_FIELD_LABELS);
    setPendingChanges(diffs);
    setPendingAction(() => () => executeSave(statusOverride));
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete submission "${sub.title}"?`)) {
      return;
    }

    try {
      setIsWorking(true);
      const res = await fetch(`/api/admin/submissions?id=${sub.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Submission deleted.");
        router.push("/admin/submissions");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to delete submission.");
      }
    } catch (err) {
      console.error("Delete submission error:", err);
      toast.error("Network error while deleting submission.");
    } finally {
      setIsWorking(false);
    }
  };

  const statusConfig = STATUS_CONFIG[(editForm.status || sub.status) as SubmissionStatus] || {
    badge: "bg-muted text-muted-foreground",
    dotColor: "bg-muted-foreground",
    label: editForm.status || sub.status,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 font-mono text-xs">
      {/* Top Header & Navigation Bar */}
      <div className="border-line/60 bg-paper flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-line hover:bg-surface h-8 gap-1.5 px-3 text-xs font-bold uppercase"
            >
              <Link href="/admin/submissions">
                <ArrowLeftIcon weight="bold" className="size-3.5" />
                <span>Back to Queue</span>
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground text-[11px] font-bold uppercase">
              Inspect & Sync
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <h1 className="text-foreground text-lg font-bold uppercase tracking-tight">
              {sub.title}
            </h1>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                statusConfig.badge,
              )}
            >
              <span className={cn("size-1.5 rounded-full", statusConfig.dotColor)} />
              {statusConfig.label}
            </span>
          </div>
          <p className="text-muted-foreground text-[11px]">
            Submitted by{" "}
            <span className="text-foreground font-semibold">
              {sub.submitterName || sub.submitterEmail || "Anonymous"}
            </span>{" "}
            on {new Date(sub.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Top Global Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSyncField("all")}
            className="border-primary/50 text-primary hover:bg-primary/10 h-8 gap-1.5 text-xs font-bold uppercase"
          >
            <LightningIcon weight="fill" className="size-4" />
            <span>Sync All Fields ➔</span>
          </Button>

          {sub.status !== "approved" && (
            <Button
              type="button"
              onClick={() => handleRequestSave("approved")}
              disabled={isWorking}
              className="h-8 gap-1.5 bg-emerald-600 px-3.5 text-xs font-bold text-white uppercase hover:bg-emerald-700"
            >
              <CheckCircleIcon weight="fill" className="size-4" />
              <span>Approve & Publish</span>
            </Button>
          )}

          {sub.status === "pending" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRequestSave("rejected")}
              disabled={isWorking}
              className="border-destructive/60 text-destructive hover:bg-destructive/10 h-8 gap-1.5 text-xs font-bold uppercase"
            >
              <XCircleIcon weight="bold" className="size-4" />
              <span>Reject</span>
            </Button>
          )}
        </div>
      </div>

      {/* Submitter Notes Alert if available */}
      {sub.notes && (
        <div className="border-line/60 bg-muted/30 rounded-xl border p-4 text-[11px]">
          <span className="text-muted-foreground font-bold uppercase">Submitter Note:</span>
          <p className="text-foreground mt-1 italic">{sub.notes}</p>
        </div>
      )}

      {/* Main Comparative Inspection Grid (Left 8 Cols: Paired Fields, Right 4 Cols: Sticky Preview & Actions) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Paired Fields Section (8 cols) */}
        <div className="space-y-6 xl:col-span-8">
          {/* FIELD 1: RESOURCE URL */}
          <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>1. Resource URL</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark
                  checked={Boolean(editForm.url?.trim() && isValidHttpUrl(editForm.url.trim()))}
                />
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAutoDetect}
                disabled={isDetecting || (!editForm.url?.trim() && !sub.url?.trim())}
                className="h-7 gap-1 px-2 font-mono text-[10px] font-bold uppercase"
              >
                {isDetecting ? (
                  <CircleNotchIcon className="size-3 animate-spin" />
                ) : (
                  <ArrowsClockwiseIcon weight="bold" className="text-primary size-3" />
                )}
                <span>Scan Live Site</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Read-only Submitted */}
              <div className="border-line/40 bg-muted/20 flex flex-col justify-between rounded-lg border p-3">
                <div>
                  <span className="text-muted-foreground mb-1 block text-[10px] font-bold uppercase">
                    Submitted (Read-Only)
                  </span>
                  <a
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary block truncate font-mono text-xs hover:underline"
                  >
                    {sub.url}
                  </a>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSyncField("url")}
                    className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                  >
                    <span>Sync URL</span>
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Editable Target */}
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                  Target Resource (Type or Sync)
                </span>
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
            </div>
          </div>

          {/* FIELD 2: TITLE */}
          <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>2. Title</span>
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Read-only Submitted */}
              <div className="border-line/40 bg-muted/20 flex flex-col justify-between rounded-lg border p-3">
                <div>
                  <span className="text-muted-foreground mb-1 block text-[10px] font-bold uppercase">
                    Submitted (Read-Only)
                  </span>
                  <p className="text-foreground font-bold">{sub.title}</p>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSyncField("title")}
                    className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                  >
                    <span>Sync Title</span>
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Editable Target */}
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                  Target Resource (Type or Sync)
                </span>
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
          </div>

          {/* FIELD 3: SUBTITLE / TAGLINE */}
          <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>3. Subtitle / Tagline (Optional)</span>
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Read-only Submitted */}
              <div className="border-line/40 bg-muted/20 flex flex-col justify-between rounded-lg border p-3">
                <div>
                  <span className="text-muted-foreground mb-1 block text-[10px] font-bold uppercase">
                    Submitted (Read-Only)
                  </span>
                  <p className={cn("text-xs", !sub.subtitle && "text-muted-foreground italic")}>
                    {sub.subtitle || "None provided"}
                  </p>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={!sub.subtitle}
                    onClick={() => handleSyncField("subtitle")}
                    className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                  >
                    <span>Sync Subtitle</span>
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Editable Target */}
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                  Target Resource (Type or Sync)
                </span>
                <InputField
                  value={editForm.subtitle || ""}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  placeholder="e.g. Modern React UI library"
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* FIELD 4: CATEGORY */}
          <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>4. Category</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={Boolean(editForm.category?.trim())} />
              </Label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Read-only Submitted */}
              <div className="border-line/40 bg-muted/20 flex flex-col justify-between rounded-lg border p-3">
                <div>
                  <span className="text-muted-foreground mb-1 block text-[10px] font-bold uppercase">
                    Submitted (Read-Only)
                  </span>
                  <span className="bg-primary/10 text-primary inline-block rounded px-2 py-0.5 text-xs font-semibold">
                    {sub.category}
                  </span>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSyncField("category")}
                    className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                  >
                    <span>Sync Category</span>
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Editable Target */}
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                  Target Resource (Select or Sync)
                </span>
                <SelectField
                  value={editForm.category || ""}
                  onValueChange={(val) => setEditForm({ ...editForm, category: val })}
                  options={categoryOptions}
                  triggerClassName="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* FIELD 5: DESCRIPTION */}
          <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>5. Description</span>
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Read-only Submitted */}
              <div className="border-line/40 bg-muted/20 flex flex-col justify-between rounded-lg border p-3">
                <div>
                  <span className="text-muted-foreground mb-1 block text-[10px] font-bold uppercase">
                    Submitted (Read-Only)
                  </span>
                  <p className="text-foreground leading-relaxed text-[11px]">{sub.description}</p>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSyncField("description")}
                    className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                  >
                    <span>Sync Description</span>
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Editable Target */}
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                  Target Resource (Type or Sync)
                </span>
                <Textarea
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="bg-paper min-h-24 font-mono text-xs leading-relaxed"
                  required
                />
              </div>
            </div>
          </div>

          {/* FIELD 6: VISUALS & MEDIA ASSETS */}
          <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>6. Media & Icon Styling</span>
                <FieldCheckmark checked={Boolean(editForm.favicon || editForm.ogImage)} />
              </Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleSyncField("visuals")}
                className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
              >
                <span>Sync Visuals</span>
                <ArrowRightIcon className="size-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Read-only Submitted Preview Box (5 cols) */}
              <div className="border-line/40 bg-muted/20 space-y-3 rounded-lg border p-3 lg:col-span-5">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                  Submitted Visuals
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[10px]">Favicon:</span>
                  {sub.favicon ? (
                    <div className="bg-card flex size-7 items-center justify-center rounded border p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sub.favicon} alt="Favicon" className="size-4 object-contain" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-[10px] italic">None</span>
                  )}
                  <span className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">
                    {(sub as unknown as { iconBg?: string }).iconBg || "dark"}
                  </span>
                </div>

                {sub.ogImage ? (
                  <div className="border-line/30 space-y-1 border-t pt-2">
                    <span className="text-muted-foreground text-[10px]">OG Image:</span>
                    <div className="bg-muted relative h-20 w-full overflow-hidden rounded border">
                      <Image
                        src={sub.ogImage}
                        alt="Submitted OG Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground block text-[10px] italic">
                    No OG image submitted
                  </span>
                )}
              </div>

              {/* Editable Target Media Asset Fields (7 cols) */}
              <div className="lg:col-span-7">
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
              </div>
            </div>
          </div>

          {/* FIELD 7: CREATOR ATTRIBUTION & SOCIALS */}
          <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>7. Creator / Author Attribution</span>
                <FieldCheckmark checked={Boolean(editForm.author?.trim())} />
              </Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleSyncField("authorAll")}
                className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
              >
                <span>Sync Author & Links</span>
                <ArrowRightIcon className="size-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Read-only Submitted Author Box (5 cols) */}
              <div className="border-line/40 bg-muted/20 space-y-2 rounded-lg border p-3 lg:col-span-5">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                  Submitted Author Data
                </span>
                <div className="flex items-center gap-2">
                  <UserIcon className="text-muted-foreground size-4" />
                  <span className="text-foreground font-bold">{sub.author || "None provided"}</span>
                </div>

                <div className="border-line/30 grid grid-cols-1 gap-1 border-t pt-2 text-[10px]">
                  {sub.authorWebsite && (
                    <div className="truncate text-muted-foreground">
                      <span className="font-bold">Website:</span> {sub.authorWebsite}
                    </div>
                  )}
                  {sub.authorGitHub && (
                    <div className="truncate text-muted-foreground">
                      <span className="font-bold">GitHub:</span> {sub.authorGitHub}
                    </div>
                  )}
                  {sub.authorTwitter && (
                    <div className="truncate text-muted-foreground">
                      <span className="font-bold">X / Twitter:</span> {sub.authorTwitter}
                    </div>
                  )}
                  {sub.authorLinkedIn && (
                    <div className="truncate text-muted-foreground">
                      <span className="font-bold">LinkedIn:</span> {sub.authorLinkedIn}
                    </div>
                  )}
                  {sub.authorYouTube && (
                    <div className="truncate text-muted-foreground">
                      <span className="font-bold">YouTube:</span> {sub.authorYouTube}
                    </div>
                  )}
                  {sub.authorBlog && (
                    <div className="truncate text-muted-foreground">
                      <span className="font-bold">Blog:</span> {sub.authorBlog}
                    </div>
                  )}
                  {!sub.authorWebsite &&
                    !sub.authorGitHub &&
                    !sub.authorTwitter &&
                    !sub.authorLinkedIn &&
                    !sub.authorYouTube &&
                    !sub.authorBlog && (
                      <span className="text-muted-foreground italic">No links submitted</span>
                    )}
                </div>
              </div>

              {/* Editable Target Author Fields (7 cols) */}
              <div className="lg:col-span-7">
                <AuthorSocialFields
                  values={{
                    author: editForm.author,
                    authorBlog: editForm.authorBlog,
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
              </div>
            </div>
          </div>

          {/* FIELD 8: GITHUB & CANONICAL TAGS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* GitHub Repo */}
            <div className="border-line/60 bg-paper space-y-3 rounded-xl border p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>8. GitHub Repo (Optional)</span>
                  <FieldCheckmark checked={Boolean(editForm.github?.trim())} />
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!sub.github}
                  onClick={() => handleSyncField("github")}
                  className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                >
                  <span>Sync</span>
                  <ArrowRightIcon className="size-3" />
                </Button>
              </div>

              <div className="border-line/40 bg-muted/20 rounded-lg border p-2 text-[10px]">
                <span className="text-muted-foreground font-bold">Submitted:</span>{" "}
                <span className={cn(sub.github ? "text-foreground" : "text-muted-foreground italic")}>
                  {sub.github || "None"}
                </span>
              </div>

              <InputField
                type="url"
                value={editForm.github || ""}
                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                placeholder="https://github.com/owner/repo"
                containerClassName="h-9"
                className="font-mono text-xs"
              />
            </div>

            {/* Canonical Tags */}
            <div className="border-line/60 bg-paper space-y-3 rounded-xl border p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>9. Canonical Tags</span>
                  <FieldCheckmark checked={Boolean(editForm.tags?.trim())} />
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!sub.tags}
                  onClick={() => handleSyncField("tags")}
                  className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-[10px] font-bold uppercase"
                >
                  <span>Sync</span>
                  <ArrowRightIcon className="size-3" />
                </Button>
              </div>

              <div className="border-line/40 bg-muted/20 rounded-lg border p-2 text-[10px]">
                <span className="text-muted-foreground font-bold">Submitted:</span>{" "}
                <span className={cn(sub.tags ? "text-foreground" : "text-muted-foreground italic")}>
                  {sub.tags || "None"}
                </span>
              </div>

              <TagPicker
                value={editForm.tags || ""}
                onChange={(val) => setEditForm({ ...editForm, tags: val })}
                allowCustom={false}
                placeholder="Search & select canonical tags..."
              />
            </div>
          </div>

          {/* FIELD 10: MODERATION & ADMIN NOTES */}
          <div className="border-line/60 bg-paper space-y-4 rounded-xl border p-5 shadow-xs">
            <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">
              10. Moderation Status & Admin Notes
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Moderation Status
                </Label>
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

              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Internal Admin Notes
                </Label>
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

        {/* Sticky Sidebar: Live Preview & Action Bar (4 cols) */}
        <div className="space-y-6 xl:col-span-4">
          <div className="sticky top-20 space-y-6">
            {/* Live Resource Card Preview */}
            <div className="border-line/60 bg-paper rounded-xl border p-5 shadow-sm">
              <h3 className="text-foreground mb-3 text-xs font-bold uppercase tracking-wider">
                Live Resource Card Preview
              </h3>
              <p className="text-muted-foreground mb-4 text-[11px]">
                Real-time preview of how this card will render in the catalog once published.
              </p>

              <div className="flex justify-center rounded-xl border border-dashed border-line/60 bg-muted/20 p-4">
                <ResourceCardPreview
                  author={editForm.author}
                  cardMaxWidthClass="max-w-xs"
                  category={editForm.category || "Unassigned"}
                  className="rounded-lg"
                  description={editForm.description || "Enter a description..."}
                  favicon={editForm.favicon}
                  iconBg={editForm.iconBg || "dark"}
                  ogImage={editForm.ogImage}
                  subtitle={editForm.subtitle}
                  tags={editForm.tags}
                  title={editForm.title || "Resource Title"}
                  url={editForm.url}
                />
              </div>
            </div>

            {/* Actions Card */}
            <div className="border-line/60 bg-paper space-y-3 rounded-xl border p-5 shadow-sm">
              <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">
                Inspection Actions
              </h3>

              <div className="flex flex-col gap-2">
                {sub.status !== "approved" && (
                  <Button
                    type="button"
                    onClick={() => handleRequestSave("approved")}
                    disabled={isWorking}
                    className="w-full gap-1.5 bg-emerald-600 text-xs font-bold text-white uppercase hover:bg-emerald-700"
                  >
                    <CheckCircleIcon weight="fill" className="size-4" />
                    <span>Approve & Publish</span>
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={() => handleRequestSave()}
                  disabled={isWorking}
                  className="w-full gap-1.5 text-xs font-bold uppercase"
                >
                  <FloppyDiskIcon className="size-4" />
                  <span>Save Inspection State</span>
                </Button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/admin/submissions")}
                    className="text-xs uppercase"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isWorking}
                    className="text-destructive hover:bg-destructive/10 gap-1 text-xs uppercase"
                  >
                    <TrashIcon className="size-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Create Author Modal */}
      <AdminAuthorDialog
        open={isCreateAuthorOpen}
        onOpenChange={setIsCreateAuthorOpen}
        initialData={createAuthorInitialData}
        initialName={createAuthorInitialData.name}
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
              authorBlog: newAuthor.blog || prev.authorBlog || "",
              authorGitHub: newAuthor.github || prev.authorGitHub || "",
              authorLinkedIn: newAuthor.linkedin || prev.authorLinkedIn || "",
              authorTwitter: newAuthor.twitter || prev.authorTwitter || "",
              authorWebsite: newAuthor.website || prev.authorWebsite || "",
              authorYouTube: newAuthor.youtube || prev.authorYouTube || "",
            };
          });
          setIsCreateAuthorOpen(false);
          toast.success(`Author "${newAuthor.name}" created and linked!`);
        }}
      />

      {/* Confirmation Dialog for Submission Updates */}
      <AdminConfirmEditDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Submission & Resource Synchronization"
        description="Review field updates before applying to the database and catalog."
        itemTitle={editForm.title || sub.title}
        changes={pendingChanges}
        onConfirm={() => {
          if (pendingAction) {
            pendingAction();
          }
        }}
        isWorking={isWorking}
      />
    </div>
  );
}
