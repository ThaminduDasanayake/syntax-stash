"use client";

import {
  ArrowCounterClockwiseIcon,
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
import { cn } from "@/lib/utils";

import { STATUS_CONFIG, SubmissionStatus } from "./types";

interface AdminSubmissionCardProps {
  copied: boolean;
  isWorking: boolean;
  onCopyTs: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onUpdateStatus: (status: "approved" | "rejected" | "pending") => void;
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
    <div className="border-line bg-surface/40 hover:bg-surface/70 rounded-lg border p-5 font-mono text-xs transition-colors">
      {/* Status & Submitter meta header */}
      <div className="border-line mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase",
              STATUS_CONFIG[sub.status as SubmissionStatus]?.badge ||
                "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                STATUS_CONFIG[sub.status as SubmissionStatus]?.dotColor || "bg-muted-foreground",
              )}
            />
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
                <span className="text-muted-foreground text-xs font-normal">— {sub.subtitle}</span>
              )}
              <span className="border-line text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase">
                {sub.category}
              </span>
            </div>

            <a
              href={sub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1 text-[11px] font-medium break-all hover:underline"
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
                      className="bg-surface border-line py-0.2 text-muted-foreground rounded border px-1.5 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1.5 text-[11px]">
              {sub.author && (
                <div className="text-foreground flex items-center gap-1.5 font-semibold">
                  <span>By {sub.author}</span>
                  <div className="text-muted-foreground flex items-center gap-1">
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
                        className="inline-flex items-center p-0.5 hover:opacity-80"
                        title="Author GitHub Profile"
                      >
                        <Image
                          src="/github.svg"
                          alt="GitHub"
                          width={14}
                          height={14}
                          className="size-3.5"
                        />
                      </a>
                    )}
                    {sub.authorYouTube && (
                      <a
                        href={sub.authorYouTube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center p-0.5 hover:opacity-80"
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
                        className="inline-flex items-center p-0.5 hover:opacity-80"
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
        <div className="border-line mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onCopyTs}
              className="gap-1 text-[11px] font-bold uppercase"
            >
              <ClipboardTextIcon weight="duotone" />
              {copied ? "Copied!" : "Copy TypeScript"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="gap-1 text-[11px] uppercase"
            >
              <PencilSimpleIcon weight="duotone" /> Edit
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {sub.status !== "approved" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus("approved")}
                disabled={isWorking}
                className={cn(
                  "gap-1.5 text-[11px] font-bold uppercase transition-all duration-150 active:scale-95",
                  STATUS_CONFIG.approved.button,
                )}
              >
                <CheckCircleIcon weight="duotone" className="size-4" /> Approve
              </Button>
            )}
            {sub.status === "rejected" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus("pending")}
                disabled={isWorking}
                className={cn(
                  "gap-1.5 text-[11px] font-bold uppercase transition-all duration-150 active:scale-95",
                  STATUS_CONFIG.pending.button,
                )}
              >
                <ArrowCounterClockwiseIcon weight="duotone" className="size-4" /> Move to Pending
              </Button>
            )}
            {sub.status !== "rejected" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus("rejected")}
                disabled={isWorking}
                className={cn(
                  "gap-1.5 text-[11px] font-bold uppercase transition-all duration-150 active:scale-95",
                  STATUS_CONFIG.rejected.button,
                )}
              >
                <XCircleIcon weight="duotone" className="size-4" /> Reject
              </Button>
            )}
            <Button
              size="icon-lg"
              variant="destructive"
              onClick={onDelete}
              disabled={isWorking}
              className="border-destructive/80 h-10"
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
