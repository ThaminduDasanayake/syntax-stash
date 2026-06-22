"use client";

import { ArrowSquareOutIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { CardIcon } from "@/components/card-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap } from "@/lib/icons";
import { ToolCardProps } from "@/types";

function getAlternatingColor(title: string, index?: number) {
  const colorOptions = ["bg-c-orange", "bg-c-blue text-paper", "bg-c-pink", "bg-c-green"];

  if (index !== undefined) {
    return colorOptions[index % colorOptions.length];
  }

  // Fallback if no index provided
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorOptions[hash % colorOptions.length];
}

function CardBody({ tool, index }: ToolCardProps & { index?: number }) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getAlternatingColor(tool.title, index);

  return (
    <Card
      className={`group/card relative flex h-full w-full flex-col justify-between overflow-hidden border ring-0 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-md ${colorClasses}`}
    >
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between px-5 pt-5 pb-4">
          <span className="text-telemetry mt-2 opacity-70 transition-colors group-hover/card:opacity-100">
            {tool.category}
          </span>
          <div className="flex items-center gap-2">
            {isInternal ? (
              <Icon className="size-7 shrink-0 transition-transform group-hover/card:scale-110" />
            ) : (
              <CardIcon
                url={tool.url!}
                alt={tool.title}
                className={tool.className}
                explicitFavicon={tool.favicon}
              />
            )}
          </div>
        </div>

        <CardHeader className="relative z-10 flex flex-col px-5 pt-2 pb-6">
          <CardTitle className="font-display text-2xl font-black tracking-tight uppercase transition-colors">
            {tool.title}
          </CardTitle>

          <CardDescription className="mt-4 text-sm font-medium text-inherit opacity-90">
            {tool.description}
          </CardDescription>
        </CardHeader>
      </div>

      {tool.tags?.length || !isInternal ? (
        <div className="flex items-end justify-between gap-4 border-t border-current/20 px-5 py-4 opacity-80 transition-opacity group-hover/card:opacity-100">
          <div className="flex flex-wrap gap-2">
            {/*{tool.tags?.map((tag) => (*/}
            {/*  <span*/}
            {/*    key={tag}*/}
            {/*    className="border border-current/20 bg-current/5 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase"*/}
            {/*  >*/}
            {/*    {tag}*/}
            {/*  </span>*/}
            {/*))}*/}
            {tool.author && (
              <span className="text-[10px] font-medium tracking-wider group-hover/card:opacity-100">
                {tool.author}
              </span>
            )}
          </div>
          {!isInternal && (
            <ArrowSquareOutIcon
              weight="bold"
              className="shrink-0 transition-all duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:opacity-100"
            />
          )}
        </div>
      ) : null}
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
