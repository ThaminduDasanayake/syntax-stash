"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  ClipboardTextIcon,
  FloppyDiskIcon,
  GithubLogoIcon,
  GlobeIcon,
  LinkedinLogoIcon,
  PencilSimpleIcon,
  TrashIcon,
  XCircleIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugifyAuthor } from "@/lib/authors";
import { Submission } from "@/lib/db/schema";
import { resourceCategories } from "@/lib/resource-data";

type TabStatus = "all" | "approved" | "pending" | "rejected";

interface SubmissionCounts {
  all: number;
  approved: number;
  pending: number;
  rejected: number;
}

export function AdminSubmissionsClient() {
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [counts, setCounts] = useState<SubmissionCounts>({
    all: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Submission>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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
        await fetchSubmissions(activeTab);
      }
    } catch (err) {
      console.error("Failed to delete submission:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await fetch("/api/admin/submissions", {
        body: JSON.stringify({ id, ...editForm }),
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
      authorWebsite: sub.authorWebsite || "",
      authorYouTube: sub.authorYouTube || "",
      category: sub.category,
      description: sub.description,
      favicon: sub.favicon || "",
      gitHubLink: sub.gitHubLink || "",
      ogImage: sub.ogImage || "",
      subtitle: sub.subtitle || "",
      tags: sub.tags || "",
      url: sub.url,
    });
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

    // If author and social links exist, append Authors Registry snippet
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
        <div className="flex flex-wrap items-center gap-1.5 border-b pb-2 sm:border-b-0 sm:pb-0">
          {(["all", "approved", "pending", "rejected"] as TabStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              <span>{tab}</span>
              <span className="rounded-full bg-background/30 px-1.5 py-0.2 text-[10px]">
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-mono text-xs"
          />
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <CircleNotchIcon className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="border-line/70 bg-surface/30 rounded border p-12 text-center font-mono">
          <p className="text-muted-foreground text-sm font-semibold">
            No {activeTab === "all" ? "" : activeTab} submissions found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSubmissions.map((sub) => {
            const isEditing = editingId === sub.id;
            const isWorking = actionLoadingId === sub.id;

            return (
              <div
                key={sub.id}
                className="border-line/70 bg-surface/40 hover:bg-surface/70 rounded border p-5 font-mono text-xs transition-colors"
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

                {isEditing ? (
                  /* Edit Form Mode */
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Title</label>
                        <Input
                          value={editForm.title || ""}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Subtitle</label>
                        <Input
                          value={editForm.subtitle || ""}
                          onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                          placeholder="e.g. Modern React UI library"
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Category</label>
                        <select
                          value={editForm.category || sub.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="border-input bg-background text-foreground flex h-9 w-full rounded border px-3 py-1 font-mono text-xs"
                        >
                          {resourceCategories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">URL</label>
                        <Input
                          value={editForm.url || ""}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-muted-foreground text-[10px] font-bold uppercase">Description</label>
                      <textarea
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        className="border-input bg-background text-foreground flex w-full rounded border p-2 font-mono text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Favicon URL</label>
                        <Input
                          value={editForm.favicon || ""}
                          onChange={(e) => setEditForm({ ...editForm, favicon: e.target.value })}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">OG Image URL</label>
                        <Input
                          value={editForm.ogImage || ""}
                          onChange={(e) => setEditForm({ ...editForm, ogImage: e.target.value })}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Author Name</label>
                        <Input
                          value={editForm.author || ""}
                          onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Author Website / Portfolio</label>
                        <Input
                          value={editForm.authorWebsite || editForm.authorLink || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              authorLink: e.target.value,
                              authorWebsite: e.target.value,
                            })
                          }
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Author X / Twitter</label>
                        <Input
                          value={editForm.authorTwitter || ""}
                          onChange={(e) => setEditForm({ ...editForm, authorTwitter: e.target.value })}
                          placeholder="https://x.com/username"
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Author GitHub Profile</label>
                        <Input
                          value={editForm.authorGitHub || ""}
                          onChange={(e) => setEditForm({ ...editForm, authorGitHub: e.target.value })}
                          placeholder="https://github.com/username"
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Author YouTube Channel</label>
                        <Input
                          value={editForm.authorYouTube || ""}
                          onChange={(e) => setEditForm({ ...editForm, authorYouTube: e.target.value })}
                          placeholder="https://youtube.com/@channel"
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Author LinkedIn Profile</label>
                        <Input
                          value={editForm.authorLinkedIn || ""}
                          onChange={(e) => setEditForm({ ...editForm, authorLinkedIn: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Project GitHub Repo</label>
                        <Input
                          value={editForm.gitHubLink || ""}
                          onChange={(e) => setEditForm({ ...editForm, gitHubLink: e.target.value })}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">Tags (comma separated)</label>
                        <Input
                          value={editForm.tags || ""}
                          onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                          placeholder="react, tailwind, ui"
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-muted-foreground text-[10px] font-bold uppercase">Admin Notes</label>
                      <Input
                        placeholder="Internal notes about this review..."
                        value={editForm.adminNotes || ""}
                        onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                        className="font-mono text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="text-xs uppercase"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(sub.id)}
                        disabled={isWorking}
                        className="gap-1 text-xs uppercase"
                      >
                        <FloppyDiskIcon className="size-3.5" /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Standard Card Display */
                  <div>
                    <div className="flex items-start gap-4">
                      <CardIcon alt={sub.title} favicon={sub.favicon || undefined} className="size-11 shrink-0" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-foreground text-sm font-bold tracking-tight">{sub.title}</h3>
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

                        <p className="text-muted-foreground text-xs leading-relaxed">{sub.description}</p>

                        {sub.tags && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {sub.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                              <span key={tag} className="bg-surface border-line/60 rounded border px-1.5 py-0.2 text-[10px] text-muted-foreground">
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
                                    className="hover:text-primary p-0.5"
                                    title="Author GitHub Profile"
                                  >
                                    <GithubLogoIcon weight="fill" className="size-3.5" />
                                  </a>
                                )}
                                {sub.authorYouTube && (
                                  <a
                                    href={sub.authorYouTube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary p-0.5"
                                    title="Author YouTube Channel"
                                  >
                                    <YoutubeLogoIcon weight="fill" className="size-3.5" />
                                  </a>
                                )}
                                {sub.authorLinkedIn && (
                                  <a
                                    href={sub.authorLinkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary p-0.5"
                                    title="Author LinkedIn Profile"
                                  >
                                    <LinkedinLogoIcon weight="fill" className="size-3.5" />
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
