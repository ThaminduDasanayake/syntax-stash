"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  CopyIcon,
  FloppyDiskIcon,
  GlobeIcon,
  LightningIcon,
  TrashIcon,
  UserIcon,
  XCircleIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
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

function CopyValueButton({ label, text }: { label: string; text: string }) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.info(`Copied ${label} to clipboard.`);
      }}
      className="text-muted-foreground hover:text-foreground hover:bg-muted/60 size-6 p-0"
      title={`Copy ${label}`}
    >
      <CopyIcon className="size-3" />
    </Button>
  );
}

function SubmittedDataBanner({
  display,
  label,
  onSync,
  value,
}: {
  display?: React.ReactNode;
  label?: string;
  onSync: () => void;
  value?: string | null;
}) {
  const hasContent = Boolean(value?.trim() || display);

  return (
    <div className="border-line/60 bg-muted/30 flex items-center justify-between gap-2 rounded border px-3 py-1.5 font-mono text-xs">
      <div className="flex items-center gap-2 truncate">
        <span className="text-muted-foreground shrink-0 text-[10px] font-bold tracking-wider uppercase">
          {label || "Submitted"}:
        </span>
        {display ? (
          display
        ) : (
          <span
            className={cn(
              "truncate text-[11px]",
              hasContent ? "text-foreground font-medium" : "text-muted-foreground italic",
            )}
          >
            {value || "None provided"}
          </span>
        )}
      </div>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={!hasContent}
        onClick={onSync}
        className="text-primary hover:bg-primary/10 h-5 shrink-0 gap-1 px-1.5 text-[10px] font-bold uppercase"
        title="Sync this value into target field"
      >
        <span>Sync</span>
        <ArrowRightIcon className="size-3" />
      </Button>
    </div>
  );
}

