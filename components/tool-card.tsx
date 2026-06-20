"use client";

import { ArrowSquareOutIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { CardIcon } from "@/components/card-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap } from "@/lib/icons";
import { ToolCardProps } from "@/types";

function getAlternatingColor(title: string, index?: number) {
  const colorOptions = [
    "bg-c-heur text-on-heur",   // Yellow (matches 01 / 04 HEURISTIC)
    "bg-c-bias text-on-bias",   // Blue   (matches 02 / 04 BIAS)
    "bg-c-nudge text-on-nudge", // Purple (matches 03 / 04 NUDGE)
    "bg-c-ai text-on-ai"        // Green  (matches 04 / 04 AI PHENOMENA)
  ];
  
  if (index !== undefined) {
    return colorOptions[index % colorOptions.length];
  }
  
  // Fallback if no index provided
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorOptions[hash % colorOptions.length];
}

function CardBody({ tool, index }: ToolCardProps & { index?: number }) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getAlternatingColor(tool.title, index);

  return (
    <Card className={`group/card relative flex h-full w-full flex-col overflow-hidden border-2 border-primary transition-all duration-200 hover:shadow-[6px_6px_0px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1 ${colorClasses}`}>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="opacity-70 group-hover/card:opacity-100 text-telemetry transition-colors">
          {tool.category}
        </span>
        {isInternal && <span className="opacity-70 text-telemetry">INT</span>}
      </div>

      <CardHeader className="relative z-10 flex-1 flex flex-col px-5 pb-5 pt-0">
        <div className="flex flex-col items-start gap-3">
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              {isInternal ? (
                <Icon className="size-6 shrink-0 transition-transform group-hover/card:scale-110" />
              ) : (
                <CardIcon
                  url={tool.url!}
                  alt={tool.title}
                  className={tool.className}
                  explicitFavicon={tool.favicon}
                />
              )}
              <CardTitle className="font-display text-2xl uppercase font-black tracking-tight transition-colors">
                {tool.title}
              </CardTitle>
            </div>
            {!isInternal && (
              <ArrowSquareOutIcon
                weight="bold"
                className="mt-1 size-5 shrink-0 transition-all group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
              />
            )}
          </div>
        </div>
        
        <CardDescription className="mt-4 text-inherit font-mono text-sm leading-relaxed opacity-90 flex-1">
          {tool.description}
        </CardDescription>

        {tool.tags && tool.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="bg-background/10 border-primary/20 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}

export default function ToolCard({ tool, index }: ToolCardProps & { index?: number }) {
  const linkWrapperClass =
    "block w-full h-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  if (tool.slug) {
    return (
      <Link href={`/tools/${tool.slug}`} className={linkWrapperClass}>
        <CardBody tool={tool} index={index} />
      </Link>
    );
  }

  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className={linkWrapperClass}>
      <CardBody tool={tool} index={index} />
    </a>
  );
}
