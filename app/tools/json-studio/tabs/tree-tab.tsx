"use client";

import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { TreeNode } from "@/app/tools/json-studio/tree-node";
import { countChildren, parseJson } from "@/app/tools/json-studio/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  input: string;
  onTestInQuery: (path: string) => void;
};

export function TreeTab({ input, onTestInQuery }: Props) {
  const [search, setSearch] = useState("");
  const [forceExpand, setForceExpand] = useState<boolean | null>(null);

  const parsed = useMemo(() => parseJson(input), [input]);
  const rootCount = useMemo(() => {
    if (!parsed.ok) return 0;
    return countChildren(parsed.value);
  }, [parsed]);

  return (
    <div className="space-y-3">
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

      <div className="border-border bg-card min-h-[400px] overflow-auto rounded-xl border p-3 font-mono">
        {parsed.ok ? (
          <TreeNode
            name=""
            value={parsed.value}
            path="$"
            depth={0}
            searchQuery={search}
            forceExpand={forceExpand}
            onTestInQuery={onTestInQuery}
          />
        ) : (
          <p className="text-muted-foreground p-4 text-sm">
            {input.trim()
              ? <span className="text-destructive text-xs">{parsed.error}</span>
              : "Paste valid JSON on the left to explore the tree."}
          </p>
        )}
      </div>
    </div>
  );
}
