"use client";

import { ArrowSquareOutIcon, TagIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { cn, getCategoryTheme, Theme, THEME_CONFIG } from "@/lib/utils";

export interface ResourceCardPreviewProps {
  author?: string | null;
  cardMaxWidthClass?: string;
  category?: string | null;
  className?: string;
  description?: string | null;
  favicon?: string | null;
  subtitle?: string | null;
  tags?: string | null;
  title?: string | null;
  url?: string | null;
}

export function ResourceCardPreview({
  title,
  author,
  cardMaxWidthClass = "max-w-80",
  category = "Generators",
  className,
  description,
  favicon,
  subtitle,
  tags,
  url,
}: ResourceCardPreviewProps) {
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);

  const activeTheme: Theme = customTheme ?? getCategoryTheme(category || "Generators");
  const themeClasses = THEME_CONFIG[activeTheme].bg;
  const isBlue = activeTheme === "blue";

  return (
    <div className={cn("border-line bg-paper/50 border p-5 font-mono text-xs", className)}>
      {/* Header with Hero Eyebrow Theme Switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <span className="text-foreground font-bold tracking-wider uppercase">
          Card Preview
        </span>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-[10px] font-bold uppercase">
            Theme:
          </span>
          <span className="hero-eyebrow-dots flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("orange")}
              title="Orange theme"
              aria-label="Select orange theme"
              className={cn(
                "bg-c-orange size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "orange"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("blue")}
              title="Blue theme"
              aria-label="Select blue theme"
              className={cn(
                "bg-c-blue size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "blue"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("pink")}
              title="Pink theme"
              aria-label="Select pink theme"
              className={cn(
                "bg-c-pink size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "pink"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("green")}
              title="Green theme"
              aria-label="Select green theme"
              className={cn(
                "bg-c-green size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "green"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
          </span>
        </div>
      </div>

      {/* Rendered Syntax Stash Card */}
      <div className={cn("mx-auto w-full", cardMaxWidthClass)}>
        <article className={cn("card group", themeClasses)}>
          <div className="card-inner">
            <div className="card-face">
              <div className="card-header">
                <span className="card-meta">{category || "Generators"}</span>
                <CardIcon alt={title || "Preview"} favicon={favicon || undefined} />
              </div>

              <h3 className="card-title">{title || "Resource Title"}</h3>

              {subtitle && <p className="card-subtitle">{subtitle}</p>}

              <p className="card-description">
                {description ||
                  "Tool description preview will appear here. It explains the features, purpose, and utility for developers."}
              </p>

              {/* Tags preview if any */}
              {tags && (
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {tags
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
                  {author ? <span className="card-author truncate">{author}</span> : null}
                </div>

                <div className="flex items-center gap-2">
                  {url && (
                    <a
                      href={url}
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
  );
}
