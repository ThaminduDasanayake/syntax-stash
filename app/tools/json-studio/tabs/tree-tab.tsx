"use client";

import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { countChildren, parseJson } from "@/app/tools/json-studio/helpers";
import { TreeNode } from "@/app/tools/json-studio/tree-node";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

type Props = {
  input: string;
  onTestInQueryAction: (path: string) => void;
};

export function TreeTab({ input, onTestInQueryAction }: Props) {
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
        <SearchInput
          placeholder="Search keys and values..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="ml-auto flex items-center gap-2">
          <div className="text-muted-foreground ml-1 text-xs">
            {parsed.ok ? `${rootCount} root ${rootCount === 1 ? "key" : "keys"}` : ""}
          </div>
          <Button variant="outline" size="sm" onClick={() => setForceExpand(true)}>
            <CaretDownIcon /> Expand all
          </Button>
          <Button variant="outline" size="sm" onClick={() => setForceExpand(false)}>
            <CaretRightIcon /> Collapse all
          </Button>
          {forceExpand !== null && (
            <Button variant="ghost" size="sm" onClick={() => setForceExpand(null)}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="border-border bg-card min-h-100 overflow-auto rounded-xl border p-3 font-mono">
        {parsed.ok ? (
          <TreeNode
            name=""
            value={parsed.value}
            path="$"
            depth={0}
            searchQuery={search}
            forceExpand={forceExpand}
            onTestInQueryAction={onTestInQueryAction}
          />
        ) : (
          <p className="text-muted-foreground p-4 text-sm">
            {input.trim() ? (
              <span className="text-destructive text-xs">{parsed.error}</span>
            ) : (
              "Paste valid JSON on the left to explore the tree."
            )}
          </p>
        )}
      </div>
    </div>
  );
}
