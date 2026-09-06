"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  ClipboardTextIcon,
  GlobeIcon,
  PencilSimpleIcon,
  TrashIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";

import { AdminResourceItem } from "./types";


interface AdminResourceCardProps {
  isWorking?: boolean;
  onDelete: () => void;
  onEdit: () => void;
  resource: AdminResourceItem;
}

export function AdminResourceCard({
  isWorking = false,
  onDelete,
  onEdit,
  resource: res,
}: AdminResourceCardProps) {
  const [copied, setCopied] = useState(false);

  const tagsList = res.tags
    ? res.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(res, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-line bg-surface/40 hover:bg-surface/70 rounded-lg border p-5 font-mono text-xs transition-colors">
      {/* Category & Timestamps Header */}
      <div className="border-line mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
        <div className="flex items-center gap-2">
          <span className="border-line bg-surface-elevated text-foreground rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            {res.category}
          </span>
          <span className="text-muted-foreground text-[11px]">
            Created: {new Date(res.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {res.authorName && (
            <span>
              Author:{" "}
              <strong className="text-foreground">{res.authorName}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Resource Info */}
      <div className="flex items-start gap-4">
        <CardIcon
          alt={res.title}
          favicon={res.favicon || undefined}
          className="size-11 shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-foreground text-sm font-bold tracking-tight">{res.title}</h3>
            {res.subtitle && (
              <span className="text-muted-foreground text-xs font-normal">— {res.subtitle}</span>
            )}
          </div>

          <a
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1 text-[11px] font-medium break-all hover:underline"
          >
            {res.url} <ArrowSquareOutIcon className="size-3" />
          </a>

          {res.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed font-sans">
              {res.description}
            </p>
          )}

          {/* Social / Author Links & GitHub Repo */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px]">
            {res.github && (
              <a
                href={res.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                title="GitHub Repository"
              >
                <Image
                  src="/github.svg"
                  alt="GitHub"
                  width={12}
                  height={12}
                  className="size-3 dark:invert"
                />
                <span>Repository</span>
              </a>
            )}

            {res.authorWebsite && (
              <a
                href={res.authorWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                title="Author Website"
              >
                <GlobeIcon className="size-3" />
                <span>Website</span>
              </a>
            )}

            {res.authorTwitter && (
              <a
                href={res.authorTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                title="Author Twitter/X"
              >
                <XLogoIcon className="size-3" />
                <span>X / Twitter</span>
              </a>
            )}

            {res.authorGithub && (
              <a
                href={res.authorGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                title="Author GitHub Profile"
              >
                <Image
                  src="/github.svg"
                  alt="Author GitHub"
                  width={12}
                  height={12}
                  className="size-3 dark:invert"
                />
                <span>Author GitHub</span>
              </a>
            )}

            {res.authorYoutube && (
              <a
                href={res.authorYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                title="Author YouTube"
              >
                <Image
                  src="/youtube.svg"
                  alt="YouTube"
                  width={12}
                  height={12}
                  className="size-3"
                />
                <span>YouTube</span>
              </a>
            )}

            {res.authorLinkedin && (
              <a
                href={res.authorLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                title="Author LinkedIn"
              >
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={12}
                  height={12}
                  className="size-3"
                />
                <span>LinkedIn</span>
              </a>
            )}
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1.5">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="border-line text-muted-foreground/90 bg-surface/80 rounded border px-1.5 py-0.5 text-[10px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-line mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyJson}
            className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-[11px]"
          >
            {copied ? (
              <>
                <CheckCircleIcon className="size-3 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <ClipboardTextIcon className="size-3" />
                <span>JSON</span>
              </>
            )}
          </Button>

          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-[11px]"
          >
            <a href={res.url} target="_blank" rel="noopener noreferrer">
              <ArrowSquareOutIcon className="size-3" />
              <span>Visit</span>
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            disabled={isWorking}
            className="border-line hover:bg-surface h-7 gap-1 px-2.5 text-[11px]"
          >
            <PencilSimpleIcon className="size-3" />
            <span>Edit</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            disabled={isWorking}
            className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive h-7 gap-1 px-2 text-[11px]"
          >
            <TrashIcon className="size-3" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
