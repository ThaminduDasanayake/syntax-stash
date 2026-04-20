import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ToolLayoutProps } from "@/types";

export function ToolLayout({
  children,
  icon: Icon,
  title,
  highlight,
  description,
  backHref = "/",
  backText = "Back",
  maxWidth = "max-w-7xl",
}: ToolLayoutProps) {
  return (
    <div>
      <div className={`relative z-10 mx-auto ${maxWidth} px-4 py-8 md:py-12`}>
        {/* Back link */}
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          {backText}
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <Icon className="text-primary" size={36} />
            <span>
              {title}
              {highlight && <span className="text-primary"> {highlight}</span>}
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
