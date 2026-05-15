"use client";

import { ArrowSquareOutIcon, ToolboxIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap } from "@/lib/icons";
import { ToolCardProps } from "@/types";

function getFavicon(toolUrl: string, explicitFavicon?: string) {
  const url = new URL(toolUrl);
  const domain = url.hostname;
  const origin = url.origin;

  const sources: string[] = [];

  if (explicitFavicon) {
    sources.push(explicitFavicon);
  }

  sources.push(`${origin}/favicon.ico`);
  sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);

  return sources;
}

function Favicon({
  url,
  alt,
  explicitFavicon,
}: {
  url: string;
  alt: string;
  explicitFavicon?: string;
}) {
  const sources = getFavicon(url, explicitFavicon);
  const [index, setIndex] = useState(0);

  return (
    <div className="border-border/50 bg-foreground/60 dark:bg-primary/40 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border p-1 shadow-sm">
      <Image
        src={sources[index]}
        alt={alt}
        width={24}
        height={24}
        unoptimized
        className="h-full w-full object-contain"
        onError={() => {
          if (index < sources.length - 1) {
            setIndex(index + 1);
          }
        }}
      />
    </div>
  );
}

function CardBody({ tool }: ToolCardProps) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <div className="flex flex-row items-center gap-3">
          {isInternal ? (
            <div className="bg-primary/10 border-ring/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border">
              <Icon className="text-primary size-4.5!" />
            </div>
          ) : (
            <Favicon url={tool.url!} alt={tool.title} explicitFavicon={tool.favicon} />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-foreground font-semibold">{tool.title}</CardTitle>
              {!isInternal && (
                <ArrowSquareOutIcon
                  weight="duotone"
                  className="text-muted-foreground mt-0.5 shrink-0"
                />
              )}
            </div>
          </div>
        </div>
        <CardDescription className="mt-2 line-clamp-3 leading-relaxed">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-4">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-[11px] tracking-wider uppercase">
          {tool.category}
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function ToolCard({ tool }: ToolCardProps) {
  const className =
    "block w-full h-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_var(--color-primary)] hover:shadow-primary/10";

  if (tool.slug) {
    return (
      <Link href={`/tools/${tool.slug}`} className={className}>
        <CardBody tool={tool} />
      </Link>
    );
  }

  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className={className}>
      <CardBody tool={tool} />
    </a>
  );
}
