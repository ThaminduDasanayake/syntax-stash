import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

import { iconMap } from "@/lib/icons";
import { Tool } from "@/types";

export function ToolLayout({ children, tool }: { children: ReactNode; tool: Tool | undefined }) {
  if (!tool) {
    notFound();
  }

  const { icon, title, highlight, description, category } = tool;
  const Icon = icon ? iconMap[icon] : undefined;

  return (
    <div className="flex w-full flex-col grow">
      {/* Editorial Tool Header */}
      <div className="border-border bg-background border-b-2 px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-8">
          
          <Link
            href="/tools"
            className="group flex w-fit shrink-0 items-center gap-3 pr-4 pb-1 transition-colors"
          >
            <div className="border-ink bg-foreground text-background group-hover:bg-background group-hover:text-foreground flex h-6 w-6 items-center justify-center border-2 transition-colors">
              <ArrowLeftIcon weight="bold" size={12} />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground font-mono text-xs font-bold tracking-widest uppercase transition-colors">
              RETURN TO TOOLS
            </span>
          </Link>

          <div className="flex w-full flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest opacity-70">
                <span className="uppercase">{category || "UTILITY COMPONENT"}</span>
              </div>
              
              <div className="flex items-center gap-6">
                {Icon && (
                  <div className="border-ink bg-background flex h-16 w-16 shrink-0 items-center justify-center border-2">
                    <Icon className="text-ink" size={32} weight="bold" />
                  </div>
                )}
                <h1 className="flex flex-wrap items-baseline gap-x-2 text-5xl tracking-tighter sm:text-6xl md:text-7xl">
                  {title.split(new RegExp(`(${highlight})`, "gi")).map((part, i) =>
                    part.toLowerCase() === highlight?.toLowerCase() ? (
                      <span
                        key={i}
                        className="-mt-2 font-serif tracking-normal lowercase italic"
                      >
                        {part}.
                      </span>
                    ) : (
                      <span key={i} className="font-display font-black uppercase">
                        {part}
                      </span>
                    )
                  )}
                </h1>
              </div>
            </div>

            <div className="max-w-md font-mono text-sm leading-relaxed opacity-90 lg:text-right">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Content Workspace */}
      <div className="bg-background flex grow w-full px-6 py-8 md:px-12 lg:px-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