export function AdminSubmissionInspectView({ submission: sub }: AdminSubmissionInspectViewProps) {
  const router = useRouter();
  const { categoryOptions } = useCategories();

  // Inspect mode starts with empty destination fields so admin inspects and syncs intentionally
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

  // Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<FieldDiff[]>([]);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  const submittedAuthorNames = sub.author
    ? sub.author
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

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
      toast.success("Synchronized author details.");
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

  const executeDelete = async () => {
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
    <div className="mx-auto max-w-6xl space-y-8 font-mono text-xs">
      {/* Header with Navigation & Quick Actions */}
      <div className="border-line flex flex-col gap-4 border-b-[1.5px] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs font-bold uppercase"
            >
              <Link href="/admin/submissions">
                <ArrowLeftIcon weight="bold" />
                <span>Back to Submissions</span>
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground text-[11px] font-bold uppercase">
              Inspect & Sync
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight uppercase">
              Inspect: <span className="text-primary">{sub.title}</span>
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
          <p className="text-muted-foreground font-mono text-xs">
            Submitted by{" "}
            <span className="text-foreground font-semibold">
              {sub.submitterName || sub.submitterEmail || "Anonymous"}
            </span>{" "}
            on {new Date(sub.createdAt).toLocaleDateString()}. Review submitted payload above each
            field and sync selectively into the catalog editor.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSyncField("all")}
            className="border-primary/50 text-primary hover:bg-primary/10 h-9 gap-1.5 px-3 text-xs font-bold uppercase"
          >
            <LightningIcon weight="fill" className="size-4" />
            <span>Sync All Fields ➔</span>
          </Button>

          {sub.status === "approved" ? (
            <Button
              asChild
              className="h-9 gap-1.5 bg-emerald-600 px-4 text-xs font-bold text-white uppercase hover:bg-emerald-700"
            >
              <Link href={`/admin/resources?q=${encodeURIComponent(sub.title)}`}>
                <ArrowSquareOutIcon weight="bold" className="size-4" />
                <span>View in Catalog</span>
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleRequestSave("approved")}
              disabled={isWorking}
              className="h-9 gap-1.5 bg-emerald-600 px-4 text-xs font-bold text-white uppercase hover:bg-emerald-700"
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
              className="border-destructive/60 text-destructive hover:bg-destructive/10 h-9 gap-1.5 px-3 text-xs font-bold uppercase"
            >
              <XCircleIcon weight="bold" className="size-4" />
              <span>Reject</span>
            </Button>
          )}
        </div>
      </div>

      {/* Submitter Note Alert if present */}
      {sub.notes && (
        <div className="border-line/60 bg-muted/20 rounded-lg border p-4 text-[11px]">
          <span className="text-muted-foreground font-bold uppercase">Submitter Note:</span>
          <p className="text-foreground mt-0.5 italic">{sub.notes}</p>
        </div>
      )}

      {/* Main Layout: Form Controls (7 cols) + Live Real Card Preview (5 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Controls with Submitted Data Banners (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Resource URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Resource URL</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark
                  checked={Boolean(editForm.url?.trim() && isValidHttpUrl(editForm.url.trim()))}
                />
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoDetect}
                disabled={isDetecting || (!editForm.url?.trim() && !sub.url?.trim())}
                className="h-7 gap-1.5 font-mono text-[10px] font-bold uppercase"
              >
                {isDetecting ? (
                  <CircleNotchIcon weight="bold" className="size-3.5 animate-spin" />
                ) : (
                  <ArrowsClockwiseIcon weight="bold" className="text-primary size-3.5" />
                )}
                <span>Scan Live Site</span>
              </Button>
            </div>

            {/* Submitted Value Banner */}
            <SubmittedDataBanner
              label="Submitted URL"
              value={sub.url}
              onSync={() => handleSyncField("url")}
            />

            {/* Target Input Field */}
            <div className="h-9">
              <InputField
                type="url"
                value={editForm.url || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                containerClassName="h-9"
                className="font-mono text-xs"
                required
              />
            </div>
          </div>

          {/* Section 2: Title, Category, & Subtitle */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Title */}
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

              {/* Submitted Title Banner */}
              <SubmittedDataBanner
                label="Submitted"
                value={sub.title}
                onSync={() => handleSyncField("title")}
              />

              <div className="h-9">
                <InputField
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Radix UI"
                  containerClassName="h-9"
                  className="font-mono text-xs"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Category</span>
                <span className="text-destructive">*</span>
                <FieldCheckmark checked={Boolean(editForm.category?.trim())} />
              </Label>

              {/* Submitted Category Banner */}
              <SubmittedDataBanner
                label="Submitted"
                value={sub.category}
                onSync={() => handleSyncField("category")}
              />

              <div className="h-9">
                <SelectField
                  value={editForm.category || ""}
                  onValueChange={(val) => setEditForm((prev) => ({ ...prev, category: val }))}
                  options={categoryOptions}
                  triggerClassName="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Subtitle / Tagline */}
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

            {/* Submitted Subtitle Banner */}
            <SubmittedDataBanner
              label="Submitted"
              value={sub.subtitle}
              onSync={() => handleSyncField("subtitle")}
            />

            <div className="h-9">
              <InputField
                value={editForm.subtitle || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g. Unstyled, accessible React UI components"
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

            {/* Submitted Description Banner */}
            <SubmittedDataBanner
              label="Submitted"
              value={sub.description}
              onSync={() => handleSyncField("description")}
            />

            <Textarea
              value={editForm.description || ""}
              onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief overview of the tool or resource..."
              rows={4}
              className="bg-paper min-h-24 font-mono text-xs leading-relaxed"
              required
            />
          </div>

          {/* Section 4: Visuals & Media Styling */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span>Visuals & Media Styling</span>
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

            {/* Submitted Visuals Summary Banner */}
            <div className="border-line/60 bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded border p-2.5 text-[11px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-muted-foreground text-[10px] font-bold uppercase">
                  Submitted Visuals:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Favicon:</span>
                  {sub.favicon ? (
                    <div className="bg-card flex size-6 items-center justify-center rounded border p-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sub.favicon} alt="Favicon" className="size-3.5 object-contain" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-[10px] italic">None</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Icon Bg:</span>
                  <span className="bg-muted rounded px-1.5 py-0.2 text-[10px] font-bold uppercase">
                    {(sub as unknown as { iconBg?: string }).iconBg || "dark"}
                  </span>
                </div>

                {sub.ogImage && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">OG Image:</span>
                    <span className="text-foreground max-w-40 truncate text-[10px] font-mono">
                      {sub.ogImage}
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleSyncField("visuals")}
                className="text-primary hover:bg-primary/10 h-5 gap-1 px-1.5 text-[10px] font-bold uppercase"
              >
                <span>Sync</span>
                <ArrowRightIcon className="size-3" />
              </Button>
            </div>

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

          {/* Section 5: Creator Attribution (Submitted Cards + Copy + Manual Selector) */}
          <div className="space-y-4">
            <div>
              <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <UserIcon className="text-primary size-4" />
                <span>Submitted Author Details</span>
              </Label>
              <p className="text-muted-foreground text-[11px]">
                Submitted author names and links. Copy details as needed to manually add to the
                catalog database.
              </p>
            </div>

            {/* Individual Submitted Author Cards with Copy Buttons */}
            {submittedAuthorNames.length > 0 ? (
              <div className="space-y-3">
                {submittedAuthorNames.map((authorName, idx) => (
                  <div
                    key={`${authorName}-${idx}`}
                    className="border-line/70 bg-paper/40 space-y-3 rounded-lg border-[1.5px] p-3.5"
                  >
                    {/* Author Header */}
                    <div className="flex items-center gap-2">
                      <UserIcon className="text-primary size-4" />
                      <span className="text-foreground text-xs font-bold">{authorName}</span>
                      <CopyValueButton text={authorName} label="author name" />
                    </div>

                      {/* Submitted Links List with Individual Copy Buttons */}
                      <div className="border-line/40 grid grid-cols-1 gap-2.5 border-t pt-2.5 sm:grid-cols-2 text-[10px]">
                        {sub.authorWebsite ? (
                          <div className="bg-muted/30 border-line/40 flex items-center justify-between gap-2 rounded border px-2.5 py-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <GlobeIcon className="text-muted-foreground size-3.5 shrink-0" />
                              <span className="font-bold text-muted-foreground">Website:</span>
                              <span className="text-foreground truncate">{sub.authorWebsite}</span>
                            </div>
                            <CopyValueButton text={sub.authorWebsite} label="Website URL" />
                          </div>
                        ) : null}

                        {sub.authorGitHub ? (
                          <div className="bg-muted/30 border-line/40 flex items-center justify-between gap-2 rounded border px-2.5 py-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <Image
                                src="/github.svg"
                                alt="GitHub"
                                width={12}
                                height={12}
                                className="opacity-70 dark:invert shrink-0"
                              />
                              <span className="font-bold text-muted-foreground">GitHub:</span>
                              <span className="text-foreground truncate">{sub.authorGitHub}</span>
                            </div>
                            <CopyValueButton text={sub.authorGitHub} label="GitHub URL" />
                          </div>
                        ) : null}

                        {sub.authorTwitter ? (
                          <div className="bg-muted/30 border-line/40 flex items-center justify-between gap-2 rounded border px-2.5 py-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <XLogoIcon weight="bold" className="text-muted-foreground size-3.5 shrink-0" />
                              <span className="font-bold text-muted-foreground">Twitter/X:</span>
                              <span className="text-foreground truncate">{sub.authorTwitter}</span>
                            </div>
                            <CopyValueButton text={sub.authorTwitter} label="Twitter / X" />
                          </div>
                        ) : null}

                        {sub.authorLinkedIn ? (
                          <div className="bg-muted/30 border-line/40 flex items-center justify-between gap-2 rounded border px-2.5 py-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <Image
                                src="/linkedin.svg"
                                alt="LinkedIn"
                                width={12}
                                height={12}
                                className="opacity-70 shrink-0"
                              />
                              <span className="font-bold text-muted-foreground">LinkedIn:</span>
                              <span className="text-foreground truncate">{sub.authorLinkedIn}</span>
                            </div>
                            <CopyValueButton text={sub.authorLinkedIn} label="LinkedIn" />
                          </div>
                        ) : null}

                        {sub.authorYouTube ? (
                          <div className="bg-muted/30 border-line/40 flex items-center justify-between gap-2 rounded border px-2.5 py-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <Image
                                src="/youtube.svg"
                                alt="YouTube"
                                width={12}
                                height={12}
                                className="opacity-70 shrink-0"
                              />
                              <span className="font-bold text-muted-foreground">YouTube:</span>
                              <span className="text-foreground truncate">{sub.authorYouTube}</span>
                            </div>
                            <CopyValueButton text={sub.authorYouTube} label="YouTube" />
                          </div>
                        ) : null}

                        {sub.authorBlog ? (
                          <div className="bg-muted/30 border-line/40 flex items-center justify-between gap-2 rounded border px-2.5 py-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <GlobeIcon className="text-muted-foreground size-3.5 shrink-0" />
                              <span className="font-bold text-muted-foreground">Blog:</span>
                              <span className="text-foreground truncate">{sub.authorBlog}</span>
                            </div>
                            <CopyValueButton text={sub.authorBlog} label="Blog URL" />
                          </div>
                        ) : null}

                        {!sub.authorWebsite &&
                          !sub.authorGitHub &&
                          !sub.authorTwitter &&
                          !sub.authorLinkedIn &&
                          !sub.authorYouTube &&
                          !sub.authorBlog && (
                            <span className="text-muted-foreground italic col-span-2 py-1">
                              No social profile links submitted for this creator.
                            </span>
                          )}
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <div className="border-line/60 bg-muted/20 rounded-lg border p-3 text-muted-foreground italic text-xs">
                No creator was specified in this submission.
              </div>
            )}

            {/* Target Resource Author Selector */}
            <div className="border-line/60 border-t pt-3">
              <Label className="text-foreground mb-1.5 block font-mono text-xs font-bold uppercase">
                Assign Catalog Author(s) to Resource
              </Label>
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
                onSelectAuthorOption={handleSelectAuthorOption}
                suggestedAuthor={suggestedAuthor}
                onAcceptSuggestedAuthor={handleAcceptSuggestedAuthor}
                onDismissSuggestedAuthor={() => setSuggestedAuthor(null)}
                allowCustom={false}
                disabled={isWorking}
              />
            </div>
          </div>

          {/* Section 6: Additional Details & Tags */}
          <div className="border-line space-y-4 border-t pt-5">
            <div>
              <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                Additional Details & Tags
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Repository link, topic tags, and internal review notes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* GitHub Repo */}
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

                {/* Submitted GitHub Banner */}
                <SubmittedDataBanner
                  label="Submitted"
                  value={sub.github}
                  onSync={() => handleSyncField("github")}
                />

                <div className="h-9">
                  <InputField
                    type="url"
                    value={editForm.github || ""}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, github: e.target.value }))}
                    placeholder="https://github.com/owner/repo"
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              {/* Canonical Tags */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <span>Canonical Tags</span>
                  <FieldCheckmark checked={Boolean(editForm.tags?.trim())} />
                </Label>

                {/* Submitted Tags Banner */}
                <SubmittedDataBanner
                  label="Submitted"
                  value={sub.tags}
                  onSync={() => handleSyncField("tags")}
                />

                <TagPicker
                  value={editForm.tags || ""}
                  onChange={(val) => setEditForm((prev) => ({ ...prev, tags: val }))}
                  allowCustom={false}
                  placeholder="Search and select canonical tags..."
                />
              </div>
            </div>

            {/* Moderation Status & Admin Notes */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Moderation Status
                </Label>
                <div className="h-9">
                  <SelectField
                    value={editForm.status || sub.status}
                    onValueChange={(val) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: val as "pending" | "approved" | "rejected",
                      }))
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
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, adminNotes: e.target.value }))
                    }
                    placeholder="Notes about this review..."
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-6">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isWorking}
              className="text-destructive hover:bg-destructive/10 gap-1.5 text-xs uppercase"
            >
              <TrashIcon className="size-4" />
              <span>Delete Submission</span>
            </Button>

            <div className="flex flex-wrap items-center gap-2.5">
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
                onClick={() => handleRequestSave()}
                disabled={isWorking}
                className="gap-1.5 text-xs font-bold uppercase"
              >
                <FloppyDiskIcon className="size-4" />
                <span>Save Edits</span>
              </Button>

              {sub.status === "approved" ? (
                <Button
                  asChild
                  size="sm"
                  className="gap-1.5 bg-emerald-600 text-xs font-bold text-white uppercase hover:bg-emerald-700"
                >
                  <Link href={`/admin/resources?q=${encodeURIComponent(sub.title)}`}>
                    <ArrowSquareOutIcon weight="bold" className="size-4" />
                    <span>View in Catalog</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleRequestSave("approved")}
                  disabled={isWorking}
                  className="gap-1.5 bg-emerald-600 text-xs font-bold text-white uppercase hover:bg-emerald-700"
                >
                  <CheckCircleIcon weight="fill" className="size-4" />
                  <span>Approve & Publish</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Real Live Card Preview & Info (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="border-line bg-paper/40 border-[1.5px] p-5 shadow-xs">
              <h3 className="text-foreground mb-3 font-mono text-xs font-bold tracking-wider uppercase">
                Live Resource Card Preview
              </h3>
              <p className="text-muted-foreground mb-4 text-[11px]">
                Real-time preview of how this card will render in the live catalog once published.
              </p>

              <div className="flex justify-center">
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

            {/* Quick Meta Card */}
            <div className="border-line bg-paper/30 space-y-2.5 border-[1.5px] p-4 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold uppercase">Submission ID:</span>
                <span className="text-foreground font-mono">{sub.id.slice(0, 12)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold uppercase">Submitted Date:</span>
                <span className="text-foreground">{new Date(sub.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold uppercase">Submitter Email:</span>
                <span className="text-foreground">{sub.submitterEmail || "Anonymous"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Hold-to-Confirm Dialog for Deleting Submission */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={executeDelete}
        title="Delete this submission?"
        description={
          <>
            Are you sure you want to permanently delete submission{" "}
            <strong className="text-foreground">&quot;{sub.title}&quot;</strong>? This action
            cannot be undone.
          </>
        }
        confirmLabel="Hold to delete"
      />
    </div>
  );
}
