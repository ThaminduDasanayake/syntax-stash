import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
    <Card className="bg-[#0C0C0C] border border-white/5 ring-0 py-4">
      <CardHeader>
        <div className="flex flex-row items-center gap-3">
          {isInternal ? (
            <div className="w-8 h-8 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-orange-400" />
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
              <CardTitle className="text-white font-semibold">
                {tool.title}
              </CardTitle>
              {isInternal ? null : (
                <ExternalLink size={14} className="text-zinc-600 shrink-0 mt-0.5" />
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-zinc-500 leading-relaxed">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge className="bg-orange-500/10 text-orange-400/80 text-[11px] lowercase tracking-wide border-none hover:bg-orange-500/10">
          {tool.category}
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function ToolCard({ tool }: Props) {
  const isInternal = tool.url.startsWith("/");
  const className = "block transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]";

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
