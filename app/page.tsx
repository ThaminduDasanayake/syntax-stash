"use client";

import { tools } from "@/lib/data";
import ToolCard from "@/components/ToolCard";

export default function Home() {
  return (
    <div className="h-full flex flex-col p-6 w-full max-w-7xl mx-auto overflow-y-auto">
      <div className="w-full bg-card border border-border rounded-xl p-8 mb-8 text-center flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          syntax<span className="text-primary">-</span>stash
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          A curated command center for modern web development.
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-4">
          Built with Next.js · handmade, no tracking.
        </p>
      </div>

      <div className="w-full">
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {tools.map((tool) => (
              <ToolCard key={tool.url} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm mt-10">
            No tools found.
          </div>
        )}
      </div>
    </div>
  );
}
