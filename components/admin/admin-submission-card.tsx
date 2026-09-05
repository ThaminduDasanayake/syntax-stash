"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  GlobeIcon,
  PencilSimpleIcon,
  TrashIcon,
  XCircleIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { Submission } from "@/lib/db/schema";

interface AdminSubmissionCardProps {
  copied: boolean;
  isWorking: boolean;
  onCopyTs: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onUpdateStatus: (status: "approved" | "rejected") => void;
  submission: Submission;
}

export function AdminSubmissionCard({
  copied,
  isWorking,
  onCopyTs,
  onDelete,
  onEdit,
  onUpdateStatus,
  submission: sub,
}: AdminSubmissionCardProps) {
  return (
    <div className="border-line/70 bg-surface/40 hover:bg-surface/70 rounded-lg border p-5 font-mono text-xs transition-colors">
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

      {/* Main Card Display */}
      <div>
        <div className="flex items-start gap-4">
          <CardIcon
            alt={sub.title}
            favicon={sub.favicon || undefined}
            className="size-11 shrink-0"
          />
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
              onClick={onCopyTs}
              className="gap-1 text-[11px] uppercase font-bold"
            >
              <ClipboardTextIcon className="size-3.5" />
              {copied ? "Copied!" : "Copy TypeScript"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="gap-1 text-[11px] uppercase"
            >
              <PencilSimpleIcon className="size-3.5" /> Edit
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {sub.status !== "approved" && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus("approved")}
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
                onClick={() => onUpdateStatus("rejected")}
                disabled={isWorking}
                className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 gap-1 text-[11px] uppercase"
              >
                <XCircleIcon className="size-3.5" /> Reject
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
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
}
