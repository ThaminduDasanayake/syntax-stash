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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">All Tools</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {internalTools.length} tools across {Object.keys(groupedTools).length} categories
        </p>
      </div>

      <div className="space-y-12 pb-8">
        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category} className="space-y-6">
            <h2 className="text-primary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">
              {category}
              <span className="bg-primary h-px flex-1" />
            </h2>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
