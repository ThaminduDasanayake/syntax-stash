"use client";

import { ListOrdered } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

interface Heading {
  level: number;
  text: string;
  anchor: string;
}

export default function MarkdownTOCGeneratorPage() {
  const [input, setInput] = useState(`# Main Document Title
## Getting Started
### Prerequisites
### Installation
## Configuration
### Basic Setup
### Advanced Options
#### Option A
#### Option B
### Troubleshooting
## Usage
### Common Patterns
### Examples
## Contributing
## License`);

  const [maxDepth, setMaxDepth] = useState("6");

  const toc = useMemo<string>(() => {
    if (!input.trim()) return "";

    const maxDepthNum = parseInt(maxDepth, 10);

    // Strip fenced code blocks before extracting headings
    const stripped = input.replace(/```[\s\S]*?```/g, "");

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Heading[] = [];
    const anchorCounts = new Map<string, number>();

    let match;
    while ((match = headingRegex.exec(stripped)) !== null) {
      const level = match[1].length;
      // Strip inline markdown (bold, italic, code, links) from heading text
      const rawText = match[2].trim();
      const text = rawText
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/__(.+?)__/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/_(.+?)_/g, "$1")
        .replace(/`(.+?)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

      if (level <= maxDepthNum) {
        let anchor = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/^-+|-+$/g, "");

        // Handle duplicate anchors (GitHub-style: append -1, -2, etc.)
        const count = anchorCounts.get(anchor) ?? 0;
        anchorCounts.set(anchor, count + 1);
        if (count > 0) {
          anchor = `${anchor}-${count}`;
        }

        headings.push({ level, text, anchor });
      }
    }

    if (headings.length === 0) return "";

    // Normalize indentation relative to the minimum heading level
    const minLevel = Math.min(...headings.map((h) => h.level));
    const lines = headings.map((heading) => {
      const indent = " ".repeat((heading.level - minLevel) * 2);
      return `${indent}- [${heading.text}](#${heading.anchor})`;
    });

    return lines.join("\n");
  }, [input, maxDepth]);

  const depthOptions = [
    { value: "1", label: "H1 Only" },
    { value: "2", label: "H1-H2" },
    { value: "3", label: "H1-H3" },
    { value: "4", label: "H1-H4" },
    { value: "5", label: "H1-H5" },
    { value: "6", label: "H1-H6 (All)" },
  ];

  const headingCount = useMemo(() => {
    const maxDepthNum = parseInt(maxDepth, 10);
    const stripped = input.replace(/```[\s\S]*?```/g, "");
    const headingRegex = /^(#{1,6})\s+/gm;
    let count = 0;
    let match;
    while ((match = headingRegex.exec(stripped)) !== null) {
      if (match[1].length <= maxDepthNum) {
        count++;
      }
    }
    return count;
  }, [input, maxDepth]);

  return (
    <ToolLayout
      icon={ListOrdered}
      title="Markdown"
      highlight="Table of Contents"
      description="Generate a nested Table of Contents from your Markdown document with automatic anchor links."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-4">
          <SelectField
            label="Maximum Heading Depth"
            value={maxDepth}
            onValueChange={setMaxDepth}
            options={depthOptions}
          />

          <TextAreaField
            label="Markdown Document"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your Markdown document here..."
            rows={20}
            action={
              <ClearButton
                onClick={() => setInput("")}
                disabled={!input}
              />
            }
          />
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          <TextAreaField
            label="Table of Contents"
            value={toc}
            readOnly
            rows={22}
            placeholder="Your ToC will appear here..."
            action={
              <CopyButton
                value={toc}
                disabled={!toc}
              />
            }
          />

          {/* Stats */}
          {input.trim() && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Found {headingCount} heading{headingCount !== 1 ? "s" : ""} (max depth: H{maxDepth})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Guide */}
      <div className="mt-8 border-t pt-8">
        <h3 className="mb-4 text-sm font-semibold">How It Works</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="mb-2 text-sm font-medium">Anchor Generation</h4>
            <p className="text-xs text-muted-foreground">
              Special characters are stripped and spaces become hyphens. Example: <code className="font-mono text-xs bg-background px-1 py-0.5 rounded">## My Setup</code> → <code className="font-mono text-xs bg-background px-1 py-0.5 rounded">#my-setup</code>
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="mb-2 text-sm font-medium">Indentation</h4>
            <p className="text-xs text-muted-foreground">
              Each heading level adds 2 spaces of indentation for proper nesting in Markdown.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
