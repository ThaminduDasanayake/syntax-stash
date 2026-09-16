"use client";

import {
  ArticleIcon,
  EyeIcon,
  GlobeIcon,
  PencilSimpleIcon,
  TrashIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { parseAuthors } from "@/lib/utils";

import { AdminPingButton } from "./admin-ping-button";
import { AdminResourceItem } from "./types";

export interface AdminResourceTableProps {
  applyingRedirectId?: string | null;
  checkingHealthId?: string | null;
  isWorking?: boolean;
  onApplyRedirect?: (item: AdminResourceItem) => void;
  onCheckHealth?: (item: AdminResourceItem) => void;
  onDelete: (item: AdminResourceItem) => void;
  onEdit: (item: AdminResourceItem) => void;
  onPreview: (item: AdminResourceItem) => void;
  resources: AdminResourceItem[];
}

export function AdminResourceTable({
  applyingRedirectId,
  checkingHealthId,
  isWorking = false,
  onApplyRedirect,
  onCheckHealth,
  onDelete,
  onEdit,
  onPreview,
  resources,
}: AdminResourceTableProps) {
  return (
    <div className="border-line bg-surface/30 overflow-hidden rounded-lg border-[1.5px]">
      <Table className="font-mono text-xs">
        <TableHeader className="bg-surface/80">
          <TableRow className="border-line hover:bg-transparent">
            <TableHead className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
              Category
            </TableHead>
            <TableHead className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
              Resource
            </TableHead>
            <TableHead className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
              Health & URL
            </TableHead>
            <TableHead className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
              Author
            </TableHead>
            <TableHead className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
              Tags
            </TableHead>
            <TableHead className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
              Created
            </TableHead>
            <TableHead className="text-muted-foreground px-4 py-3 text-right text-[11px] font-bold tracking-wider uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-line divide-y">
          {resources.map((item) => {
            const authorLinks: {
              href: string;
              icon: React.ReactNode;
              key: string;
              label: string;
            }[] = [];

            if (item.authorBlog) {
              authorLinks.push({
                href: item.authorBlog,
                icon: <ArticleIcon className="size-3.5" />,
                key: "blog",
                label: "Blog",
              });
            }
            if (item.authorGithub) {
              authorLinks.push({
                href: item.authorGithub,
                icon: (
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={14}
                    height={14}
                    className="dark:invert"
                  />
                ),
                key: "github",
                label: "GitHub",
              });
            }
            if (item.authorLinkedin) {
              authorLinks.push({
                href: item.authorLinkedin,
                icon: <Image src="/linkedin.svg" alt="LinkedIn" width={14} height={14} />,
                key: "linkedin",
                label: "LinkedIn",
              });
            }
            if (item.authorTwitter) {
              authorLinks.push({
                href: item.authorTwitter,
                icon: <XLogoIcon weight="bold" className="size-3.5" />,
                key: "twitter",
                label: "X / Twitter",
              });
            }
            if (item.authorWebsite) {
              authorLinks.push({
                href: item.authorWebsite,
                icon: <GlobeIcon className="size-3.5" />,
                key: "website",
                label: "Website",
              });
            }
            if (item.authorYoutube) {
              authorLinks.push({
                href: item.authorYoutube,
                icon: <Image src="/youtube.svg" alt="YouTube" width={14} height={14} />,
                key: "youtube",
                label: "YouTube",
              });
            }

            const parsedAuthors = parseAuthors(item.authorName);

            const allTags = item.tags
              ? item.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : [];

            return (
              <TableRow
                key={item.id}
                className="border-line hover:bg-surface/60 group transition-colors"
              >
                {/* Category Badge */}
                <TableCell className="px-4 py-2.5 whitespace-nowrap">
                  <Badge
                    variant="secondary"
                    className="font-mono text-[10px] font-bold tracking-wider uppercase"
                  >
                    {item.category}
                  </Badge>
                </TableCell>

                {/* Title & Subtitle */}
                <TableCell className="min-w-50 px-4 py-2.5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground group-hover:text-primary text-xs leading-snug font-bold transition-colors">
                        {item.title}
                      </span>
                      {!item.ogImage?.trim() && (
                        <span className="py-0.2 rounded bg-amber-500/15 px-1 text-[9px] font-bold text-amber-700 dark:text-amber-400">
                          No OG
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <span className="text-muted-foreground line-clamp-1 text-[11px]">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Health & URL */}
                <TableCell className="max-w-64 px-4 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block size-2 shrink-0 rounded-full ${
                          item.healthStatus === "healthy"
                            ? "bg-emerald-500"
                            : item.healthStatus === "broken"
                              ? "animate-pulse bg-rose-500"
                              : item.healthStatus === "redirect"
                                ? "bg-amber-500"
                                : item.healthStatus === "blocked"
                                  ? "bg-yellow-500"
                                  : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-muted-foreground text-[10px] font-bold uppercase">
                        {item.healthStatus || "unchecked"}
                        {item.healthStatusCode ? ` (${item.healthStatusCode})` : ""}
                      </span>
                      {onCheckHealth && (
                        <AdminPingButton
                          showLabel={false}
                          isChecking={checkingHealthId === item.id}
                          onClick={() => onCheckHealth(item)}
                          side="top"
                          disabled={isWorking}
                        />
                      )}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary block truncate text-[11px] hover:underline"
                      title={item.url}
                    >
                      {item.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>

                    {item.healthStatus === "redirect" && item.healthRedirectUrl && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400">
                        <span className="truncate" title={item.healthRedirectUrl}>
                          ↳ {item.healthRedirectUrl}
                        </span>
                        {onApplyRedirect && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApplyRedirect(item)}
                            disabled={applyingRedirectId === item.id || isWorking}
                            className="h-5 border-amber-600/40 bg-amber-500/15 px-1.5 text-[9px] font-bold uppercase hover:bg-amber-500/25"
                          >
                            {applyingRedirectId === item.id ? "..." : "Apply"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Author */}
                <TableCell className="max-w-40 px-4 py-2.5">
                  {parsedAuthors.length > 0 ? (
                    <HoverCard openDelay={150} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <span className="text-foreground hover:text-primary inline-flex cursor-pointer items-center text-[11px] font-medium underline-offset-2 hover:underline">
                          {parsedAuthors.join(" & ")}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent
                        align="start"
                        className="w-auto max-w-xs min-w-48 font-mono"
                      >
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-foreground text-xs font-bold uppercase">
                              {parsedAuthors.join(" & ")}
                            </p>
                            <p className="text-muted-foreground text-[10px]">
                              {parsedAuthors.length > 1 ? "Resource Authors" : "Resource Author"}
                            </p>
                          </div>
                          {authorLinks.length > 0 ? (
                            <div className="border-line flex flex-wrap items-center gap-1.5 border-t pt-2">
                              {authorLinks.map(({ href, icon, key, label }) => (
                                <Button
                                  key={key}
                                  size="icon"
                                  variant="ghost"
                                  asChild
                                  className="text-muted-foreground hover:text-foreground border-line hover:border-foreground size-7 rounded-full border transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    title={label}
                                  >
                                    {icon}
                                  </a>
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground/70 border-line border-t pt-1.5 text-[10px] italic">
                              No links available
                            </p>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <span className="opacity-40">—</span>
                  )}
                </TableCell>

                {/* Tags */}
                <TableCell className="max-w-45 px-4 py-2.5">
                  {allTags.length > 0 ? (
                    <HoverCard openDelay={150} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <div className="flex cursor-pointer flex-wrap items-center gap-1">
                          {allTags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="border-line bg-surface/70 text-muted-foreground py-0.2 rounded border-[1.5px] px-1.5 text-[9px]"
                            >
                              #{tag}
                            </span>
                          ))}
                          {allTags.length > 2 && (
                            <span className="text-muted-foreground/70 self-center text-[9px] font-bold">
                              +{allTags.length - 2}
                            </span>
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent align="start" className="w-auto max-w-64 font-mono">
                        <div className="flex flex-col gap-2">
                          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                            All Tags ({allTags.length})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {allTags.map((tag) => (
                              <span
                                key={tag}
                                className="border-line bg-surface text-foreground rounded border-[1.5px] px-1.5 py-0.5 text-[10px]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <span className="opacity-40">—</span>
                  )}
                </TableCell>

                {/* Created Date */}
                <TableCell className="text-muted-foreground px-4 py-2.5 text-[11px] whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="px-4 py-2.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPreview(item)}
                          className="text-foreground hover:bg-surface-elevated"
                        >
                          <EyeIcon className="text-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Open</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CopyButton
                          textToCopy={() => JSON.stringify(item, null, 2)}
                          iconOnly
                          size="icon-xs"
                          title="Copy JSON"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Copy JSON</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(item)}
                          disabled={isWorking}
                          className="border-line hover:bg-surface size-7 p-0"
                        >
                          <PencilSimpleIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(item)}
                          disabled={isWorking}
                          className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive size-7 p-0"
                        >
                          <TrashIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
