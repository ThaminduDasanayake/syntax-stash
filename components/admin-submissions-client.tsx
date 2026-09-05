"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  ClipboardTextIcon,
  FloppyDiskIcon,
  GlobeIcon,
  ImageIcon,
  PencilSimpleIcon,
  SparkleIcon,
  TagIcon,
  TrashIcon,
  XCircleIcon,
  XIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { AdminSubmissionsCardsSkeleton } from "@/components/admin-submissions-skeleton";
import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { slugifyAuthor } from "@/lib/authors";
import { Submission } from "@/lib/db/schema";
import { resourceCategories } from "@/lib/resource-data";
import { cn, getCategoryTheme, Theme, THEME_CONFIG } from "@/lib/utils";

type TabStatus = "all" | "approved" | "pending" | "rejected";

interface SubmissionCounts {
  all: number;
  approved: number;
  pending: number;
  rejected: number;
}

const CATEGORY_OPTIONS = resourceCategories.map((cat) => ({
  label: cat,
  value: cat,
}));

const STATUS_OPTIONS = [
  { label: "Approved", value: "approved" },
  { label: "Pending Review", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

interface AdminSubmissionsClientProps {
  initialCounts?: SubmissionCounts;
  initialSubmissions?: Submission[];
}

export function AdminSubmissionsClient({
  initialCounts = { all: 0, approved: 0, pending: 0, rejected: 0 },
  initialSubmissions = [],
}: AdminSubmissionsClientProps) {
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [counts, setCounts] = useState<SubmissionCounts>(initialCounts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Submission>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);

  const isInitialMountRef = useRef(true);

  const fetchSubmissions = useCallback(async (status: TabStatus) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/submissions?status=${status}`);
      const data = await res.json();
      if (res.ok) {
        setSubmissions(data.submissions || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    fetchSubmissions(activeTab);
  }, [activeTab, fetchSubmissions]);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      setActionLoadingId(id);
      const res = await fetch("/api/admin/submissions", {
        body: JSON.stringify({ id, status: newStatus }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (res.ok) {
        await fetchSubmissions(activeTab);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this submission?")) return;

    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        if (editingId === id) setEditingId(null);
        await fetchSubmissions(activeTab);
      }
    } catch (err) {
      console.error("Failed to delete submission:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveEdit = async (id: string, overrideStatus?: "approved" | "rejected" | "pending") => {
    try {
      setActionLoadingId(id);
      const payload = {
        id,
        ...editForm,
        ...(overrideStatus ? { status: overrideStatus } : {}),
      };

      const res = await fetch("/api/admin/submissions", {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        await fetchSubmissions(activeTab);
      }
    } catch (err) {
      console.error("Failed to save edits:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const startEditing = (sub: Submission) => {
    setEditingId(sub.id);
    setEditForm({
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
    setCustomTheme(null);
  };

  const handleAutoDetect = async () => {
    const targetUrl = editForm.url?.trim();
    if (!targetUrl) return;

    try {
      setIsDetecting(true);
      const res = await fetch(`/api/submissions/metadata?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (res.ok && !data.error) {
        setEditForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          author: data.author || prev.author,
          authorGitHub: data.authorGitHub || prev.authorGitHub,
          authorLinkedIn: data.authorLinkedIn || prev.authorLinkedIn,
          authorTwitter: data.authorTwitter || prev.authorTwitter,
          authorWebsite: data.authorWebsite || prev.authorWebsite,
          authorYouTube: data.authorYouTube || prev.authorYouTube,
          category: data.category && resourceCategories.includes(data.category) ? data.category : prev.category,
          description: data.description || prev.description,
          favicon: data.favicon || prev.favicon,
          gitHubLink: data.gitHubLink || prev.gitHubLink,
          ogImage: data.ogImage || prev.ogImage,
        }));
      }
    } catch (err) {
      console.error("Metadata auto-detect failed:", err);
    } finally {
      setIsDetecting(false);
    }
  };

  const generateTsCode = (sub: Submission) => {
    let code = "  // --- Resource Entry ---\n  {\n";
    code += `    title: "${sub.title.replace(/"/g, '\\"')}",\n`;
    if (sub.subtitle) code += `    subtitle: "${sub.subtitle.replace(/"/g, '\\"')}",\n`;
    code += `    category: CATEGORIES.${sub.category.toLowerCase().replace(/[^a-z0-9]/g, "") || "tools"},\n`;
    code += `    description: "${sub.description.replace(/"/g, '\\"')}",\n`;
    code += `    url: "${sub.url}",\n`;
    if (sub.favicon) code += `    favicon: "${sub.favicon}",\n`;
    if (sub.ogImage) code += `    ogImage: "${sub.ogImage}",\n`;
    if (sub.author) code += `    author: "${sub.author.replace(/"/g, '\\"')}",\n`;
    const resolvedWebsite = sub.authorWebsite || sub.authorLink;
    if (resolvedWebsite) code += `    authorLink: "${resolvedWebsite}",\n`;
    if (sub.gitHubLink) code += `    gitHubLink: "${sub.gitHubLink}",\n`;
    const parsedTags = sub.tags
      ? sub.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    if (parsedTags.length > 0) {
      code += `    tags: [${parsedTags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ")}],\n`;
    } else {
      code += "    tags: [],\n";
    }
    code += "  },";

    const hasSocial =
      sub.authorTwitter ||
      sub.authorGitHub ||
      sub.authorWebsite ||
      sub.authorYouTube ||
      sub.authorLinkedIn;
    if (sub.author && hasSocial) {
      const slug = slugifyAuthor(sub.author);
      code += `\n\n  // --- Authors Registry Entry (lib/resource-data/authors.ts) ---\n`;
      code += `  "${slug}": {\n`;
      code += `    name: "${sub.author.replace(/"/g, '\\"')}",\n`;
      code += `    links: {\n`;
      if (sub.authorGitHub) code += `      github: "${sub.authorGitHub}",\n`;
      if (sub.authorLinkedIn) code += `      linkedin: "${sub.authorLinkedIn}",\n`;
      if (sub.authorTwitter) code += `      twitter: "${sub.authorTwitter}",\n`;
      if (resolvedWebsite) code += `      website: "${resolvedWebsite}",\n`;
      if (sub.authorYouTube) code += `      youtube: "${sub.authorYouTube}",\n`;
      code += `    },\n`;
      code += `  },`;
    }

    return code;
  };

  const handleCopyTsCode = (sub: Submission) => {
    const code = generateTsCode(sub);
    navigator.clipboard.writeText(code);
    setCopiedId(sub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.title.toLowerCase().includes(q) ||
      sub.description.toLowerCase().includes(q) ||
      sub.url.toLowerCase().includes(q) ||
      (sub.author && sub.author.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 border-b pb-2 sm:border-b-0 sm:pb-0 font-mono">
          {(["all", "approved", "pending", "rejected"] as TabStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-surface hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              <span>{tab}</span>
              <span className="rounded-full bg-background/40 px-1.5 py-0.2 text-[10px]">
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 font-mono">
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <AdminSubmissionsCardsSkeleton count={3} />
      ) : filteredSubmissions.length === 0 ? (
        <div className="border-line/70 bg-surface/30 rounded border p-12 text-center font-mono">
          <p className="text-muted-foreground text-sm font-semibold">
            No {activeTab === "all" ? "" : activeTab} submissions found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSubmissions.map((sub) => {
            const isEditing = editingId === sub.id;
            const isWorking = actionLoadingId === sub.id;

            if (isEditing) {
              const activeCategory = editForm.category || sub.category || "Generators";
              const currentTheme: Theme = customTheme ?? getCategoryTheme(activeCategory);
              const themeClasses = THEME_CONFIG[currentTheme].bg;
              const isBlue = currentTheme === "blue";

              return (
                <div
                  key={sub.id}
                  className="border-primary/60 bg-paper/60 rounded-lg border-2 p-6 font-mono text-xs shadow-md"
                >
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
                      onClick={() => setEditingId(null)}
                      className="text-muted-foreground hover:text-foreground size-8 p-0"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>

                  {/* 2-Column Responsive Layout: Form (7 cols) + Real Card Preview (5 cols) */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Form Controls Column */}
                    <div className="space-y-6 lg:col-span-7">
                      {/* Section 1: Tool URL with Auto-Fill */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-foreground font-mono text-xs font-bold uppercase">
                            Tool URL <span className="text-destructive">*</span>
                          </Label>
                          <span className="text-muted-foreground text-[10px]">
                            Auto-sync metadata from website
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
                              <SparkleIcon weight="fill" className="text-primary size-3.5" />
                            )}
                            {isDetecting ? "Fetching..." : "Auto-Fill"}
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
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          rows={3}
                          className="bg-paper min-h-20 font-mono text-xs leading-relaxed"
                          required
                        />
                      </div>

                      {/* Section 4: Visuals & Media */}
                      <div className="border-line/40 space-y-4 border-t pt-4">
                        <div>
                          <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                            Visual Assets & Media
                          </h4>
                          <p className="text-muted-foreground text-[11px]">
                            Favicon URL and OpenGraph image banner.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                                Favicon URL
                              </Label>
                              {editForm.favicon && (
                                <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                                  <CardIcon
                                    alt="favicon"
                                    favicon={editForm.favicon}
                                    className="size-4"
                                  />
                                  <span>Preview</span>
                                </span>
                              )}
                            </div>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.favicon || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, favicon: e.target.value })
                                }
                                placeholder="https://example.com/favicon.ico"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                                OG Image URL
                              </Label>
                              {editForm.ogImage && (
                                <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                                  <ImageIcon className="size-4" />
                                  <span>Image Set</span>
                                </span>
                              )}
                            </div>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.ogImage || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, ogImage: e.target.value })
                                }
                                placeholder="https://example.com/og.png"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* OG Image Preview Thumbnail */}
                        {editForm.ogImage && (
                          <div className="border-line/40 bg-paper/80 flex items-center gap-3 border p-2.5 rounded">
                            <div className="border-line/60 relative h-12 w-20 shrink-0 overflow-hidden border bg-black/10 rounded">
                              <Image
                                src={editForm.ogImage}
                                alt="OG Image Preview"
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                                OG Image Banner Preview
                              </span>
                              <span className="text-foreground/80 block truncate font-mono text-[11px]">
                                {editForm.ogImage}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section 5: Creator Attribution */}
                      <div className="border-line/40 space-y-4 border-t pt-4">
                        <div>
                          <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                            Creator Attribution & Links
                          </h4>
                          <p className="text-muted-foreground text-[11px]">
                            Credit author with individual portfolio and social platforms.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-foreground font-mono text-xs font-bold uppercase">
                              Creator / Author Name
                            </Label>
                            <div className="h-9">
                              <InputField
                                value={editForm.author || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, author: e.target.value })
                                }
                                placeholder="e.g. Jane Doe"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                              <GlobeIcon className="text-muted-foreground size-3.5" /> Website / Portfolio
                            </Label>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.authorWebsite || editForm.authorLink || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    authorLink: e.target.value,
                                    authorWebsite: e.target.value,
                                  })
                                }
                                placeholder="https://janedoe.com"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                              <XLogoIcon weight="bold" className="text-muted-foreground size-3.5" /> X / Twitter
                            </Label>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.authorTwitter || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, authorTwitter: e.target.value })
                                }
                                placeholder="https://x.com/username"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                              <Image
                                src="/github.svg"
                                alt="GitHub"
                                width={14}
                                height={14}
                                className="size-3.5 dark:invert"
                              />
                              <span>GitHub Profile</span>
                            </Label>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.authorGitHub || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, authorGitHub: e.target.value })
                                }
                                placeholder="https://github.com/username"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                              <Image
                                src="/youtube.svg"
                                alt="YouTube"
                                width={14}
                                height={14}
                                className="size-3.5"
                              />
                              <span>YouTube Channel</span>
                            </Label>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.authorYouTube || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, authorYouTube: e.target.value })
                                }
                                placeholder="https://youtube.com/@channel"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                              <Image
                                src="/linkedin.svg"
                                alt="LinkedIn"
                                width={14}
                                height={14}
                                className="size-3.5"
                              />
                              <span>LinkedIn Profile</span>
                            </Label>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.authorLinkedIn || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, authorLinkedIn: e.target.value })
                                }
                                placeholder="https://linkedin.com/in/username"
                                containerClassName="h-9"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

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
                            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                              <Image
                                src="/github.svg"
                                alt="GitHub"
                                width={14}
                                height={14}
                                className="size-3.5 dark:invert"
                              />
                              <span>GitHub Repository (Optional)</span>
                            </Label>
                            <div className="h-9">
                              <InputField
                                type="url"
                                value={editForm.gitHubLink || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, gitHubLink: e.target.value })
                                }
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
                                onChange={(e) =>
                                  setEditForm({ ...editForm, tags: e.target.value })
                                }
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
                                onChange={(e) =>
                                  setEditForm({ ...editForm, adminNotes: e.target.value })
                                }
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
                        <div className="border-line bg-paper/50 border p-5 font-mono text-xs rounded-lg">
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                            <span className="text-foreground font-bold tracking-wider uppercase">
                              Card Preview
                            </span>

                            {/* Theme switcher */}
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-[10px] font-bold uppercase">
                                Theme:
                              </span>
                              <span className="hero-eyebrow-dots">
                                <button
                                  type="button"
                                  onClick={() => setCustomTheme("orange")}
                                  title="Orange theme"
                                  className={cn(
                                    "bg-c-orange size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                                    currentTheme === "orange"
                                      ? "ring-ink opacity-100 ring-1 ring-inset"
                                      : "opacity-60",
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => setCustomTheme("blue")}
                                  title="Blue theme"
                                  className={cn(
                                    "bg-c-blue size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                                    currentTheme === "blue"
                                      ? "ring-ink opacity-100 ring-1 ring-inset"
                                      : "opacity-60",
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => setCustomTheme("pink")}
                                  title="Pink theme"
                                  className={cn(
                                    "bg-c-pink size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                                    currentTheme === "pink"
                                      ? "ring-ink opacity-100 ring-1 ring-inset"
                                      : "opacity-60",
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => setCustomTheme("green")}
                                  title="Green theme"
                                  className={cn(
                                    "bg-c-green size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                                    currentTheme === "green"
                                      ? "ring-ink opacity-100 ring-1 ring-inset"
                                      : "opacity-60",
                                  )}
                                />
                              </span>
                            </div>
                          </div>

                          {/* Rendered Syntax Stash Card */}
                          <div className="mx-auto w-full max-w-76">
                            <article className={cn("card group", themeClasses)}>
                              <div className="card-inner">
                                <div className="card-face">
                                  <div className="card-header">
                                    <span className="card-meta">{activeCategory}</span>
                                    <CardIcon
                                      alt={editForm.title || "Preview"}
                                      favicon={editForm.favicon || undefined}
                                    />
                                  </div>

                                  <h3 className="card-title">
                                    {editForm.title || sub.title || "Resource Title"}
                                  </h3>

                                  {editForm.subtitle && (
                                    <p className="card-subtitle">{editForm.subtitle}</p>
                                  )}

                                  <p className="card-description">
                                    {editForm.description ||
                                      sub.description ||
                                      "Tool description preview will appear here."}
                                  </p>

                                  {editForm.tags && (
                                    <div className="mt-2 flex flex-wrap items-center gap-1">
                                      {editForm.tags
                                        .split(",")
                                        .map((t) => t.trim())
                                        .filter(Boolean)
                                        .slice(0, 3)
                                        .map((t) => (
                                          <span
                                            key={t}
                                            className={cn(
                                              "py-0.2 inline-flex items-center gap-0.5 rounded px-1.5 font-mono text-[9px]",
                                              isBlue ? "bg-paper/20 text-paper" : "bg-ink/10 text-ink",
                                            )}
                                          >
                                            <TagIcon className="size-2.5" />
                                            {t}
                                          </span>
                                        ))}
                                    </div>
                                  )}

                                  <div className="card-footer">
                                    <div className="flex min-w-0 items-center gap-2">
                                      {editForm.author ? (
                                        <span className="card-author truncate">
                                          {editForm.author}
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {editForm.url && (
                                        <a
                                          href={editForm.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={cn(
                                            "inline-flex items-center justify-center p-1 transition-transform hover:scale-110",
                                            isBlue ? "text-paper" : "text-ink",
                                          )}
                                          title="Open Link"
                                        >
                                          <ArrowSquareOutIcon weight="bold" className="size-4" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="border-line/50 mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(sub.id)}
                      disabled={isWorking}
                      className="text-destructive hover:bg-destructive/10 gap-1 text-xs uppercase"
                    >
                      <TrashIcon className="size-3.5" /> Delete Submission
                    </Button>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="text-xs uppercase"
                      >
                        Cancel
                      </Button>

                      {sub.status !== "approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(sub.id, "approved")}
                          disabled={isWorking}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold uppercase"
                        >
                          <CheckCircleIcon weight="fill" className="size-4" /> Approve & Save
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(sub.id)}
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

            return (
              <div
                key={sub.id}
                className="border-line/70 bg-surface/40 hover:bg-surface/70 rounded-lg border p-5 font-mono text-xs transition-colors"
              >
                {/* Status & Submitter meta header */}
                <div className="border-line/40 mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        sub.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : sub.status === "rejected"
                            ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Submitted: {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {sub.submitterEmail && (
                    <span className="text-muted-foreground/80 text-[11px]">
                      By: {sub.submitterName || sub.submitterEmail} ({sub.submitterEmail})
                    </span>
                  )}
                </div>

                {/* Standard Card Display */}
                <div>
                  <div className="flex items-start gap-4">
                    <CardIcon
                      alt={sub.title}
                      favicon={sub.favicon || undefined}
                      className="size-11 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-foreground text-sm font-bold tracking-tight">
                          {sub.title}
                        </h3>
                        {sub.subtitle && (
                          <span className="text-muted-foreground text-xs font-normal">
                            — {sub.subtitle}
                          </span>
                        )}
                        <span className="border-line text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] uppercase font-bold">
                          {sub.category}
                        </span>
                      </div>

                      <a
                        href={sub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1 text-[11px] font-medium break-all"
                      >
                        {sub.url} <ArrowSquareOutIcon className="size-3" />
                      </a>

                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {sub.description}
                      </p>

                      {sub.tags && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {sub.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="bg-surface border-line/60 rounded border px-1.5 py-0.2 text-[10px] text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1.5 text-[11px]">
                        {sub.author && (
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <span>By {sub.author}</span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              {(sub.authorWebsite || sub.authorLink) && (
                                <a
                                  href={sub.authorWebsite || sub.authorLink || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-primary p-0.5"
                                  title="Author Website"
                                >
                                  <GlobeIcon className="size-3.5" />
                                </a>
                              )}
                              {sub.authorTwitter && (
                                <a
                                  href={sub.authorTwitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-primary p-0.5"
                                  title="Author X / Twitter"
                                >
                                  <XLogoIcon weight="bold" className="size-3.5" />
                                </a>
                              )}
                              {sub.authorGitHub && (
                                <a
                                  href={sub.authorGitHub}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:opacity-80 p-0.5 inline-flex items-center"
                                  title="Author GitHub Profile"
                                >
                                  <Image
                                    src="/github.svg"
                                    alt="GitHub"
                                    width={14}
                                    height={14}
                                    className="size-3.5 dark:invert"
                                  />
                                </a>
                              )}
                              {sub.authorYouTube && (
                                <a
                                  href={sub.authorYouTube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:opacity-80 p-0.5 inline-flex items-center"
                                  title="Author YouTube Channel"
                                >
                                  <Image
                                    src="/youtube.svg"
                                    alt="YouTube"
                                    width={14}
                                    height={14}
                                    className="size-3.5"
                                  />
                                </a>
                              )}
                              {sub.authorLinkedIn && (
                                <a
                                  href={sub.authorLinkedIn}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:opacity-80 p-0.5 inline-flex items-center"
                                  title="Author LinkedIn Profile"
                                >
                                  <Image
                                    src="/linkedin.svg"
                                    alt="LinkedIn"
                                    width={14}
                                    height={14}
                                    className="size-3.5"
                                  />
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {sub.gitHubLink && (
                          <a
                            href={sub.gitHubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold underline"
                          >
                            GitHub Repo <ArrowSquareOutIcon className="size-3" />
                          </a>
                        )}

                        {sub.ogImage && (
                          <a
                            href={sub.ogImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] underline"
                          >
                            OG Image <ArrowSquareOutIcon className="size-3" />
                          </a>
                        )}
                      </div>

                      {sub.notes && (
                        <div className="bg-background/80 text-muted-foreground mt-2 rounded p-2 text-[11px] italic">
                          💬 Submitter Note: &ldquo;{sub.notes}&rdquo;
                        </div>
                      )}
                      {sub.adminNotes && (
                        <div className="bg-primary/10 text-primary mt-1 rounded p-2 text-[11px]">
                          📌 Admin Note: {sub.adminNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="border-line/40 mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyTsCode(sub)}
                        className="gap-1 text-[11px] uppercase font-bold"
                      >
                        <ClipboardTextIcon className="size-3.5" />
                        {copiedId === sub.id ? "Copied!" : "Copy TypeScript"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(sub)}
                        className="gap-1 text-[11px] uppercase"
                      >
                        <PencilSimpleIcon className="size-3.5" /> Edit
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.status !== "approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(sub.id, "approved")}
                          disabled={isWorking}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-[11px] uppercase font-bold"
                        >
                          <CheckCircleIcon weight="fill" className="size-3.5" /> Approve
                        </Button>
                      )}
                      {sub.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(sub.id, "rejected")}
                          disabled={isWorking}
                          className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 gap-1 text-[11px] uppercase"
                        >
                          <XCircleIcon className="size-3.5" /> Reject
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(sub.id)}
                        disabled={isWorking}
                        className="text-muted-foreground hover:text-destructive p-2"
                        aria-label="Delete submission"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
