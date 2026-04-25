"use client";

import { ChevronsDownUp, ChevronsUpDown, Network } from "lucide-react";
import { useMemo, useState } from "react";

import { TreeNode } from "@/app/tools/json-tree-viewer/tree-node";
import { countChildren, parseJson } from "@/app/tools/json-tree-viewer/helpers";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SAMPLE = JSON.stringify(
  {
    user: {
      id: "usr_42",
      name: "Ada Lovelace",
      email: "ada@example.com",
      isActive: true,
      tags: ["admin", "early-adopter"],
      profile: {
        bio: "Mathematician & first programmer",
        avatarUrl: null,
        joinedAt: "1815-12-10T00:00:00Z",
      },
    },
    posts: [
      { id: 1, title: "Notes on the Analytical Engine", publishedAt: "1843-08-01", views: 4201 },
      { id: 2, title: "Translations and Commentary", publishedAt: null, views: 0 },
    ],
    meta: { total: 2, page: 1, perPage: 20 },
  },
  null,
  2,
);

export default function JsonTreeViewerPage() {
  const [input, setInput] = useState(SAMPLE);
  const [search, setSearch] = useState("");
  const [forceExpand, setForceExpand] = useState<boolean | null>(null);

  const parsed = useMemo(() => parseJson(input), [input]);
  const rootCount = useMemo(() => {
    if (!parsed.ok) return 0;
    return countChildren(parsed.value);
  }, [parsed]);

  return (
    <ToolLayout
      icon={Network}
      title="JSON Tree"
      highlight="Viewer"
      description="Explore JSON payloads as a collapsible tree. Search keys and values, copy paths, and expand or collapse the whole tree at once."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <Label>JSON input</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={28}
            className="resize-y font-mono text-xs"
            placeholder="Paste JSON here…"
            spellCheck={false}
          />
          {!parsed.ok && (
            <p className="text-destructive text-xs">{parsed.error}</p>
          )}
        </div>

        {/* Tree panel */}
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keys and values…"
              className="h-8 max-w-56 text-sm"
            />
            <div className="text-muted-foreground ml-1 text-xs">
              {parsed.ok ? `${rootCount} root ${rootCount === 1 ? "key" : "keys"}` : ""}
            </div>
            <div className="ml-auto flex gap-1">
              <Button
                variant="outline" size="sm"
                className="h-7 rounded-full px-2 text-xs"
                onClick={() => setForceExpand(true)}
              >
                <ChevronsUpDown size={11} /> Expand all
              </Button>
              <Button
                variant="outline" size="sm"
                className="h-7 rounded-full px-2 text-xs"
                onClick={() => setForceExpand(false)}
              >
                <ChevronsDownUp size={11} /> Collapse all
              </Button>
              {forceExpand !== null && (
                <Button
                  variant="ghost" size="sm"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => setForceExpand(null)}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Tree */}
          <div className="border-border bg-card min-h-[400px] overflow-auto rounded-xl border p-3 font-mono">
            {parsed.ok ? (
              <TreeNode
                name=""
                value={parsed.value}
                path="$"
                depth={0}
                searchQuery={search}
                forceExpand={forceExpand}
              />
            ) : (
              <p className="text-muted-foreground p-4 text-sm">
                Paste valid JSON on the left to explore the tree.
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
