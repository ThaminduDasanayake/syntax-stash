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
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-8 pb-12 md:px-12 md:pt-12 md:pb-24">
      {/* Back link */}
      <Link
        href={"/"}
        className="group hover:border-primary mb-8 inline-flex w-fit shrink-0 items-center gap-3 border-2 border-transparent pr-4 pb-1 transition-colors"
      >
        <div className="bg-foreground text-background group-hover:bg-primary flex h-6 w-6 items-center justify-center transition-colors">
          <ArrowLeftIcon weight="bold" size={14} />
        </div>
        <span className="text-muted-foreground group-hover:text-primary font-mono text-xs font-bold tracking-widest uppercase transition-colors">
          Return to Stash
        </span>
      </Link>

      {/* Heading */}
      <div className="border-border bg-blueprint-card mb-10 shrink-0 border-2">
        <div className="border-border bg-background/50 flex items-center justify-between border-b-2 px-6 py-2 backdrop-blur-sm">
          <span className="text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase">
            {"//"} {category || "UTILITY COMPONENT"}
          </span>
          <span className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase">
            [ ACTIVE ]
          </span>
        </div>

        <div className="flex flex-col items-start gap-6 p-8 md:flex-row md:p-12">
          {Icon && (
            <div className="border-border bg-background flex h-16 w-16 shrink-0 items-center justify-center border-2">
              <Icon className="text-primary" size={32} weight="bold" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tighter uppercase md:text-5xl">
              {title.split(new RegExp(`(${highlight})`, "gi")).map((part, i) =>
                part.toLowerCase() === highlight?.toLowerCase() ? (
                  /* Replaced soft coloring with a harsh underline */
                  <span
                    key={i}
                    className="text-primary decoration-primary underline decoration-4 underline-offset-4"
                  >
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </h1>

            {/* Monospace Description */}
            <p className="text-muted-foreground font-mono text-sm leading-relaxed tracking-wide">
              &gt; {description}
            </p>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
