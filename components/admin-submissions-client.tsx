"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AdminStatusTabs,
  AdminSubmissionCard,
  AdminSubmissionEditForm,
  generateTsCode,
  SubmissionCounts,
  TabStatus,
} from "@/components/admin";
import { AdminSubmissionsCardsSkeleton } from "@/components/admin-submissions-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Submission } from "@/lib/db/schema";

interface AdminSubmissionsClientProps {
  initialCounts?: SubmissionCounts;
  initialSubmissions?: Submission[];
}

export function AdminSubmissionsClient({
  _initialCounts,
  initialSubmissions = [],
}: AdminSubmissionsClientProps & { _initialCounts?: SubmissionCounts }) {
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>(initialSubmissions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingSubmission, setDeletingSubmission] = useState<Submission | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Background refresh handler (used if initial submissions were not preloaded)
  const refreshSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/submissions?status=all`);
      const data = await res.json();
      if (res.ok && data.submissions) {
        setAllSubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Failed to refresh submissions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialSubmissions.length === 0) {
      refreshSubmissions();
    }
  }, [initialSubmissions.length, refreshSubmissions]);

  // Compute counts dynamically from cached in-memory submissions
  const counts: SubmissionCounts = {
    all: allSubmissions.length,
    approved: allSubmissions.filter((s) => s.status === "approved").length,
    pending: allSubmissions.filter((s) => s.status === "pending").length,
    rejected: allSubmissions.filter((s) => s.status === "rejected").length,
  };

  // Optimistic Status Update: Instant UI response + Toast + Background API persistence
  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected" | "pending") => {
    const target = allSubmissions.find((s) => s.id === id);
    const previousSubmissions = allSubmissions;
    const itemTitle = target?.title ? `"${target.title}"` : "Submission";

    // 1. Optimistically update in-memory state
    setAllSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus, updatedAt: new Date() } : s)),
    );

    // 2. Immediate feedback toast
    if (newStatus === "approved") {
      toast.success(`${itemTitle} approved successfully.`);
    } else if (newStatus === "rejected") {
      toast.warning(`${itemTitle} marked as rejected.`);
    } else {
      toast.info(`${itemTitle} moved back to pending queue.`);
    }

    // 3. Background API sync with rollback on failure
    try {
      setActionLoadingId(id);
      const res = await fetch("/api/admin/submissions", {
        body: JSON.stringify({ id, status: newStatus }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to update status on server");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setAllSubmissions(previousSubmissions);
      toast.error(`Failed to update status for ${itemTitle}. Reverted changes.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Optimistic Delete: Instant UI removal + Toast + Background API call
  const handleConfirmDelete = async () => {
    if (!deletingSubmission) return;
    const target = deletingSubmission;
    const previousSubmissions = allSubmissions;
    const itemTitle = `"${target.title}"`;

    // 1. Optimistically remove from state
    setAllSubmissions((prev) => prev.filter((s) => s.id !== target.id));
    if (editingId === target.id) setEditingId(null);
    setDeletingSubmission(null);

    // 2. Immediate feedback toast
    toast.success(`${itemTitle} permanently deleted.`);

    // 3. Background API sync
    try {
      setActionLoadingId(target.id);
      const res = await fetch(`/api/admin/submissions?id=${target.id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete submission on server");
      }
    } catch (err) {
      console.error("Failed to delete submission:", err);
      setAllSubmissions(previousSubmissions);
      toast.error(`Failed to delete ${itemTitle}. Reverted changes.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Optimistic Edit & Save: Instant UI update + Toast + Background API call
  const handleSaveEdit = async (
    id: string,
    formData: Partial<Submission>,
    overrideStatus?: "approved" | "rejected" | "pending",
  ) => {
    const target = allSubmissions.find((s) => s.id === id);
    const previousSubmissions = allSubmissions;
    const itemTitle = `"${formData.title || target?.title || "Submission"}"`;

    // 1. Optimistically update state
    setAllSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...formData,
              ...(overrideStatus ? { status: overrideStatus } : {}),
              updatedAt: new Date(),
            }
          : s,
      ),
    );

    setEditingId(null);

    // 2. Immediate feedback toast
    if (overrideStatus === "approved") {
      toast.success(`${itemTitle} updated and approved.`);
    } else if (overrideStatus === "rejected") {
      toast.warning(`${itemTitle} updated and rejected.`);
    } else if (overrideStatus === "pending") {
      toast.info(`${itemTitle} updated and moved to pending.`);
    } else {
      toast.success(`Changes saved for ${itemTitle}.`);
    }

    // 3. Background API sync
    try {
      setActionLoadingId(id);
      const payload = {
        id,
        ...formData,
        ...(overrideStatus ? { status: overrideStatus } : {}),
      };

      const res = await fetch("/api/admin/submissions", {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to save edits on server");
      }
    } catch (err) {
      console.error("Failed to save edits:", err);
      setAllSubmissions(previousSubmissions);
      toast.error(`Failed to save edits for ${itemTitle}. Reverted changes.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyTsCode = (sub: Submission) => {
    const code = generateTsCode(sub);
    navigator.clipboard.writeText(code);
    setCopiedId(sub.id);
    toast.info(`TypeScript entry copied for "${sub.title}".`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Instant client-side filtering by active tab and search query
  const filteredSubmissions = allSubmissions.filter((sub) => {
    if (activeTab !== "all" && sub.status !== activeTab) return false;
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
      {/* Top Tabs & Search Bar */}
      <AdminStatusTabs
        activeTab={activeTab}
        counts={counts}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Submissions List / Loading Skeleton / Empty State */}
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
          {filteredSubmissions.map((sub) =>
            editingId === sub.id ? (
              <AdminSubmissionEditForm
                key={sub.id}
                submission={sub}
                isWorking={actionLoadingId === sub.id}
                onCancel={() => setEditingId(null)}
                onDelete={() => setDeletingSubmission(sub)}
                onSave={handleSaveEdit}
              />
            ) : (
              <AdminSubmissionCard
                key={sub.id}
                submission={sub}
                copied={copiedId === sub.id}
                isWorking={actionLoadingId === sub.id}
                onCopyTs={() => handleCopyTsCode(sub)}
                onEdit={() => setEditingId(sub.id)}
                onDelete={() => setDeletingSubmission(sub)}
                onUpdateStatus={(status) => handleUpdateStatus(sub.id, status)}
              />
            ),
          )}
        </div>
      )}

      {/* Custom Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deletingSubmission)}
        onOpenChange={(open) => !open && setDeletingSubmission(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">&ldquo;{deletingSubmission?.title}&rdquo;</strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(actionLoadingId)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={Boolean(actionLoadingId)}
            >
              {actionLoadingId ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
