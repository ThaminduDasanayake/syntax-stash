import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/lib/data";

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
    <Card className="bg-card text-card-foreground border-border ring-0 py-4 h-full w-full flex flex-col transition-colors">
      <CardHeader className="flex-none">
        <div className="flex flex-row items-center gap-3">
          {isInternal ? (
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-primary" />
            </div>
          ) : (
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
              alt={`${tool.title} logo`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-md bg-white/10 border border-white/10 p-1 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-foreground font-semibold">
                {tool.title}
              </CardTitle>
              {isInternal ? null : (
                <ExternalLink
                  size={14}
                  className="text-muted-foreground shrink-0 mt-0.5"
                />
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-muted-foreground leading-relaxed mt-2 text-sm line-clamp-2">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-4 flex-none">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-[11px] lowercase tracking-wide border-none px-2 py-0.5">
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
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <CardBody tool={tool} />
    </a>
  );
}
