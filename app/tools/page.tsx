import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import { internalTools } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse all developer tools in syntax-stash — converters, generators, formatters, and more.",
  alternates: { canonical: "/tools" },
};

const groupedTools = internalTools.reduce(
  (acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  },
  {} as Record<string, typeof internalTools>,
);

export default function ToolsPage() {
  return (
    <div className="flex w-full flex-col">
      {/* Mini-Hero */}
      <div className="border-border bg-background relative w-full border-b-2 px-6 py-12 md:px-12">
        <h1 className="flex flex-col gap-1 text-4xl tracking-tighter sm:text-5xl">
          <span className="font-display font-black uppercase">THE TOOLS</span>
          <span className="font-serif tracking-normal lowercase italic">stash.</span>
        </h1>
        <p className="text-muted-foreground mt-4 font-mono text-sm leading-relaxed tracking-wider uppercase opacity-80">
          {internalTools.length} curated generators, formatters, and utilities.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
        <div className="space-y-12 pb-8">
          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-primary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">
                {category}
                <span className="bg-primary h-px flex-1" />
                <span>{tools.length} Tools</span>
              </h2>
              <div className="card-grid">
                {tools.map((tool, index) => (
                  <ToolCard key={tool.slug} tool={tool} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
