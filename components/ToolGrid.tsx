"use client";

import ToolCard from "./ToolCard";
import type { Tool } from "@/lib/data";

type Props = {
  tools: Tool[];
};

export default function ToolGrid({ tools }: Props) {
  if (tools.length === 0) {
    return (
      <p className="text-center text-zinc-500 py-16">
        No tools found. Try a different search or category.
      </p>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {tools.map((tool) => (
        <div key={tool.title} className="break-inside-avoid mb-4">
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  );
}
