"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  initialCounts = { all: 0, approved: 0, pending: 0, rejected: 0 },
  initialSubmissions = [],
}: AdminSubmissionsClientProps) {
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [counts, setCounts] = useState<SubmissionCounts>(initialCounts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingSubmission, setDeletingSubmission] = useState<Submission | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

  const handleUpdateStatus = async (
    id: string,
    newStatus: "approved" | "rejected" | "pending",
  ) => {
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

  const handleConfirmDelete = async () => {
    if (!deletingSubmission) return;
    const id = deletingSubmission.id;

    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Submission permanently deleted.");
        if (editingId === id) setEditingId(null);
        await fetchSubmissions(activeTab);
      } else {
        toast.error("Failed to delete submission.");
      }
    } catch (err) {
      console.error("Failed to delete submission:", err);
      toast.error("Failed to delete submission.");
    } finally {
      setActionLoadingId(null);
      setDeletingSubmission(null);
    }
  };

  const handleSaveEdit = async (
    id: string,
    formData: Partial<Submission>,
    overrideStatus?: "approved" | "rejected" | "pending",
  ) => {
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

      if (res.ok) {
        setEditingId(null);
        await fetchSubmissions(activeTab);
      }
    } catch (err) {
      console.error("Failed to save edits:", err);
    } finally {
      setActionLoadingId(null);
    }
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
              <strong className="text-foreground">
                &ldquo;{deletingSubmission?.title}&rdquo;
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(actionLoadingId)}>
              Cancel
            </AlertDialogCancel>
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
