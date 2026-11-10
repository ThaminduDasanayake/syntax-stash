"use client";

import { ArticleIcon, GlobeIcon, XLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AuthorLinks } from "@/types";

export interface AuthorLinkInput {
  blog?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  youtube?: string | null;
}

export interface AuthorSocialLinksProps {
  buttonClassName?: string;
  className?: string;
  detailedTooltip?: boolean;
  emptyFallback?: React.ReactNode;
  interactive?: boolean;
  links?: AuthorLinks | AuthorLinkInput | null;
  size?: "xs" | "sm" | "md";
  variant?: "subtle" | "outline";
  withTooltip?: boolean;
}

interface SocialConfigItem {
  key: keyof AuthorLinkInput;
  label: string;
  normalize: (raw: string) => string;
  renderIcon: (iconClass: string, imgSize: number) => React.ReactNode;
}

function normalizeHttpUrl(raw: string): string {
  return raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
}

/* eslint-disable perfectionist/sort-arrays */
const SOCIAL_ITEMS: SocialConfigItem[] = [
  {
    key: "website",
    label: "Website",
    normalize: normalizeHttpUrl,
    renderIcon: (iconClass) => <GlobeIcon weight="bold" className={iconClass} />,
  },
  {
    key: "github",
    label: "GitHub",
    normalize: (raw) =>
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `https://github.com/${raw.replace(/^@/, "")}`,
    renderIcon: (iconClass, imgSize) => (
      <Image
        src="/github.svg"
        alt="GitHub"
        width={imgSize}
        height={imgSize}
        className={cn(
          iconClass,
          "opacity-80 transition-opacity group-hover/author-link:opacity-100",
        )}
      />
    ),
  },
  {
    key: "twitter",
    label: "X / Twitter",
    normalize: (raw) =>
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `https://x.com/${raw.replace(/^@/, "")}`,
    renderIcon: (iconClass) => <XLogoIcon weight="bold" className={iconClass} />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    normalize: (raw) =>
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `https://linkedin.com/in/${raw}`,
    renderIcon: (iconClass, imgSize) => (
      <Image
        src="/linkedin.svg"
        alt="LinkedIn"
        width={imgSize}
        height={imgSize}
        className={cn(
          iconClass,
          "opacity-80 transition-opacity group-hover/author-link:opacity-100",
        )}
      />
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    normalize: (raw) =>
      raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://youtube.com/${raw}`,
    renderIcon: (iconClass, imgSize) => (
      <Image
        src="/youtube.svg"
        alt="YouTube"
        width={imgSize}
        height={imgSize}
        className={cn(
          iconClass,
          "opacity-80 transition-opacity group-hover/author-link:opacity-100",
        )}
      />
    ),
  },
  {
    key: "blog",
    label: "Blog",
    normalize: normalizeHttpUrl,
    renderIcon: (iconClass) => <ArticleIcon weight="bold" className={iconClass} />,
  },
];
/* eslint-enable perfectionist/sort-arrays */

const SIZE_CLASSES: Record<"xs" | "sm" | "md", { button: string; icon: string; img: number }> = {
  md: { button: "size-8 rounded-lg", icon: "size-4", img: 16 },
  sm: { button: "size-7 rounded-full", icon: "size-3.5", img: 14 },
  xs: { button: "size-6 rounded-md", icon: "size-3.5", img: 14 },
};

const VARIANT_CLASSES: Record<"subtle" | "outline", string> = {
  outline:
    "border-line-2 bg-paper/60 text-muted-foreground hover:border-foreground hover:text-foreground border-[1.5px] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0",
  subtle:
    "hover:border-primary/40 hover:bg-primary/10 border-[1.5px] border-white/10 bg-white/[0.03] text-zinc-400 transition-[transform,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:text-white active:scale-95",
};
export function AuthorSocialLinks({
  buttonClassName,
  className,
  detailedTooltip = false,
  emptyFallback = null,
  interactive = true,
  links,
  size = "sm",
  variant = "subtle",
  withTooltip = true,
}: AuthorSocialLinksProps) {
  if (!links) {
    return <>{emptyFallback}</>;
  }

  const activeItems = SOCIAL_ITEMS.flatMap((item) => {
    const raw = links[item.key]?.trim();
    if (!raw) return [];
    return [{ ...item, href: item.normalize(raw), raw }];
  });

  if (activeItems.length === 0) {
    return <>{emptyFallback}</>;
  }

  const sizeSpec = SIZE_CLASSES[size];

  if (!interactive) {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {activeItems.map((item) => (
          <span
            key={item.key}
            title={item.label}
            aria-label={item.label}
            className="inline-flex items-center justify-center text-zinc-400 transition-colors group-hover:text-zinc-200"
          >
            {item.renderIcon(sizeSpec.icon, sizeSpec.img)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {activeItems.map((item) => {
        const anchor = (
          <Button
            key={item.key}
            asChild
            size="icon"
            variant="ghost"
            className={cn(
              "group/author-link",
              sizeSpec.button,
              VARIANT_CLASSES[variant],
              buttonClassName,
            )}
          >
            <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
              {item.renderIcon(sizeSpec.icon, sizeSpec.img)}
            </a>
          </Button>
        );

        if (!withTooltip) {
          return anchor;
        }

        return (
          <Tooltip key={item.key}>
            <TooltipTrigger asChild>{anchor}</TooltipTrigger>
            <TooltipContent side="top">
              <p>{detailedTooltip ? `${item.label}: ${item.raw}` : item.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
