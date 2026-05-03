import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

import { Tool } from "@/types";

interface SmartToolLayoutProps {
  children: ReactNode;
  tool: Tool | undefined;
  backHref?: string;
  backText?: string;
  maxWidth?: "max-w-4xl" | "max-w-6xl" | "max-w-7xl";
}

export function ToolLayout({
  children,
  tool,
  backHref = "/",
  backText = "Back",
  maxWidth = "max-w-7xl",
}: SmartToolLayoutProps) {
  if (!tool) {
    notFound();
  }

  const { icon: Icon, title, highlight, description } = tool;

  return (
    <div>
      <div className={`relative z-10 mx-auto ${maxWidth} px-4 py-8 md:py-12`}>
        {/* Back link */}
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeftIcon weight="bold" size={20} />
          {backText}
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
    </div>
  );
}
