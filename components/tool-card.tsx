"use client";

import { ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { memo } from "react";

import { iconMap } from "@/lib/icons";
import { internalTools } from "@/lib/tools-data";
import { cn, getCategoryColor } from "@/lib/utils";
import { ToolCardProps } from "@/types";

function ToolCardComponent({ tool }: ToolCardProps) {
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getCategoryColor(tool.category, "tool");

  const totalTools = internalTools.length;
  const toolIndex = internalTools.findIndex((t) => t.slug === tool.slug);
  const currentNumber = toolIndex !== -1 ? String(toolIndex + 1).padStart(2, "0") : "01";
  const totalFormatted = String(totalTools).padStart(2, "0");
  const toolNumber = `${currentNumber}/${totalFormatted}`;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="focus-visible:outline-primary block h-full w-full cursor-pointer text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <article className={cn("card group", colorClasses)}>
        <div className="card-inner">
          <div className="card-face">
            <div className="card-header">
              <span className="card-meta">
                {tool.category}
                <span className="card-meta-sep">·</span>
                <span>{toolNumber}</span>
              </span>

              <div className="bg-background text-foreground card-icon-box">
                <Icon className="card-icon" />
              </div>
            </div>

            <h3 className="card-title">{tool.title}</h3>

            <p className="card-description">{tool.description}</p>

            <div className="card-footer">
              {tool.highlight ? (
                <span className="card-author">{tool.highlight}</span>
              ) : (
                <div aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export const ToolCard = memo(ToolCardComponent);
export default ToolCard;
