"use client";

import { useMemo, useState } from "react";

import { PLACEHOLDER_MODIFIED, PLACEHOLDER_ORIGINAL } from "@/app/tools/diff-viewer/data.ts";
import { DiffLineRow } from "@/app/tools/diff-viewer/diff-line-row";
import {
  buildSideColumns,
  computeDiff,
  type DiffLine,
  formatUnifiedDiff,
} from "@/app/tools/diff-viewer/helpers";
import { ToolLayout } from "@/components/layout/layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";
import { developmentTools } from "@/lib/tools-data";

function SideBySideLineRow({
  line,
  showOld,
  showNew,
}: {
  line: DiffLine | null;
  showOld: boolean;
  showNew: boolean;
}) {
  if (!line) {
    return <div className="bg-muted/30 min-h-5 w-full font-mono text-xs leading-5" />;
  }
  return <DiffLineRow line={line} showOld={showOld} showNew={showNew} />;
}

export default function DiffViewerPage() {
  const [original, setOriginal] = useState(PLACEHOLDER_ORIGINAL);
  const [modified, setModified] = useState(PLACEHOLDER_MODIFIED);
  const [viewMode, setViewMode] = useState<"unified" | "side-by-side">("unified");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const { diffLines, diffText, stats } = useMemo(() => {
    const lines = computeDiff(original, modified, ignoreWhitespace);
    const text = formatUnifiedDiff(lines);
    const added = lines.filter((l) => l.type === "added").length;
    const removed = lines.filter((l) => l.type === "removed").length;
    const unchanged = lines.filter((l) => l.type === "unchanged").length;
    return { diffLines: lines, diffText: text, stats: { added, removed, unchanged } };
  }, [original, modified, ignoreWhitespace]);

  const { left, right } = useMemo(
    () => (viewMode === "side-by-side" ? buildSideColumns(diffLines) : { left: [], right: [] }),
    [diffLines, viewMode],
  );

  const hasChanges = stats.added > 0 || stats.removed > 0;

  const tool = developmentTools.find((t) => t.url === "/tools/diff-viewer");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TextAreaField
            label="Original"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={10}
            className="resize-y font-mono text-xs"
            placeholder="Paste original text here…"
            action={
              <ClearButton
                onClick={() => {
                  setOriginal("");
                }}
                disabled={!hasChanges}
              />
            }
          />

          <TextAreaField
            label="Modified"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={10}
            className="resize-y font-mono text-xs"
            placeholder="Paste modified text here…"
            action={
              <ClearButton
                onClick={() => {
                  setModified("");
                }}
                disabled={!hasChanges}
              />
            }
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger className="tab-trigger" value="unified">
                Unified
              </TabsTrigger>
              <TabsTrigger className="tab-trigger" value="side-by-side">
                Side by side
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Switch
              id="ignore-ws"
              checked={ignoreWhitespace}
              onCheckedChange={setIgnoreWhitespace}
            />
            <Label htmlFor="ignore-ws" className="cursor-pointer text-sm">
              Ignore whitespace
            </Label>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {hasChanges && (
              <div className="flex gap-3 text-xs">
                <span className="text-green-400">+{stats.added}</span>
                <span className="text-red-400">−{stats.removed}</span>
                <span>{stats.unchanged} unchanged</span>
              </div>
            )}
            <CopyButton value={diffText} disabled={!hasChanges} />
          </div>
        </div>

        {/* Diff output */}
        {diffLines.length > 0 && (
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
            {!hasChanges && (
              <div className="text-muted-foreground p-4 text-center text-sm">
                Files are identical.
              </div>
            )}

            {hasChanges && viewMode === "unified" && (
              <div className="overflow-x-auto">
                {diffLines.map((line, idx) => (
                  <DiffLineRow key={idx} line={line} showOld showNew />
                ))}
              </div>
            )}

            {hasChanges && viewMode === "side-by-side" && (
              <div className="grid grid-cols-2 overflow-x-auto">
                <div className="border-border border-r">
                  <div className="border-border bg-muted/30 border-b px-3 py-1.5">
                    <span className="text-muted-foreground font-mono text-xs font-semibold">
                      Original
                    </span>
                  </div>
                  {left.map((item) => (
                    <SideBySideLineRow key={item.key} line={item.line} showOld showNew={false} />
                  ))}
                </div>
                <div>
                  <div className="border-border bg-muted/30 border-b px-3 py-1.5">
                    <span className="text-muted-foreground font-mono text-xs font-semibold">
                      Modified
                    </span>
                  </div>
                  {right.map((item) => (
                    <SideBySideLineRow key={item.key} line={item.line} showOld={false} showNew />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
