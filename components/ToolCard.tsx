import { ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tool } from "@/types";

type Props = {
  tool: Tool;
};

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function CardBody({ tool }: Props) {
  const isInternal = tool.url.startsWith("/");
  const hostname = isInternal ? null : getHostname(tool.url);

  return (
    <Card className="bg-card text-card-foreground border-border flex h-full w-full flex-col py-4 ring-0 transition-colors">
      <CardHeader className="flex-none">
        <div className="flex flex-row items-center gap-3">
          {isInternal ? (
            <div className="bg-primary/10 border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border">
              <Sparkles size={14} className="text-primary" />
            </div>
          ) : (
            <Image
              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
              alt={`${tool.title} logo`}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-md border border-white/10 bg-white/10 p-1"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-foreground font-semibold">{tool.title}</CardTitle>
              {isInternal ? null : (
                <ExternalLink size={14} className="text-muted-foreground mt-0.5 shrink-0" />
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex-none pt-4">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0.5 text-[11px] tracking-wide lowercase">
          {tool.category}
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function ToolCard({ tool }: Props) {
  const isInternal = tool.url.startsWith("/");
  const className =
    "block w-full h-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_var(--color-primary)] hover:shadow-primary/10";

  if (isInternal) {
    return (
      <Link href={tool.url} className={className}>
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
