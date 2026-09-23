"use client";

import { TrayIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminSubmissionCard, StatusTabs, SubmissionCounts, TabStatus } from "@/components/admin";
import { AdminSubmissionsCardsSkeleton } from "@/components/admin/submissions/admin-submissions-skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
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
  const [deletingSubmission, setDeletingSubmission] = useState<Submission | null>(null);
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
      <StatusTabs
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
        <EmptyState
          variant="card"
          icon={<TrayIcon className="size-6" />}
          title={activeTab === "all" ? "No Submissions Found" : `No ${activeTab} Submissions`}
          description={
            searchQuery
              ? `No submissions match "${searchQuery}". Try clearing your search query.`
              : `There are currently no ${activeTab === "all" ? "" : activeTab} submissions to review.`
          }
          action={
            searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs uppercase"
              >
                Clear Search
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSubmissions.map((sub) => (
            <AdminSubmissionCard
              key={sub.id}
              submission={sub}
              isWorking={actionLoadingId === sub.id}
              onDelete={() => setDeletingSubmission(sub)}
              onUpdateStatus={(status) => handleUpdateStatus(sub.id, status)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deletingSubmission)}
        onOpenChange={(open) => !open && setDeletingSubmission(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this submission?"
        description={
          <>
            Are you sure you want to permanently delete submission{" "}
            <strong className="text-foreground">&quot;{deletingSubmission?.title}&quot;</strong>?
            This action cannot be undone.
          </>
        }
        confirmLabel="Hold to delete"
      />
    </div>
  );
}
