"use client";

import { ToolGridProps } from "@/types";

import ToolCard from "./ToolCard";

export default function ToolGrid({ tools }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <p className="py-16 text-center text-zinc-500">
        No tools found. Try a different search or category.
      </p>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {tools.map((tool) => (
        <div key={tool.title} className="mb-4 break-inside-avoid">
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  );
}
