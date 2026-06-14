"use client";

import { ArrowSquareOutIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { CardIcon } from "@/components/card-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap } from "@/lib/icons";
import { ToolCardProps } from "@/types";

function CardBody({ tool }: ToolCardProps) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;

  return (
    <Card className="group/card bg-blueprint-card hover:border-primary hover:shadow-border relative flex h-full w-full flex-col overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow">
      <div className="bg-background/50 flex items-center justify-between border-b-2 px-4 py-2 backdrop-blur-sm">
        <span className="text-muted-foreground group-hover/card:text-primary text-telemetry transition-colors">
          &gt; {tool.category}
        </span>
        {isInternal && <span className="text-muted-foreground text-telemetry">INT</span>}
      </div>

      <CardHeader className="relative z-10 flex-1 p-5">
        <div className="flex flex-row items-start gap-4">
          {isInternal ? (
            <div className="bg-background group-hover/card:border-primary group-hover/card:text-primary flex h-10 w-10 shrink-0 items-center justify-center border-2 transition-colors">
              <Icon className="size-5 transition-colors" />
            </div>
          ) : (
            <CardIcon
              url={tool.url!}
              alt={tool.title}
              className={tool.className}
              explicitFavicon={tool.favicon}
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-foreground group-hover/card:text-primary font-sans text-lg font-bold tracking-tight transition-colors">
                {tool.title}
              </CardTitle>
              {!isInternal && (
                <ArrowSquareOutIcon
                  weight="duotone"
                  className="text-muted-foreground group-hover/card:text-primary mt-1 size-4 shrink-0 transition-all group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                />
              )}
            </div>
          </div>
        </div>
        <CardDescription className="mt-4 line-clamp-3 font-mono text-xs leading-relaxed opacity-80">
          {tool.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function ToolCard({ tool }: ToolCardProps) {
  const linkWrapperClass =
    "block w-full h-full outline-none focus-visible:ring-2 focus-visible:ring-primary";

  if (tool.slug) {
    return (
      <Link href={`/tools/${tool.slug}`} className={linkWrapperClass}>
        <CardBody tool={tool} />
      </Link>
    );
  }

  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className={linkWrapperClass}>
      <CardBody tool={tool} />
    </a>
  );
}
