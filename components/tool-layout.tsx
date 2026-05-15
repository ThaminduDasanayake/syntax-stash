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

  const { icon, title, highlight, description } = tool;
  const Icon = icon ? iconMap[icon] : undefined;

  return (
    <div className="relative z-10 mx-auto flex min-h-full max-w-7xl flex-col px-4 py-8 md:py-12 md:pb-24">
      {/* Back link */}
      <Link
        href={"/"}
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeftIcon weight="bold" size={20} />
        Back
      </Link>

      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
          {Icon && <Icon className="text-primary" size={44} weight="duotone" />}
          <span>
            {title.split(new RegExp(`(${highlight})`, "gi")).map((part, i) =>
              part.toLowerCase() === highlight?.toLowerCase() ? (
                <span key={i} className="text-primary">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </span>
        </h1>
        <p className="text-foreground text-base md:text-lg">{description}</p>
      </div>

      {/* Tool Content */}
      {children}
    </div>
  );
}
